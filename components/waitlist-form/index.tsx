"use client"
import clsx from "clsx"
import type React from "react"
import { useRef, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ArrowRight } from "lucide-react"
import { createPortal } from "react-dom"

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

export function InputForm({ buttonCopy, ...props }: InputForm) {
  const [state, setState] = useState<State>(STATES.idle)
  const [error, setError] = useState<string>()
  const [value, setValue] = useState("")
  const [showManifestoPrompt, setShowManifestoPrompt] = useState(false)
  const [promptPosition, setPromptPosition] = useState<{ top: number; left: number } | null>(null)
  const errorTimeout = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()
  const formRef = useRef<HTMLDivElement>(null)
  const [arrowStart, setArrowStart] = useState<{ x: number; y: number } | null>(null)
  const [arrowEnd, setArrowEnd] = useState<{ x: number; y: number } | null>(null)

  // Show manifesto prompt after success animation
  useEffect(() => {
    if (state === STATES.success) {
      const promptTimeout = setTimeout(() => {
        // Find Manifesto button
        const manifestoBtn = document.querySelector('[data-manifesto-btn]') as HTMLElement
        // Find the main box (form)
        const formBox = formRef.current
        if (manifestoBtn && formBox) {
          const rectEnd = manifestoBtn.getBoundingClientRect()
          const rectStart = formBox.getBoundingClientRect()
          // Start: center-top of form box
          setArrowStart({
            x: rectStart.left + rectStart.width / 2,
            y: rectStart.top + window.scrollY,
          })
          // End: just above and to the right of Manifesto button
          setArrowEnd({
            x: rectEnd.left + rectEnd.width * 0.8,
            y: rectEnd.top + window.scrollY - 12,
          })
        }
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
    <div className="relative" ref={formRef}>
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
      {showManifestoPrompt && arrowStart && arrowEnd && typeof window !== 'undefined' && createPortal(
        (() => {
          // Calculate SVG dimensions and path
          const minX = Math.min(arrowStart.x, arrowEnd.x) - 60
          const minY = Math.min(arrowStart.y, arrowEnd.y) - 60
          const width = Math.abs(arrowEnd.x - arrowStart.x) + 120
          const height = Math.abs(arrowEnd.y - arrowStart.y) + 120
          // Start and end relative to SVG
          const startX = arrowStart.x - minX
          const startY = arrowStart.y - minY
          const endX = arrowEnd.x - minX
          const endY = arrowEnd.y - minY
          // Control points for two loops (cubic Bezier)
          const cp1X = startX + (endX - startX) * 0.2
          const cp1Y = startY - 120
          const cp2X = startX + (endX - startX) * 0.4
          const cp2Y = startY + 80
          const cp3X = startX + (endX - startX) * 0.6
          const cp3Y = startY - 120
          const cp4X = startX + (endX - startX) * 0.8
          const cp4Y = startY + 80
          // SVG path with two loops
          const path = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${(startX + endX) / 2} ${(startY + endY) / 2} S ${cp3X} ${cp3Y}, ${endX} ${endY}`
          return (
            <svg
              style={{
                position: 'absolute',
                left: minX,
                top: minY,
                pointerEvents: 'none',
                zIndex: 50,
              }}
              width={width}
              height={height}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={path}
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 2000,
                  strokeDashoffset: 2000,
                  animation: 'drawArrow 2.2s cubic-bezier(0.4,0,0.2,1) forwards',
                }}
              />
              {/* Arrowhead at the end */}
              <polygon
                points={`${endX - 12},${endY - 8} ${endX},${endY} ${endX - 14},${endY + 8}`}
                fill="currentColor"
                style={{
                  opacity: 0,
                  animation: 'fadeInArrowHead 0.5s 1.8s forwards',
                }}
              />
              <style>{`
                @keyframes drawArrow {
                  to { stroke-dashoffset: 0; }
                }
                @keyframes fadeInArrowHead {
                  to { opacity: 1; }
                }
              `}</style>
            </svg>
          )
        })(),
        document.body
      )}
    </div>
  )
}

const Loading = () => (
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded-full border border-[currentColor] !border-t-[transparent] animate-spin" />
  </div>
)
