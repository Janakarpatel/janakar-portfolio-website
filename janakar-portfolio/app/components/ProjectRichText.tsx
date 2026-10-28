import Link from 'next/link'

/**
 * Plain text with:
 * - `[label](url)` → basic-link
 * - `^[1]` → footnote superscript (benji-style small element)
 */
export default function ProjectRichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\^\[\d+\])/g)

  return (
    <>
      {parts.map((part, i) => {
        const fn = /^\^\[(\d+)\]$/.exec(part)
        if (fn) {
          return (
            <sup key={i}>
              <a
                href={`#fn-${fn[1]}`}
                id={`fnref-${fn[1]}`}
                className="basic-link footnote-ref"
                aria-describedby={`fn-${fn[1]}`}
              >
                {fn[1]}
              </a>
            </sup>
          )
        }

        const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
        if (!m) return <span key={i}>{part}</span>
        const [, label, href] = m
        const external = /^https?:\/\//.test(href)
        if (external) {
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="basic-link"
            >
              {label}
            </a>
          )
        }
        return (
          <Link key={i} href={href} className="basic-link">
            {label}
          </Link>
        )
      })}
    </>
  )
}
