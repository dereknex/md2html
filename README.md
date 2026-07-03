# md2html — Self-Contained HTML Converter 🚀

`md2html` is a command-line tool (CLI) designed to convert Markdown documents into completely **self-contained** HTML files with beautiful syntax highlighting and interactive Mermaid diagrams.

All generated HTML files have styling and scripts (such as Shiki highlight configurations and Mermaid runtime) fully inlined. No network requests or external dependencies are required to view the output locally.

---

## ✨ Features

- 📦 **Fully Self-Contained**: CSS and JS are fully embedded inside the output. View the generated single HTML file offline seamlessly.
- 🎨 **GitHub Markdown Style**: Adopts the official `github-markdown-css` layout, matching the look and feel of GitHub natively.
- 🔍 **Interactive Mermaid Diagrams (Zoom & Pan)**:
  - Automatically renders Mermaid flowcharts, sequence diagrams, etc.
  - Supports zoom (via mouse wheel or buttons) and pan (via dragging) on desktop and touch devices.
  - Controls panel at the top-right corner (Zoom In `＋`, Zoom Out `－`, Zoom Reset `↺`, Fullscreen `⛶`).
- 🖥️ **Mermaid Fullscreen Mode**: Expand any diagram to fullscreen with custom background matching your light/dark system theme.
- 💻 **Syntax Highlighting**: Uses Shiki engine under the hood, supporting major programming languages with official GitHub themes.
- 🛠️ **Single Binary Compilation**: Fully compiled using Bun for macOS, Linux, and Windows with zero dependencies.

---

## 🚀 Quick Start

### Requirements

- [Bun](https://bun.sh/) >= 1.0.0

### Installation & Build

1. Clone the repository:
   ```bash
   git clone <repository-url> md2html
   cd md2html
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Generate resources and build the project:
   ```bash
   bun run gen:css && bun run build
   ```

---

## 📖 Usage Guide

### CLI Command Options

```bash
bun dev [options] <input.md>
```

- `-i, --input` : Path to the Markdown source file.
- `-o, --output` : Output path of the HTML file (defaults to the same directory with `.html` extension).
- `-t, --theme` : Shiki theme (default: `github-light`).
- `-h, --help` : Show help information.

### Examples

```bash
# Convert a markdown file (creates examples/example.html)
bun run dev -- examples/example.md

# Specify the output file path and dark theme
bun run dev -- -i README.md -o docs/index.html -t github-dark
```

---

## 🛠️ Build & Package Scripts

The following scripts are defined in `package.json`:

- `bun run gen:css` : Extracts dependencies (mermaid, CSS) and inlines them into `src/assets.ts`.
- `bun run build` : Compiles TypeScript files to the `dist/` directory.
- `bun run dev` : Runs the CLI in development mode using TypeScript source directly.
- `bun run package` : Compiles a standalone single binary for the current host architecture at `bin/md2html`.
- `bun run package:macos-arm64` : Compiles a standalone binary for Apple Silicon macOS.
- `bun run package:linux-x64` : Compiles a standalone binary for Linux x64.
- `bun run package:win-x64` : Compiles a standalone executable binary for Windows x64.

---

## 📁 Directory Structure

```text
├── bin/                 # Compiled standalone executable outputs
├── dist/                # tsc compile output
├── examples/            # Example/Test Markdown and HTML files
├── scripts/             # Build scripts for Sea assets integration
├── src/                 # Source directory
│   ├── assets.ts        # Auto-generated: inlined CSS and JS assets
│   ├── convert.ts       # Unified / Markdown parser compiler logic
│   ├── index.ts         # CLI entrypoint and argument parser
│   └── template.ts      # HTML wrapper skeleton and zoom/pan interactive code
├── tsconfig.json        # TypeScript configuration
└── package.json         # Bun configuration & dependencies
```
