import mysql from 'mysql2/promise';
import 'dotenv/config';

const connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT,
    ssl: {
        rejectUnauthorized: false
    },
    
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log(`-- Banco de dados conectado--`);

export default connection;