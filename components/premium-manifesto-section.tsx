'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Sparkles, Star } from 'lucide-react'
import { Alex_Brush } from 'next/font/google'
import clsx from 'clsx'
import Link from 'next/link'

const font = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["latin"],
  weight: "400",
})

export function PremiumManifestoSection() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-16 overflow-hidden max-w-4xl mx-auto">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-20 left-4 z-50"
      >
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-slate-2/80 backdrop-blur-sm border border-slate-6 rounded-lg text-sm text-slate-11 hover:text-slate-12 hover:bg-slate-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 space-y-12"
      >
        {/* Header */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2"
          >
            <Heart className="w-4 h-4 text-red-400 fill-current" />
            <span className="text-sm font-medium text-slate-11">Our Mission</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-12 leading-tight"
          >
            Why We're Building the{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Future of Dating
            </span>
          </motion.h1>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="prose prose-lg max-w-3xl mx-auto text-left"
        >
          <div className="text-slate-11 [&>p]:tracking-tight [&>p]:leading-[1.6] [&>p:not(:last-child)]:mb-6 text-pretty space-y-6">
            <p className="text-xl leading-relaxed">
              <strong className="text-slate-12">Dating is broken.</strong> What started as a revolution in human connection has become an endless 
              scroll of superficial judgments. We're reducing love to split-second swipes based on filtered photos.
            </p>
            
            <p className="text-lg">
              <strong className="text-slate-12">We're building something different.</strong> A world where personality matters more than the perfect selfie. 
              Where real conversations happen before superficial matches. Where AI helps you find genuine compatibility, not just attraction.
            </p>
            
            <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 border border-purple-200/30 rounded-xl p-6 my-8">
              <p className="text-lg text-slate-12">
                <strong className="text-purple-800">The numbers don't lie:</strong> 80% of Gen Z feels mentally drained by dating apps. Nearly half of online 
                daters feel more discouraged than hopeful. Ghosting and fake profiles have made finding love feel impossible.
              </p>
            </div>
            
            <p className="text-lg">
              <strong className="text-slate-12">June changes everything:</strong> Our AI creates meaningful conversations before you ever match. You'll talk 
              to someone's AI representation first—testing humor, values, and conversational chemistry in a natural 5-10 minute chat.
            </p>
            
            <p className="text-lg">
              <strong className="text-slate-12">The result?</strong> No more endless scrolling. No more "hey" messages that go nowhere. No more wondering 
              if someone's actually interested. Just one perfect match, at the perfect time.
            </p>
            
            <div className="text-center py-8">
              <p className="text-2xl font-bold text-slate-12 mb-2">
                This is the future of dating.
              </p>
              <p className="text-xl text-slate-10">
                Intentional. Meaningful. Real.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Launch Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-slate-2/50 backdrop-blur-sm border border-slate-6 rounded-2xl p-8 space-y-4"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h3 className="text-xl font-bold text-slate-12">Coming Soon</h3>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>
          
          <p className="text-lg font-medium text-slate-11">
            <strong className="text-slate-12">Launching August 18, 2025</strong> • National Couples Day
          </p>
          
          <p className="text-slate-10">
            <strong>Backed by:</strong> Nas Company, Nusseir Yasin, and Aija Mayrock
          </p>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <p className={clsx("text-slate-12 text-3xl font-medium italic", font.className)}>
              The June Team
            </p>
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
          </div>
          
          <div className="space-y-2">
            <p className="text-slate-11 font-medium">
              <strong className="text-slate-12">Jeet Dekivadia</strong> & <strong className="text-slate-12">Kartikey Bihani</strong>
            </p>
            <p className="text-slate-10 text-sm">Co-Founders • Building the future of dating</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 left-1/5 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/3 right-1/5 w-48 h-48 bg-pink-500/5 rounded-full blur-2xl"
        />
      </div>
    </div>
  )
} 