/** Benji.org / github-light-default token colors. */
const C = {
  text: '#1f2328',
  string: '#0a3069',
  keyword: '#cf222e',
  property: '#0550ae',
  punct: '#1f2328',
} as const

type Tok = { text: string; color: string }

function highlightJson(code: string): Tok[] {
  const out: Tok[] = []
  const re = /("(?:\\.|[^"\\])*")|([{}[\]:,])|(\s+)|([^\s"{}[\]:,]+)/g
  let m: RegExpExecArray | null
  let expectKey = true
  while ((m = re.exec(code))) {
    const [, str, punct, space, other] = m
    if (space) {
      out.push({ text: space, color: C.text })
      continue
    }
    if (punct) {
      out.push({ text: punct, color: C.punct })
      if (punct === '{' || punct === '[') expectKey = true
      else if (punct === ':' ) expectKey = false
      else if (punct === ',' || punct === '}' || punct === ']') expectKey = true
      continue
    }
    if (str) {
      out.push({ text: str, color: expectKey ? C.property : C.string })
      continue
    }
    if (other) out.push({ text: other, color: C.text })
  }
  return out
}

function highlightBash(code: string): Tok[] {
  const out: Tok[] = []
  for (const line of code.split(/(?<=\n)/)) {
    if (line.startsWith('#')) {
      out.push({ text: line, color: '#6e7781' })
      continue
    }
    const re = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\s+)|(\S+)/g
    let m: RegExpExecArray | null
    let first = true
    while ((m = re.exec(line))) {
      const [, str, space, word] = m
      if (space) {
        out.push({ text: space, color: C.text })
        continue
      }
      if (str) {
        out.push({ text: str, color: C.string })
        first = false
        continue
      }
      if (word) {
        out.push({ text: word, color: first ? C.keyword : C.string })
        first = false
      }
    }
  }
  return out
}

function tokensFor(code: string, language?: string): Tok[] {
  if (language === 'json') return highlightJson(code)
  if (language === 'bash' || language === 'shell') return highlightBash(code)
  return [{ text: code, color: C.text }]
}

/** Colored pre/code — github-light palette, no highlighter dep. */
export default function CodeBlock({
  code,
  language,
  caption,
}: {
  code: string
  language?: string
  caption?: string
}) {
  const tokens = tokensFor(code, language)
  return (
    <figure className="project-code">
      <pre data-language={language} data-theme="github-light-default">
        <code data-language={language}>
          {tokens.map((t, i) => (
            <span key={i} style={{ color: t.color }}>
              {t.text}
            </span>
          ))}
        </code>
      </pre>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}
