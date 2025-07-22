'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  name: string
  email: string
  phone: string
  gender: string
  age: string
  instagram: string
  linkedin: string
  twitter: string
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '+1',
  gender: '',
  age: '',
  instagram: '@',
  linkedin: '',
  twitter: '@'
}

type Step = 'personal' | 'social' | 'confirmation' | 'success'

export function PremiumWaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('personal')
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')
  const supabase = createClient()
  const modalRef = useRef<HTMLDivElement>(null)

  const handleClose = () => {
    setCurrentStep('personal')
    setFormData(initialFormData)
    setError('')
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
      if (!formData.instagram || formData.instagram === '@') {
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
      // Prepare the data object with all fields
      const submissionData = {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        age: parseInt(formData.age),
        instagram: formData.instagram,
        linkedin: formData.linkedin || null,
        twitter: formData.twitter === '@' ? null : formData.twitter,
        created_at: new Date()
      }

      console.log('Submitting data:', submissionData)

      const { data, error: supabaseError } = await supabase
        .from('waitlist')
        .insert([submissionData])
        .select()

      if (supabaseError) {
        console.error('Supabase error details:', supabaseError)
        
        if (supabaseError.code === '23505') {
          throw new Error('This email is already on the waitlist!')
        }
        
        // Handle RLS policy violations
        if (supabaseError.code === '42501' || supabaseError.message?.includes('row-level security')) {
          throw new Error('Permission denied. Please check your database security settings.')
        }
        
        // If columns don't exist, fall back to simple email insert
        if (supabaseError.code === '42703' || supabaseError.message?.includes('column') || supabaseError.message?.includes('does not exist')) {
          console.log('New columns not found, falling back to email-only submission')
          
          const { error: fallbackError } = await supabase
            .from('waitlist')
            .insert([{
              email: formData.email,
              created_at: new Date()
            }])
            .select()
          
          if (fallbackError) {
            console.error('Fallback error:', fallbackError)
            if (fallbackError.code === '42501' || fallbackError.message?.includes('row-level security')) {
              throw new Error('Database security configuration needs to be updated. Please contact support.')
            }
            throw new Error('Failed to submit application. Please try again.')
          }
        } else {
          throw new Error(`Database error (${supabaseError.code}): ${supabaseError.message}`)
        }
      }

      console.log('Submission successful:', data)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-lg border-b border-white/10 p-6 text-white">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-xl font-bold">Join June</h2>
          </div>
          <p className="text-sm opacity-90">Find your perfect match</p>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-slate-2">
          <div className="flex justify-between text-xs text-slate-10 mb-2">
            <span className={currentStep === 'personal' ? 'text-purple-600 font-medium' : ''}>
              Personal Info
            </span>
            <span className={currentStep === 'social' ? 'text-purple-600 font-medium' : ''}>
              Social Presence
            </span>
            <span className={currentStep === 'confirmation' ? 'text-purple-600 font-medium' : ''}>
              Review
            </span>
          </div>
          <div className="w-full bg-slate-6 rounded-full h-1">
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-1 rounded-full"
              initial={{ width: '33%' }}
              animate={{
                width: currentStep === 'personal' ? '33%' :
                       currentStep === 'social' ? '66%' : '100%'
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {currentStep === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => updateFormData('gender', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    >
                      <option value="" className="bg-slate-800 text-white">Select</option>
                      <option value="Male" className="bg-slate-800 text-white">Male</option>
                      <option value="Female" className="bg-slate-800 text-white">Female</option>
                      <option value="Other" className="bg-slate-800 text-white">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">Age *</label>
                    <input
                      type="number"
                      min="18"
                      max="99"
                      value={formData.age}
                      onChange={(e) => updateFormData('age', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                      placeholder="25"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 'social' && (
              <motion.div
                key="social"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">Instagram Handle *</label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => updateFormData('instagram', e.target.value.startsWith('@') ? e.target.value : '@' + e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    placeholder="@yourusername"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">LinkedIn Profile (Optional)</label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => updateFormData('linkedin', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">X (Twitter) Handle (Optional)</label>
                  <input
                    type="text"
                    value={formData.twitter}
                    onChange={(e) => updateFormData('twitter', e.target.value.startsWith('@') ? e.target.value : '@' + e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    placeholder="@yourusername"
                  />
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                  <p className="text-sm text-white/90 drop-shadow-sm">
                    <strong className="text-white">Why we ask:</strong> Your social presence helps our AI create better matches and ensures authentic connections.
                  </p>
                </div>
              </motion.div>
            )}

            {currentStep === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white mb-4 drop-shadow-sm">Review Your Application</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Name:</span>
                    <span className="text-white font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Email:</span>
                    <span className="text-white font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Phone:</span>
                    <span className="text-white font-medium">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Gender & Age:</span>
                    <span className="text-white font-medium">{formData.gender}, {formData.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Instagram:</span>
                    <span className="text-white font-medium">{formData.instagram}</span>
                  </div>
                  {formData.linkedin && (
                    <div className="flex justify-between">
                      <span className="text-white/70">LinkedIn:</span>
                      <span className="text-white font-medium truncate max-w-48">{formData.linkedin}</span>
                    </div>
                  )}
                  {formData.twitter && formData.twitter !== '@' && (
                    <div className="flex justify-between">
                      <span className="text-white/70">X (Twitter):</span>
                      <span className="text-white font-medium">{formData.twitter}</span>
                    </div>
                  )}
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 mt-6">
                  <p className="text-sm text-white/90 drop-shadow-sm">
                    <strong className="text-white">What happens next?</strong> You'll receive your access code via email when your batch is ready. 
                    Earlier applications get priority access!
                  </p>
                </div>
              </motion.div>
            )}

            {currentStep === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-sm">Application Received! 🎉</h3>
                <p className="text-white/90 mb-6 drop-shadow-sm">
                  Welcome to June. We'll email you when your batch is ready!
                </p>
                
                <button
                  onClick={handleClose}
                  className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-lg text-white px-6 py-3 rounded-lg font-medium border border-white/10 hover:shadow-lg transition-all"
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-lg text-sm text-red-200"
            >
              {error}
            </motion.div>
          )}

          {/* Action Buttons */}
          {currentStep !== 'success' && (
            <div className="flex gap-3 mt-6">
              {currentStep !== 'personal' && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white/90 hover:bg-white/15 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              
              <button
                onClick={currentStep === 'confirmation' ? handleSubmit : handleNext}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-lg text-white px-4 py-3 rounded-lg font-medium border border-white/10 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : currentStep === 'confirmation' ? (
                  'Submit Application'
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
} 