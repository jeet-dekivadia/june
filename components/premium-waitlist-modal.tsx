'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, ArrowRight, Star, Heart, Users, Zap, Shield, Crown, CheckCircle, MapPin, Navigation, Search, Globe, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  name: string
  phone: string
  countryCode: string
  location: string
  gender: string
  age: string
  instagram: string
  linkedin: string
  twitter: string
}

const initialFormData: FormData = {
  name: '',
  phone: '',
  countryCode: '+',
  location: '',
  gender: '',
  age: '',
  instagram: '',
  linkedin: '',
  twitter: ''
}

type Step = 'personal' | 'social' | 'success'

// Location suggestion interface
interface LocationSuggestion {
  display_name: string
  lat: string
  lon: string
  place_id: number
}

// Debounce hook for API calls - faster for instant search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Popular cities for instant search
const popularCities = [
  'New York City, United States',
  'Los Angeles, United States', 
  'Chicago, United States',
  'Houston, United States',
  'Phoenix, United States',
  'Philadelphia, United States',
  'San Antonio, United States',
  'San Diego, United States',
  'Dallas, United States',
  'San Jose, United States',
  'Austin, United States',
  'Jacksonville, United States',
  'San Francisco, United States',
  'Columbus, United States',
  'Charlotte, United States',
  'Fort Worth, United States',
  'Indianapolis, United States',
  'Seattle, United States',
  'Denver, United States',
  'Boston, United States',
  'El Paso, United States',
  'Nashville, United States',
  'Detroit, United States',
  'Oklahoma City, United States',
  'Portland, United States',
  'Las Vegas, United States',
  'Memphis, United States',
  'Louisville, United States',
  'Baltimore, United States',
  'Milwaukee, United States',
  'Albuquerque, United States',
  'Tucson, United States',
  'Fresno, United States',
  'Sacramento, United States',
  'Mesa, United States',
  'Kansas City, United States',
  'Atlanta, United States',
  'Long Beach, United States',
  'Omaha, United States',
  'Raleigh, United States',
  'Colorado Springs, United States',
  'Miami, United States',
  'Virginia Beach, United States',
  'Oakland, United States',
  'Minneapolis, United States',
  'Tulsa, United States',
  'Arlington, United States',
  'Tampa, United States',
  'New Orleans, United States',
  'Wichita, United States',
  'Cleveland, United States',
  'Bakersfield, United States',
  'Aurora, United States',
  'Anaheim, United States',
  'Honolulu, United States',
  'Santa Ana, United States',
  'Corpus Christi, United States',
  'Riverside, United States',
  'Lexington, United States',
  'Stockton, United States',
  'Henderson, United States',
  'Saint Paul, United States',
  'St. Louis, United States',
  'Cincinnati, United States',
  'Pittsburgh, United States',
  // International cities
  'London, United Kingdom',
  'Paris, France',
  'Berlin, Germany',
  'Madrid, Spain',
  'Rome, Italy',
  'Amsterdam, Netherlands',
  'Barcelona, Spain',
  'Vienna, Austria',
  'Prague, Czech Republic',
  'Budapest, Hungary',
  'Warsaw, Poland',
  'Stockholm, Sweden',
  'Copenhagen, Denmark',
  'Oslo, Norway',
  'Helsinki, Finland',
  'Dublin, Ireland',
  'Brussels, Belgium',
  'Zurich, Switzerland',
  'Geneva, Switzerland',
  'Munich, Germany',
  'Frankfurt, Germany',
  'Hamburg, Germany',
  'Milan, Italy',
  'Naples, Italy',
  'Florence, Italy',
  'Venice, Italy',
  'Lisbon, Portugal',
  'Porto, Portugal',
  'Athens, Greece',
  'Istanbul, Turkey',
  'Moscow, Russia',
  'Saint Petersburg, Russia',
  'Tokyo, Japan',
  'Osaka, Japan',
  'Kyoto, Japan',
  'Seoul, South Korea',
  'Busan, South Korea',
  'Beijing, China',
  'Shanghai, China',
  'Guangzhou, China',
  'Shenzhen, China',
  'Hong Kong, Hong Kong',
  'Macau, Macau',
  'Taipei, Taiwan',
  'Singapore, Singapore',
  'Bangkok, Thailand',
  'Manila, Philippines',
  'Jakarta, Indonesia',
  'Kuala Lumpur, Malaysia',
  'Ho Chi Minh City, Vietnam',
  'Hanoi, Vietnam',
  'Mumbai, India',
  'Delhi, India',
  'Bangalore, India',
  'Chennai, India',
  'Kolkata, India',
  'Hyderabad, India',
  'Pune, India',
  'Ahmedabad, India',
  'Sydney, Australia',
  'Melbourne, Australia',
  'Brisbane, Australia',
  'Perth, Australia',
  'Adelaide, Australia',
  'Auckland, New Zealand',
  'Wellington, New Zealand',
  'Toronto, Canada',
  'Vancouver, Canada',
  'Montreal, Canada',
  'Calgary, Canada',
  'Ottawa, Canada',
  'Edmonton, Canada',
  'Winnipeg, Canada',
  'Quebec City, Canada',
  'Hamilton, Canada',
  'Kitchener, Canada',
  'Mexico City, Mexico',
  'Guadalajara, Mexico',
  'Monterrey, Mexico',
  'Puebla, Mexico',
  'Tijuana, Mexico',
  'León, Mexico',
  'Juárez, Mexico',
  'São Paulo, Brazil',
  'Rio de Janeiro, Brazil',
  'Brasília, Brazil',
  'Salvador, Brazil',
  'Fortaleza, Brazil',
  'Belo Horizonte, Brazil',
  'Manaus, Brazil',
  'Curitiba, Brazil',
  'Recife, Brazil',
  'Porto Alegre, Brazil',
  'Buenos Aires, Argentina',
  'Córdoba, Argentina',
  'Rosario, Argentina',
  'Mendoza, Argentina',
  'La Plata, Argentina',
  'Santiago, Chile',
  'Valparaíso, Chile',
  'Concepción, Chile',
  'Lima, Peru',
  'Arequipa, Peru',
  'Trujillo, Peru',
  'Bogotá, Colombia',
  'Medellín, Colombia',
  'Cali, Colombia',
  'Barranquilla, Colombia',
  'Cartagena, Colombia',
  'Caracas, Venezuela',
  'Maracaibo, Venezuela',
  'Valencia, Venezuela',
  'Quito, Ecuador',
  'Guayaquil, Ecuador',
  'La Paz, Bolivia',
  'Santa Cruz, Bolivia',
  'Asunción, Paraguay',
  'Montevideo, Uruguay',
  'Cape Town, South Africa',
  'Johannesburg, South Africa',
  'Durban, South Africa',
  'Pretoria, South Africa',
  'Port Elizabeth, South Africa',
  'Cairo, Egypt',
  'Alexandria, Egypt',
  'Giza, Egypt',
  'Lagos, Nigeria',
  'Kano, Nigeria',
  'Ibadan, Nigeria',
  'Abuja, Nigeria',
  'Casablanca, Morocco',
  'Rabat, Morocco',
  'Fez, Morocco',
  'Marrakech, Morocco',
  'Algiers, Algeria',
  'Oran, Algeria',
  'Constantine, Algeria',
  'Tunis, Tunisia',
  'Sfax, Tunisia',
  'Sousse, Tunisia',
  'Tripoli, Libya',
  'Benghazi, Libya',
  'Khartoum, Sudan',
  'Omdurman, Sudan',
  'Addis Ababa, Ethiopia',
  'Dire Dawa, Ethiopia',
  'Nairobi, Kenya',
  'Mombasa, Kenya',
  'Kisumu, Kenya',
  'Kampala, Uganda',
  'Entebbe, Uganda',
  'Kigali, Rwanda',
  'Bujumbura, Burundi',
  'Dar es Salaam, Tanzania',
  'Dodoma, Tanzania',
  'Mwanza, Tanzania',
  'Lusaka, Zambia',
  'Ndola, Zambia',
  'Harare, Zimbabwe',
  'Bulawayo, Zimbabwe',
  'Gaborone, Botswana',
  'Francistown, Botswana',
  'Windhoek, Namibia',
  'Swakopmund, Namibia',
  'Maseru, Lesotho',
  'Mbabane, Eswatini',
  'Maputo, Mozambique',
  'Beira, Mozambique',
  'Antananarivo, Madagascar',
  'Toamasina, Madagascar',
  'Port Louis, Mauritius',
  'Victoria, Seychelles'
]

// Cache for API results
const locationCache = new Map<string, LocationSuggestion[]>()

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

// Helper function to extract city and country from location string
const extractCityCountry = (locationString: string): string => {
  if (!locationString) return ''
  
  const parts = locationString.split(',').map(part => part.trim())
  
  // Try to identify city and country from the parts
  if (parts.length >= 2) {
    const city = parts[0]
    const country = parts[parts.length - 1]
    
    // Skip intermediate parts like state/province for cleaner display
    if (city && country && city !== country) {
      return `${city}, ${country}`
    }
  }
  
  // Fallback to first part if parsing fails
  return parts[0] || locationString
}

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
  const [countryCodeInput, setCountryCodeInput] = useState('')
  const [bestLocationMatch, setBestLocationMatch] = useState<LocationSuggestion | null>(null)
  const [fullLocationData, setFullLocationData] = useState<string>('') // Store complete location for geolocation
  const [showLocationSuggestion, setShowLocationSuggestion] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [isLocationSelected, setIsLocationSelected] = useState(false) // Prevent search after selection
  const supabase = createClient()
  const modalRef = useRef<HTMLDivElement>(null)

  // Debounced search term for API calls - ultra fast for better UX
  const debouncedLocationSearch = useDebounce(formData.location, 50)

  // Handle initial loading animation when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsInitialLoading(true)
      const timer = setTimeout(() => {
        setIsInitialLoading(false)
      }, 1200) // 1.2 second loading time

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleClose = () => {
    setCurrentStep('personal')
    setFormData(initialFormData)
    setError('')
    setWaitlistPosition(0)
    setIsInitialLoading(false)
    setCountryCodeInput('')
    setBestLocationMatch(null)
    setFullLocationData('')
    setShowLocationSuggestion(false)
    setIsLoadingLocation(false)
    setIsDetectingLocation(false)
    setIsLocationSelected(false)
    onClose()
  }

  // Ultra-fast location search with instant local results
  const searchBestLocation = useCallback(async (query: string) => {
    if (query.length < 2) {
      setBestLocationMatch(null)
      setShowLocationSuggestion(false)
      return
    }

    // First, do instant local search with smart matching
    const queryLower = query.toLowerCase().trim()
    const localMatches = popularCities.filter(city => {
      const cityLower = city.toLowerCase()
      // Prioritize starts-with matches first, then contains
      return cityLower.startsWith(queryLower) || cityLower.includes(queryLower)
    }).sort((a, b) => {
      const aLower = a.toLowerCase()
      const bLower = b.toLowerCase()
      // Prioritize exact starts-with matches
      const aStarts = aLower.startsWith(queryLower)
      const bStarts = bLower.startsWith(queryLower)
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1
      return a.localeCompare(b)
    })

    if (localMatches.length > 0) {
      // Instantly show best local match
      const bestLocal = localMatches[0]
      const mockLocationSuggestion: LocationSuggestion = {
        display_name: bestLocal,
        lat: '0', // Will be filled by geolocation if needed
        lon: '0',
        place_id: Date.now() // Mock ID
      }
      setBestLocationMatch(mockLocationSuggestion)
      setShowLocationSuggestion(true)
      return
    }

    // Only if no local matches and user typed 3+ chars, do API search
    if (query.length < 3) {
      setBestLocationMatch(null)
      setShowLocationSuggestion(false)
      return
    }

    // Check cache first
    const cacheKey = query.toLowerCase().trim()
    if (locationCache.has(cacheKey)) {
      const cached = locationCache.get(cacheKey)!
      if (cached.length > 0) {
        setBestLocationMatch(cached[0])
        setShowLocationSuggestion(true)
      } else {
        setBestLocationMatch(null)
        setShowLocationSuggestion(false)
      }
      return
    }

    setIsLoadingLocation(true)
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=3&addressdetails=1&accept-language=en`,
        {
          headers: {
            'User-Agent': 'June Dating App'
          }
        }
      )
      
      if (response.ok) {
        const data: LocationSuggestion[] = await response.json()
        
        // Cache the result
        locationCache.set(cacheKey, data)
        
        if (data.length > 0) {
          setBestLocationMatch(data[0])
          setShowLocationSuggestion(true)
        } else {
          setBestLocationMatch(null)
          setShowLocationSuggestion(false)
        }
      }
    } catch (error) {
      console.error('Location search error:', error)
      setBestLocationMatch(null)
      setShowLocationSuggestion(false)
    } finally {
      setIsLoadingLocation(false)
    }
  }, [])

  // Geolocation detection
  const detectCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      return
    }

    setIsDetectingLocation(true)
    setError('')

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes cache
        })
      })

      const { latitude, longitude } = position.coords
      
      // Reverse geocoding to get location name
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en`,
        {
          headers: {
            'User-Agent': 'June Dating App'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        if (data.display_name) {
          // Store full location data for database
          setFullLocationData(data.display_name)
          // Display clean city, country format
          const cleanLocation = extractCityCountry(data.display_name)
          
          // Set selection flag to prevent search from triggering
          setIsLocationSelected(true)
          
          // Clear any existing suggestions
          setShowLocationSuggestion(false)
          setBestLocationMatch(null)
          
          // Update form data last
          updateFormData('location', cleanLocation)
        } else {
          setError('Could not determine your location')
        }
      } else {
        setError('Failed to get location details')
      }
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location services.')
            break
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.')
            break
          case error.TIMEOUT:
            setError('Location request timed out.')
            break
          default:
            setError('An unknown error occurred while getting your location.')
            break
        }
      } else {
        setError('Failed to detect your current location')
      }
    } finally {
      setIsDetectingLocation(false)
    }
  }, [])

  // Trigger search when debounced value changes - now supports 2+ chars
  useEffect(() => {
    // Skip search if location was just selected
    if (isLocationSelected) {
      return
    }
    
    if (debouncedLocationSearch && debouncedLocationSearch.length >= 2) {
      searchBestLocation(debouncedLocationSearch)
    } else {
      setBestLocationMatch(null)
      setShowLocationSuggestion(false)
    }
  }, [debouncedLocationSearch, searchBestLocation, isLocationSelected])

  const handleLocationSearch = (value: string) => {
    updateFormData('location', value)
    // Clear full location data when user manually types
    setFullLocationData('')
    // Reset selection flag when user starts typing
    setIsLocationSelected(false)
    
    // Instant local search for immediate feedback (no debouncing for local results)
    if (value.length >= 2) {
      const queryLower = value.toLowerCase().trim()
      const localMatches = popularCities.filter(city => {
        const cityLower = city.toLowerCase()
        return cityLower.startsWith(queryLower) || cityLower.includes(queryLower)
      }).sort((a, b) => {
        const aLower = a.toLowerCase()
        const bLower = b.toLowerCase()
        const aStarts = aLower.startsWith(queryLower)
        const bStarts = bLower.startsWith(queryLower)
        if (aStarts && !bStarts) return -1
        if (!aStarts && bStarts) return 1
        return a.localeCompare(b)
      })
      
      if (localMatches.length > 0) {
        const bestLocal = localMatches[0]
        const mockLocationSuggestion: LocationSuggestion = {
          display_name: bestLocal,
          lat: '0',
          lon: '0',
          place_id: Date.now()
        }
        setBestLocationMatch(mockLocationSuggestion)
        setShowLocationSuggestion(true)
        return
      }
    }
    
    // Clear suggestion if no local matches
    setBestLocationMatch(null)
    setShowLocationSuggestion(false)
    // The useEffect above will handle the API call via debouncing for non-local searches
  }

  const selectBestLocation = () => {
    if (bestLocationMatch) {
      // Store full location for database if needed
      setFullLocationData(bestLocationMatch.display_name)
      // Display clean city, country format
      const cleanLocation = extractCityCountry(bestLocationMatch.display_name)
      
      // Set selection flag to prevent search from triggering again
      setIsLocationSelected(true)
      
      // Clear suggestion immediately
      setShowLocationSuggestion(false)
      setBestLocationMatch(null)
      
      // Update form data last to prevent triggering search
      updateFormData('location', cleanLocation)
    }
  }

  // Simple keyboard navigation for single suggestion
  const handleLocationKeyDown = (e: React.KeyboardEvent) => {
    if (!showLocationSuggestion) return

    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        selectBestLocation()
        break
      case 'Escape':
        e.preventDefault()
        setShowLocationSuggestion(false)
        break
    }
  }

  // Enhanced validation functions
  const validateName = (name: string) => {
    return /^[a-zA-Z\s]+$/.test(name) // Only letters and spaces
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

  const handleNext = () => {
    if (currentStep === 'personal') {
      if (!formData.name || !formData.phone || !formData.location || !formData.gender || !formData.age) {
        setError('Please fill in all required fields')
        return
      }
      
      if (!validateName(formData.name)) {
        setError('Name can only contain letters and spaces')
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
    }
  }

  const handleBack = () => {
    if (currentStep === 'social') {
      setCurrentStep('personal')
    }
  }

  const handleSubmit = async () => {
    if (!formData.instagram) {
      setError('Instagram handle is required')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // First get current waitlist count
      const { count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })

      // Try with all fields first
      const fullSubmissionData = {
        email: null, // Set email as null as requested
        name: formData.name,
        phone: `${formData.countryCode}${formData.phone.replace(/\s/g, '')}`, // Remove all spaces
        location: fullLocationData || formData.location, // Use full location data if available from geolocation
        gender: formData.gender,
        age: parseInt(formData.age),
        instagram: formatSocialUrl('instagram', formData.instagram),
        linkedin: formData.linkedin ? formatSocialUrl('linkedin', formData.linkedin) : null,
        twitter: formData.twitter ? formatSocialUrl('twitter', formData.twitter) : null,
        created_at: new Date()
      }

      let { data, error: supabaseError } = await supabase
        .from('waitlist')
        .insert([fullSubmissionData])
        .select()

      // If we get a column error, try with minimal data
      if (supabaseError && (supabaseError.code === '42703' || supabaseError.message?.includes('column') || supabaseError.message?.includes('does not exist'))) {
        console.log('Retrying with minimal data due to missing columns...')
        
        // Try with basic required fields only
        const minimalData = {
          name: formData.name,
          instagram: formatSocialUrl('instagram', formData.instagram),
          created_at: new Date()
        }

        const { data: retryData, error: retryError } = await supabase
          .from('waitlist')
          .insert([minimalData])
          .select()

        if (retryError) {
          console.error('Retry submission error:', retryError)
          throw new Error(`Database error: ${retryError.message}. Please run the SQL migration in your Supabase dashboard.`)
        }
        
        data = retryData
        supabaseError = null
      }

      if (supabaseError) {
        console.error('Supabase error:', supabaseError)
        
        if (supabaseError.code === '42501' || supabaseError.message?.includes('row-level security')) {
          throw new Error('Permission denied. Please run the SQL migration in your Supabase dashboard to update security policies.')
        }
        
        if (supabaseError.code === '23505') {
          throw new Error('This information is already on the waitlist!')
        }
        
        throw new Error(`Database error (${supabaseError.code}): ${supabaseError.message}`)
      }

      // Set waitlist position (current count + 1 for the new entry)
      setWaitlistPosition((count || 0) + 1)
      setCurrentStep('success')
    } catch (error) {
      console.error('Form submission error:', error)
      
      // More specific error messages
      let errorMessage = 'An unexpected error occurred'
      
      if (error instanceof Error) {
        if (error.message.includes('column') || error.message.includes('does not exist')) {
          errorMessage = 'Database needs to be updated. Please run the SQL migration first.'
        } else if (error.message.includes('row-level security') || error.message.includes('Permission denied')) {
          errorMessage = 'Database security needs to be configured. Please run the SQL migration.'
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
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
              {/* Header - Hidden on success screen */}
              {currentStep !== 'success' && (
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
                    <p className="text-sm text-white/70 font-light">
                      {currentStep === 'personal' ? 'Personal Information' : 'Social Profiles'}
                    </p>
                  </motion.div>
                </div>
              )}

              {/* Form Content */}
              <div className="px-6 pb-6 pt-6">
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
                        <label className="block text-xs font-medium text-white/90 tracking-wider uppercase">Phone Number *</label>
                        <div className="flex gap-2">
                          <motion.input
                            whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
                            type="text"
                            value={`+${countryCodeInput}`}
                            onChange={(e) => {
                              const value = e.target.value.replace(/^\+/, '') // Remove + if user types it
                              if (/^\d*$/.test(value) && value.length <= 3) { // Only allow digits and max 3 characters
                                setCountryCodeInput(value)
                                updateFormData('countryCode', `+${value}`)
                              }
                            }}
                            className="w-20 px-3 py-3 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 transition-all duration-500 font-light text-sm"
                            placeholder="+"
                            maxLength={4}
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

                      <div className="space-y-3 relative">
                        <label className="block text-xs font-medium text-white/90 tracking-wider uppercase">Location *</label>
                        
                        {/* Premium Location Input Container */}
                        <div className="relative">
                          <motion.div
                            whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
                            className="relative group"
                          >
                                                        <motion.input
                              whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
                              type="text"
                              value={formData.location}
                              onChange={(e) => handleLocationSearch(e.target.value)}
                              onKeyDown={handleLocationKeyDown}
                                                          onFocus={() => {
                              if (bestLocationMatch && !isLocationSelected) {
                                setShowLocationSuggestion(true)
                              }
                            }}
                              onBlur={() => {
                                // Delay hiding to allow clicks on suggestions
                                setTimeout(() => {
                                  setShowLocationSuggestion(false)
                                }, 200)
                              }}
                              className="w-full px-4 py-3 pr-12 bg-black/30 backdrop-blur-sm border border-white/15 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 transition-all duration-500 font-light text-sm"
                              placeholder="Allow Location"
                            />
                            
                            {/* Location Action Button */}
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={detectCurrentLocation}
                                disabled={isDetectingLocation}
                                className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                title={isDetectingLocation ? "Detecting..." : "Use current location"}
                                aria-label={isDetectingLocation ? "Detecting location" : "Detect current location"}
                              >
                                {isDetectingLocation ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Navigation className="w-4 h-4" />
                                )}
                              </motion.button>
                            </div>
                          </motion.div>
                        </div>

                        {/* Clean Single Location Suggestion */}
                        <AnimatePresence>
                          {showLocationSuggestion && bestLocationMatch && (
                            <motion.div
                              key="location-suggestion"
                              initial={{ opacity: 0, y: -10, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.98 }}
                              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                              className="absolute z-20 w-full mt-2 bg-gradient-to-br from-black/95 to-black/90 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-xl overflow-hidden"
                            >
                              <motion.button
                                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={selectBestLocation}
                                className="w-full flex items-center gap-3 px-4 py-4 text-left transition-all duration-300"
                              >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                                  <MapPin className="w-4 h-4 text-purple-300" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-white font-light">
                                    {extractCityCountry(bestLocationMatch.display_name)}
                                  </div>
                                  <div className="text-white/50 text-xs mt-0.5 truncate">
                                    {bestLocationMatch.display_name}
                                  </div>
                                </div>
                                <div className="text-white/40 text-xs">
                                  Press Enter
                                </div>
                              </motion.button>
                            </motion.div>
                          )}
                          
                          {/* Loading State */}
                          {isLoadingLocation && (
                            <motion.div
                              key="location-loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute z-20 w-full mt-2 bg-gradient-to-br from-black/95 to-black/90 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-xl overflow-hidden"
                            >
                              <div className="flex items-center justify-center gap-3 px-4 py-4 text-white/70 text-sm">
                                <div className="w-4 h-4 border-2 border-white/20 border-t-purple-400 rounded-full animate-spin" />
                                <span className="font-light">Finding location...</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
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
                            min="18"
                            max="99"
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
                          <strong className="text-white font-medium">Why we ask:</strong> Your social presence helps our AI create better matches.
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
                    {currentStep === 'social' && (
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
                      onClick={currentStep === 'social' ? handleSubmit : handleNext}
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white px-5 py-3 rounded-2xl font-medium border border-white/20 hover:shadow-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : currentStep === 'social' ? (
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