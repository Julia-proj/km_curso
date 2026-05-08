import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { OfferFAQ } from '@/components/offer/OfferFAQ'
import { BackButton } from '@/components/BackButton'
import { isCourseActive } from '@/config/feature-flags'

export const metadata: Metadata = {
  title: 'Выбери формат - HAIRLAB',
  description: 'Два формата восстановления волос: Full Course (39€) и HAIRLAB Guide (13€).',
}

const comparisonFeatures = [
  { name: 'PDF-карта ухода (32 стр.)', guide: true, course: true },
  { name: 'Протоколы и чеклисты', guide: true, course: true },
  { name: 'Карточки проверенных средств', guide: true, course: true },
  { name: '5 видеоуроков от Елены', guide: false, course: true },
  { name: 'AI-диагностика по фото', guide: false, course: true },
  { name: 'Личный кабинет с прогрессом', guide: false, course: true },
  { name: 'Персональный протокол', guide: false, course: true },
]

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 4.5L6.75 12.75L3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 9H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function OfferPage() {
  const courseActive = isCourseActive()

  return (
    <>
      <Header />
      <main className="bg-[var(--color-bg)] pt-20 md:pt-24 pb-24 px-5">
        <div className="max-w-5xl mx-auto">

          <BackButton />

          {/* Page header */}
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold tracking-[3px] uppercase text-[var(--color-text-muted)] mb-4">
              HAIRLAB
            </p>
            <h1 className="text-2xl md:text-4xl font-semibold text-[var(--color-text)] mb-4 text-balance tracking-tight">
              Два формата. Одна система.
            </h1>
            <p className="text-[var(--color-text-soft)] text-sm md:text-base max-w-xl mx-auto">
              Ты уже прошла диагностику и посмотрела урок. Теперь выбери, как хочешь двигаться дальше.
            </p>
          </div>

          {/* Product cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 items-start">

            {/* Full Course - visually larger */}
            <div className="relative bg-[var(--color-surface)] border-2 border-[var(--color-accent)] rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow-lg)]">
              <span className="absolute -top-3 left-6 bg-[var(--color-accent)] text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                Полный формат
              </span>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mt-2 mb-1 tracking-tight">
                Система восстановления с Еленой
              </h3>
              <p className="text-3xl font-semibold text-[var(--color-accent)] mb-4 tracking-tight">39€</p>
              <p className="text-sm text-[var(--color-text-soft)] mb-6 leading-relaxed">
                Для тех, кому нужен не просто гайд, а пошаговый маршрут. С видео, AI-анализом и персональным протоколом.
              </p>
              <div className="mb-8 space-y-5">
                {/* Video lessons */}
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)] mb-2">Видео-уроки:</p>
                  <ul className="space-y-1.5 mb-2">
                    {[
                      'как правильно диагностировать состояние волос',
                      'какие типы повреждений бывают',
                      'какие составы действительно работают',
                      'как подобрать правильный домашний уход',
                      'какие ошибки нельзя допускать',
                      'как восстановить даже сильно повреждённый блонд',
                    ].map((point) => (
                      <li key={point} className="flex gap-2 text-sm text-[var(--color-text-soft)]">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                    Отдельный урок: разбор восстановления натуральных волос, составы и этапы. Пошагово на себе и моделях: пилинг, мытьё, кондиционер, маски, несмываемые, сушка феном.
                  </p>
                </div>
                {/* Feature items */}
                <ul className="space-y-3">
                  {[
                    { title: 'AI-диагностика по фото', desc: 'Загрузи фото - система покажет степень повреждения.', soon: true },
                    { title: 'Личный кабинет', desc: 'Видишь, где остановилась. Возвращаешься в любой момент.', soon: false },
                    { title: 'Персональный протокол', desc: 'На основе твоих ответов и AI-анализа.', soon: false },
                    { title: 'Hairlab Guide включён', desc: 'PDF-карта ухода (32 стр.) уже входит в курс.', soon: false },
                    { title: 'Чек-листы и дополнительные материалы', desc: '', soon: false },
                  ].map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <span className="text-[var(--color-accent)] mt-0.5 shrink-0">
                        <CheckIcon />
                      </span>
                      <div>
                        <span className="text-sm font-semibold text-[var(--color-text)]">
                          {item.title}
                          {item.soon && (
                            <span className="ml-2 inline-block rounded-full bg-[var(--color-accent)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                              SOON
                            </span>
                          )}
                        </span>
                        {item.desc && (
                          <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">{item.desc}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">
                Одна покупка - полный доступ. Без подписок, без доплат.
              </p>
              <Link
                href="/checkout?product=course"
                className="block text-center bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold px-6 py-4 rounded-[var(--radius-full)] transition-colors text-sm"
              >
                {courseActive ? 'Получить полный доступ - 39€' : 'Оформить предзаказ - 39€'}
              </Link>
            </div>

            {/* HAIRLAB Guide - compact */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-7">
              <span className="inline-block bg-[var(--color-bg-warm)] text-[var(--color-text-soft)] text-[11px] font-semibold px-3 py-1 rounded-full mb-4">
                Лёгкий старт
              </span>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1 tracking-tight">
                только методичка HAIRLAB: Карта восстановления
              </h3>
              <p className="text-2xl font-semibold text-[var(--color-accent)] mb-5 tracking-tight">13€</p>
              <div className="space-y-5 mb-7">
                {/* Block 1 */}
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)] mb-2">Готовые рабочие средства</p>
                  <ul className="space-y-1.5 mb-2">
                    {['шампуни', 'маски', 'кондиционеры', 'термозащита'].map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-[var(--color-text-soft)]">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                    Под каждый тип кожи и волос, без привязки к бренду. По таблице ты выбираешь то, что подходит именно тебе.
                  </p>
                </div>
                {/* Block 2 */}
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)] mb-2">Гайд по аксессуарам</p>
                  <ul className="space-y-1.5 mb-2">
                    {['Что не повреждает волосы', 'какое полотенце выбрать', 'материал для сна', 'расчёски, резинки, зажимы'].map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-[var(--color-text-soft)]">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                    Маленькие детали, которые годами незаметно ломают волосы.
                  </p>
                </div>
                {/* Block 3 */}
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)] mb-2">Протоколы восстановления</p>
                  <ul className="space-y-1.5 mb-2">
                    {['Чёткие схемы', 'под разные типы волос', 'под разную степень повреждения', 'пошаговые сценарии'].map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-[var(--color-text-soft)]">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                    Берёшь свой протокол и просто следуешь шагам.
                  </p>
                </div>
              </div>
              <Link
                href="/checkout?product=guide"
                className="block text-center border border-border text-foreground hover:bg-sand/60 font-semibold px-6 py-4 rounded-[var(--radius-full)] transition-colors text-sm"
              >
                Начать с HAIRLAB Guide - 13€
              </Link>
            </div>
          </div>

          {/* Comparison table */}
          <div className="mb-20">
            <p className="text-[11px] font-semibold tracking-[3px] uppercase text-[var(--color-text-muted)] text-center mb-3">
              с р а в н е н и е
            </p>
            <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-text)] text-center mb-8 tracking-tight">
              Что входит в каждый формат
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-soft)] w-1/2"></th>
                    <th className="text-center py-3 px-4 font-semibold text-[var(--color-text)] whitespace-nowrap">
                      HAIRLAB Guide <span className="font-normal text-[var(--color-text-soft)]">13€</span>
                    </th>
                    <th className="text-center py-3 pl-4 font-semibold text-[var(--color-accent)] whitespace-nowrap">
                      Full Course <span className="font-normal">39€</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature) => (
                    <tr key={feature.name} className="border-b border-[var(--color-border)] last:border-0">
                      <td className="py-3 pr-4 text-[var(--color-text-soft)]">{feature.name}</td>
                      <td className="text-center py-3 px-4">
                        {feature.guide ? (
                          <span className="text-[var(--color-success)]"><CheckIcon /></span>
                        ) : (
                          <span className="text-[var(--color-text-muted)]"><DashIcon /></span>
                        )}
                      </td>
                      <td className="text-center py-3 pl-4">
                        {feature.course ? (
                          <span className="text-[var(--color-accent)]"><CheckIcon /></span>
                        ) : (
                          <span className="text-[var(--color-text-muted)]"><DashIcon /></span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Результат */}
          <div className="bg-[var(--color-bg-warm)] border border-[var(--color-border)] rounded-[var(--radius-xl)] px-6 md:px-12 py-10 mb-16">
            <p className="text-[11px] font-semibold tracking-[3px] uppercase text-[var(--color-text-muted)] mb-3">
              р е з у л ь т а т
            </p>
            <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-text)] mb-4 text-balance leading-snug tracking-tight">
              Гладкие, плотные волосы - это не генетика, а система.
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-[var(--color-text-soft)] max-w-xl">
              Они всегда выглядят дорого. Без сложной укладки, без идеального цвета, даже в обычном хвосте.
              Плотность, блеск и гладкость создают тот самый ухоженный вид, который не получается собрать
              из случайных масок и советов из интернета. Но такой результат начинается не с дорогого средства.
              Он начинается с понимания: что нужно, в каком порядке и почему.
            </p>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <p className="text-[11px] font-semibold tracking-[3px] uppercase text-[var(--color-text-muted)] text-center mb-3">
              в о п р о с ы
            </p>
            <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-text)] text-center mb-8 tracking-tight">
              Частые вопросы
            </h2>
            <OfferFAQ />
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
