"use client"
import clsx from "clsx"
import type React from "react"
import { useRef, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ArrowRight } from "lucide-react"

type InputForm = {
  buttonCopy: {
    success: string
    idle: string
    loading: string
  }
} & React.HTMLAttributes<HTMLInputElement>

type State = "idle" | "loading" | "success" | "error"

const STATES: Record<State, State> = {
  idle: "idle",
  loading: "loading",
  success: "success",
  error: "error",
}

// Typewriter animation hook
function useTypewriter(text: string, delay: number = 40) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay]);
  return displayed;
}

export function InputForm({ buttonCopy, ...props }: InputForm) {
  const [state, setState] = useState<State>(STATES.idle)
  const [error, setError] = useState<string>()
  const [value, setValue] = useState("")
  const [showManifestoPrompt, setShowManifestoPrompt] = useState(false)
  const errorTimeout = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()

  // Show manifesto prompt after success animation
  useEffect(() => {
    if (state === STATES.success) {
      const promptTimeout = setTimeout(() => {
        setShowManifestoPrompt(true)
      }, 1000)

      return () => clearTimeout(promptTimeout)
    }
  }, [state])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formEl = e.currentTarget
    if (state === STATES.success || state === STATES.loading) return
    if (errorTimeout.current) {
      clearTimeout(errorTimeout.current)
      setError(undefined)
      setState(STATES.idle)
    }

    try {
      setState(STATES.loading)
      const formData = new FormData(formEl)
      const email = formData.get("email") as string

      if (!email) {
        throw new Error("Email is required")
      }

      const { error: supabaseError } = await supabase.from("waitlist").insert([{ email, created_at: new Date() }])

      if (supabaseError) {
        if (supabaseError.code === "23505") {
          // Duplicate email
          throw new Error("You're already on the waitlist!")
        }
        throw new Error("Failed to join waitlist. Please try again.")
      }

      setState(STATES.success)
      setValue("")
    } catch (error) {
      setState(STATES.error)
      const errorMessage = error instanceof Error ? error.message : "There was an error while submitting the form"
      setError(errorMessage)
      console.error(error)
      errorTimeout.current = setTimeout(() => {
        setError(undefined)
        setState(STATES.idle)
      }, 3000)
    }
  }

  const isSubmitted = state === "success"
  const inputDisabled = state === "loading" || state === "success"

  return (
    <div className="relative">
      <form className="flex flex-col gap-2 w-full relative" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between gap-3 relative">
          <input
            {...props}
            value={value}
            className={clsx(
              "flex-1 text-sm pl-4 pr-28 py-2 h-11 bg-gray-11/5 cursor-text rounded-full text-gray-12 placeholder:text-gray-9 border border-gray-11/10 transition-all duration-500",
              isSubmitted && "opacity-0",
            )}
            disabled={inputDisabled}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            data-1p-ignore
            data-lpignore
            autoFocus
          />

          {/* Animated success button that expands */}
          <button
            type="submit"
            disabled={inputDisabled}
            className={clsx(
              "absolute h-8 px-3.5 bg-gray-12 text-gray-1 text-sm top-1/2 transform -translate-y-1/2 rounded-full font-medium flex gap-1 items-center transition-all duration-500 ease-out",
              "disabled:cursor-not-allowed",
              {
                "bg-gray-12 text-gray-2": state === "loading",
                "right-1.5 w-auto": !isSubmitted,
                "right-0 left-0 w-full h-11 justify-center": isSubmitted,
              },
              inputDisabled && "cursor-not-allowed",
            )}
          >
            {state === "loading" ? (
              <>
                {buttonCopy.loading}
                <Loading />
              </>
            ) : isSubmitted ? (
              <span className="animate-pulse">{buttonCopy.success}</span>
            ) : (
              buttonCopy.idle
            )}
          </button>
        </div>
        <div className="w-full h-2" />
        {error && <p className="absolute text-xs text-[#ff0000] top-full -translate-y-1/2 px-2">{error}</p>}
      </form>

      {/* Manifesto prompt with curved arrow */}
      {showManifestoPrompt && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-in slide-in-from-bottom-4 duration-700">
          <div className="relative flex flex-col items-center">
            {/* Curved arrow SVG, visually points from button to text */}
            <svg
              width="90"
              height="60"
              viewBox="0 0 90 60"
              className="text-slate-11 animate-bounce"
              style={{ animationDelay: "0.5s" }}
            >
              <path d="M45 10 Q60 30 70 40 Q80 50 85 55" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M80 50 L85 55 L78 54" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <a
            href="/manifesto"
            className="mt-2 text-sm text-slate-11 hover:text-slate-12 transition-colors duration-200 flex items-center gap-1 group font-mono"
            style={{ minHeight: 24 }}
          >
            <span style={{ whiteSpace: 'pre' }}>{useTypewriter("Check out our manifesto")}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
      )}
    </div>
  )
}

const Loading = () => (
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded-full border border-[currentColor] !border-t-[transparent] animate-spin" />
  </div>
)
