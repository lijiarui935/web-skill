/**
 * 姓名：李嘉蕊 | 学号：24002120526 | 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：科技新闻路由 GET /api/news
 */
const express = require('express');
const { LJR_listNews } = require('../controllers/LJR_newsController');

const LJR_router = express.Router();

LJR_router.get('/', LJR_listNews);

module.exports = LJR_router;
