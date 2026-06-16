"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { PostPaymentNav } from "@/components/Navigation"
import { useQuizStore } from "@/stores/quiz-store"
import { getDiagnosis, type SavedDiagnosis } from "@/lib/progress"
import { buildCarePlan } from "@/lib/recommendations/pick-products"
import { getProductsByIds, getCategoryLabel } from "@/config/limba-products"
import { ProductCard } from "@/components/scan/ProductCard"
import { CONTACT_INFO } from "@/config/constants"

const FORM_LABEL: Record<string, string> = {
  straight: "прямые",
  wavy: "волнистые",
  curly: "кудрявые",
}
const POROSITY_LABEL: Record<string, string> = {
  low: "низкая пористость",
  medium: "средняя пористость",
  high: "высокая пористость",
}
const DENSITY_LABEL: Record<string, string> = {
  thin: "тонкая структура",
  medium: "средняя плотность",
  thick: "плотная структура",
}

/** Short human list of what the hair lacks. */
function deficitText(d: SavedDiagnosis): string | null {
  if (!d.deficits) return null
  const parts: string[] = []
  if (d.deficits.hydration) parts.push("влаги")
  if (d.deficits.lipids) parts.push("липидов")
  if (d.deficits.protein) parts.push("протеинов")
  return parts.length ? `Не хватает: ${parts.join(", ")}.` : null
}

export default function CarePage() {
  const router = useRouter()
  const answers = useQuizStore((s) => s.answers)
  const isQuizCompleted = useQuizStore((s) => s.isCompleted)

  const [gate, setGate] = useState<"checking" | "ready">("checking")
  const [diagnosis, setDiagnosis] = useState<SavedDiagnosis | null>(null)

  // Funnel gating runs after mount so persisted localStorage is available.
  useEffect(() => {
    if (!isQuizCompleted()) {
      router.replace("/quiz?next=/dashboard/diagnostika")
      return
    }
    const saved = getDiagnosis()
    if (!saved) {
      router.replace("/dashboard/diagnostika")
      return
    }
    setDiagnosis(saved)
    setGate("ready")
  }, [isQuizCompleted, router])

  const plan = useMemo(
    () => (diagnosis ? buildCarePlan(answers, diagnosis) : null),
    [answers, diagnosis]
  )

  const view = useMemo(() => {
    if (!plan) return null
    // Core set: shampoo + conditioner + главная mask + one thermal protection.
    const setProducts = getProductsByIds([plan.shampoo, plan.conditioner, plan.primaryMask, plan.thermalProtection])
    const additionalMaskProducts = plan.additionalMask ? getProductsByIds([plan.additionalMask]) : []
    const peptideProducts = plan.peptideMask ? getProductsByIds([plan.peptideMask]) : []
    const finishProducts = plan.finish ? getProductsByIds([plan.finish]) : []
    const detoxProducts = getProductsByIds(plan.detoxIds)
    const setTotal = setProducts.reduce((a, p) => a + p.price_eur, 0)
    const detoxTotal = detoxProducts.reduce((a, p) => a + p.price_eur, 0)
    return {
      setProducts,
      additionalMaskProducts,
      peptideProducts,
      finishProducts,
      detoxProducts,
      setTotal,
      detoxTotal,
      grandTotal: setTotal + detoxTotal,
    }
  }, [plan])

  if (gate === "checking" || !plan || !diagnosis || !view) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F4]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#D9A19D] border-t-transparent" />
          <p className="font-body text-[#666]">Подбираем уход...</p>
        </div>
      </div>
    )
  }

  // Itemised order for Elena: every recommended product on its own line.
  const fmt = (p: { name: string; price_eur: number }) => `• ${p.name} — ${p.price_eur}€`
  const orderProducts = [...view.setProducts, ...view.detoxProducts]
  const optionalProducts = [
    ...view.additionalMaskProducts,
    ...view.peptideProducts,
    ...view.finishProducts,
  ]
  const waMessage = encodeURIComponent(
    "Здравствуйте! Прошла тест и AI-анализ. Хочу заказать уход Limba:\n" +
      orderProducts.map(fmt).join("\n") +
      `\nИтого набор: ${view.grandTotal}€.` +
      (optionalProducts.length
        ? "\n\nДополнительно по желанию:\n" + optionalProducts.map(fmt).join("\n")
        : "") +
      "\nСамовывоз, студия HAIRLAB Мадрид."
  )
  const waLink = `${CONTACT_INFO.whatsapp.url}?text=${waMessage}`

  // Visual line: "прямые · средняя пористость · тонкая структура"
  const visualBits = [
    plan && diagnosis.hairForm ? FORM_LABEL[diagnosis.hairForm] : null,
    diagnosis.porosity ? POROSITY_LABEL[diagnosis.porosity] : null,
    diagnosis.density ? DENSITY_LABEL[diagnosis.density] : null,
  ].filter(Boolean) as string[]

  return (
    <main className="min-h-screen bg-[#FAF7F4] pb-20">
      <div className="mx-auto w-full max-w-3xl px-4 pt-8 sm:px-6">
        <PostPaymentNav showBack={true} />

        {/* Header */}
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#C4956A]">
          Индивидуальный уход Limba от Елены
        </p>
        <h1 className="mt-3 font-hero-face text-2xl font-semibold leading-tight text-[#1A1A1A] sm:text-3xl">
          Подобран индивидуальный уход Limba {getCategoryLabel(plan.primary)}
        </h1>
        <p className="mt-3 font-body text-base leading-relaxed text-[#666]">
          На основе твоего теста и AI-анализа фото. Предварительный уровень повреждения:{" "}
          <span className="font-semibold text-[#1A1A1A]">{diagnosis.damageLevel}/5</span>.
        </p>

        {/* Block 1 — what the AI saw on the photo */}
        <div className="mt-6 rounded-2xl border border-[#E5DDD5] bg-white p-5 sm:p-6">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#C4956A]">
            Что показал AI-анализ фото
          </p>
          {visualBits.length > 0 && (
            <p className="mb-2 font-body text-sm font-semibold text-[#1A1A1A]">
              {visualBits.join(" · ")}
            </p>
          )}
          {deficitText(diagnosis) && (
            <p className="mb-2 font-body text-sm text-[#444]">{deficitText(diagnosis)}</p>
          )}
          {diagnosis.signs.length > 0 && (
            <ul className="space-y-1.5">
              {diagnosis.signs.slice(0, 5).map((s, i) => (
                <li key={i} className="flex gap-2 font-body text-sm leading-relaxed text-[#444]">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#C4956A]" />
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Reasoning */}
        {plan.reasons.length > 0 && (
          <div className="mt-4 rounded-2xl border border-[#E5DDD5] bg-white p-5 sm:p-6">
            <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#C4956A]">
              Почему именно это
            </p>
            <ul className="space-y-2.5">
              {plan.reasons.map((r, i) => (
                <li key={i} className="flex gap-3 font-body text-sm leading-relaxed text-[#444]">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#C4956A]" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Block 2 — the set */}
        <section className="mt-8">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-hero-face text-xl font-semibold text-[#1A1A1A]">Твой набор</h2>
            <span className="font-body text-sm text-[#666]">{view.setProducts.length} средства</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {view.setProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                description={p.description}
                priceEur={p.price_eur}
                imagePath={p.image}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#1A1A1A] bg-[#1A1A1A] px-5 py-4">
            <span className="font-sans text-sm font-medium text-white/80">Основной набор</span>
            <span className="font-hero-face text-2xl font-semibold text-white">{view.setTotal}€</span>
          </div>
        </section>

        {/* Schedule */}
        {plan.schedule.length > 0 && (
          <section className="mt-8 rounded-2xl border border-[#E5DDD5] bg-white p-5 sm:p-6">
            <h2 className="mb-3 font-hero-face text-lg font-semibold text-[#1A1A1A]">
              Схема ухода по мытьям
            </h2>
            <ol className="space-y-2">
              {plan.schedule.map((s, i) => (
                <li key={i} className="flex gap-3 font-body text-sm leading-relaxed text-[#444]">
                  <span className="font-semibold text-[#C4956A]">{i + 1}.</span>
                  {s}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Optional second mask — alternation upgrade, shown softly */}
        {view.additionalMaskProducts.length > 0 && (
          <section className="mt-8">
            <div className="mb-1 inline-flex rounded-sm bg-[#C4956A]/15 px-3 py-1.5">
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#C4956A]">
                по желанию · чтобы усилить
              </span>
            </div>
            <h2 className="mb-2 mt-3 font-hero-face text-xl font-semibold text-[#1A1A1A]">
              Можно добавить для чередования
            </h2>
            <p className="mb-4 font-body text-sm leading-relaxed text-[#666]">
              Основная маска уже закрывает главный запрос. Если захочешь усилить
              уход, добавь вторую и чередуй её с основной через мытьё, чтобы
              закрыть и другой дефицит.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {view.additionalMaskProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  description={p.description}
                  priceEur={p.price_eur}
                  imagePath={p.image}
                />
              ))}
            </div>
          </section>
        )}

        {/* Peptide mask — separate strength treatment, only on heavier damage */}
        {view.peptideProducts.length > 0 && (
          <section className="mt-8">
            <div className="mb-1 inline-flex rounded-sm bg-[#C4956A]/15 px-3 py-1.5">
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#C4956A]">
                по желанию · при сильном повреждении
              </span>
            </div>
            <h2 className="mb-2 mt-3 font-hero-face text-xl font-semibold text-[#1A1A1A]">
              Пептидная маска для прочности
            </h2>
            <p className="mb-4 font-body text-sm leading-relaxed text-[#666]">
              При сильном повреждении: уплотняет волос и повышает прочность.
              Можно как несмываемый уход на влажные волосы или усилением в маске.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {view.peptideProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  description={p.description}
                  priceEur={p.price_eur}
                  imagePath={p.image}
                />
              ))}
            </div>
          </section>
        )}

        {/* Finish — Golden Hour, only for active heat styling */}
        {view.finishProducts.length > 0 && (
          <section className="mt-8">
            <div className="mb-1 inline-flex rounded-sm bg-[#C4956A]/15 px-3 py-1.5">
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#C4956A]">
                по желанию · финиш
              </span>
            </div>
            <h2 className="mb-2 mt-3 font-hero-face text-xl font-semibold text-[#1A1A1A]">
              Финиш после укладки
            </h2>
            <p className="mb-4 font-body text-sm leading-relaxed text-[#666]">
              Блеск, гладкость и защита длины после укладки. Рекомендуем, потому
              что ты активно пользуешься феном или утюжком.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {view.finishProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  description={p.description}
                  priceEur={p.price_eur}
                  imagePath={p.image}
                />
              ))}
            </div>
          </section>
        )}

        {/* Scalp detox — green shampoo for everyone, peel as an oily-scalp add-on */}
        {view.detoxProducts.length > 0 && (
          <section className="mt-8">
            <div className="mb-1 inline-flex rounded-sm bg-[#8FBF9F]/20 px-3 py-1.5">
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#5A8F6E]">
                для кожи головы
              </span>
            </div>
            <h2 className="mb-2 mt-3 font-hero-face text-xl font-semibold text-[#1A1A1A]">
              Детокс кожи головы
            </h2>
            <p className="mb-4 font-body text-sm leading-relaxed text-[#666]">
              {plan.detoxAdvice}
              {plan.detoxIds.includes("limba-scalp-peel") &&
                " Пилинг-скраб можно добавить при жирной коже головы."}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {view.detoxProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  description={p.description}
                  priceEur={p.price_eur}
                  imagePath={p.image}
                />
              ))}
            </div>
          </section>
        )}

        {/* Block 3 — routine / regimen */}
        {plan.regimen.length > 0 && (
          <section className="mt-8 rounded-2xl border border-[#E5DDD5] bg-white p-5 sm:p-6">
            <h2 className="mb-3 font-hero-face text-lg font-semibold text-[#1A1A1A]">
              Режим ухода
            </h2>
            <ul className="space-y-2.5">
              {plan.regimen.map((r, i) => (
                <li key={i} className="flex gap-3 font-body text-sm leading-relaxed text-[#444]">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#C4956A]" />
                  {r}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Order */}
        <section className="mt-8 rounded-2xl border border-[#E5DDD5] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-sans text-sm font-medium text-[#666]">Всё вместе</span>
            <span className="font-hero-face text-2xl font-semibold text-[#1A1A1A]">{view.grandTotal}€</span>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-sm bg-[#25D366] px-6 py-4 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-white transition-all hover:bg-[#128C7E]"
          >
            Написать в WhatsApp для заказа
          </a>
          <p className="mt-4 font-body text-sm leading-relaxed text-[#666]">
            Самовывоз из студии HAIRLAB Мадрид: <strong>{CONTACT_INFO.salon.address}</strong>.
            Доставка по Испании появится позже.
          </p>
          <p className="mt-3 font-body text-xs leading-relaxed text-[#999]">
            Все рекомендации предварительные и основаны на твоих ответах и AI-анализе фото. Точный подбор: в методичках, видео-уроках или на консультации.
          </p>
        </section>
      </div>
    </main>
  )
}
