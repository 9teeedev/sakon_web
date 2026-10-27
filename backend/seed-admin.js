require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./db');

async function seedAdmin(){
    const { ADMIN_EMAIL, ADMIN_PASSWORD} = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD){
        throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env');
    }
    const [existing] = await pool.execute(
        'SELECT id FROM users WHERE email = ? LIMIT 1',
        [ADMIN_EMAIL]
    )
    if (existing.length){
        console.log('Admin account already exists');
        return;
    }
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await pool.execute(
        `INSERT INTO users (username, password, email, name, role)
        VALUES (?, ?,?,?, 'admin')`,
        ['admin', passwordHash, ADMIN_EMAIL, 'Admin']
    );
    console.log('Admin account created');
}

seedAdmin()
    .catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    })
    .finally(() => pool.end());