# 东坡清风纪 视觉资产清单 (MANIFEST)

> 生成时间: 2026-06-30 19:55 CST
> 风格关键词: 宋韵夜色 / 月光 / 宣纸 / 清风账 / 墨迹 / 朱砂 / 冷青灰 / 米白 / 旧金 / 克制古风 / 电影感
> 色板: 墨黑 #0B1118 · 夜蓝 #101820 · 月白 #F2E6C9 · 旧金 #C89B5A · 朱砂 #A83232 · 雾灰 #7E8790
> 原则: 所有文字（标题/剧情/选项/数值）由 Vue 渲染，图片仅做底图/视觉氛围，不烘入可读文字

## 总览

| 类别     | 数量 | 备注 |
|----------|------|------|
| backgrounds | 9 | 1920×1080 (实际 2752×1536 2K JPEG) |
| characters  | 7 | 600×1200 立绘, 透明/纯色背景 |
| ui          | 8 | 组件底图, 透明/半透明 PNG |
| icons       | 8 | 64×64 矢量 SVG, 手写 |
| transitions | 3 | 章节转场底图 |
| endings     | 6 | 6 个结局氛围图 |
| share       | 1 | 分享海报底图 |
| **合计**    | **42** | 全部 > 5 KB (SVG 例外) |

---

## backgrounds/  — 9 张场景背景 (1920×1080 横向)

| 文件 | 用途 | 场景描述 |
|------|------|----------|
| `bg_home_moon_city.png` | 首页 / 故事开场 | 月色水乡远景，宋韵夜色 + 流水屋檐剪影 |
| `bg_meishan_study.png` | 眉山章节 | 书斋夜晚，烛光 + 书卷 + 木窗 |
| `bg_capital_night.png` | 京城章节 | 开封夜街，灯笼 + 瓦顶远景 |
| `bg_mizhou_drought.png` | 密州章节 | 旱情，枯田 + 烈日 |
| `bg_wutai_storm.png` | 乌台诗案 | 风暴，漆黑天幕 + 闪电剪影 |
| `bg_huangzhou_river.png` | 黄州章节 | 长江月夜，江面 + 月影 + 远山 |
| `bg_huangzhou_stove.png` | 黄州日常 | 灶台暖光，灶火 + 饭香蒸汽 |
| `bg_chengtian_moon.png` | 承天寺章节 | 月色庭院，月 + 竹 + 石阶 |
| `bg_result_moon_landscape.png` | 结果页横幅 | 月光山水远景 |

---

## characters/  — 7 张人物立绘 (600×1200 纵向, 透明/纯黑背景)

| 文件 | 用途 | 描述 |
|------|------|------|
| `char_sushi_young.png` | 少年苏轼 | 白衣书生，眉山少年 |
| `char_sushi_adult.png` | 中年苏轼 | 官服，京城/密州时期 |
| `char_sushi_huangzhou.png` | 黄州苏轼 | 布衣戴笠，被贬形象 |
| `char_ziyou_shadow.png` | 苏辙 | 子由剪影 |
| `char_huaimin_shadow.png` | 王弗 / 王闰之 | 妻子剪影 |
| `char_villager_shadow.png` | 百姓剪影 | 群众 NPC 通用 |
| `char_official_shadow.png` | 官员剪影 | 反派/朝廷 NPC 通用 |

---

## ui/  — 8 张 UI 组件底图 (无文字, 透明/半透明)

| 文件 | 用途 | 说明 |
|------|------|------|
| `dialogue_box.png` | 对话框底图 | 卷轴式，承载对话文本 |
| `choice_card_default.png` | 选项卡默认态 | 用户未选时的卡片底图 |
| `choice_card_selected.png` | 选项卡选中态 | hover/focus 高亮态 |
| `choice_card_warning.png` | 污染选项警告底图 | 朱砂色边框，警告玩家 |
| `fact_book_panel.png` | 史实/改编双页底图 | 幕间史实弹窗 |
| `log_card.png` | 日志卡底图 | 行迹记录/事件卡 |
| `account_ribbon_bg.png` | 清风账状态条底图 | 顶部"清风账"分数条 |
| `result_card.png` | 结果卡底图 | 结局页结果卡片 |

---

## icons/  — 8 个 SVG 图标 (手写矢量, ~64×64 viewBox)

| 文件 | 用途 | 视觉 |
|------|------|------|
| `icon_back.svg` | 返回 | 折角宋版 |
| `icon_log.svg` | 日志入口 | 折页册子 |
| `icon_archive.svg` | 档案入口 | 卷宗架 |
| `icon_sound.svg` | 静音/声音 | 笛形 |
| `icon_moon.svg` | 月相/夜间模式 | 弯月 |
| `icon_brush.svg` | 毛笔 | 笔锋 |
| `icon_scroll.svg` | 卷轴 | 展开的卷子 |
| `icon_stamp.svg` | 印章 | 朱砂方印 |

---

## transitions/  — 3 张章节转场底图 (本次新生成)

| 文件 | 用途 | 场景描述 |
|------|------|----------|
| `chapter_mizhou_to_wutai.png` | 密州 → 乌台 章节转场 | 风暴前夕，干裂大地 + 远处闪电 + 孤鸦 |
| `chapter_huangzhou_to_chengtian.png` | 黄州 → 承天寺 章节转场 | 竹林分开 + 月色庭院 + 石阶 |
| `archive_wall_bg.png` | 档案墙背景 | 木质卷宗架 + 竹简 + 朱砂绳 |

---

## endings/  — 6 张结局氛围图 (本次新生成)

| 文件 | 结局 | 视觉描述 |
|------|------|----------|
| `ending_qingfeng.png` | 清风结局 | 雨过天晴，弯月照湖 + 纸鸢 |
| `ending_yisuo_yanyu.png` | 一蓑烟雨 | 孤舟蓑笠翁 + 烟雨江面 |
| `ending_tianya_light.png` | 天涯微光 | 暮色渡口 + 远海落日 + 帆影 |
| `ending_yueguang_cold.png` | 月光冷 | 冰雪冻湖 + 枯梅 + 冷月 |
| `ending_dirty_account.png` | 污染账 | 昏暗案桌 + 墨渍 + 朱砂印 + 银锭 |
| `ending_ziyou_tired.png` | 子由疲惫 | 孤灯下伏案写信的书生 |

---

## share/  — 1 张分享海报底图 (本次新生成)

| 文件 | 用途 | 视觉描述 |
|------|------|----------|
| `share_poster_template.png` | 分享海报底图 | 案桌 + 空白卷轴 + 毛笔砚台，留出中央大片空白给前端叠加标题/二维码 |

---

## 设计原则 (强制约束)

1. **零文本烘焙**: 所有可读文字（标题/剧情/选项/数值/朝代/年号）由 Vue 模板或 canvas 渲染；图片仅承载氛围与底图。
2. **风格统一**: 全部走宋韵水墨路线，禁止赛博蓝屏、仙侠光效、低幼 Q 版、表情包化苏轼。
3. **色板一致**: 仅使用文档指定的 6 种主色 + 衍生过渡色，不出现廉政展板大红、不出现 AI 紫色霓虹。
4. **避免 IP 化误读**: 苏轼不只表现为"吃货"，保留诗人、政治家、被贬者的多面性。

## 后续 Vue 接入注意

- `bg_*.png` 和 `ending_*.png` 作为全屏背景层（`background-image: url(...)` 或 `<img>` 全屏 fixed），前景由 Vue 组件叠加文字与交互。
- `char_*.png` 作为立绘精灵 (`<img>` + CSS `mix-blend-mode: multiply` 与背景融合)。
- `ui/*.png` 作为卡片底图，**不要直接放文字**，所有文字必须由 Vue 模板 `<div>` 渲染在上层。
- `icons/*.svg` 通过 `<img src>` 或内联 `<svg>` 使用，建议 inline 以便 `currentColor` 控制色调。
- `transitions/` 用于章节切换的过场画面（CSS 渐隐 + 图片轮播 1.5s）。
- `share/share_poster_template.png` 配合 html2canvas 或后端拼接服务叠加海报标题。

## 文件格式说明

- 所有 PNG 后缀文件实际为 JPEG 编码（matrix MCP 默认输出 JPEG），浏览器通过 magic bytes 自动识别，与扩展名无关。如需严格 PNG，请用 ImageMagick 或 Pillow 转换（`magick mogrify -format png *.jpg`）。
- 分辨率: backgrounds/transitions/endings/share 全部 2752×1536 (16:9 2K)，高于设计建议的 1920×1080，确保高 DPR 设备清晰。