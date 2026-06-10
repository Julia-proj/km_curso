interface SuccessActionCardProps {
  icon: React.ReactNode
  label: string
  description: string
  href: string
  external?: boolean
}

export function SuccessActionCard({ icon, label, description, href, external }: SuccessActionCardProps) {
  const CardContent = (
    <>
      <div style={{ flexShrink: 0, paddingTop: "2px" }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3
          style={{
            fontFamily: "var(--font-hero-face), Manrope, sans-serif",
            fontSize: "1.0625rem",
            fontWeight: 600,
            color: "#1A1A1A",
            marginBottom: "0.5rem",
            lineHeight: 1.3,
          }}
        >
          {label}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body-face), Inter, sans-serif",
            fontSize: "0.875rem",
            color: "#666",
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>
      <div style={{ flexShrink: 0 }}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#A0845C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 18L15 12L9 6" />
        </svg>
      </div>
    </>
  )

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
          background: "#fff",
          border: "1px solid rgba(160, 132, 92, 0.2)",
          padding: "1.5rem",
          textDecoration: "none",
          transition: "border-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(160, 132, 92, 0.4)"
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(160, 132, 92, 0.2)"
        }}
      >
        {CardContent}
      </a>
    )
  }

  return (
    <a
      href={href}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
        background: "#fff",
        border: "1px solid rgba(160, 132, 92, 0.2)",
        padding: "1.5rem",
        textDecoration: "none",
        transition: "border-color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(160, 132, 92, 0.4)"
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(160, 132, 92, 0.2)"
      }}
    >
      {CardContent}
    </a>
  )
}
