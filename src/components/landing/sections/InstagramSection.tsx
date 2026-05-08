"use client"

// Иконка Instagram
const InstagramIcon = ({ className = "h-4 w-4", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
  </svg>
)

// Иконка Play
const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5.14v13.72a1 1 0 001.5.86l10.44-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" />
  </svg>
)

// Иконка стрелки
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
)

const instagramPosts = [
  {
    id: 1,
    badge: "ОТЗЫВ",
    title: "Отзыв из Instagram",
    description: "Скрин из Reels: реальный результат и живой формат доказательства.",
    image: "/images/rev1.png"
  },
  {
    id: 2,
    badge: "REEL",
    title: "Результат клиентки",
    description: "Видео в Instagram с результатом и состоянием волос после ухода.",
    image: "/images/rev2.png"
  },
  {
    id: 3,
    badge: "ОТЗЫВ",
    title: "История ученицы",
    description: "Живой отзыв о подходе, результате и понятной системе восстановления.",
    image: "/images/rev3.png"
  },
  {
    id: 4,
    badge: "БЛОНД",
    title: "Работа с длиной",
    description: "Кейс про блонд без сухости и результат после правильно подобранного протокола.",
    image: "/images/rev4.png"
  },
  {
    id: 5,
    badge: "СТУДИЯ",
    title: "Процесс и доверие",
    description: "Видео из Instagram, где видно подход студии и реальные материалы курса.",
    image: "/images/rev5.png"
  }
]

export function InstagramSection() {
  return (
    <section 
      className="w-full"
      style={{ 
        backgroundColor: '#f3e6df',
        paddingTop: '40px',
        paddingBottom: '70px'
      }}
    >
      <div 
        className="mx-auto"
        style={{ 
          maxWidth: '1440px',
          paddingLeft: '100px',
          paddingRight: '100px'
        }}
      >
        {/* Заголовок блока */}
        <div 
          className="flex items-center gap-2 mb-7"
          style={{ marginBottom: '28px' }}
        >
          <InstagramIcon className="h-4 w-4" style={{ color: '#3d3d3d' }} />
          <span 
            className="font-semibold uppercase tracking-wider"
            style={{ 
              fontSize: '14px',
              letterSpacing: '4px',
              color: '#3d3d3d'
            }}
          >
            INSTAGRAM
          </span>
        </div>

        {/* Сетка карточек */}
        <div 
          className="grid"
          style={{ 
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '16px'
          }}
        >
          {instagramPosts.map((post) => (
            <article 
              key={post.id}
              className="flex flex-col overflow-hidden"
              style={{
                backgroundColor: '#fbf8f4',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                minHeight: '640px'
              }}
            >
              {/* Верхняя часть с изображением */}
              <div 
                className="relative overflow-hidden"
                style={{ 
                  height: '400px',
                  minHeight: '400px',
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px'
                }}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  style={{ objectFit: 'cover' }}
                />
                
                {/* Badge с иконкой Instagram */}
                <div 
                  className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5"
                  style={{ 
                    padding: '7px 12px',
                    borderRadius: '999px'
                  }}
                >
                  <InstagramIcon className="h-3 w-3" />
                  <span 
                    className="font-semibold uppercase"
                    style={{ 
                      fontSize: '11px',
                      letterSpacing: '1.5px',
                      color: '#3d3d3d'
                    }}
                  >
                    {post.badge}
                  </span>
                </div>

                {/* Кнопка Play по центру */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="flex items-center justify-center rounded-full"
                    style={{ 
                      width: '56px',
                      height: '56px',
                      backgroundColor: '#f8f3ef'
                    }}
                  >
                    <PlayIcon />
                  </div>
                </div>
              </div>

              {/* Нижняя часть с текстом */}
              <div 
                className="flex flex-col"
                style={{ 
                  padding: '18px 20px 20px',
                  minHeight: '240px'
                }}
              >
                {/* KERATIN_MADRID */}
                <p 
                  className="font-semibold uppercase mb-2"
                  style={{ 
                    fontSize: '11px',
                    letterSpacing: '1.8px',
                    color: '#8B7D72'
                  }}
                >
                  KERATIN_MADRID
                </p>

                {/* Заголовок */}
                <h3 
                  className="font-serif mb-2"
                  style={{ 
                    fontSize: '22px',
                    lineHeight: '1.1',
                    color: '#3d3d3d',
                    fontFamily: 'Georgia, serif'
                  }}
                >
                  {post.title}
                </h3>

                {/* Описание */}
                <p 
                  className="mb-auto"
                  style={{ 
                    fontSize: '16px',
                    lineHeight: '1.5',
                    color: '#5b514b'
                  }}
                >
                  {post.description}
                </p>

                {/* Ссылка внизу */}
                <a 
                  href="#"
                  className="flex items-center gap-2 font-semibold uppercase"
                  style={{ 
                    fontSize: '12px',
                    letterSpacing: '2px',
                    fontWeight: '600',
                    color: '#3d3d3d',
                    marginTop: 'auto'
                  }}
                >
                  <span>СМОТРЕТЬ В INSTAGRAM</span>
                  <ArrowIcon />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Адаптивные стили */}
      <style jsx>{`
        @media (max-width: 1280px) {
          section > div > div {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        @media (max-width: 1024px) {
          section > div {
            padding-left: 50px !important;
            padding-right: 50px !important;
          }

          section > div > div {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 768px) {
          section {
            padding-top: 32px !important;
            padding-bottom: 48px !important;
          }

          section > div {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          section > div > div {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }

          section > div > div > article {
            min-height: auto !important;
          }

          section > div > div > article > div:first-child {
            height: 280px !important;
            min-height: 280px !important;
          }
        }

        @media (max-width: 480px) {
          section > div > div {
            grid-template-columns: 1fr !important;
          }

          section > div > div > article > div:first-child {
            height: 320px !important;
            min-height: 320px !important;
          }
        }
      `}</style>
    </section>
  )
}
