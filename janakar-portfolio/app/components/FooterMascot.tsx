/**
 * Original minimal dog + bird mascot for the footer (same visual language as
 * benji’s bunny: muted fill, small, ear/wing twitch). Not Peanuts characters.
 */
export default function FooterMascot() {
  return (
    <span className="footer-mascot inline-block align-bottom -mb-1.5" aria-hidden>
      <svg
        width="36"
        height="32"
        viewBox="0 0 44 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {/* Dog — round head, long ear, small body */}
        <g transform="translate(2, 10)">
          <path
            className="footer-ear-left"
            d="M4 8 C2 2 6 -1 9 3 C10 5 9 8 7 9 Z"
            fill="rgba(0, 0, 0, 0.4)"
          />
          <ellipse cx="14" cy="12" rx="8" ry="7.5" fill="rgba(0, 0, 0, 0.4)" />
          <ellipse cx="11.5" cy="11" rx="1.3" ry="1.5" fill="rgba(255, 255, 255, 0.85)" />
          <ellipse cx="20" cy="14" rx="2.2" ry="1.6" fill="rgba(0, 0, 0, 0.4)" />
          <path
            d="M10 19 C10 24 12 28 16 28 C20 28 22 24 22 19"
            fill="rgba(0, 0, 0, 0.4)"
          />
          <path
            d="M8 27 C6 29 5 31 6 32 M24 27 C26 29 27 31 26 32"
            stroke="rgba(0, 0, 0, 0.4)"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Bird — tiny oval body, beak, wing twitch */}
        <g transform="translate(28, 4)">
          <ellipse cx="6" cy="10" rx="5" ry="4.2" fill="rgba(0, 0, 0, 0.4)" />
          <circle cx="9.2" cy="8.5" r="0.7" fill="rgba(255, 255, 255, 0.9)" />
          <path d="M11 10 L14.5 9.2 L11 11.2 Z" fill="rgba(0, 0, 0, 0.4)" />
          <path
            className="footer-ear-right"
            d="M3 9 C0 7 0 11 3 12 Z"
            fill="rgba(0, 0, 0, 0.35)"
          />
          <path
            d="M4 14 L3 17 M7 14.5 L7.5 17.5"
            stroke="rgba(0, 0, 0, 0.4)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </span>
  )
}
