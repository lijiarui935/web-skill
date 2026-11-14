// server.js —— 王垚《高级网页设计》课堂案例：从 JSON 到 fetch 数据服务器
// 两个接口：GET /api/poems（诗词数组）、GET /api/authors（诗人列表）
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const wy_port = 3004;

// 王垚：每次请求都重新读一次，改完 db.json 刷新页面即可生效
function wy_readData() {
    const wy_txt = fs.readFileSync(path.join(__dirname, 'db.json'), 'utf-8');
    return JSON.parse(wy_txt);
}

// 允许跨域：页面用 file:// 直接双击打开也能请求本接口
app.use(function (wy_req, wy_res, wy_next) {
    wy_res.setHeader('Access-Control-Allow-Origin', '*');
    wy_next();
});

// ① 诗词接口：返回 db.json 里的 poems 数组
app.get('/api/poems', function (wy_req, wy_res) {
    try {
        const wy_data = wy_readData();
        wy_res.json(wy_data.poems);
    } catch (wy_err) {
        wy_res.status(500).json({ error: '读取 db.json 失败：' + wy_err.message });
    }
});

// ② 诗人接口：返回 db.json 里的 authors 数组
app.get('/api/authors', function (wy_req, wy_res) {
    try {
        const wy_data = wy_readData();
        wy_res.json(wy_data.authors || []);
    } catch (wy_err) {
        wy_res.status(500).json({ error: '读取 db.json 失败：' + wy_err.message });
    }
});

// ③ 顺手托管项目根目录，方便直接访问 http://localhost:3004/poems.html
app.use(express.static(path.join(__dirname, '..')));

app.listen(wy_port, function () {
    console.log('数据服务器已启动：http://localhost:' + wy_port + '/api/poems');
    console.log('诗人接口：http://localhost:' + wy_port + '/api/authors');
});
