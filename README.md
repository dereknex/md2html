# md2html — 自包含 HTML 转换工具 🚀

`md2html` 是一个命令行工具 (CLI)，用于将 Markdown 文件转换为完全**自包含 (Self-contained)**、样式优雅且支持 Mermaid 图表交互缩放的 HTML 文件。

生成的 HTML 文件内联了所有的 CSS 和 JavaScript 资源（包括 Shiki 代码高亮样式和 Mermaid 运行时），无需任何网络连接或外部文件依赖即可完美本地渲染。

---

## ✨ 特性

- 📦 **完全自包含**：所有资源（CSS、JavaScript）均在生成时编码内联，生成的单 HTML 文件可离线查看。
- 🎨 **GitHub 渲染风格**：采用官方 `github-markdown-css`，完美复刻 GitHub 原生 Markdown 布局与主题。
- 🔍 **Mermaid 缩放与平移 (Zoom & Pan)**：
  - 自动渲染 Mermaid 流程图与序列图等。
  - 支持鼠标滚轮缩放、左键拖拽平移、双指/单指触摸手势。
  - 右上角提供悬浮控制面板（放大 `＋`、缩小 `－`、重置 `↺`）。
- 💻 **优雅的代码高亮**：基于 Shiki 引擎，默认提供 GitHub 主题级别的代码高亮渲染。
- 🛠️ **多平台单体二进制打包**：支持使用 Bun 编译为无依赖的独立可执行二进制文件（Windows, macOS, Linux）。

---

## 🚀 快速开始

### 运行环境要求

- [Node.js](https://nodejs.org/) >= 20 或 [Bun](https://bun.sh/)

### 安装与构建

1. 克隆本项目并进入目录：
   ```bash
   git clone <repository-url> md2html
   cd md2html
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 生成静态资源并构建项目：
   ```bash
   npm run gen:css && npm run build
   ```

---

## 📖 使用指南

### 命令行参数

```bash
md2html [options] <input.md>
```

- `-i, --input` : Markdown 源文件路径。
- `-o, --output` : 目标 HTML 输出路径（默认在同目录下生成同名的 `.html` 文件）。
- `-t, --theme` : Shiki 渲染主题（默认：`github-light`）。
- `-h, --help` : 显示帮助信息。

### 示例

```bash
# 最简转换（在 examples/ 目录下生成 example.html）
npx tsx src/index.ts examples/example.md

# 指定输出文件路径及 Shiki 主题
npx tsx src/index.ts -i README.md -o docs/index.html -t github-dark
```

---

## 🛠️ 项目管理与打包脚本

在 `package.json` 中配置了以下常用开发命令：

- `npm run gen:css` : 提取 `node_modules` 中 CSS/JS 资源并内联入 `src/assets.ts`。
- `npm run build` : 编译 TypeScript 代码输出至 `dist/`。
- `npm run dev` : 使用 `tsx` 直接开发/调试 CLI 脚本。
- `npm run package` : 使用 Bun 编译生成当前系统的单体二进制文件（输出至 `bin/md2html`）。
- `npm run package:macos-arm64` : 交叉编译 macOS M 系列芯片二进制文件。
- `npm run package:linux-x64` : 交叉编译 Linux x64 二进制文件。
- `npm run package:win-x64` : 交叉编译 Windows x64 二进制可执行文件。

---

## 📁 目录结构

```text
├── bin/                 # 编译后的二进制可执行文件输出目录
├── dist/                # tsc 编译输出的 JS 目录
├── examples/            # 示例和测试 Markdown 文件
├── scripts/             # 预构建和 Sea 资源内联脚本
├── src/                 # TypeScript 源码目录
│   ├── assets.ts        # 自动生成：内联的 CSS/JS 静态资源
│   ├── convert.ts       # Unified / Markdown 解析核心逻辑
│   ├── index.ts         # CLI 入口与参数解析
│   └── template.ts      # HTML 骨架模板与交互脚本
├── tsconfig.json        # TypeScript 配置
└── package.json         # Node.js 项目配置与脚本
```
