import { TELEGRAM_PRIVATE_INVITE } from "@/lib/constants"
import { dashboardContent } from "@/lib/content/dashboard"

interface TelegramAccessCardProps {
  hasCourse: boolean
}

export function TelegramAccessCard({ hasCourse }: TelegramAccessCardProps) {
  if (!hasCourse) return null

  const { title, text, cta, note } = dashboardContent.telegram

  return (
    <div
      style={{
        background: "#F5F0EB",
        border: "1px solid rgba(160, 132, 92, 0.28)",
        padding: "clamp(1.5rem, 4vw, 2rem)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
        {/* Inline SVG — paper plane, 1.5px stroke */}
        <div style={{ flexShrink: 0, paddingTop: "2px" }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#A0845C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-body-face), Inter, sans-serif",
              fontSize: "0.6875rem",
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#A0845C",
              marginBottom: "0.5rem",
            }}
          >
            Только для курса
          </p>

          <h3
            style={{
              fontFamily: "var(--font-hero-face), Manrope, sans-serif",
              fontSize: "1.0625rem",
              fontWeight: 600,
              color: "#1A1A1A",
              marginBottom: "0.625rem",
              lineHeight: 1.3,
            }}
          >
            {title}
          </h3>

          <p
            style={{
              fontFamily: "var(--font-body-face), Inter, sans-serif",
              fontSize: "0.9375rem",
              color: "#666",
              lineHeight: 1.6,
              marginBottom: "1.25rem",
            }}
          >
            {text}
          </p>

          <a
            href={TELEGRAM_PRIVATE_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.625rem 1.375rem",
              background: "#1A1A1A",
              color: "#FAF7F4",
              fontFamily: "var(--font-body-face), Inter, sans-serif",
              fontSize: "0.8125rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "2px",
              transition: "background 0.18s ease",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.background = "#333"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.background = "#1A1A1A"
            }}
          >
            {cta}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>

          <p
            style={{
              fontFamily: "var(--font-body-face), Inter, sans-serif",
              fontSize: "0.75rem",
              color: "#999",
              marginTop: "0.875rem",
              lineHeight: 1.5,
            }}
          >
            {note}
          </p>
        </div>
      </div>
    </div>
  )
}
