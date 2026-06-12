"use client"

import { useEffect, useState } from "react"

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

interface ResultHeroProps {
  summary: string
  damageLevel: number
  visibleSigns: string[]
  mainIssues: string[]
  selfCarePriorities: string[]
  primaryCategory: string
}

const eyebrowStyle: React.CSSProperties = {
  fontFamily: "var(--font-body-face), Inter, sans-serif",
  fontSize: "0.6875rem",
  fontWeight: 500,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--color-bronze)",
  marginBottom: "1.5rem",
}

export function ResultHero({
  summary,
  damageLevel,
  visibleSigns,
  mainIssues,
  selfCarePriorities,
  primaryCategory,
}: ResultHeroProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const allSigns = [...new Set([...visibleSigns, ...mainIssues])]
  const category = CATEGORY_INFO[primaryCategory] ?? CATEGORY_INFO["Hydration"]
  const priorities = selfCarePriorities.slice(0, 5)

  return (
    <section
      style={{
        background: "var(--color-cream)",
        padding: "3rem 0 0",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <div
        className="km-container"
        style={{ maxWidth: "calc(760px + var(--page-x) * 2)" }}
      >
        {/* ── 1. ШКАЛА ПОВРЕЖДЕНИЯ ── */}
        <div
          style={{
            borderBottom: "1px solid var(--color-line)",
            paddingBottom: "2.75rem",
            marginBottom: "2.75rem",
          }}
        >
          <p style={eyebrowStyle}>Уровень повреждения</p>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "clamp(1.5rem, 5vw, 3.5rem)",
            }}
          >
            <div style={{ flexShrink: 0 }}>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "clamp(5rem, 12vw, 8rem)",
                  fontWeight: 300,
                  lineHeight: 0.88,
                  letterSpacing: "-0.02em",
                  color: "var(--color-ink)",
                }}
              >
                {damageLevel}
              </span>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "0.8125rem",
                  color: "var(--color-bronze)",
                  marginTop: "0.5rem",
                  letterSpacing: "0.02em",
                }}
              >
                /5 · предположительный уровень (на основе анализа фото и ваших ответов)
              </span>
            </div>

            <div style={{ flex: 1, paddingTop: "0.625rem" }}>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  background: "var(--color-line)",
                  marginBottom: "1.25rem",
                }}
              />
              <div style={{ display: "flex", gap: "6px" }}>
                {[1, 2, 3, 4, 5].map((seg) => (
                  <div
                    key={seg}
                    className="damage-segment"
                    style={{
                      "--index": seg,
                      flex: 1,
                      height: "5px",
                      border: "1px solid var(--color-bronze)",
                      backgroundColor:
                        mounted && seg <= damageLevel
                          ? "var(--color-bronze)"
                          : "transparent",
                      borderRadius: "2px",
                      transition: "background-color 0.4s ease",
                    } as React.CSSProperties}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. ПРИЗНАКИ КАК ЧИПЫ ── */}
        <div
          style={{
            borderBottom: "1px solid var(--color-line)",
            paddingBottom: "2.75rem",
            marginBottom: "2.75rem",
          }}
        >
          <p style={eyebrowStyle}>Видимые признаки</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {allSigns.map((sign) => (
              <span
                key={sign}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 14px",
                  border: "1px solid var(--color-bronze)",
                  borderRadius: "2px",
                  fontFamily: "var(--font-body-face), Inter, sans-serif",
                  fontSize: "0.875rem",
                  color: "var(--color-ink)",
                  background: "transparent",
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-bronze)",
                    flexShrink: 0,
                  }}
                />
                {SIGN_LABELS[sign] ?? sign}
              </span>
            ))}
          </div>
        </div>

        {/* ── 3. КАРТОЧКА КАТЕГОРИИ LIMBA ── */}
        <div
          style={{
            borderBottom: "1px solid var(--color-line)",
            paddingBottom: "2.75rem",
            marginBottom: "2.75rem",
          }}
        >
          <div
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              padding: "clamp(1.5rem, 4vw, 2.25rem) clamp(1.5rem, 4vw, 2.5rem)",
            }}
          >
            <p style={eyebrowStyle}>ТВОЁ НАПРАВЛЕНИЕ</p>
            <p
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "clamp(2.25rem, 7vw, 3.75rem)",
                fontWeight: 300,
                lineHeight: 1,
                letterSpacing: "-0.015em",
                color: "var(--color-ink)",
                margin: "0.875rem 0",
              }}
            >
              {category.label}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body-face), Inter, sans-serif",
                fontSize: "0.9375rem",
                color: "var(--color-ink-soft)",
                lineHeight: 1.55,
              }}
            >
              {category.description}
            </p>
          </div>
        </div>

        {/* ── 4. SUMMARY ОТ AI КАК ЦИТАТА ── */}
        <div
          style={{
            borderBottom: "1px solid var(--color-line)",
            paddingBottom: "2.75rem",
            marginBottom: "2.75rem",
          }}
        >
          <div
            style={{
              paddingLeft: "1.375rem",
              borderLeft: "2px solid var(--color-bronze)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(1.125rem, 2.5vw, 1.25rem)",
                lineHeight: 1.7,
                color: "var(--color-ink)",
              }}
            >
              {summary}
            </p>
          </div>
        </div>

        {/* ── 5. SELF_CARE_PRIORITIES КАК НУМЕРОВАННЫЙ СПИСОК ── */}
        {priorities.length > 0 && (
          <div
            style={{
              borderBottom: "1px solid var(--color-line)",
              paddingBottom: "3rem",
              marginBottom: "0",
            }}
          >
            <p style={eyebrowStyle}>Приоритеты ухода</p>
            <ol
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0",
                display: "flex",
                flexDirection: "column",
                gap: "1.75rem",
              }}
            >
              {priorities.map((item, i) => (
                <li
                  key={i}
                  style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "clamp(2rem, 5vw, 3rem)",
                      fontWeight: 300,
                      lineHeight: 1,
                      color: "var(--color-bronze)",
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
                      color: "var(--color-ink)",
                      paddingTop: "0.3rem",
                    }}
                  >
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <style>{`
        .damage-segment {
          animation: fillSegment 0.4s ease forwards;
          animation-delay: calc((var(--index) - 1) * 80ms);
          opacity: 0;
        }

        @keyframes fillSegment {
          from {
            opacity: 0;
            transform: scaleX(0.8);
          }
          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }
      `}</style>
    </section>
  )
}
