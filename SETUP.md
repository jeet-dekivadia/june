# June Dating App - Environment Setup

## 🚀 Quick Start (Demo Mode)
The app now works without any configuration! It will run in demo mode with:
- Simulated waitlist counts that grow over time
- Form submissions logged to console
- All premium features fully functional

## 🔧 Full Setup (Production)
To connect to a real database and enable email functionality:

1. Create a .env.local file in the project root:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   RESEND_API_KEY=your-resend-key
   ```

2. Get Supabase credentials from: https://supabase.com/dashboard
3. Run the SQL script in scripts/create-waitlist-table.sql
4. Get Resend API key from: https://resend.com/api-keys

## 📱 Current Features
✅ Ultra-premium UI with countdown timer
✅ FOMO banner with dynamic counts  
✅ Premium application modal
✅ Single-screen no-scroll design
✅ Manhattan elite branding
✅ Demo mode functionality
