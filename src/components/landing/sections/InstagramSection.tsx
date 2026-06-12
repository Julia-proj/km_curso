"use client"

import Image from "next/image"
import { instagramReels } from "@/config/landing-content"

// Иконка Instagram
const InstagramIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
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

export function InstagramSection() {
  return (
    <section className="w-full bg-[#f3e6df] py-10 px-5 md:px-12 lg:px-24 xl:py-[70px]">
      <div className="mx-auto max-w-[1440px]">
        {/* Заголовок блока */}
        <div className="flex items-center gap-2 mb-7 md:mb-8">
          <InstagramIcon className="h-4 w-4 text-[#3d3d3d]" />
          <span className="font-semibold uppercase tracking-[0.25em] text-[14px] text-[#3d3d3d]">
            INSTAGRAM
          </span>
        </div>

        {/* Сетка карточек */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {instagramReels.map((reel) => (
            <article 
              key={reel.id}
              className="flex flex-col overflow-hidden rounded-2xl bg-[#fbf8f4] shadow-sm md:min-h-[640px]"
            >
              {/* Верхняя часть с изображением */}
              <div className="relative overflow-hidden h-[320px] sm:h-[280px] md:h-[400px] lg:h-[400px]">
                <Image
                  src={reel.image}
                  alt={reel.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  loading="lazy"
                />
                
                {/* Badge с иконкой Instagram */}
                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5">
                  <InstagramIcon className="h-3 w-3" />
                  <span className="font-semibold uppercase text-xs tracking-[0.15em] text-[#3d3d3d]">
                    {reel.tag}
                  </span>
                </div>

                {/* Кнопка Play по центру */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f3ef]">
                    <PlayIcon />
                  </div>
                </div>
              </div>

              {/* Нижняя часть с текстом */}
              <div className="flex flex-col p-5 md:p-[18px_20px_20px] md:min-h-[240px]">
                {/* KERATIN_MADRID */}
                <p className="mb-2 font-semibold uppercase text-xs tracking-[0.18em] text-[#8B7D72]">
                  KERATIN_MADRID
                </p>

                {/* Заголовок */}
                <h3 className="mb-2 font-serif text-xl leading-[1.1] text-[#3d3d3d] md:text-2xl">
                  {reel.title}
                </h3>

                {/* Описание */}
                <p className="mb-auto text-base leading-[1.5] text-[#5b514b]">
                  {reel.description}
                </p>

                {/* Ссылка внизу */}
                <a 
                  href={reel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center gap-2 font-semibold uppercase text-xs tracking-[0.2em] text-[#3d3d3d]"
                >
                  <span>СМОТРЕТЬ В INSTAGRAM</span>
                  <ArrowIcon />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
