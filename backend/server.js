const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();
const port = process.env.PORT || 3000;
const bcrypt = require('bcryptjs');

app.use(cors());
app.use(express.json());

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
        return res.json({
            user: {id: user.id, username: user.username, role: user.role}
        })
    } catch (error) {
        console.error('Login failed', error.message);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ'})
    }
   
    
})

// Running App
app.listen(port, ()=>{
    console.log(`API Server running on port ${port}`)
})