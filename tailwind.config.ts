import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ikigai: {
          primary: '#2563EB',    // Blue - main actions
          secondary: '#7C3AED',  // Purple - secondary actions
          notice: '#F59E0B',     // Amber - Phase 1 NOTICE
          explore: '#10B981',    // Emerald - Phase 2 EXPLORE
          investigate: '#3B82F6',// Blue - Phase 3 INVESTIGATE
          construct: '#8B5CF6',  // Violet - Phase 4 CONSTRUCT
          share: '#EC4899',      // Pink - Phase 5 SHARE & REFLECT
          developing: '#EF4444', // Red - assessment level
          achieving: '#F59E0B',  // Amber - assessment level
          exceeding: '#10B981',  // Green - assessment level
        },
      },
      fontSize: {
        'student-body': ['1.125rem', { lineHeight: '1.75rem' }],
        'student-heading': ['1.5rem', { lineHeight: '2rem' }],
      },
      spacing: {
        'touch': '44px', // minimum touch target for young learners
      },
    },
  },
  plugins: [],
}

export default config
