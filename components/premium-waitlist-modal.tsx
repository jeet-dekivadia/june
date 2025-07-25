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

// Comprehensive list of 150+ country codes with names
const countryOptions = [
  { code: '+1', name: 'United States / Canada' },
  { code: '+7', name: 'Russia / Kazakhstan' },
  { code: '+20', name: 'Egypt' },
  { code: '+27', name: 'South Africa' },
  { code: '+30', name: 'Greece' },
  { code: '+31', name: 'Netherlands' },
  { code: '+32', name: 'Belgium' },
  { code: '+33', name: 'France' },
  { code: '+34', name: 'Spain' },
  { code: '+36', name: 'Hungary' },
  { code: '+39', name: 'Italy' },
  { code: '+40', name: 'Romania' },
  { code: '+41', name: 'Switzerland' },
  { code: '+43', name: 'Austria' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+45', name: 'Denmark' },
  { code: '+46', name: 'Sweden' },
  { code: '+47', name: 'Norway' },
  { code: '+48', name: 'Poland' },
  { code: '+49', name: 'Germany' },
  { code: '+51', name: 'Peru' },
  { code: '+52', name: 'Mexico' },
  { code: '+53', name: 'Cuba' },
  { code: '+54', name: 'Argentina' },
  { code: '+55', name: 'Brazil' },
  { code: '+56', name: 'Chile' },
  { code: '+57', name: 'Colombia' },
  { code: '+58', name: 'Venezuela' },
  { code: '+60', name: 'Malaysia' },
  { code: '+61', name: 'Australia' },
  { code: '+62', name: 'Indonesia' },
  { code: '+63', name: 'Philippines' },
  { code: '+64', name: 'New Zealand' },
  { code: '+65', name: 'Singapore' },
  { code: '+66', name: 'Thailand' },
  { code: '+81', name: 'Japan' },
  { code: '+82', name: 'South Korea' },
  { code: '+84', name: 'Vietnam' },
  { code: '+86', name: 'China' },
  { code: '+90', name: 'Turkey' },
  { code: '+91', name: 'India' },
  { code: '+92', name: 'Pakistan' },
  { code: '+93', name: 'Afghanistan' },
  { code: '+94', name: 'Sri Lanka' },
  { code: '+95', name: 'Myanmar' },
  { code: '+98', name: 'Iran' },
  { code: '+212', name: 'Morocco' },
  { code: '+213', name: 'Algeria' },
  { code: '+216', name: 'Tunisia' },
  { code: '+218', name: 'Libya' },
  { code: '+220', name: 'Gambia' },
  { code: '+221', name: 'Senegal' },
  { code: '+222', name: 'Mauritania' },
  { code: '+223', name: 'Mali' },
  { code: '+224', name: 'Guinea' },
  { code: '+225', name: 'Ivory Coast' },
  { code: '+226', name: 'Burkina Faso' },
  { code: '+227', name: 'Niger' },
  { code: '+228', name: 'Togo' },
  { code: '+229', name: 'Benin' },
  { code: '+230', name: 'Mauritius' },
  { code: '+231', name: 'Liberia' },
  { code: '+232', name: 'Sierra Leone' },
  { code: '+233', name: 'Ghana' },
  { code: '+234', name: 'Nigeria' },
  { code: '+235', name: 'Chad' },
  { code: '+236', name: 'Central African Republic' },
  { code: '+237', name: 'Cameroon' },
  { code: '+238', name: 'Cape Verde' },
  { code: '+239', name: 'São Tomé and Príncipe' },
  { code: '+240', name: 'Equatorial Guinea' },
  { code: '+241', name: 'Gabon' },
  { code: '+242', name: 'Republic of the Congo' },
  { code: '+243', name: 'Democratic Republic of the Congo' },
  { code: '+244', name: 'Angola' },
  { code: '+245', name: 'Guinea-Bissau' },
  { code: '+246', name: 'British Indian Ocean Territory' },
  { code: '+248', name: 'Seychelles' },
  { code: '+249', name: 'Sudan' },
  { code: '+250', name: 'Rwanda' },
  { code: '+251', name: 'Ethiopia' },
  { code: '+252', name: 'Somalia' },
  { code: '+253', name: 'Djibouti' },
  { code: '+254', name: 'Kenya' },
  { code: '+255', name: 'Tanzania' },
  { code: '+256', name: 'Uganda' },
  { code: '+257', name: 'Burundi' },
  { code: '+258', name: 'Mozambique' },
  { code: '+260', name: 'Zambia' },
  { code: '+261', name: 'Madagascar' },
  { code: '+262', name: 'Réunion' },
  { code: '+263', name: 'Zimbabwe' },
  { code: '+264', name: 'Namibia' },
  { code: '+265', name: 'Malawi' },
  { code: '+266', name: 'Lesotho' },
  { code: '+267', name: 'Botswana' },
  { code: '+268', name: 'Eswatini' },
  { code: '+269', name: 'Comoros' },
  { code: '+290', name: 'Saint Helena' },
  { code: '+291', name: 'Eritrea' },
  { code: '+297', name: 'Aruba' },
  { code: '+298', name: 'Faroe Islands' },
  { code: '+299', name: 'Greenland' },
  { code: '+350', name: 'Gibraltar' },
  { code: '+351', name: 'Portugal' },
  { code: '+352', name: 'Luxembourg' },
  { code: '+353', name: 'Ireland' },
  { code: '+354', name: 'Iceland' },
  { code: '+355', name: 'Albania' },
  { code: '+356', name: 'Malta' },
  { code: '+357', name: 'Cyprus' },
  { code: '+358', name: 'Finland' },
  { code: '+359', name: 'Bulgaria' },
  { code: '+370', name: 'Lithuania' },
  { code: '+371', name: 'Latvia' },
  { code: '+372', name: 'Estonia' },
  { code: '+373', name: 'Moldova' },
  { code: '+374', name: 'Armenia' },
  { code: '+375', name: 'Belarus' },
  { code: '+376', name: 'Andorra' },
  { code: '+377', name: 'Monaco' },
  { code: '+378', name: 'San Marino' },
  { code: '+380', name: 'Ukraine' },
  { code: '+381', name: 'Serbia' },
  { code: '+382', name: 'Montenegro' },
  { code: '+383', name: 'Kosovo' },
  { code: '+385', name: 'Croatia' },
  { code: '+386', name: 'Slovenia' },
  { code: '+387', name: 'Bosnia and Herzegovina' },
  { code: '+389', name: 'North Macedonia' },
  { code: '+420', name: 'Czech Republic' },
  { code: '+421', name: 'Slovakia' },
  { code: '+423', name: 'Liechtenstein' },
  { code: '+500', name: 'Falkland Islands' },
  { code: '+501', name: 'Belize' },
  { code: '+502', name: 'Guatemala' },
  { code: '+503', name: 'El Salvador' },
  { code: '+504', name: 'Honduras' },
  { code: '+505', name: 'Nicaragua' },
  { code: '+506', name: 'Costa Rica' },
  { code: '+507', name: 'Panama' },
  { code: '+508', name: 'Saint Pierre and Miquelon' },
  { code: '+509', name: 'Haiti' },
  { code: '+590', name: 'Guadeloupe' },
  { code: '+591', name: 'Bolivia' },
  { code: '+592', name: 'Guyana' },
  { code: '+593', name: 'Ecuador' },
  { code: '+594', name: 'French Guiana' },
  { code: '+595', name: 'Paraguay' },
  { code: '+596', name: 'Martinique' },
  { code: '+597', name: 'Suriname' },
  { code: '+598', name: 'Uruguay' },
  { code: '+599', name: 'Curaçao' },
  { code: '+670', name: 'East Timor' },
  { code: '+672', name: 'Antarctica' },
  { code: '+673', name: 'Brunei' },
  { code: '+674', name: 'Nauru' },
  { code: '+675', name: 'Papua New Guinea' },
  { code: '+676', name: 'Tonga' },
  { code: '+677', name: 'Solomon Islands' },
  { code: '+678', name: 'Vanuatu' },
  { code: '+679', name: 'Fiji' },
  { code: '+680', name: 'Palau' },
  { code: '+681', name: 'Wallis and Futuna' },
  { code: '+682', name: 'Cook Islands' },
  { code: '+683', name: 'Niue' },
  { code: '+684', name: 'American Samoa' },
  { code: '+685', name: 'Samoa' },
  { code: '+686', name: 'Kiribati' },
  { code: '+687', name: 'New Caledonia' },
  { code: '+688', name: 'Tuvalu' },
  { code: '+689', name: 'French Polynesia' },
  { code: '+690', name: 'Tokelau' },
  { code: '+691', name: 'Micronesia' },
  { code: '+692', name: 'Marshall Islands' },
  { code: '+850', name: 'North Korea' },
  { code: '+852', name: 'Hong Kong' },
  { code: '+853', name: 'Macau' },
  { code: '+855', name: 'Cambodia' },
  { code: '+856', name: 'Laos' },
  { code: '+880', name: 'Bangladesh' },
  { code: '+886', name: 'Taiwan' },
  { code: '+960', name: 'Maldives' },
  { code: '+961', name: 'Lebanon' },
  { code: '+962', name: 'Jordan' },
  { code: '+963', name: 'Syria' },
  { code: '+964', name: 'Iraq' },
  { code: '+965', name: 'Kuwait' },
  { code: '+966', name: 'Saudi Arabia' },
  { code: '+967', name: 'Yemen' },
  { code: '+968', name: 'Oman' },
  { code: '+970', name: 'Palestine' },
  { code: '+971', name: 'United Arab Emirates' },
  { code: '+972', name: 'Israel' },
  { code: '+973', name: 'Bahrain' },
  { code: '+974', name: 'Qatar' },
  { code: '+975', name: 'Bhutan' },
  { code: '+976', name: 'Mongolia' },
  { code: '+977', name: 'Nepal' },
  { code: '+992', name: 'Tajikistan' },
  { code: '+993', name: 'Turkmenistan' },
  { code: '+994', name: 'Azerbaijan' },
  { code: '+995', name: 'Georgia' },
  { code: '+996', name: 'Kyrgyzstan' },
  { code: '+998', name: 'Uzbekistan' }
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
          animation: lumaAnim 1.5s infinite ease-in-out;
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

// Enhanced Progress Circles Component
const ProgressCircles = ({ currentStep }: { currentStep: Step }) => {
  const steps = ['personal', 'social', 'confirmation']
  const currentIndex = steps.indexOf(currentStep)

  return (
    <div className="flex justify-center items-center gap-6 px-6 py-4">
      {[1, 2, 3].map((step, index) => {
        const isActive = index <= currentIndex
        const isCurrent = index === currentIndex
        
        return (
          <motion.div
            key={step}
            className={`relative w-12 h-12 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-500 ${
              isCurrent 
                ? 'bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-xl border-2 border-white/30 text-white shadow-2xl scale-110' 
                : isActive
                ? 'bg-white/15 backdrop-blur-sm border border-white/20 text-white/90'
                : 'bg-white/8 backdrop-blur-sm border border-white/10 text-white/60'
            }`}
            animate={{
              scale: isCurrent ? 1.1 : 1,
              boxShadow: isCurrent ? '0 0 30px rgba(255, 255, 255, 0.3)' : '0 0 0px rgba(255, 255, 255, 0)'
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {step}
            {isCurrent && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/20 via-pink-400/10 to-rose-400/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            )}
          </motion.div>
        )
      })}
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
  const [countryCodeInput, setCountryCodeInput] = useState('1')
  const supabase = createClient()
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle initial loading animation when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsInitialLoading(true)
      const timer = setTimeout(() => {
        setIsInitialLoading(false)
      }, 1000) // 1 second loading time

      return () => clearTimeout(timer)
    }
  }, [isOpen])



  const handleClose = () => {
    setCurrentStep('personal')
    setFormData(initialFormData)
    setError('')
    setWaitlistPosition(0)
    setIsInitialLoading(false)
    setCountryCodeInput('1')
    onClose()
  }

  // Enhanced validation functions
  const validateName = (name: string) => {
    return /^[a-zA-Z\s]+$/.test(name) // Only letters and spaces
  }

  const validateEmail = (email: string) => {
    return email.includes('@') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const checkEmailExists = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('email')
        .eq('email', email)
        .limit(1)

      if (error) throw error
      return data && data.length > 0
    } catch (error) {
      console.error('Error checking email:', error)
      return false
    }
  }

  const validatePhone = (phone: string) => {
    return /^[0-9\s\(\)\-]+$/.test(phone) // Only numbers, spaces, parentheses, and hyphens
  }

  const formatSocialUrl = (platform: string, value: string) => {
    if (!value) return ''
    
    // If already a full URL, return as is
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value
    }
    
    // Remove @ if present at the start
    const cleanValue = value.startsWith('@') ? value.slice(1) : value
    
    switch (platform) {
      case 'instagram':
        return `https://instagram.com/${cleanValue}`
      case 'linkedin':
        return value.includes('linkedin.com') ? value : `https://linkedin.com/in/${cleanValue}`
      case 'twitter':
        return `https://twitter.com/${cleanValue}`
      default:
        return value
    }
  }

  const extractUsername = (platform: string, value: string) => {
    if (!value) return ''
    
    // If it's already just a username (no URL), return it with @
    if (!value.includes('http') && !value.includes('.com')) {
      return value.startsWith('@') ? value : `@${value}`
    }
    
    // Extract username from URL
    try {
      const url = new URL(value.startsWith('http') ? value : `https://${value}`)
      const pathname = url.pathname
      
      switch (platform) {
        case 'instagram':
          const igMatch = pathname.match(/\/([^\/]+)\/?$/)
          return igMatch ? `@${igMatch[1]}` : value
        case 'linkedin':
          const liMatch = pathname.match(/\/in\/([^\/]+)\/?$/) || pathname.match(/\/([^\/]+)\/?$/)
          return liMatch ? `@${liMatch[1]}` : value
        case 'twitter':
          const twMatch = pathname.match(/\/([^\/]+)\/?$/)
          return twMatch ? `@${twMatch[1]}` : value
        default:
          return value
      }
    } catch {
      return value
    }
  }

  const handleNext = async () => {
    if (currentStep === 'personal') {
      if (!formData.name || !formData.email || !formData.phone || !formData.gender || !formData.age) {
        setError('Please fill in all required fields')
        return
      }
      
      if (!validateName(formData.name)) {
        setError('Name can only contain letters and spaces')
        return
      }
      
      if (!validateEmail(formData.email)) {
        setError('Please enter a valid email address')
        return
      }
      
      // Check if email already exists
      const emailExists = await checkEmailExists(formData.email)
      if (emailExists) {
        setError('This email is already on the waitlist!')
        return
      }
      
      if (!validatePhone(formData.phone)) {
        setError('Phone number can only contain numbers, spaces, parentheses, and hyphens')
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
        phone: `${formData.countryCode} ${formData.phone}`,
        gender: formData.gender,
        age: parseInt(formData.age),
        instagram: formatSocialUrl('instagram', formData.instagram),
        linkedin: formData.linkedin ? formatSocialUrl('linkedin', formData.linkedin) : null,
        twitter: formData.twitter ? formatSocialUrl('twitter', formData.twitter) : null,
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
        className="relative bg-white/8 backdrop-blur-3xl border border-white/15 rounded-3xl shadow-2xl w-[90%] max-w-[90%] md:w-full md:max-w-md overflow-hidden"
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
                transition={{ delay: 1.2, duration: 0.6 }}
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
                  <h2 className="text-2xl font-light text-white tracking-wider">Apply to June</h2>
                </motion.div>
              </div>

              {/* Enhanced Progress Circles */}
              <ProgressCircles currentStep={currentStep} />

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
                          onChange={(e) => {
                            const value = e.target.value
                            if (validateName(value) || value === '') {
                              updateFormData('name', value)
                            }
                          }}
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
                          placeholder="tryjune.dating@gmail.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-white/90 tracking-wider uppercase">Phone Number *</label>
                        <div className="flex gap-2">
                          <motion.input
                            whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
                            type="text"
                            value={`+${countryCodeInput}`}
                            onChange={(e) => {
                              const value = e.target.value.replace(/^\+/, '') // Remove + if user types it
                              if (/^\d*$/.test(value)) { // Only allow digits
                                setCountryCodeInput(value)
                                updateFormData('countryCode', `+${value}`)
                              }
                            }}
                            className="w-20 px-3 py-3 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 transition-all duration-500 font-light text-sm"
                            placeholder="+1"
                          />
                          <motion.input
                            whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => {
                              const value = e.target.value
                              if (validatePhone(value) || value === '') {
                                updateFormData('phone', value)
                              }
                            }}
                            className="flex-1 px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 transition-all duration-500 font-light text-sm"
                            placeholder="(123) 456-7890"
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
                            className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl text-white focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 transition-all duration-500 font-light text-sm appearance-none"
                            style={{ backgroundImage: 'none' }}
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
                            min="16"
                            max="120"
                            value={formData.age}
                            onChange={(e) => updateFormData('age', e.target.value)}
                            className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 transition-all duration-500 font-light text-sm"
                            placeholder="27"
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
                        <motion.input
                          whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
                          type="text"
                          value={formData.instagram}
                          onChange={(e) => updateFormData('instagram', e.target.value)}
                          className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 transition-all duration-500 font-light text-sm"
                          placeholder="@yourusername or full profile URL"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-white/90 tracking-wider uppercase">LinkedIn Profile (Optional)</label>
                        <motion.input
                          whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
                          type="text"
                          value={formData.linkedin}
                          onChange={(e) => updateFormData('linkedin', e.target.value)}
                          className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 transition-all duration-500 font-light text-sm"
                          placeholder="username or full profile URL"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-white/90 tracking-wider uppercase">X (Twitter) Handle (Optional)</label>
                        <motion.input
                          whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
                          type="text"
                          value={formData.twitter}
                          onChange={(e) => updateFormData('twitter', e.target.value)}
                          className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 transition-all duration-500 font-light text-sm"
                          placeholder="@yourusername or full profile URL"
                        />
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
                      
                      <div className="space-y-1 text-sm bg-gradient-to-br from-white/12 to-white/6 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl">
                        <div className="flex justify-between items-center py-3 border-b border-white/15 last:border-b-0">
                          <span className="text-white/70 font-medium tracking-wide text-xs uppercase">Name</span>
                          <span className="text-white font-medium">{formData.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/15 last:border-b-0">
                          <span className="text-white/70 font-medium tracking-wide text-xs uppercase">Email</span>
                          <span className="text-white font-medium text-xs">{formData.email}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/15 last:border-b-0">
                          <span className="text-white/70 font-medium tracking-wide text-xs uppercase">Phone</span>
                          <span className="text-white font-medium">{formData.countryCode} {formData.phone}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/15 last:border-b-0">
                          <span className="text-white/70 font-medium tracking-wide text-xs uppercase">Gender & Age</span>
                          <span className="text-white font-medium">{formData.gender}, {formData.age}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/15 last:border-b-0">
                          <span className="text-white/70 font-medium tracking-wide text-xs uppercase">Instagram</span>
                          <span className="text-white font-medium text-xs truncate max-w-32">{extractUsername('instagram', formData.instagram)}</span>
                        </div>
                        {formData.linkedin && (
                          <div className="flex justify-between items-center py-3 border-b border-white/15 last:border-b-0">
                            <span className="text-white/70 font-medium tracking-wide text-xs uppercase">LinkedIn</span>
                            <span className="text-white font-medium truncate max-w-32 text-xs">{extractUsername('linkedin', formData.linkedin)}</span>
                          </div>
                        )}
                        {formData.twitter && (
                          <div className="flex justify-between items-center py-3 border-b border-white/15 last:border-b-0">
                            <span className="text-white/70 font-medium tracking-wide text-xs uppercase">X (Twitter)</span>
                            <span className="text-white font-medium text-xs truncate max-w-32">{extractUsername('twitter', formData.twitter)}</span>
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
                      <motion.h3 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-2xl font-light text-white mb-2 tracking-wide"
                      >
                        Congratulations!
                      </motion.h3>
                      
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="text-white/90 mb-2 font-light text-sm tracking-wide"
                      >
                        You are <span className="font-medium text-white">#{waitlistPosition + 5000}</span> on the waitlist
                      </motion.p>

                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="text-white/80 mb-6 font-light text-xs tracking-wider"
                      >
                        Be ready to enter the future of dating
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="mb-6"
                      >
                        <Image
                          src="/junelogo.png"
                          alt="June"
                          width={120}
                          height={120}
                          className="mx-auto"
                        />
                      </motion.div>
                      
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.6 }}
                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClose}
                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white px-8 py-3 rounded-2xl font-medium border border-white/20 hover:shadow-2xl transition-all duration-500 text-sm tracking-wide"
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