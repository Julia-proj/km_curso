import Image from "next/image"

interface ProductCardProps {
  id: string
  name: string
  description: string
  priceEur: number
  imagePath?: string
}

export function ProductCard({ id, name, description, priceEur, imagePath }: ProductCardProps) {
  return (
    <div className="flex gap-4 rounded-lg border border-[#E5DDD5] bg-white p-4">
      {imagePath && (
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm bg-[#F5F0ED]">
          <Image
            src={imagePath}
            alt={name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-center">
        <h3 className="font-hero-face text-base font-semibold text-[#1A1A1A]">
          {name}
        </h3>
        <p className="mt-1 font-body text-sm text-[#666]">
          {description}
        </p>
        <p className="mt-2 font-body text-sm font-semibold text-[#1A1A1A]">
          {priceEur}€
        </p>
      </div>
    </div>
  )
}
