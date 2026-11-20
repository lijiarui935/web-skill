/**
 * 姓名：李嘉蕊 | 学号：24002120526 | 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：数据库测试路由 POST /api/db-test
 */
const express = require('express');
const { LJR_testConnection } = require('../controllers/LJR_dbController');

const LJR_router = express.Router();

LJR_router.post('/db-test', LJR_testConnection);

module.exports = LJR_router;
