/**
 * 姓名：李嘉蕊 | 学号：24002120526 | 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：图文列表路由 GET /api/gallery
 */
const express = require('express');
const { LJR_listGallery } = require('../controllers/LJR_galleryController');

const LJR_router = express.Router();

LJR_router.get('/', LJR_listGallery);

module.exports = LJR_router;
