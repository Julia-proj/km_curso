export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8F5F1] pt-20 pb-16 px-5 md:pt-24">
      <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
      </div>
    </div>
  )
}
