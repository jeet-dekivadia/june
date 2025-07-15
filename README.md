# June - Just one match that matters

A revolutionary dating app that replaces endless swiping with meaningful, AI-vetted connections.

## Features

- **Original purple gradient background**
- **Beautiful animated success flow** with curved arrow pointing to manifesto
- **AI-powered matching** - No more endless swiping
- **Waitlist functionality** powered by Supabase
- **Responsive design** that works on all devices
- **Always dark theme** for optimal experience

## Getting Started

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd june-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env.local` file and add your Supabase credentials:
     \`\`\`
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     \`\`\`

4. **Create the database table**
   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Run the SQL script from `scripts/create-waitlist-table.sql`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Build for production**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## Deployment

This app is ready to deploy to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- Any platform that supports Next.js

Make sure to add your environment variables to your deployment platform.

## Team

**Co-Founders:** Jeet Dekivadia & Kartikey Bihani

**Backed by:** Nas Company, Nusseir Yasin, and Aija Mayrock

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database and authentication
- **Interactive Gradient** - Cursor-responsive background

## License

© 2024 June. Just one match that matters.
