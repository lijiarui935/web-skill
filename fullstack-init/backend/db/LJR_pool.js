/**
 * 姓名：李嘉蕊 | 学号：24002120526 | 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：MySQL 连接池，凭据全部来自 backend/.env，不写死在代码里
 */
const mysql = require('mysql2/promise');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const LJR_pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ljr_fullstack',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
});

module.exports = LJR_pool;
