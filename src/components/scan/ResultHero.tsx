"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const SIGN_LABELS: Record<string, string> = {
  dryness: "сухость",
  breakage: "ломкость",
  split_ends: "секущиеся кончики",
  dullness: "тусклость",
  color_fade: "потеря цвета",
  frizz: "пушистость",
  oily_scalp: "жирность корней",
  volume_loss: "потеря объёма",
  thinning: "истончение",
}

const CATEGORY_INFO: Record<string, { label: string; description: string }> = {
  Hydration: {
    label: "Hydration",
    description: "Увлажнение и восстановление — для сухих, пористых и ломких волос",
  },
  Color: {
    label: "Color",
    description: "Защита цвета и яркость — для окрашенных и осветлённых волос",
  },
  Volume: {
    label: "Volume",
    description: "Объём и плотность — для тонких и ослабленных волос",
  },
  Detox: {
    label: "Detox",
    description: "Детокс кожи головы — глубокое очищение и баланс",
  },
}

const FR = "var(--font-fraunces, 'Georgia', serif)"
const BRONZE = "#A0845C"
const HAIRLINE = "1px solid rgba(160, 132, 92, 0.22)"

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: "easeOut" as const },
})

interface ResultHeroProps {
  summary: string
  damageLevel: number
  visibleSigns: string[]
  mainIssues: string[]
  selfCarePriorities: string[]
  primaryCategory: string
}

export function ResultHero({
  summary,
  damageLevel,
  visibleSigns,
  mainIssues,
  selfCarePriorities,
  primaryCategory,
}: ResultHeroProps) {
  const [scaleActive, setScaleActive] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setScaleActive(true), 180)
    return () => clearTimeout(id)
  }, [])

  const allSigns = [...new Set([...visibleSigns, ...mainIssues])]
  const category = CATEGORY_INFO[primaryCategory] ?? CATEGORY_INFO["Hydration"]
  const priorities = selfCarePriorities.slice(0, 5)

  return (
    <section style={{ background: "#FAF7F4", padding: "3rem 0 0" }}>
      <div
        className="km-container"
        style={{ maxWidth: "calc(760px + var(--page-x) * 2)" }}
      >
        {/* ── 1. Шкала повреждения ── */}
        <motion.div
          {...fade(0)}
          style={{ borderBottom: HAIRLINE, paddingBottom: "2.75rem", marginBottom: "2.75rem" }}
        >
          <p style={eyebrow}>Уровень повреждения</p>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "clamp(1.5rem, 5vw, 3.5rem)" }}>
            <div style={{ flexShrink: 0 }}>
              <span
                style={{
                  display: "block",
                  fontFamily: FR,
                  fontSize: "clamp(5rem, 12vw, 8rem)",
                  fontWeight: 300,
                  lineHeight: 0.88,
                  letterSpacing: "-0.02em",
                  color: "#1A1A1A",
                }}
              >
                {damageLevel}
              </span>
              <span
                style={{
                  display: "block",
                  fontFamily: FR,
                  fontStyle: "italic",
                  fontSize: "0.8125rem",
                  color: BRONZE,
                  marginTop: "0.5rem",
                  letterSpacing: "0.02em",
                }}
              >
                /5 · уровень повреждения
              </span>
            </div>

            <div style={{ flex: 1, paddingTop: "0.625rem" }}>
              <div style={{ width: "100%", height: "1px", background: "rgba(160,132,92,0.18)", marginBottom: "1.25rem" }} />
              <div style={{ display: "flex", gap: "6px" }}>
                {[1, 2, 3, 4, 5].map((seg) => (
                  <div
                    key={seg}
                    style={{
                      flex: 1,
                      height: "5px",
                      border: `1px solid ${BRONZE}`,
                      backgroundColor: scaleActive && seg <= damageLevel ? BRONZE : "transparent",
                      transition: `background-color 0.3s ease ${(seg - 1) * 80}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 2. Признаки как чипы ── */}
        <motion.div
          {...fade(0.15)}
          style={{ borderBottom: HAIRLINE, paddingBottom: "2.75rem", marginBottom: "2.75rem" }}
        >
          <p style={eyebrow}>Видимые признаки</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {allSigns.map((sign) => (
              <span
                key={sign}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 14px",
                  border: "1px solid rgba(160,132,92,0.38)",
                  borderRadius: "2px",
                  fontFamily: "var(--font-body-face), Inter, sans-serif",
                  fontSize: "0.875rem",
                  color: "#1A1A1A",
                  background: "transparent",
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    backgroundColor: BRONZE,
                    flexShrink: 0,
                  }}
                />
                {SIGN_LABELS[sign] ?? sign}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── 3. Карточка категории Limba ── */}
        <motion.div
          {...fade(0.25)}
          style={{ borderBottom: HAIRLINE, paddingBottom: "2.75rem", marginBottom: "2.75rem" }}
        >
          <div
            style={{
              background: "#F2EDE6",
              border: "1px solid rgba(160,132,92,0.28)",
              padding: "clamp(1.5rem, 4vw, 2.25rem) clamp(1.5rem, 4vw, 2.5rem)",
            }}
          >
            <p style={eyebrow}>Твоё направление</p>
            <p
              style={{
                fontFamily: FR,
                fontSize: "clamp(2.25rem, 7vw, 3.75rem)",
                fontWeight: 300,
                lineHeight: 1,
                letterSpacing: "-0.015em",
                color: "#1A1A1A",
                margin: "0.875rem 0",
              }}
            >
              {category.label}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body-face), Inter, sans-serif",
                fontSize: "0.9375rem",
                color: "#666",
                lineHeight: 1.55,
              }}
            >
              {category.description}
            </p>
          </div>
        </motion.div>

        {/* ── 4. Summary-цитата ── */}
        <motion.div
          {...fade(0.35)}
          style={{ borderBottom: HAIRLINE, paddingBottom: "2.75rem", marginBottom: "2.75rem" }}
        >
          <div style={{ paddingLeft: "1.375rem", borderLeft: `2px solid ${BRONZE}` }}>
            <p
              style={{
                fontFamily: FR,
                fontStyle: "italic",
                fontSize: "clamp(1.0625rem, 2.5vw, 1.1875rem)",
                lineHeight: 1.7,
                color: "#1A1A1A",
              }}
            >
              {summary}
            </p>
          </div>
        </motion.div>

        {/* ── 5. Self-care priorities ── */}
        {priorities.length > 0 && (
          <motion.div
            {...fade(0.45)}
            style={{ borderBottom: HAIRLINE, paddingBottom: "3rem", marginBottom: "0" }}
          >
            <p style={eyebrow}>Приоритеты ухода</p>
            <ol style={{ listStyle: "none", padding: 0, margin: "0", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              {priorities.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                  <span
                    style={{
                      fontFamily: FR,
                      fontSize: "clamp(2rem, 5vw, 3rem)",
                      fontWeight: 300,
                      lineHeight: 1,
                      color: BRONZE,
                      minWidth: "3.5rem",
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p
                    style={{
                      fontFamily: "var(--font-body-face), Inter, sans-serif",
                      fontSize: "0.9375rem",
                      lineHeight: 1.65,
                      color: "#1A1A1A",
                      paddingTop: "0.3rem",
                    }}
                  >
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </div>
    </section>
  )
}

const eyebrow: React.CSSProperties = {
  fontFamily: "var(--font-body-face), Inter, sans-serif",
  fontSize: "0.6875rem",
  fontWeight: 500,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: BRONZE,
  marginBottom: "1.5rem",
}
