/**
 * 姓名：李嘉蕊 | 学号：24002120526 | 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：Express 入口，注册中间件、路由、静态资源托管，监听 8526 端口
 */
const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const LJR_app = express();
const LJR_port = Number(process.env.PORT) || 8526;

// 李嘉蕊：课程作业，开放全部跨域
LJR_app.use(cors());
LJR_app.use(express.json());

// 李嘉蕊：健康检查，方便验证服务是否启动
LJR_app.get('/api/health', function (LJR_req, LJR_res) {
    LJR_res.json({
        code: 0,
        msg: 'ok',
        data: {
            name: '李嘉蕊',
            studentId: '24002120526',
            port: LJR_port,
            time: new Date().toLocaleString('zh-CN', { hour12: false })
        }
    });
});

// 李嘉蕊：RESTful + MVC，路由只负责转发，业务在 controllers
LJR_app.use('/api', require('./routes/LJR_db'));
LJR_app.use('/api/news', require('./routes/LJR_news'));
LJR_app.use('/api/gallery', require('./routes/LJR_gallery'));

// 李嘉蕊：托管前端静态资源，浏览器直接访问 http://localhost:8526/
LJR_app.use(express.static(path.join(__dirname, '..', 'frontend')));

// 李嘉蕊：统一 404 与错误响应格式
LJR_app.use(function (LJR_req, LJR_res) {
    LJR_res.status(404).json({ code: 404, msg: '接口或页面不存在', data: null });
});

LJR_app.use(function (LJR_err, LJR_req, LJR_res, LJR_next) {
    console.error('服务器错误：', LJR_err.message);
    LJR_res.status(500).json({ code: 500, msg: '服务器内部错误：' + LJR_err.message, data: null });
});

LJR_app.listen(LJR_port, function () {
    console.log('Server running at http://localhost:' + LJR_port);
    console.log('健康检查：http://localhost:' + LJR_port + '/api/health');
});
