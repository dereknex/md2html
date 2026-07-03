import { mermaidRuntimeJs } from "./assets.js";

export function wrapHtml(body: string, css: string, title = "Markdown"): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
${css}
    .markdown-body {
      box-sizing: border-box;
      min-width: 200px;
      max-width: 980px;
      margin: 0 auto;
      padding: 45px;
    }
    @media (max-width: 767px) {
      .markdown-body {
        padding: 15px;
      }
    }
    .markdown-body .mermaid svg {
      display: block;
      margin: 0 auto;
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <div class="markdown-body">
${body}
  </div>
  <script>
${mermaidRuntimeJs}
  </script>
  <script>
    mermaid.initialize({ startOnLoad: true, theme: "default", securityLevel: "loose" });
  </script>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
