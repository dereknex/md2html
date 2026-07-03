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
    /* Mermaid Container & Viewport Styles */
    .mermaid-container {
      position: relative;
      width: 100%;
      border: 1px solid var(--borderColor-default);
      border-radius: 6px;
      background-color: var(--bgColor-muted);
      margin-bottom: 16px;
      overflow: hidden;
    }
    .mermaid-container:fullscreen {
      width: 100vw !important;
      height: 100vh !important;
      background-color: var(--bgColor-default) !important;
      border: none !important;
      border-radius: 0 !important;
      margin: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    .mermaid-container:fullscreen pre.mermaid {
      width: 100vw !important;
      height: 100vh !important;
      max-height: none !important;
      min-height: 0 !important;
    }
    .markdown-body pre.mermaid {
      background: none !important;
      border: none !important;
      padding: 0 !important;
      margin: 0 !important;
      overflow: hidden !important;
      width: 100%;
      min-height: 250px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: grab;
      box-sizing: border-box;
    }
    .markdown-body pre.mermaid:active {
      cursor: grabbing;
    }
    .markdown-body pre.mermaid svg {
      display: block;
      margin: 0 auto;
      max-width: 100% !important;
      height: auto !important;
      transform-origin: center center;
      transition: none;
      user-select: none;
    }
    .mermaid-controls {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 10;
      display: flex;
      gap: 6px;
    }
    .mermaid-controls button {
      background: var(--bgColor-default);
      border: 1px solid var(--borderColor-default);
      color: var(--fgColor-default);
      padding: 0;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      transition: all 0.2s ease;
    }
    .mermaid-controls button svg {
      display: block;
      pointer-events: none;
    }
    .mermaid-controls button:hover {
      background: var(--bgColor-muted);
      border-color: var(--borderColor-accent-emphasis);
      color: var(--fgColor-accent);
      transform: scale(1.05);
    }
    .mermaid-controls button:active {
      transform: scale(0.95);
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
    document.addEventListener('DOMContentLoaded', () => {
      mermaid.initialize({ startOnLoad: false, theme: "default", securityLevel: "loose" });
      mermaid.run().then(() => {
        const mermaidBlocks = document.querySelectorAll('.mermaid');
        mermaidBlocks.forEach(block => {
          const svg = block.querySelector('svg');
          if (!svg) return;

          // 1. Create container and controls
          const container = document.createElement('div');
          container.className = 'mermaid-container';

          const controls = document.createElement('div');
          controls.className = 'mermaid-controls';
          controls.innerHTML = \`
            <button class="zoom-in" title="放大">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <button class="zoom-out" title="缩小">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <button class="zoom-reset" title="重置">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>
            </button>
            <button class="zoom-fullscreen" title="全屏">
              <svg class="fs-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
              <svg class="exit-fs-icon" style="display:none;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6m10-6h-6v6M4 10h6V4m10 6h-6V4"/></svg>
            </button>
          \`;

          // 2. Insert container before the block, then move the block inside
          block.parentNode.insertBefore(container, block);
          container.appendChild(block);
          container.appendChild(controls);

          // 3. Zoom & Pan State
          let scale = 1;
          let translateX = 0;
          let translateY = 0;
          let isDragging = false;
          let startX = 0;
          let startY = 0;

          function updateTransform(useTransition = false) {
            svg.style.transition = useTransition ? 'transform 0.15s ease-out' : 'none';
            svg.style.transform = \`translate(\${translateX}px, \${translateY}px) scale(\${scale})\`;
          }

          // 4. Mouse Drag (Pan)
          block.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Left click only
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            e.preventDefault(); // Prevents default SVG dragging behavior
          });

          window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform(false);
          });

          window.addEventListener('mouseup', () => {
            isDragging = false;
          });

          // 5. Touch Drag for Mobile
          block.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
              isDragging = true;
              startX = e.touches[0].clientX - translateX;
              startY = e.touches[0].clientY - translateY;
            }
          });

          block.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            if (e.touches.length === 1) {
              translateX = e.touches[0].clientX - startX;
              translateY = e.touches[0].clientY - startY;
              updateTransform(false);
            }
          });

          block.addEventListener('touchend', () => {
            isDragging = false;
          });

          // 6. Wheel Zoom
          block.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = block.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const zoomFactor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
            const nextScale = scale * zoomFactor;
            const clampedScale = Math.min(Math.max(nextScale, 0.15), 10);

            // Keep mouse cursor point invariant
            const actualFactor = clampedScale / scale;
            translateX = mouseX - (mouseX - translateX) * actualFactor;
            translateY = mouseY - (mouseY - translateY) * actualFactor;
            scale = clampedScale;

            updateTransform(false);
          }, { passive: false });

          // 7. Button Controls
          const btnIn = controls.querySelector('.zoom-in');
          const btnOut = controls.querySelector('.zoom-out');
          const btnReset = controls.querySelector('.zoom-reset');
          const btnFs = controls.querySelector('.zoom-fullscreen');
          const fsIcon = btnFs.querySelector('.fs-icon');
          const exitFsIcon = btnFs.querySelector('.exit-fs-icon');

          btnIn.addEventListener('click', () => {
            const nextScale = Math.min(scale * 1.3, 10);
            const rect = block.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const factor = nextScale / scale;
            translateX = centerX - (centerX - translateX) * factor;
            translateY = centerY - (centerY - translateY) * factor;
            scale = nextScale;
            updateTransform(true);
          });

          btnOut.addEventListener('click', () => {
            const nextScale = Math.max(scale / 1.3, 0.15);
            const rect = block.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const factor = nextScale / scale;
            translateX = centerX - (centerX - translateX) * factor;
            translateY = centerY - (centerY - translateY) * factor;
            scale = nextScale;
            updateTransform(true);
          });

          btnReset.addEventListener('click', () => {
            scale = 1;
            translateX = 0;
            translateY = 0;
            updateTransform(true);
          });

          btnFs.addEventListener('click', () => {
            if (!document.fullscreenElement) {
              container.requestFullscreen().catch(err => {
                console.error("Error enabling fullscreen", err);
              });
            } else {
              document.exitFullscreen();
            }
          });

          document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement === container) {
              fsIcon.style.display = 'none';
              exitFsIcon.style.display = 'block';
              btnFs.title = '退出全屏';
              scale = 1;
              translateX = 0;
              translateY = 0;
              updateTransform(true);
            } else {
              if (exitFsIcon.style.display === 'block') {
                fsIcon.style.display = 'block';
                exitFsIcon.style.display = 'none';
                btnFs.title = '全屏';
                scale = 1;
                translateX = 0;
                translateY = 0;
                updateTransform(true);
              }
            }
          });
        });
      });
    });
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
