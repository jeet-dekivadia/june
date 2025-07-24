'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, ArrowRight, Star, Heart, Users, Zap, Shield, Crown, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

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

type Step = 'personal' | 'social' | 'confirmation' | 'success'

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

// Purple Liquid Glass Luma Spinner Component
const PurpleLumaSpinner = () => {
  return (
    <div className="relative w-[80px] aspect-square">
      <span className="absolute rounded-full animate-lumaAnim shadow-[inset_0_0_0_4px] shadow-amber-200/70 backdrop-blur-sm" />
      <span className="absolute rounded-full animate-lumaAnim animation-delay shadow-[inset_0_0_0_4px] shadow-yellow-100/60 backdrop-blur-sm" />
      <style jsx>{`
        @keyframes lumaAnim {
          0% {
            inset: 0 45px 45px 0;
            box-shadow: inset 0 0 0 4px rgba(222, 203, 164, 0.9);
          }
          12.5% {
            inset: 0 45px 0 0;
            box-shadow: inset 0 0 0 4px rgba(196, 175, 140, 0.9);
          }
          25% {
            inset: 45px 45px 0 0;
            box-shadow: inset 0 0 0 4px rgba(240, 220, 186, 0.9);
          }
          37.5% {
            inset: 45px 0 0 0;
            box-shadow: inset 0 0 0 4px rgba(222, 203, 164, 0.9);
          }
          50% {
            inset: 45px 0 0 45px;
            box-shadow: inset 0 0 0 4px rgba(196, 175, 140, 0.9);
          }
          62.5% {
            inset: 0 0 0 45px;
            box-shadow: inset 0 0 0 4px rgba(240, 220, 186, 0.9);
          }
          75% {
            inset: 0 0 45px 45px;
            box-shadow: inset 0 0 0 4px rgba(222, 203, 164, 0.9);
          }
          87.5% {
            inset: 0 0 45px 0;
            box-shadow: inset 0 0 0 4px rgba(196, 175, 140, 0.9);
          }
          100% {
            inset: 0 45px 45px 0;
            box-shadow: inset 0 0 0 4px rgba(222, 203, 164, 0.9);
          }
        }
        .animate-lumaAnim {
          animation: lumaAnim 3s infinite ease-in-out;
        }
        .animation-delay {
          animation-delay: -1.5s;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-1 {
          animation: bounce 1.4s infinite ease-in-out;
        }
        .animate-bounce-2 {
          animation: bounce 1.4s infinite ease-in-out 0.2s;
        }
        .animate-bounce-3 {
          animation: bounce 1.4s infinite ease-in-out 0.4s;
        }
      `}</style>
    </div>
  )
}

export function PremiumWaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('personal')
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')
  const [waitlistPosition, setWaitlistPosition] = useState<number>(0)
  const [isInitialLoading, setIsInitialLoading] = useState(false)
  const supabase = createClient()
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle initial loading animation when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsInitialLoading(true)
      const timer = setTimeout(() => {
        setIsInitialLoading(false)
      }, 3000) // 3 seconds

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleClose = () => {
    setCurrentStep('personal')
    setFormData(initialFormData)
    setError('')
    setWaitlistPosition(0)
    setIsInitialLoading(false)
    onClose()
  }

  const handleNext = () => {
    if (currentStep === 'personal') {
      if (!formData.name || !formData.email || !formData.phone || !formData.gender || !formData.age) {
        setError('Please fill in all required fields')
        return
      }
      if (parseInt(formData.age) < 18 || parseInt(formData.age) > 99) {
        setError('Age must be between 18 and 99')
        return
      }
      setError('')
      setCurrentStep('social')
    } else if (currentStep === 'social') {
      if (!formData.instagram) {
        setError('Instagram handle is required')
        return
      }
      setError('')
      setCurrentStep('confirmation')
    }
  }

  const handleBack = () => {
    if (currentStep === 'social') {
      setCurrentStep('personal')
    } else if (currentStep === 'confirmation') {
      setCurrentStep('social')
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      // First get current waitlist count
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
        
        if (supabaseError.code === '42501' || supabaseError.message?.includes('row-level security')) {
          throw new Error('Permission denied. Please check your database security settings.')
        }
        
        if (supabaseError.code === '42703' || supabaseError.message?.includes('column') || supabaseError.message?.includes('does not exist')) {
          const { error: fallbackError } = await supabase
            .from('waitlist')
            .insert([{
              email: formData.email,
              created_at: new Date()
            }])
            .select()
          
          if (fallbackError) {
            if (fallbackError.code === '42501' || fallbackError.message?.includes('row-level security')) {
              throw new Error('Database security configuration needs to be updated. Please contact support.')
            }
            throw new Error('Failed to submit application. Please try again.')
          }
        } else {
          throw new Error(`Database error (${supabaseError.code}): ${supabaseError.message}`)
        }
      }

      // Set waitlist position (current count + 1 for the new entry)
      setWaitlistPosition((count || 0) + 1)
      setCurrentStep('success')
    } catch (error) {
      console.error('Form submission error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4`}>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[rgba(30,25,20,0.3)] backdrop-blur-2xl"
        onClick={handleClose}
      />

      {/* Modal */}
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.85, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 60 }}
        transition={{ type: "spring", stiffness: 250, damping: 30, duration: 0.6 }}
        className="relative bg-white/8 backdrop-blur-3xl border border-white/15 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}
      >
        {/* Loading Screen */}
        <AnimatePresence mode="wait">
          {isInitialLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center p-20 text-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-8"
              >
                <PurpleLumaSpinner />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex items-center gap-1 text-xl font-light text-white tracking-wide"
              >
                <span>Entering June</span>
                <span className="animate-bounce-1">.</span>
                <span className="animate-bounce-2">.</span>
                <span className="animate-bounce-3">.</span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border-b border-white/10 p-6 text-center">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/8 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-500 flex items-center justify-center text-white/90 text-lg font-extralight hover:rotate-90"
                >
                  ×
                </button>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="space-y-2"
                >
                  <h2 className="text-2xl font-light text-white tracking-wider">Join June</h2>
                  <p className="text-white/70 font-light text-sm tracking-wide">Find your perfect match</p>
                </motion.div>
              </div>

              {/* Progress Indicator */}
              <div className="px-6 py-4">
                <div className="flex justify-between text-xs text-white/60 mb-3 font-medium tracking-wider uppercase">
                  <span className={`transition-all duration-300 ${currentStep === 'personal' ? 'text-white font-semibold' : ''}`}>
                    Personal
                  </span>
                  <span className={`transition-all duration-300 ${currentStep === 'social' ? 'text-white font-semibold' : ''}`}>
                    Social
                  </span>
                  <span className={`transition-all duration-300 ${currentStep === 'confirmation' ? 'text-white font-semibold' : ''}`}>
                    Review
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 h-1.5 rounded-full shadow-lg"
                    initial={{ width: '33%' }}
                    animate={{
                      width: currentStep === 'personal' ? '33%' :
                             currentStep === 'social' ? '66%' : '100%'
                    }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </div>
              </div>

              {/* Form Content */}
              <div className="px-6 pb-6">
                <AnimatePresence mode="wait">
                  {currentStep === 'personal' && (
                    <motion.div
                      key="personal"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-white/90 tracking-wider uppercase">Full Name *</label>
                        <motion.input
                          whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
                          type="text"
                          value={formData.name}
                          onChange={(e) => updateFormData('name', e.target.value)}
                          className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 transition-all duration-500 font-light text-sm"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-white/90 tracking-wider uppercase">Email Address *</label>
                        <motion.input
                          whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 transition-all duration-500 font-light text-sm"
                          placeholder="Enter your email address"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-white/90 tracking-wider uppercase">Phone Number *</label>
                        <div className="flex gap-2">
                          <motion.select
                            whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
                            value={formData.countryCode}
                            onChange={(e) => updateFormData('countryCode', e.target.value)}
                            className="w-20 px-3 py-3 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl text-white focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 transition-all duration-500 font-light text-sm appearance-none cursor-pointer"
                            style={{ backgroundImage: 'none' }}
                          >
                            {countryOptions.map((option, index) => (
                              <option key={index} value={option.code} className="bg-black text-white">
                                {option.code}
                              </option>
                            ))}
                          </motion.select>
                          <motion.input
                            whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateFormData('phone', e.target.value)}
                            className="flex-1 px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 transition-all duration-500 font-light text-sm"
                            placeholder="123 456 7890"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-white/90 tracking-wider uppercase">Gender *</label>
                          <motion.select
                            whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
                            value={formData.gender}
                            onChange={(e) => updateFormData('gender', e.target.value)}
                            className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl text-white focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 transition-all duration-500 font-light text-sm"
                          >
                            <option value="" className="bg-black text-white">Select</option>
                            <option value="Male" className="bg-black text-white">Male</option>
                            <option value="Female" className="bg-black text-white">Female</option>
                            <option value="Other" className="bg-black text-white">Other</option>
                          </motion.select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-white/90 tracking-wider uppercase">Age *</label>
                          <motion.input
                            whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
                            type="number"
                            min="18"
                            max="99"
                            value={formData.age}
                            onChange={(e) => updateFormData('age', e.target.value)}
                            className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 transition-all duration-500 font-light text-sm"
                            placeholder="25"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 'social' && (
                    <motion.div
                      key="social"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-white/90 tracking-wider uppercase">Instagram Handle *</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-medium text-sm">@</span>
                          <motion.input
                            whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
                            type="text"
                            value={formData.instagram}
                            onChange={(e) => updateFormData('instagram', e.target.value)}
                            className="w-full pl-8 pr-4 py-3 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 transition-all duration-500 font-light text-sm"
                            placeholder="yourusername"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-white/90 tracking-wider uppercase">LinkedIn Profile (Optional)</label>
                        <motion.input
                          whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
                          type="url"
                          value={formData.linkedin}
                          onChange={(e) => updateFormData('linkedin', e.target.value)}
                          className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 transition-all duration-500 font-light text-sm"
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-white/90 tracking-wider uppercase">X (Twitter) Handle (Optional)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-medium text-sm">@</span>
                          <motion.input
                            whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
                            type="text"
                            value={formData.twitter}
                            onChange={(e) => updateFormData('twitter', e.target.value)}
                            className="w-full pl-8 pr-4 py-3 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 transition-all duration-500 font-light text-sm"
                            placeholder="yourusername"
                          />
                        </div>
                      </div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mt-4"
                      >
                        <p className="text-xs text-white/80 font-light leading-relaxed text-center">
                          <strong className="text-white font-medium">Why we ask:</strong> Your social presence helps our AI create better matches and ensures authentic connections.
                        </p>
                      </motion.div>
                    </motion.div>
                  )}

                  {currentStep === 'confirmation' && (
                    <motion.div
                      key="confirmation"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-light text-white mb-4 text-center tracking-wide">Review Your Application</h3>
                      
                      <div className="space-y-3 text-sm bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                        <div className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-b-0">
                          <span className="text-white/60 font-medium tracking-wide">Name</span>
                          <span className="text-white font-medium">{formData.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-b-0">
                          <span className="text-white/60 font-medium tracking-wide">Email</span>
                          <span className="text-white font-medium text-xs">{formData.email}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-b-0">
                          <span className="text-white/60 font-medium tracking-wide">Phone</span>
                          <span className="text-white font-medium">{formData.countryCode}{formData.phone}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-b-0">
                          <span className="text-white/60 font-medium tracking-wide">Gender & Age</span>
                          <span className="text-white font-medium">{formData.gender}, {formData.age}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-b-0">
                          <span className="text-white/60 font-medium tracking-wide">Instagram</span>
                          <span className="text-white font-medium">@{formData.instagram}</span>
                        </div>
                        {formData.linkedin && (
                          <div className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-b-0">
                            <span className="text-white/60 font-medium tracking-wide">LinkedIn</span>
                            <span className="text-white font-medium truncate max-w-32 text-xs">{formData.linkedin}</span>
                          </div>
                        )}
                        {formData.twitter && (
                          <div className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-b-0">
                            <span className="text-white/60 font-medium tracking-wide">X (Twitter)</span>
                            <span className="text-white font-medium">@{formData.twitter}</span>
                          </div>
                        )}
                      </div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-sm border border-white/10 rounded-2xl p-4"
                      >
                        <p className="text-xs text-white/80 font-light leading-relaxed text-center">
                          <strong className="text-white font-medium">What happens next?</strong> You'll receive your exclusive access code via email when your batch is ready.
                        </p>
                      </motion.div>
                    </motion.div>
                  )}

                  {currentStep === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 150, damping: 25, duration: 0.6 }}
                      className="text-center py-6"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200, duration: 0.6 }}
                        className="mb-4"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto flex items-center justify-center text-2xl font-light text-white shadow-2xl">
                          ✓
                        </div>
                      </motion.div>
                      
                      <motion.h3 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="text-xl font-light text-white mb-2 tracking-wide"
                      >
                        Congratulations!
                      </motion.h3>
                      
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="text-white/90 mb-6 font-light text-sm tracking-wide"
                      >
                        You are <span className="font-medium text-white">#{waitlistPosition}</span> on the waitlist
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="mb-6"
                      >
                        <Image
                          src="/images/purpledate.jpeg"
                          alt="June"
                          width={160}
                          height={160}
                          className="rounded-2xl mx-auto shadow-2xl border border-white/20"
                        />
                      </motion.div>
                      
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.6 }}
                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClose}
                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white px-6 py-3 rounded-2xl font-medium border border-white/20 hover:shadow-2xl transition-all duration-500 text-sm tracking-wide"
                      >
                        Close
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-500/15 backdrop-blur-sm border border-red-400/25 rounded-2xl text-xs text-red-200 text-center"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Action Buttons */}
                {currentStep !== 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex gap-3 mt-6"
                  >
                    {currentStep !== 'personal' && (
                      <motion.button
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBack}
                        className="px-5 py-3 bg-white/8 backdrop-blur-sm border border-white/20 rounded-2xl text-white hover:bg-white/15 transition-all duration-500 font-medium text-sm tracking-wide"
                      >
                        Back
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                      onClick={currentStep === 'confirmation' ? handleSubmit : handleNext}
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white px-5 py-3 rounded-2xl font-medium border border-white/20 hover:shadow-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : currentStep === 'confirmation' ? (
                        'Submit Application'
                      ) : (
                        'Continue'
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
} 