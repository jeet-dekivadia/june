import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Debug logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Supabase Debug:', {
      url: supabaseUrl ? '✅ URL found' : '❌ URL missing',
      key: supabaseKey ? '✅ Key found' : '❌ Key missing',
      urlPrefix: supabaseUrl?.substring(0, 20) + '...',
      keyPrefix: supabaseKey?.substring(0, 20) + '...'
    })
  }

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      `Missing Supabase environment variables:
      - NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅' : '❌'}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? '✅' : '❌'}
      
      Make sure your .env.local file is in the root directory with these exact variable names.`
    )
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
