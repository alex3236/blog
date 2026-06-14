# AGENTS.md

## Commands

```bash
npm run dev      # Astro dev server, HMR for .typ files
npm run build    # Static build to dist/
npm run preview  # Preview production build
npm run lint     # ESLint fix
npm run format   # Prettier write
```

## Architecture

- **Framework**: Astro 5.18, static output
- **Content**: Typst `.typ` files in `posts/`, compiled by `astro-typst` integration
- **Styling**: Tailwind CSS v3 via `@astrojs/tailwind`, dark mode via `.dark` class
- **Interactivity**: React islands for stateful components (ThemeSwitch, SearchBar), plain Astro `<script>` for non-React client code (CodeHighlight, ImagePreview)

### Content pipeline

Posts are `.typ` files at `posts/` (with `posts/page/` for standalone pages, `posts/draft/` for drafts). They use:

```typst
#import "/templates/blog.typ": *
#show: main-chinese.with(title: "...", date: "...", tags: ("..."), ...)
```

Frontmatter is extracted via the `<frontmatter>` label in the template (line 77). The glob loader in `src/content.config.ts` finds all `.typ` files recursively. Blog pages import posts via `import.meta.glob('/posts/**/*.typ')` for rendering; content collections (`getCollection('posts')`) provide metadata-only access for listings.

### React components must use `client:load`

In `.astro` files, any `<ReactComponent />` needs `client:load` — without it, the component renders server-side only (no state, no effects, no event handlers). Example:

```astro
<ThemeSwitch client:load />
```

Plain Astro `<script>` components (like `CodeHighlight.astro`, `ImagePreview.astro`) don't need `client:load` — they inject a `<script>` tag into the page.

### NavSection is shared

`src/components/NavSection.astro` is used by both `pages/index.astro` and `pages/page/[page].astro`. Don't duplicate its markup.

## Typst gotchas

- **`image()` is overridden** in `templates/blog.typ:6` to output `<img>` tags directly — Typst can't load remote `http://` URLs.
- **Show rules use `it.body` not `it`** to avoid double-rendering (e.g. `show quote: it => html.elem("blockquote", ..., it.body)`).
- **Math is unsupported** in Typst HTML export. Equations will be silently ignored; don't try to add show rules for them.
- **`/*` in text starts a block comment** — path-like strings like `lib/*` must be wrapped in backticks ` `` `.
- **Single-element tuples** in Typst frontmatter (e.g. `tags: ("数码")`) become strings, not arrays. The content schema handles this with `z.union([z.array(...), z.string()])`.

## Post metadata

| Field                       | `page: true` | `draft: true` |
| --------------------------- | ------------ | ------------- |
| Appears in blog list        | No           | No            |
| Has own URL at `/blog/slug` | Yes          | No            |
| Shows seal at bottom        | Yes          | N/A           |
| Shows "草稿" badge          | No           | Yes           |

## Title tag logic

`BaseLayout.astro` appends `| 星星碎片收容所` to `<title>` **unless** the page title already contains the site name. This avoids double suffixes on the homepage.

## Commit style

Use conventional commits: `feat:`, `fix:`, `style:`, `docs:`.
