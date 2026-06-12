export function HeroAnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#FAF7F4] -z-10">
      {/* Blob 1 - cream - more visible */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#E8DDD0] blur-[100px] opacity-90 animate-blob-1"
      />
      {/* Blob 2 - soft rose - more visible */}
      <div
        className="absolute top-[20%] right-[-5%] w-[550px] h-[550px] rounded-full bg-[#E8D4D0] blur-[100px] opacity-90 animate-blob-2"
      />
      {/* Blob 3 - warm beige - more visible */}
      <div
        className="absolute bottom-[-10%] left-[30%] w-[650px] h-[650px] rounded-full bg-[#E8D8C8] blur-[100px] opacity-90 animate-blob-3"
      />
      {/* Blob 4 - light paper - more visible */}
      <div
        className="absolute top-[40%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#EDE4DA] blur-[100px] opacity-85 animate-blob-4"
      />
      {/* Blob 5 - rose - more visible */}
      <div
        className="absolute bottom-[20%] right-[20%] w-[580px] h-[580px] rounded-full bg-[#D9A19D] blur-[100px] opacity-60 animate-blob-5"
      />
    </div>
  )
}
