"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { PostPaymentNav } from "@/components/Navigation"
import { useQuizStore } from "@/stores/quiz-store"
import { getDiagnosis, type SavedDiagnosis } from "@/lib/progress"
import {
  inferCategory,
  resolveMaskId,
  needsHeatProtection,
  needsScalpDetox,
} from "@/lib/recommendations/pick-products"
import { getProductsByIds, getCategoryLabel, CATEGORY_INFO } from "@/config/limba-products"
import { ProductCard } from "@/components/scan/ProductCard"
import { CONTACT_INFO } from "@/config/constants"

export default function CarePage() {
  const router = useRouter()
  const answers = useQuizStore((s) => s.answers)
  const isQuizCompleted = useQuizStore((s) => s.isCompleted)

  const [gate, setGate] = useState<"checking" | "ready">("checking")
  const [diagnosis, setDiagnosis] = useState<SavedDiagnosis | null>(null)

  // Funnel gating runs after mount so persisted localStorage is available.
  useEffect(() => {
    if (!isQuizCompleted()) {
      router.replace("/quiz")
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

  const plan = useMemo(() => {
    if (!diagnosis) return null

    const { primary, secondary } = inferCategory(answers)
    const heat = needsHeatProtection(answers, diagnosis.damageLevel)
    const scalpDetox = needsScalpDetox(answers, diagnosis.signs)

    const coreIds = [
      `limba-${primary}-shampoo`,
      `limba-${primary}-conditioner`,
      resolveMaskId(primary, answers),
    ]
    const setIds = heat ? [...coreIds, "limba-heat-protection"] : coreIds
    const addonIds = scalpDetox ? ["limba-detox-shampoo", "limba-scalp-peel"] : []

    const setProducts = getProductsByIds(setIds)
    const addonProducts = getProductsByIds(addonIds)

    const setTotal = setProducts.reduce((acc, p) => acc + p.price_eur, 0)
    const addonTotal = addonProducts.reduce((acc, p) => acc + p.price_eur, 0)

    const reasons: string[] = [
      `Основное направление — линия Limba ${getCategoryLabel(primary)}: ${CATEGORY_INFO[primary].why}.`,
    ]
    if (secondary) {
      reasons.push(`Дополнительно по длине подойдёт уход линии ${getCategoryLabel(secondary)}.`)
    }
    if (heat) {
      reasons.push(
        "Ты пользуешься феном, утюжком или стайлером — добавили термозащиту. Это обязательный шаг перед любой горячей укладкой."
      )
    }
    if (scalpDetox) {
      reasons.push(
        "Ты моешь голову часто — кожа головы склонна к жирности. Добавили зелёный детокс-шампунь (чередуй с основным) и пилинг раз в неделю. Можно начать с чего-то одного."
      )
    }

    return {
      primary,
      heat,
      scalpDetox,
      setProducts,
      addonProducts,
      setTotal,
      addonTotal,
      grandTotal: setTotal + addonTotal,
      reasons,
    }
  }, [answers, diagnosis])

  if (gate === "checking" || !plan || !diagnosis) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F4]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#D9A19D] border-t-transparent" />
          <p className="font-body text-[#666]">Подбираем уход...</p>
        </div>
      </div>
    )
  }

  const waMessage = encodeURIComponent(
    `Здравствуйте! Прошла тест и AI-анализ. Хочу набор Limba ${getCategoryLabel(plan.primary)}` +
      (plan.scalpDetox ? " + детокс для кожи головы" : "") +
      `. Итого ${plan.grandTotal}€. Заберу в студии Мадрид.`
  )
  const waLink = `${CONTACT_INFO.whatsapp.url}?text=${waMessage}`

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

        {/* Reasoning */}
        <div className="mt-6 rounded-2xl border border-[#E5DDD5] bg-white p-5 sm:p-6">
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

        {/* Core set */}
        <section className="mt-8">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-hero-face text-xl font-semibold text-[#1A1A1A]">Твой набор</h2>
            <span className="font-body text-sm text-[#666]">{plan.setProducts.length} средства</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {plan.setProducts.map((p) => (
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
            <span className="font-sans text-sm font-medium text-white/80">Полный набор</span>
            <span className="font-hero-face text-2xl font-semibold text-white">{plan.setTotal}€</span>
          </div>
        </section>

        {/* Optional scalp add-ons */}
        {plan.addonProducts.length > 0 && (
          <section className="mt-8">
            <div className="mb-1 inline-flex rounded-sm bg-[#8FBF9F]/20 px-3 py-1.5">
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#5A8F6E]">
                по желанию · для кожи головы
              </span>
            </div>
            <h2 className="mb-2 mt-3 font-hero-face text-xl font-semibold text-[#1A1A1A]">
              Дополнительно при жирной коже головы
            </h2>
            <p className="mb-4 font-body text-sm leading-relaxed text-[#666]">
              Можно взять весь набор сразу или начать с чего-то одного — например, с пилинга.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {plan.addonProducts.map((p) => (
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

            <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#E5DDD5] bg-white px-5 py-4">
              <span className="font-sans text-sm font-medium text-[#666]">
                Набор + уход за кожей головы
              </span>
              <span className="font-hero-face text-2xl font-semibold text-[#1A1A1A]">
                {plan.grandTotal}€
              </span>
            </div>
          </section>
        )}

        {/* Order */}
        <section className="mt-8 rounded-2xl border border-[#E5DDD5] bg-white p-6">
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
            Все рекомендации предварительные и основаны на твоих ответах и AI-анализе фото. Точный подбор — в методичках, видео-уроках или на консультации.
          </p>
        </section>
      </div>
    </main>
  )
}
