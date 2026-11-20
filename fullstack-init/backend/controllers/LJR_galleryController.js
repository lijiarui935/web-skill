/**
 * 姓名：李嘉蕊 | 学号：24002120526 | 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：图文列表控制器，从 LJR_gallery 表按创建时间倒序读取
 */
const LJR_pool = require('../db/LJR_pool');

async function LJR_listGallery(LJR_req, LJR_res) {
    try {
        const [LJR_rows] = await LJR_pool.query(
            'SELECT id, title, description, img_url, category, create_time FROM LJR_gallery ORDER BY create_time DESC'
        );
        LJR_res.json({ code: 0, msg: '查询成功', data: LJR_rows });
    } catch (LJR_err) {
        console.error('查询图文失败：', LJR_err.message);
        LJR_res.json({ code: 1, msg: '查询图文失败：' + LJR_err.message, data: [] });
    }
}

module.exports = { LJR_listGallery };
