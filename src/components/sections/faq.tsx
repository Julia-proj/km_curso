"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"

const faqs = [
  {
    question: "А почему не спросить ChatGPT?",
    answer:
      "ChatGPT хорошо объясняет теорию: что такое кератин, зачем термозащита, чем кондиционер отличается от маски. Но он не знает, какие у тебя волосы. Не видел, через что они прошли. Не понимает, что тебе нужно делать завтра утром при мытье головы. HAIRLAB - это не общие ответы. Это конкретный маршрут: диагностика, ошибки, протокол, продукты, порядок действий. Собранный мастером с 6-летним опытом и 5000+ клиенток.",
  },
  {
    question: "Чем это лучше советов из TikTok?",
    answer:
      "В коротких видео бывает много полезного. Но 30-секундный ролик показывает один фрагмент, вырванный из контекста. Он не знает, что у тебя за волосы, какая у них степень повреждения и что стоит в ванной. Ты можешь посмотреть 50 таких роликов и всё равно не понимать, с чего начать. HAIRLAB складывает фрагменты в последовательность. Не один лайфхак, а цепочка шагов, где каждый следующий опирается на предыдущий.",
  },
  {
    question: "У меня уже есть хороший профессиональный уход. Зачем мне это?",
    answer:
      "Если твои средства дают результат и ты им довольна, скорее всего, ничего менять не нужно. Но если ты тратишь на уход, а волосы всё равно сухие, ломкие или тусклые, возможно, дело в последовательности. Или в том, что средство не попадает в текущую потребность. HAIRLAB помогает разобраться: что из того, что ты уже используешь, работает, а что можно заменить или убрать.",
  },
]

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="border-b border-border last:border-b-0"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 md:py-6 text-left group"
      >
        <span className="text-text text-base md:text-lg font-medium pr-4 group-hover:text-accent transition-colors">
          {question}
        </span>
        <span className="text-text-muted flex-shrink-0">
          {isOpen ? <MinusIcon /> : <PlusIcon />}
        </span>
      </button>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <p className="text-text-soft text-sm md:text-base leading-relaxed pb-5 md:pb-6">
            {answer}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-16 md:py-24 px-5">
      <div className="max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-text-muted text-[11px] font-medium tracking-[3px] uppercase text-center mb-4"
        >
          в о п р о с ы
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-2xl md:text-4xl font-medium text-text text-center mb-10 md:mb-12"
        >
          Частые вопросы
        </motion.h2>

        <div className="bg-surface rounded-xl border border-border px-6 md:px-8">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
