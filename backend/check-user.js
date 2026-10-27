require('dotenv').config();
const pool = require('./db');

async function checkUsers(){
    const [existing] = await pool.execute(
        'SELECT * FROM users' 
    )
    if (existing.length){
        console.log(existing);
        return;
    }
}

checkUsers()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => pool.end());