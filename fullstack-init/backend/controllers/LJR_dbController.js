/**
 * 姓名：李嘉蕊 | 学号：24002120526 | 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：数据库连接测试控制器，用页面提交的用户名密码尝试连接 MySQL
 */
const mysql = require('mysql2/promise');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function LJR_testConnection(LJR_req, LJR_res) {
    const LJR_user = (LJR_req.body && LJR_req.body.username) || process.env.DB_USER || 'root';
    const LJR_password = (LJR_req.body && LJR_req.body.password) || '';

    let LJR_conn = null;
    try {
        LJR_conn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: LJR_user,
            password: LJR_password,
            connectTimeout: 5000
        });
        const [LJR_rows] = await LJR_conn.query('SELECT VERSION() AS version');
        LJR_res.json({
            code: 0,
            msg: '数据库连接成功',
            data: {
                version: LJR_rows[0].version,
                user: LJR_user,
                host: process.env.DB_HOST || 'localhost'
            }
        });
    } catch (LJR_err) {
        LJR_res.json({
            code: 1,
            msg: '数据库连接失败：' + LJR_err.message,
            data: { errorCode: LJR_err.code || '' }
        });
    } finally {
        if (LJR_conn) {
            await LJR_conn.end().catch(function () {});
        }
    }
}

module.exports = { LJR_testConnection };
