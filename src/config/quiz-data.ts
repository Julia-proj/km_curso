import type { QuizQuestion } from '@/types/quiz'

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Какой у тебя тип волос?',
    options: [
      { id: 'q1_a', label: 'Натуральные (не крашу)', score: 0 },
      { id: 'q1_b', label: 'Окрашенные (тон в тон или темнее)', score: 1 },
      { id: 'q1_c', label: 'Осветлённые или мелированные', score: 2 },
      { id: 'q1_d', label: 'Сильно осветлённый блонд', score: 3 },
    ],
  },
  {
    id: 'q2',
    question: 'Что беспокоит больше всего?',
    options: [
      { id: 'q2_a', label: 'Сухость и жёсткость', score: 1 },
      { id: 'q2_b', label: 'Ломкость и потеря длины', score: 2 },
      { id: 'q2_c', label: 'Путаются и плохо расчёсываются', score: 2 },
      { id: 'q2_d', label: 'Тусклые, нет блеска', score: 1 },
    ],
  },
  {
    id: 'q3',
    question: 'Как часто используешь фен или утюжок?',
    options: [
      { id: 'q3_a', label: 'Почти каждый день', score: 2 },
      { id: 'q3_b', label: 'Пару раз в неделю', score: 1 },
      { id: 'q3_c', label: 'Редко, только по случаю', score: 0 },
      { id: 'q3_d', label: 'Не использую вообще', score: 0 },
    ],
  },
  {
    id: 'q4',
    question: 'Как давно ты замечаешь проблемы с волосами?',
    options: [
      { id: 'q4_a', label: 'Меньше полугода', score: 0 },
      { id: 'q4_b', label: 'Полгода-год', score: 1 },
      { id: 'q4_c', label: 'Больше года', score: 2 },
      { id: 'q4_d', label: 'Сколько себя помню', score: 2 },
    ],
  },
]
