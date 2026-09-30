import mysql from 'mysql2/promise';
import 'dotenv/config';

const connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DB,
    password: process.env.MYSQL_PASSWORD,
    
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log(`-- Banco de dados conectado--`);

export default connection;