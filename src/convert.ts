import { unified, type Transformer } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { type Root, type Element, type Text, type ElementContent } from "hast";
import { visit } from "unist-util-visit";
import { createHighlighter, type HighlighterGeneric, type BundledLanguage, type BundledTheme } from "shiki";
import { githubMarkdownCss } from "./assets.js";
import { wrapHtml } from "./template.js";

export interface ConvertOptions {
  title?: string;
  theme?: BundledTheme;
}

async function createHighlighterInstance(theme: BundledTheme) {
  return createHighlighter({
    themes: [theme],
    langs: ["javascript", "typescript", "python", "bash", "json", "yaml", "html", "css", "markdown", "mermaid"],
  });
}

function shikiPlugin(highlighter: HighlighterGeneric<BundledLanguage, BundledTheme>, theme: BundledTheme): Transformer<Root, Root> {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, _index, parent) => {
      if (
        node.tagName !== "code" ||
        !parent ||
        parent.type !== "element" ||
        parent.tagName !== "pre"
      ) {
        return;
      }

      const className = node.properties?.className;
      let lang = "text";
      if (Array.isArray(className)) {
        const found = className.find((c) => typeof c === "string" && c.startsWith("language-")) as string | undefined;
        if (found) {
          lang = found.slice("language-".length);
        }
      }

      // Mermaid blocks are handled by mermaidPlugin (browser-side render).
      if (lang === "mermaid") {
        return;
      }

      const codeNode = node.children.find((c) => c.type === "text") as Text | undefined;
      if (!codeNode) {
        return;
      }

      const code = codeNode.value;
      const validLang = highlighter.getLoadedLanguages().includes(lang as BundledLanguage) ? lang : "text";
      const highlighted = highlighter.codeToHtml(code, {
        lang: validLang,
        theme,
      });

      const innerMatch = highlighted.match(/^<pre[^>]*>([\s\S]*)<\/pre>$/);
      const inner = innerMatch ? innerMatch[1] : highlighted;

      const rawNode = {
        type: "raw",
        value: inner,
      } as const;

      const idx = parent.children.indexOf(node);
      if (idx !== -1) {
        parent.children.splice(idx, 1, rawNode as unknown as ElementContent);
      }

      parent.properties = { ...parent.properties, className: ["shiki", "shiki-github"] };
    });
  };
}

// Mermaid: keep the diagram source as-is and tag the <pre> with class="mermaid".
// The inlined mermaid runtime (see template.ts) renders it to SVG in the browser.
function mermaidPlugin(): Transformer<Root, Root> {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, _index, parent) => {
      if (
        node.tagName !== "code" ||
        !parent ||
        parent.type !== "element" ||
        parent.tagName !== "pre"
      ) {
        return;
      }

      const className = node.properties?.className;
      const isMermaid = Array.isArray(className) && className.some((c) => typeof c === "string" && c === "language-mermaid");
      if (!isMermaid) {
        return;
      }

      const codeNode = node.children.find((c) => c.type === "text") as Text | undefined;
      if (!codeNode) {
        return;
      }

      // Turn <pre><code class="language-mermaid">SOURCE</code></pre>
      //  into <pre class="mermaid">SOURCE</pre>
      Object.assign(parent, {
        type: "element",
        tagName: "pre",
        properties: { className: ["mermaid"] },
        children: [{ type: "text", value: codeNode.value }],
      } satisfies Element);
    });
  };
}

export async function markdownToHtml(markdown: string, options: ConvertOptions = {}): Promise<string> {
  const theme = options.theme ?? "github-light";
  const title = options.title ?? "Markdown";

  const highlighter = await createHighlighterInstance(theme);

  try {
    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(mermaidPlugin)
      .use(() => shikiPlugin(highlighter, theme))
      .use(rehypeStringify, { allowDangerousHtml: true });

    const file = await processor.process(markdown);
    const body = String(file);
    return wrapHtml(body, githubMarkdownCss, title);
  } finally {
    highlighter.dispose();
  }
}
