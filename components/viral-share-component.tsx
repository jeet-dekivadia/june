'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Share2, Copy, Twitter, Linkedin, MessageCircle, Check } from 'lucide-react'

export function ViralShareComponent() {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const shareUrl = "https://june.date"
  const shareText = "Just applied to June - the revolutionary AI dating app that's changing how we find love. No more endless swiping! 💜✨ #JuneDating #FutureOfDating"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'text-blue-400 hover:bg-blue-400/10'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'text-blue-600 hover:bg-blue-600/10'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      color: 'text-green-500 hover:bg-green-500/10'
    }
  ]

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-3/80 hover:bg-slate-4 border border-slate-6 rounded-lg text-sm text-slate-11 hover:text-slate-12 transition-all"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </motion.button>

      {/* Share Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute bottom-full mb-2 right-0 bg-slate-1 border border-slate-6 rounded-xl shadow-xl p-4 min-w-[280px] z-50"
        >
          <div className="mb-3">
            <h3 className="font-medium text-slate-12 mb-1">Share June</h3>
            <p className="text-xs text-slate-10">Help spread the word about the future of dating</p>
          </div>

          {/* Share Buttons */}
          <div className="space-y-2 mb-3">
            {shareLinks.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-2 rounded-lg transition-all ${platform.color}`}
              >
                <platform.icon className="w-5 h-5" />
                <span className="text-sm font-medium">Share on {platform.name}</span>
              </a>
            ))}
          </div>

          {/* Copy Link */}
          <div className="pt-3 border-t border-slate-6">
            <button
              onClick={handleCopy}
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-3 transition-all text-slate-11"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">
                {copied ? 'Copied!' : 'Copy link'}
              </span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
} 