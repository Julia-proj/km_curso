'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'А почему не спросить ChatGPT?',
    answer:
      'ChatGPT хорошо объясняет теорию: что такое кератин, зачем термозащита, чем кондиционер отличается от маски. Но он не знает, какие у тебя волосы. Не видел, через что они прошли. Не понимает, что тебе нужно делать завтра утром при мытье головы. HAIRLAB — это не общие ответы. Это конкретный маршрут: диагностика, ошибки, протокол, продукты, порядок действий. Собранный мастером с 6-летним опытом и 5000+ клиенток.',
  },
  {
    question: 'Чем это лучше советов из TikTok?',
    answer:
      'В коротких видео бывает много полезного. Но 30-секундный ролик показывает один фрагмент, вырванный из контекста. Он не знает, что у тебя за волосы, какая у них степень повреждения и что стоит в ванной. Ты можешь посмотреть 50 таких роликов и всё равно не понимать, с чего начать. HAIRLAB складывает фрагменты в последовательность. Не один лайфхак, а цепочка шагов, где каждый следующий опирается на предыдущий.',
  },
  {
    question: 'У меня уже есть хороший профессиональный уход. Зачем мне это?',
    answer:
      'Если твои средства дают результат и ты им довольна, скорее всего, ничего менять не нужно. Но если ты тратишь на уход, а волосы всё равно сухие, ломкие или тусклые, возможно, дело в последовательности. Или в том, что средство не попадает в текущую потребность. HAIRLAB помогает разобраться: что из того, что ты уже используешь, работает, а что можно заменить или убрать.',
  },
]

export function OfferFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[var(--color-bg-warm)] transition-colors"
          >
            <span className="text-sm font-medium text-[var(--color-text)] leading-snug">
              {faq.question}
            </span>
            <span className="shrink-0 text-[var(--color-text-muted)] text-xl leading-none">
              {openIndex === i ? '−' : '+'}
            </span>
          </button>
          {openIndex === i && (
            <div className="px-6 pb-5">
              <p className="text-sm text-[var(--color-text-soft)] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
