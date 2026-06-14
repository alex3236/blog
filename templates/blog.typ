// Blog post template
// Provides main-chinese function for Chinese blog posts

// Override image() for remote URLs — Typst can't load http:// paths
#let image(src, alt: none) = {
  html.img(
    src: str(src),
    ..if alt != none { (alt: alt) } else { (:) },
    class: "h-auto max-h-[1000px] w-auto max-w-72 min-w-0 rounded-lg border-2 border-gray-600 sm:max-w-96 xl:max-w-xl dark:border-gray-300 dark:brightness-[.8]",
  )
}

#let main-chinese(
  title: "Untitled",
  desc: none,
  date: "",
  tags: (),
  category: none,
  draft: false,
  page: false,
  summary: none,
  weather: none,
  bibliography: none,
  body,
) = {
  // Document settings
  set document(author: "Alex3236")
  set heading(offset: 0)

  // Base text
  set text(size: 16pt, lang: "zh", region: "cn")
  
  set raw(theme: none)

  // Images — image() is overridden to output <img> directly for remote URLs
  // Blockquotes
  show quote: it => {
    html.elem("blockquote", attrs: (
      class: "my-4 border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-400",
    ), it.body)
  }

  // Figures — wrap image with <figure> and optional <figcaption>
  show figure: it => {
    if it.caption != none {
      html.elem("figure", attrs: (
        class: "my-6 flex flex-col items-center space-y-2",
      ), {
        it.body
        html.elem("figcaption", attrs: (
          class: "mt-2 text-center text-sm text-gray-600 dark:text-gray-400",
        ), it.caption.body)
      })
    } else {
      html.elem("figure", attrs: (
        class: "my-6 flex flex-col items-center space-y-2",
      ), { it.body })
    }
  }

  // Frontmatter label for astro-typst (must appear first in output)
  [#metadata((
    title: title,
    description: if desc != none { desc },
    date: date,
    tags: tags,
    category: if category != none { category },
    draft: draft,
    page: page,
    summary: if summary != none { summary },
    weather: if weather != none { weather },
    bibliography: if bibliography != none { bibliography },
  )) <frontmatter>]

  // The body content
  body
}
