# 我的日记

一个基于 Nuxt 3 的个人日记应用，支持记录每日日记、待办事项管理、心情记录、数据统计等功能。

## 功能特性

- 📝 **日记记录** - 按日期记录日记，支持 Markdown 基础语法
- ✅ **待办事项** - 每日待办管理，支持延期功能
- 😊 **心情记录** - 5 级心情等级，追踪情绪变化
- 📅 **日历视图** - 月历展示，快速查看有记录的日期
- 🏷️ **标签分类** - 为日记和待办添加标签
- 🔍 **全文搜索** - 搜索日记内容
- 📊 **数据统计** - 月度完成率、心情趋势图表
- 🌙 **夜间模式** - 日间/夜间主题切换
- 📱 **移动适配** - 响应式设计，支持移动端
- 💾 **数据导出** - JSON 格式备份

## 技术栈

- [Nuxt 3](https://nuxt.com/) - Vue 全栈框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS
- [Naive UI](https://www.naiveui.com/) - Vue 3 组件库
- [Pinia](https://pinia.vuejs.org/) - 状态管理
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) - 本地存储
- [ECharts](https://echarts.apache.org/) - 数据可视化

## 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 预览
pnpm preview
```

## 部署

### Vercel（推荐）

1. Fork 或导入此仓库到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量（可选）
4. 自动部署

### GitHub Actions 自动部署

1. 在 Vercel 创建项目，获取 Token、Org ID、Project ID
2. 在 GitHub 仓库设置中添加 Secrets：
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. 推送到 main 分支自动触发部署

## 项目结构

```
my-diary-app/
├── components/        # 组件
│   ├── common/       # 通用组件
│   ├── diary/        # 日记组件
│   ├── todo/         # 待办组件
│   ├── calendar/     # 日历组件
│   └── stats/        # 统计组件
├── composables/       # 组合式函数
├── layouts/           # 布局
├── pages/             # 页面
├── plugins/           # 插件
├── stores/            # Pinia 状态管理
├── types/             # TypeScript 类型
└── utils/             # 工具函数
```

## 许可证

MIT
