# 数据库记录 · 李嘉蕊 24002120526

> 规则：每次建表、改表或插入数据后按执行顺序追加 SQL，禁止覆盖。
> 仅凭本文件即可在新机器上完整重建数据库（MySQL 9.0 验证通过）。

---

## 1. 创建数据库

```sql
CREATE DATABASE IF NOT EXISTS ljr_fullstack
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE ljr_fullstack;
```

---

## 2. 科技新闻表 LJR_news

```sql
CREATE TABLE IF NOT EXISTS LJR_news (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  title VARCHAR(200) NOT NULL COMMENT '新闻标题',
  summary VARCHAR(500) NOT NULL COMMENT '摘要',
  content TEXT COMMENT '正文',
  source VARCHAR(100) NOT NULL COMMENT '来源',
  publish_time DATETIME NOT NULL COMMENT '发布时间',
  cover_img VARCHAR(255) DEFAULT '' COMMENT '封面图地址',
  PRIMARY KEY (id),
  KEY idx_publish_time (publish_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='李嘉蕊 24002120526 科技新闻表';
```

### 测试数据（8 条）

```sql
INSERT INTO LJR_news (title, summary, content, source, publish_time, cover_img) VALUES
('国产开源大模型发布新一代推理版本，数学与代码能力大幅提升', '新版本在 MATH-500 与 SWE-bench 两项基准上分别提升 12% 与 9%，推理成本下降约三成。', '国产开源大模型团队今日发布新一代推理版本，重点优化长链推理与工具调用能力。官方数据显示，新版本在数学推理、代码修复等任务上均有明显提升，同时通过稀疏激活把单次推理成本降低了约 30%。', '科技日报', '2026-11-18 09:00:00', ''),
('新一代国产 GPU 实现量产：单卡 96GB 显存，支持 FP8 训练', '该卡面向大模型训练场景，配套软件栈已适配主流深度学习框架。', '国内芯片厂商宣布新一代通用 GPU 正式量产，单卡配备 96GB HBM 显存，支持 FP8 低精度训练。厂商同步发布编译器与算子库，已完成对主流训练框架的适配，首批产品将交付给多家智算中心。', 'IT之家', '2026-11-15 14:20:00', ''),
('6G 技术白皮书发布：2030 年有望规模商用', '白皮书提出"通感算智"一体化架构，峰值速率目标为 5G 的 10 倍以上。', '行业组织联合发布 6G 技术白皮书，明确太赫兹通信、智能超表面、通感一体化等关键技术路线。白皮书预计 2028 年完成标准冻结，2030 年前后进入规模商用阶段。', '新华网', '2026-11-12 10:05:00', ''),
('人形机器人进入汽车工厂实训，单台可替代 3 个工位', '某车企在总装车间部署 20 台人形机器人，负责搬运与质检等重复性工序。', '某汽车集团公布人形机器人实训进展：20 台机器人已在总装车间连续运行三个月，承担物料搬运、外观质检等工序，单台可替代约 3 个重复性工位，故障率低于 2%。', '36氪', '2026-11-08 16:40:00', ''),
('我国首条量子芯片生产线通过验收，良率超过 90%', '产线具备超导量子芯片批量制备能力，年产能可达数千片。', '国内首条超导量子芯片生产线完成验收，覆盖薄膜生长、微纳加工、封装测试全流程，芯片良率超过 90%。产线投用后将为量子计算整机研发提供稳定供给。', '人民日报', '2026-11-05 08:30:00', ''),
('开源鸿蒙设备装机量突破 10 亿，原生应用超过 3 万款', '生态进入正循环，金融、交通、教育等行业应用加速落地。', '开源鸿蒙社区公布最新数据：搭载该系统的设备装机量突破 10 亿台，原生应用数量超过 3 万款。金融、交通、教育等行业的定制发行版开始规模部署。', '环球网', '2026-10-29 11:15:00', ''),
('固态电池中试线投产：能量密度 400Wh/kg，充电 10 分钟续航 800 公里', '中试线年产能 2GWh，计划 2027 年装车验证。', '某动力电池企业中试线正式投产，采用硫化物固态电解质路线，电芯能量密度达到 400Wh/kg，支持 10 分钟快充。企业计划 2027 年完成装车验证，2028 年小批量供货。', '第一财经', '2026-10-22 15:00:00', ''),
('AI 编程助手渗透率超 70%，开发者平均提效 35%', '调查报告显示，代码补全与单测生成是使用频率最高的两个场景。', '最新开发者调查报告显示，超过 70% 的受访开发者已在日常工作中使用 AI 编程助手，代码补全与单元测试生成是使用频率最高的场景，自评平均提效约 35%。', 'InfoQ', '2026-10-15 09:45:00', '');
```

---

## 3. 图文列表 LJR_gallery

```sql
CREATE TABLE IF NOT EXISTS LJR_gallery (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  title VARCHAR(200) NOT NULL COMMENT '标题',
  description VARCHAR(500) NOT NULL COMMENT '描述',
  img_url VARCHAR(255) NOT NULL COMMENT '图片地址',
  category VARCHAR(50) NOT NULL COMMENT '分类',
  create_time DATETIME NOT NULL COMMENT '创建时间',
  PRIMARY KEY (id),
  KEY idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='李嘉蕊 24002120526 图文列表';
```

### 测试数据（8 条，图片为本地生成）

```sql
INSERT INTO LJR_gallery (title, description, img_url, category, create_time) VALUES
('大模型推理集群', '万卡级 GPU 通过高速互联组成训练集群，支撑大模型的训练与在线推理。', 'images/LJR_gallery_1.jpg', '人工智能', '2026-11-10 10:00:00'),
('晶圆光刻车间', '光刻机在恒温恒湿的洁净室中完成曝光，决定芯片的最小线宽。', 'images/LJR_gallery_2.jpg', '芯片制造', '2026-11-09 10:00:00'),
('人形机器人实训', '人形机器人在产线上完成搬运、质检等重复工序，与工人协同作业。', 'images/LJR_gallery_3.jpg', '机器人', '2026-11-08 10:00:00'),
('可重复使用火箭', '一级火箭垂直回收后经检修再次执行发射任务，显著降低发射成本。', 'images/LJR_gallery_4.jpg', '航天探索', '2026-11-07 10:00:00'),
('稀释制冷机', '超导量子计算机需要在毫开尔文级极低温环境中运行。', 'images/LJR_gallery_5.jpg', '量子科技', '2026-11-06 10:00:00'),
('固态电池中试线', '硫化物固态电解质电芯在干燥房中完成叠片与封装。', 'images/LJR_gallery_6.jpg', '新能源', '2026-11-05 10:00:00'),
('液冷数据中心', '服务器整机浸没在绝缘冷却液中，PUE 可降至 1.1 以下。', 'images/LJR_gallery_7.jpg', '云计算', '2026-11-04 10:00:00'),
('城市 NOA 路测', '智能汽车在城市道路完成无图导航辅助驾驶测试。', 'images/LJR_gallery_8.jpg', '智能汽车', '2026-11-03 10:00:00');
```
