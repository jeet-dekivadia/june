'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useWaitlistCount() {
  const [count, setCount] = useState<number>(0) // Start with 0
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { count: dbCount } = await supabase
          .from('waitlist')
          .select('*', { count: 'exact', head: true })

        // Use exact database count
        setCount(dbCount || 0)
      } catch (error) {
        console.error('Error fetching waitlist count:', error)
        // Fallback to 0 on error
        setCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    // Initial fetch
    fetchCount()

    // Set up real-time subscription for insertions
    const subscription = supabase
      .channel('waitlist-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'waitlist' 
        }, 
        () => {
          // Refetch count when new row is inserted
          fetchCount()
        }
      )
      .subscribe()

    // Update every 5 minutes as backup
    const interval = setInterval(fetchCount, 5 * 60 * 1000)

    return () => {
      subscription.unsubscribe()
      clearInterval(interval)
    }
  }, [supabase])

  return { count, isLoading }
} 