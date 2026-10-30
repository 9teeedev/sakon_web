const express = require('express');
const session = require('express-session');
const cors = require('cors');
const pool = require('./db');
const app = express();
const port = process.env.PORT || 3000;
const bcrypt = require('bcryptjs');

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    }
}))
// API Router
app.get('/api/health/db', async (_req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({connected: true});
    } catch (error) {
        console.error('Database connection failed: ', error);
        res.status(500).json({ connected: false});
    }
});
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body ?? {};
    if (typeof username !== 'string' || typeof password !== 'string'){
        return res.status(400).json({ message: 'กรุณากรอก username และ password'});
    }
    try {
        const [users] = await pool.execute(
            'SELECT id, username, password, role FROM users WHERE username = ? LIMIT 1',
            [username]
        );

        const user = users[0];
        const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;
        if (!passwordMatches){
            return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'});
        }
        return req.session.regenerate((error) => {
            if (error) {
                return res.status(500).json({ message:'สร้าง session ไม่สำเร็จ' })
            }
            req.session.userId = user.id;
            req.session.save((saveError) => {
                if (saveError){
                    return res.status(500).json({message: 'บันทึึก session ไม่สำเร็จ'})
                }
                return res.json({
                    user: {id: user.id, username: user.username, role: user.role}
                });
            })
            
        })
    } catch (error) {
        console.error('Login failed', error.message);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ'})
    }    
})

app.get('/api/me', async(req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'กรุณาเข้าสู่ระบบ'})
    }
    try {
        const [users] = await pool.execute(
            'SELECT id, username, role FROM users WHERE id = ? LIMIT 1',
            [req.session.userId]
        );
        if(!users[0]){
            return res.status(401).json({ message: 'ไม่พบผู้ใช้งาน'});
        }
        return res.json({user: users[0]});
    }catch(error){
        console.error('Get current user failed', error.message);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ'})
    }
})

// Running App
app.listen(port, ()=>{
    console.log(`API Server running on port ${port}`)
})