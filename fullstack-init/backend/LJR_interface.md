# 接口记录 · 李嘉蕊 24002120526

> 规则：每次创建或修改接口后追加写入，禁止覆盖。
> 统一响应格式：`{ "code": 0, "msg": "提示信息", "data": {...} }`，`code = 0` 表示成功。

---

## GET /api/health

- 路径：`/api/health`
- 方法：`GET`
- 请求参数：无
- 响应示例：
```json
{
  "code": 0,
  "msg": "ok",
  "data": { "name": "李嘉蕊", "studentId": "24002120526", "port": 8526, "time": "2026/11/20 10:30:00" }
}
```
- 修改时间：2026-11-20

---

## POST /api/db-test

- 路径：`/api/db-test`
- 方法：`POST`
- 请求参数（JSON）：
```json
{ "username": "root", "password": "你的数据库密码" }
```
- 成功响应示例：
```json
{ "code": 0, "msg": "数据库连接成功", "data": { "version": "9.0.1", "user": "root", "host": "localhost" } }
```
- 失败响应示例：
```json
{ "code": 1, "msg": "数据库连接失败：Access denied for user 'root'@'localhost' (using password: YES)", "data": { "errorCode": "ER_ACCESS_DENIED_ERROR" } }
```
- 说明：连接参数中的密码只用于本次测试，不写入日志、不写入数据库
- 修改时间：2026-11-20

---

## GET /api/news

- 路径：`/api/news`
- 方法：`GET`
- 请求参数：无
- 响应示例：
```json
{
  "code": 0,
  "msg": "查询成功",
  "data": [
    {
      "id": 1,
      "title": "国产开源大模型发布新一代推理版本",
      "summary": "数学与代码能力大幅提升……",
      "content": "……",
      "source": "科技日报",
      "publish_time": "2026-11-18T09:00:00.000Z",
      "cover_img": ""
    }
  ]
}
```
- 排序：按 `publish_time` 倒序
- 修改时间：2026-11-20

---

## GET /api/gallery

- 路径：`/api/gallery`
- 方法：`GET`
- 请求参数：无
- 响应示例：
```json
{
  "code": 0,
  "msg": "查询成功",
  "data": [
    {
      "id": 1,
      "title": "大模型推理集群",
      "description": "万卡集群通过高速互联支撑大模型训练与推理……",
      "img_url": "images/LJR_gallery_1.jpg",
      "category": "人工智能",
      "create_time": "2026-11-10T02:00:00.000Z"
    }
  ]
}
```
- 排序：按 `create_time` 倒序
- 修改时间：2026-11-20
