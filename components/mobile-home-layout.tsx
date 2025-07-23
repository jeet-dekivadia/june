'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CountdownTimer } from "@/components/countdown-timer"
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { montserrat } from '@/lib/fonts'

interface FormData {
  name: string
  email: string
  phone: string
  countryCode: string
  gender: string
  age: string
  instagram: string
  linkedin: string
  twitter: string
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  countryCode: '+1',
  gender: '',
  age: '',
  instagram: '',
  linkedin: '',
  twitter: ''
}

const countryOptions = [
  { code: '+1' },
  { code: '+44' },
  { code: '+33' },
  { code: '+49' },
  { code: '+39' },
  { code: '+34' },
  { code: '+31' },
  { code: '+61' },
  { code: '+81' },
  { code: '+82' },
  { code: '+65' },
  { code: '+91' },
  { code: '+86' },
  { code: '+55' },
  { code: '+52' },
]

export function MobileHomeLayout() {
  const [activeTab, setActiveTab] = useState<'apply' | 'manifesto'>('apply')
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [waitlistPosition, setWaitlistPosition] = useState<number>(0)
  const supabase = createClient()

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.gender || !formData.age || !formData.instagram) {
      setError('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }

    if (parseInt(formData.age) < 18 || parseInt(formData.age) > 99) {
      setError('Age must be between 18 and 99')
      setIsSubmitting(false)
      return
    }

    try {
      const { count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })

      const submissionData = {
        email: formData.email,
        name: formData.name,
        phone: `${formData.countryCode}${formData.phone}`,
        gender: formData.gender,
        age: parseInt(formData.age),
        instagram: `@${formData.instagram}`,
        linkedin: formData.linkedin || null,
        twitter: formData.twitter ? `@${formData.twitter}` : null,
        created_at: new Date()
      }

      const { data, error: supabaseError } = await supabase
        .from('waitlist')
        .insert([submissionData])
        .select()

      if (supabaseError) {
        if (supabaseError.code === '23505') {
          throw new Error('This email is already on the waitlist!')
        }
        throw new Error('Failed to submit application. Please try again.')
      }

      setWaitlistPosition((count || 0) + 1)
      setIsSuccess(true)
    } catch (error) {
      console.error('Form submission error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className={`h-screen w-full flex items-center justify-center p-4 ${montserrat.className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/8 backdrop-blur-3xl border border-white/15 rounded-3xl p-8 w-full max-w-sm"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto flex items-center justify-center text-2xl font-light text-white shadow-2xl mb-4">
            ✓
          </div>
          <h3 className="text-xl font-light text-white mb-2 tracking-wide">
            Congratulations!
          </h3>
          <p className="text-white/90 mb-6 font-light text-sm tracking-wide">
            You are <span className="font-medium text-white">#{waitlistPosition}</span> on the waitlist
          </p>
          <Image
            src="/images/purpledate.jpeg"
            alt="June"
            width={120}
            height={120}
            className="rounded-2xl mx-auto shadow-2xl border border-white/20 mb-4"
          />
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white px-6 py-3 rounded-2xl font-medium border border-white/20 text-sm tracking-wide"
          >
            Close
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`h-screen w-full flex flex-col ${montserrat.className}`}>
      {/* Tab Navigation */}
      <div className="flex justify-center pt-4 pb-2">
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-2">
          <div className="flex relative">
            <motion.div
              className="absolute h-8 rounded-2xl bg-gradient-to-r from-white/40 to-white/30 backdrop-blur-lg border border-white/50 shadow-lg"
              style={{ width: '85px', left: '8px' }}
              initial={false}
              animate={{ x: activeTab === 'apply' ? 0 : 85 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
            />
            <button
              onClick={() => setActiveTab('apply')}
              className={`relative text-sm font-semibold py-2 px-4 text-white w-[85px] flex items-center justify-center drop-shadow-lg z-10 rounded-2xl transition-opacity duration-200 ease-out ${
                activeTab === 'apply' ? 'opacity-100 font-bold' : 'opacity-80'
              }`}
            >
              Apply
            </button>
            <button
              onClick={() => setActiveTab('manifesto')}
              className={`relative text-sm font-semibold py-2 px-4 text-white w-[85px] flex items-center justify-center drop-shadow-lg z-10 rounded-2xl transition-opacity duration-200 ease-out ${
                activeTab === 'manifesto' ? 'opacity-100 font-bold' : 'opacity-80'
              }`}
            >
              Manifesto
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-4 pb-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'apply' ? (
            <motion.div
              key="apply"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {/* Apply Content */}
              <div className="bg-amber-50/3 backdrop-blur-md border border-amber-100/15 rounded-3xl h-full p-6 shadow-2xl relative overflow-hidden">
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-amber-100/8 to-amber-200/8 backdrop-blur-sm mx-auto mb-3">
                      <Image
                        src="/junelogo.png"
                        alt="June"
                        width={50}
                        height={50}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                    <h1 className="text-lg font-medium text-white mb-2 drop-shadow-lg">
                      Welcome to the Future of Dating
                    </h1>
                    <p className="text-white/90 text-xs leading-relaxed drop-shadow-sm">
                      Meet your perfect match through AI-powered conversations. No endless swiping.
                    </p>
                  </div>

                  {/* Countdown Timer */}
                  <div className="mb-4">
                    <CountdownTimer />
                  </div>

                  {/* Application Form */}
                  <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-3 min-h-0">
                    <div className="flex-1 overflow-y-auto space-y-3">
                      {/* Basic Info */}
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => updateFormData('name', e.target.value)}
                          placeholder="Full Name"
                          className="px-3 py-2 bg-black/30 backdrop-blur-sm border border-white/15 rounded-xl text-white placeholder-white/50 text-xs focus:ring-1 focus:ring-purple-400/40"
                          required
                        />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          placeholder="Email"
                          className="px-3 py-2 bg-black/30 backdrop-blur-sm border border-white/15 rounded-xl text-white placeholder-white/50 text-xs focus:ring-1 focus:ring-purple-400/40"
                          required
                        />
                      </div>

                      {/* Phone */}
                      <div className="flex gap-2">
                        <select
                          value={formData.countryCode}
                          onChange={(e) => updateFormData('countryCode', e.target.value)}
                          className="w-16 px-2 py-2 bg-black/30 backdrop-blur-sm border border-white/15 rounded-xl text-white text-xs focus:ring-1 focus:ring-purple-400/40"
                        >
                          {countryOptions.map((option, index) => (
                            <option key={index} value={option.code} className="bg-black text-white">
                              {option.code}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateFormData('phone', e.target.value)}
                          placeholder="Phone number"
                          className="flex-1 px-3 py-2 bg-black/30 backdrop-blur-sm border border-white/15 rounded-xl text-white placeholder-white/50 text-xs focus:ring-1 focus:ring-purple-400/40"
                          required
                        />
                      </div>

                      {/* Gender & Age */}
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={formData.gender}
                          onChange={(e) => updateFormData('gender', e.target.value)}
                          className="px-3 py-2 bg-black/30 backdrop-blur-sm border border-white/15 rounded-xl text-white text-xs focus:ring-1 focus:ring-purple-400/40"
                          required
                        >
                          <option value="" className="bg-black text-white">Gender</option>
                          <option value="Male" className="bg-black text-white">Male</option>
                          <option value="Female" className="bg-black text-white">Female</option>
                          <option value="Other" className="bg-black text-white">Other</option>
                        </select>
                        <input
                          type="number"
                          min="18"
                          max="99"
                          value={formData.age}
                          onChange={(e) => updateFormData('age', e.target.value)}
                          placeholder="Age"
                          className="px-3 py-2 bg-black/30 backdrop-blur-sm border border-white/15 rounded-xl text-white placeholder-white/50 text-xs focus:ring-1 focus:ring-purple-400/40"
                          required
                        />
                      </div>

                      {/* Social Media */}
                      <div className="space-y-2">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 text-xs">@</span>
                          <input
                            type="text"
                            value={formData.instagram}
                            onChange={(e) => updateFormData('instagram', e.target.value)}
                            placeholder="Instagram handle"
                            className="w-full pl-6 pr-3 py-2 bg-black/30 backdrop-blur-sm border border-white/15 rounded-xl text-white placeholder-white/50 text-xs focus:ring-1 focus:ring-purple-400/40"
                            required
                          />
                        </div>
                        <input
                          type="url"
                          value={formData.linkedin}
                          onChange={(e) => updateFormData('linkedin', e.target.value)}
                          placeholder="LinkedIn (optional)"
                          className="w-full px-3 py-2 bg-black/30 backdrop-blur-sm border border-white/15 rounded-xl text-white placeholder-white/50 text-xs focus:ring-1 focus:ring-purple-400/40"
                        />
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 text-xs">@</span>
                          <input
                            type="text"
                            value={formData.twitter}
                            onChange={(e) => updateFormData('twitter', e.target.value)}
                            placeholder="X/Twitter (optional)"
                            className="w-full pl-6 pr-3 py-2 bg-black/30 backdrop-blur-sm border border-white/15 rounded-xl text-white placeholder-white/50 text-xs focus:ring-1 focus:ring-purple-400/40"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-2 bg-red-500/15 backdrop-blur-sm border border-red-400/25 rounded-xl text-xs text-red-200 text-center">
                        {error}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white px-6 py-3 rounded-2xl font-medium border border-white/20 text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Apply to Join'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="manifesto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {/* Manifesto Content */}
              <div className="bg-amber-50/3 backdrop-blur-md border border-amber-100/15 rounded-3xl h-full p-6 shadow-2xl relative overflow-hidden">
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-amber-100/8 to-amber-200/8 backdrop-blur-sm mx-auto mb-3">
                      <Image
                        src="/junelogo.png"
                        alt="June"
                        width={50}
                        height={50}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                    <h1 className="text-lg font-semibold text-white mb-2 drop-shadow-lg">
                      Our Manifesto
                    </h1>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-white/90 text-sm leading-relaxed space-y-4 overflow-y-auto">
                    <p className="drop-shadow-sm">
                      Dating shouldn't be a numbers game. It should be about finding the one person who truly gets you.
                    </p>
                    <p className="drop-shadow-sm">
                      We're building June to replace endless swiping with meaningful connections powered by advanced AI.
                    </p>
                    <p className="drop-shadow-sm">
                      <strong className="text-white">One match. One conversation. One chance to find love.</strong>
                    </p>
                    
                    <div className="bg-amber-50/5 backdrop-blur-sm border border-amber-100/20 rounded-2xl p-4 mt-6">
                      <p className="text-sm text-white/90 drop-shadow-sm italic text-center">
                        "The future of dating isn't about more options—it's about the right option."
                      </p>
                      <p className="text-xs text-white/70 mt-2 drop-shadow-sm text-center">
                        — The June Team
                      </p>
                    </div>

                    <div className="space-y-3 mt-6">
                      <h3 className="text-white font-medium">Why June is Different:</h3>
                      <ul className="space-y-2 text-xs">
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>AI matches you with one perfect person, not hundreds of maybes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>No endless swiping or superficial judgments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>Verified profiles ensure authentic connections</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>Launching August 18, 2025 on National Couples Day</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 