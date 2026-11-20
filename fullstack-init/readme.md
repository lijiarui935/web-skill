# 星轨科技资讯站 · 全栈项目初始化

- 姓名：李嘉蕊
- 学号：24002120526
- 项目类别：模仿（课堂案例复刻）
- 技术栈：原生 HTML/CSS/JS + Node.js + Express + MySQL
- 后端端口：8526（学号后三位 526）

## 项目简介

按《高级网页设计》全栈项目初始化课程要求搭建的前后端分离小项目：

- 首页包含姓名、学号、项目名称、项目类别、所有页面导航，以及 Canvas 粒子连线背景动画
- `database.html` 输入 MySQL 用户名 / 密码测试数据库连接，成功与失败都有明确提示
- `news.html` 从数据库读取科技新闻，页面顶部显示接口地址
- `gallery.html` 从数据库读取图文数据，网格布局展示"上图下文"卡片

## 目录结构

```
fullstack-init/
├─ AGENTS.md                 项目规则（项目宪法）
├─ readme.md                 项目说明
├─ start.bat                 一键启动后端
├─ lijiarui_prompt.md        提示词记录（追加写入）
├─ frontend/                 前端静态资源
│  ├─ index.html             首页（Canvas 动画 + 导航）
│  ├─ database.html          数据库连接测试
│  ├─ news.html              科技新闻列表
│  ├─ gallery.html           图文列表
│  ├─ css/LJR_main.css       全站样式
│  ├─ js/                    各页面脚本
│  ├─ images/                图文数据图片（本地生成）
│  └─ fonts/
└─ backend/                  后端服务
   ├─ app.js                 入口
   ├─ package.json
   ├─ .env                   数据库凭据（不进 git）
   ├─ db/LJR_pool.js         连接池
   ├─ routes/                路由
   ├─ controllers/           控制器
   ├─ LJR_interface.md       接口记录
   └─ LJR_database.md        数据库记录（含全部 SQL）
```

## 运行方式

1. 安装依赖（首次）：
   ```
   cd backend
   npm install
   ```
2. 配置 `backend/.env`（数据库用户名、密码、库名）
3. 双击根目录 `start.bat`，或在 `backend/` 下执行 `npm run dev`
4. 浏览器访问 http://localhost:8526/

## 接口一览

| 接口 | 方法 | 说明 |
|---|---|---|
| `/api/health` | GET | 服务健康检查 |
| `/api/db-test` | POST | 测试 MySQL 连接，返回数据库版本 |
| `/api/news` | GET | 科技新闻列表（按发布时间倒序） |
| `/api/gallery` | GET | 图文列表 |

统一响应格式：`{ "code": 0, "msg": "提示信息", "data": {} }`
