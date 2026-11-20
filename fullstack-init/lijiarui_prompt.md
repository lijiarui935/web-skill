# 提示词记录 · 李嘉蕊 24002120526

> 规则：一律追加写入，禁止覆盖已有内容。格式：时间 | 提示词全文 | 大模型名称

---

时间：2026-11-20
大模型：DeepSeek-V4.1-Flash
提示词：https://spontaneous-valkyrie-4e4229.netlify.app/fullstack-init-lesson 帮我弄成里面的任务，标红的改成姓名李嘉蕊 学号24002120526，新建一个文件夹弄，检查好后上传到 github，在作业目录里新建一个入口。补充：端口 8526；命名前缀 wy_ 全部改成 LJR_。

---

时间：2026-11-20
大模型：DeepSeek-V4.1-Flash
提示词：在当前项目根目录创建 AGENTS.md，写入项目规则（前端原生、后端 Express + MySQL、端口 8526、凭据写入 .env、命名统一 LJR_ 前缀、记录文件追加写入、统一 JSON 响应）。

---

时间：2026-11-20
大模型：DeepSeek-V4.1-Flash
提示词：请初始化本项目：1、git init + .gitignore（排除 node_modules、.env）+ 首次提交；2、按 AGENTS.md 规则创建前后端目录骨架、安装依赖；3、创建前端首页 index.html，包括姓名李嘉蕊、学号24002120526、项目名称、项目类别（自选、模仿），所有完成的 html 页面的超链接，有 canvas 背景动画，主体是页面链接导航，页面美观；4、创建 readme.md，在根目录下，包括学号、姓名。

---

时间：2026-11-20
大模型：DeepSeek-V4.1-Flash
提示词：创建运行后台的 bat 文件，放在项目根目录：1、自动切换到 backend 目录再启动（用 %~dp0）；2、使用 chcp 65001 避免中文日志乱码；3、启动命令与 package.json 中的脚本保持一致；4、结尾加 pause。

---

时间：2026-11-20
大模型：DeepSeek-V4.1-Flash
提示词：在 frontend/ 下创建 database.html：1、页面有用户名、密码两个输入框，默认用户名 root，一个"测试连接"按钮；2、点击后调用后端接口 /api/db-test，把用户名密码发给后端；3、后端用 mysql2 尝试连接 MySQL，成功返回 { code:0, msg:"数据库连接成功", data:{ 数据库版本 } }，失败返回 code 非 0 和错误信息；4、前端把结果显示在页面上：成功用绿色，失败用红色，同时在控制台输出；5、数据库凭据从 backend/.env 读取，不要写死在代码里；6、完成后在 frontend/index.html 加上本页面的超链接入口。

---

时间：2026-11-20
大模型：DeepSeek-V4.1-Flash
提示词：完成科技新闻列表页面：1、在 MySQL 中建表 LJR_news，字段包含 id、title、summary、content、source、publish_time、cover_img；2、插入至少 8 条真实的科技新闻测试数据；3、后端提供 GET /api/news 接口，返回全部新闻（按发布时间倒序），统一 JSON 格式 { code, msg, data }；4、新建 frontend/news.html，页面顶部显示当前调用的接口地址，下方以列表展示新闻标题、摘要、来源、时间；5、数据用 fetch 获取，控制台输出返回数据；6、把建表与插入数据的 SQL 追加写入 backend/LJR_database.md，接口信息追加写入 backend/LJR_interface.md，本次提示词追加写入 lijiarui_prompt.md；7、在 frontend/index.html 增加入口链接。

---

时间：2026-11-20
大模型：DeepSeek-V4.1-Flash
提示词：完成图文列表页面：1、在 MySQL 中新建表 LJR_gallery，字段 id、title、description、img_url、category、create_time，插入至少 8 条测试数据；2、后端提供 GET /api/gallery 接口，返回全部图文数据；3、新建 frontend/gallery.html，页面顶部显示接口地址，下方用网格布局展示"上图下文"卡片；4、图片加载失败时显示占位色块，不要出现破图图标；5、页面适配手机宽度；6、记录写入 backend/LJR_database.md、backend/LJR_interface.md 和 lijiarui_prompt.md，并在首页加入口。
