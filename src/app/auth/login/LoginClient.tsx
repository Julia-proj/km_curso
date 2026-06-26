"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { AnimatedBackground } from "@/components/AnimatedBackground"
import { PrePaymentNav } from "@/components/Navigation"

const emailSchema = z.email()

// Supabase auth errors arrive in English. Map the few the user can actually hit
// to friendly Russian copy (no dashes), with a safe fallback.
function toRussianError(message: string): string {
  const m = message.toLowerCase()
  if (m.includes("rate") || m.includes("after") || m.includes("too many")) {
    return "Слишком много попыток. Подожди немного и попробуй снова."
  }
  if (m.includes("expired") || m.includes("invalid") || m.includes("token")) {
    return "Код неверный или истёк. Запроси новый код."
  }
  return "Не удалось войти. Попробуй ещё раз."
}

type Mode = "idle" | "code_sent"

export default function LoginClient() {
  const router = useRouter()
  const supabase = createClient()
  const [mode, setMode] = useState<Mode>("idle")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    // Surface errors from the OAuth callback (?error=...), then bounce an
    // already signed-in user straight to the dashboard. Wrapped in an async
    // function so the setState calls don't run synchronously in the effect body.
    const init = async () => {
      const errorCode = new URLSearchParams(window.location.search).get("error")
      if (errorCode) {
        const messages: Record<string, string> = {
          no_code: "Google не вернул код авторизации. Попробуй ещё раз.",
          exchange_failed:
            "Не удалось завершить вход. Попробуй ещё раз с той же вкладки, где нажимала «Войти».",
          not_configured: "Авторизация временно недоступна. Попробуйте позже.",
        }
        setError(messages[errorCode] || "Не удалось войти. Попробуй ещё раз.")
      }

      if (!supabase) return
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push("/dashboard")
      }
    }
    init()
  }, [router, supabase])

  // Resend cooldown ticker.
  useEffect(() => {
    if (cooldown <= 0) return
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [cooldown])

  const handleGoogleLogin = async () => {
    if (!supabase) {
      setError("Авторизация временно недоступна. Попробуйте позже.")
      return
    }

    setLoading(true)
    setError(null)

    // Use the current origin (not an env-configured URL) so the PKCE verifier
    // cookie and the callback land on the same host — works on localhost,
    // Vercel previews and production alike.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const sendCode = async () => {
    if (!supabase) {
      setError("Авторизация временно недоступна. Попробуйте позже.")
      return
    }

    const parsed = emailSchema.safeParse(email.trim())
    if (!parsed.success) {
      setError("Введи корректный email.")
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data,
      options: { shouldCreateUser: true },
    })

    setLoading(false)
    if (error) {
      setError(toRussianError(error.message))
      return
    }

    setEmail(parsed.data)
    setCode("")
    setMode("code_sent")
    setCooldown(60)
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    await sendCode()
  }

  const handleResend = async () => {
    if (cooldown > 0 || loading) return
    await sendCode()
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      setError("Авторизация временно недоступна. Попробуйте позже.")
      return
    }

    const token = code.trim()
    if (token.length < 6) {
      setError("Введи код из письма полностью.")
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" })
    if (error) {
      setLoading(false)
      setError(toRussianError(error.message))
      return
    }

    // Email OTP has no OAuth callback, so apply the profile row + admin flags
    // here. Non-fatal: the handle_new_user DB trigger already created the row.
    try {
      await fetch("/api/auth/sync-profile", { method: "POST" })
    } catch {
      // Ignore — sign-in already succeeded.
    }

    router.push("/dashboard")
  }

  const handleChangeEmail = () => {
    setMode("idle")
    setCode("")
    setError(null)
    setCooldown(0)
  }

  return (
    <>
      <AnimatedBackground />
      <main className="min-h-screen bg-transparent flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <PrePaymentNav showBack={true} />
          <div className="bg-white rounded-2xl border border-[#E0DCD6] p-8 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="font-hero-face text-2xl font-semibold text-[#1A1A1A] mb-2">
                Вход в личный кабинет
              </h1>
              <p className="font-sans text-sm text-[#666]">
                {mode === "idle"
                  ? "Войди через Google или получи код на любой email"
                  : "Введи код из письма, чтобы войти"}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-sans text-sm text-red-600">{error}</p>
              </div>
            )}

            {mode === "idle" ? (
              <>
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 border border-[#D0C8BE] bg-white hover:bg-[#FAF7F4] rounded-lg py-3 px-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="font-sans text-sm font-medium text-[#1A1A1A]">
                    {loading ? "Вход..." : "Войти через Google"}
                  </span>
                </button>

                <div className="flex items-center gap-4 my-6">
                  <div className="h-px flex-1 bg-[#E0DCD6]" />
                  <span className="font-sans text-xs text-[#999]">или</span>
                  <div className="h-px flex-1 bg-[#E0DCD6]" />
                </div>

                <form onSubmit={handleSendCode}>
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@mail.ru"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-[#D0C8BE] rounded-lg py-3 px-4 font-sans text-sm text-[#1A1A1A] placeholder-[#999] focus:outline-none focus:border-[#1A1A1A] transition-colors mb-3"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1A1A1A] text-white rounded-lg py-3 px-4 font-sans text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Отправляем..." : "Получить код"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="font-sans text-sm text-[#666] mb-4 text-center">
                  Мы отправили код на{" "}
                  <span className="text-[#1A1A1A] font-medium">{email}</span>
                </p>

                <form onSubmit={handleVerify}>
                  <input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="Код из письма"
                    maxLength={10}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full border border-[#D0C8BE] rounded-lg py-3 px-4 font-sans text-center text-lg tracking-[0.3em] text-[#1A1A1A] placeholder:tracking-normal placeholder:text-[#999] focus:outline-none focus:border-[#1A1A1A] transition-colors mb-3"
                  />
                  <button
                    type="submit"
                    disabled={loading || code.length < 6}
                    className="w-full bg-[#1A1A1A] text-white rounded-lg py-3 px-4 font-sans text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Проверяем..." : "Войти"}
                  </button>
                </form>

                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={handleChangeEmail}
                    className="font-sans text-xs text-[#666] hover:text-[#1A1A1A] underline"
                  >
                    Изменить email
                  </button>
                  <button
                    onClick={handleResend}
                    disabled={cooldown > 0 || loading}
                    className="font-sans text-xs text-[#666] hover:text-[#1A1A1A] underline disabled:no-underline disabled:text-[#999] disabled:cursor-not-allowed"
                  >
                    {cooldown > 0 ? `Ещё раз через ${cooldown} сек` : "Отправить ещё раз"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
