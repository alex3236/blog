import type { Element, Root, RootContent, Text } from "hast";
import { codeToHast } from "shiki";

function extractText(node: RootContent): string {
  if (node.type === "text") return (node as Text).value;
  if (node.type === "element" && (node as Element).tagName === "br") return "\n";
  if ("children" in node && Array.isArray(node.children)) {
    return node.children.map(extractText).join("");
  }
  return "";
}

function collectCodeBlocks(
  parent: Root | Element,
  results: Array<{
    parent: Root | Element;
    index: number;
    lang: string;
    text: string;
  }>,
) {
  for (let i = 0; i < parent.children.length; i++) {
    const child = parent.children[i];
    if (child.type !== "element") continue;
    const el = child as Element;
    if (el.tagName === "pre") {
      const codeEl = el.children?.find(
        (c) => c.type === "element" && (c as Element).tagName === "code",
      ) as Element | undefined;
      if (codeEl) {
        const lang = codeEl.properties?.["data-lang"] as string;
        if (lang) {
          const text = codeEl.children?.map(extractText).join("") || "";
          results.push({ parent, index: i, lang, text });
        }
      }
    }
    if (el.children) {
      collectCodeBlocks(el, results);
    }
  }
}

const langAlias: Record<string, string> = {
  shell: "shellscript",
  sh: "shellscript",
  zsh: "shellscript",
  batch: "bat",
  "c++": "cpp",
};

export function rehypeShiki() {
  return async (tree: Root) => {
    const blocks: Array<{
      parent: Root | Element;
      index: number;
      lang: string;
      text: string;
    }> = [];
    collectCodeBlocks(tree, blocks);

    const replacements = new Map<
      Root | Element,
      Array<{ index: number; hast: Root }>
    >();

    for (const { parent, index, lang, text } of blocks) {
      const shikiLang = langAlias[lang] || lang;
      try {
        const hast = await codeToHast(text, {
          lang: shikiLang,
          themes: {
            light: "catppuccin-latte",
            dark: "catppuccin-mocha",
          },
          defaultColor: "light",
        });
        if (!replacements.has(parent)) replacements.set(parent, []);
        replacements.get(parent)!.push({ index, hast });
      } catch (e) {
        console.warn(
          `[rehypeShiki] Failed to highlight code block (lang: ${shikiLang}): ${e}`,
        );
        // Language not supported by Shiki — leave the block as-is
      }
    }

    for (const [parent, items] of replacements) {
      items.sort((a, b) => b.index - a.index);
      for (const { index, hast } of items) {
        parent.children.splice(index, 1, ...hast.children);
      }
    }
  };
}
