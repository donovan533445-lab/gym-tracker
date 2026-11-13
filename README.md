# GYM TRACKER

中文个人健身进步追踪网站。React + TypeScript + Recharts，深色荧光绿主题，支持电脑、平板、iPhone Safari。

## 运行

Node.js 22.13+（Vite 8 推荐 22.14+）。

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

开发入口默认 `/gym-tracker/`，专用手机入口 `/gym-tracker/mobile/`。其他仓库路径可通过 `VITE_BASE_PATH=/your-repo/ npm run build` 设置。

## 功能

训练记录与动作库、逐组重量/次数/RPE、复制上次训练、历史编辑删除确认、力量趋势与1RM、动态PR历史与庆祝、身体围度、训练计划与长期目标、CSV导出、完整JSON备份恢复。初次打开没有伪造训练记录。

## 数据与隐私

网站代码公开；训练数据不在仓库中。每位访问者的数据通过 IndexedDB 保存在自己的浏览器，不上传服务器，不同设备不自动同步。刷新或重开保留记录。请使用普通浏览模式并定期导出完整备份；清除网站数据、卸载浏览器或无痕模式可能丢失本机数据。旧版可先从设置导出完整备份，再在此站恢复。

`lib/storage.ts` 提供 `TrainingRepository` 接口，可替换为有身份验证的服务端数据库适配器。IndexedDB 使用事务与版本比较，避免多个标签页静默覆盖。

## GitHub Pages

`npm run build` 生成 `docs/`，含 `.nojekyll`。提交源码和 docs 后，在仓库 Settings → Pages 选择 Deploy from a branch → main → /docs → Save。每次更新运行构建并提交 docs。

## 校验

模型测试覆盖容量、估算1RM、PR回算、5×5目标、备份关联校验、CSV安全转义和日期规则。存储测试覆盖持久化、并发冲突、非法数据和损坏记录保护。

## 动作库 v2

内置 100 个动作，每项有中文名称、器械、目标肌群、3 条动作要点和可播放/暂停/下载的分解示范 GIF。动作库支持中英文搜索、肌群及器械筛选；训练编辑器和力量分析中也可展开示范。

视觉素材来自 `@bryllim/workout-guide@1.0.0`，作者 Bryl Lim，部分首姿态源于 Everkinetic，按 **CC BY-SA 4.0** 使用。本站将三个姿态依次组装为循环 GIF，并保留原始首帧作静态封面；这些是分解图示，不是真人视频或连续动作捕捉。完整逐帧来源、改动和许可证见 `public/exercise-media/ATTRIBUTION.json` 与 `LICENSE.txt`。衍生 GIF/封面继续按 CC BY-SA 4.0 提供。

媒体直接随网站托管，不依赖外部图片服务器。每个 `public/exercise-media/*.json` 内封装实际 GIF/PNG 的 data URL，按可见区域加载封面，仅在用户打开示范后播放，减少手机端同时运行动画。

重建素材（常规构建无需执行）：下载并解包 `npm pack @bryllim/workout-guide@1.0.0 --ignore-scripts`，安装 ffmpeg 与 Pillow，然后运行 `python scripts/generate-exercise-media.py /absolute/path/to/package`。`content/exercises.tsv` 是中文动作与来源的对应表。

首次加载自动补充旧版缺失动作，并原子更新数据库版本；保留原 29 个动作 ID、用户改名、自定义动作、训练、计划、目标和身体记录。已升级后主动删除的动作不会在刷新时重新加入。恢复旧备份时也执行同样的增量升级。
