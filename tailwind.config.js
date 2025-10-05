/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            h1: {
              color: '#111827',
              fontWeight: '800',
              fontSize: '2.25rem',
              marginTop: '0',
              marginBottom: '1rem',
            },
            h2: {
              color: '#111827',
              fontWeight: '700',
              fontSize: '1.875rem',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            h3: {
              color: '#111827',
              fontWeight: '600',
              fontSize: '1.5rem',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
            },
            h4: {
              color: '#111827',
              fontWeight: '600',
              fontSize: '1.25rem',
              marginTop: '1.25rem',
              marginBottom: '0.5rem',
            },
            p: {
              marginTop: '1rem',
              marginBottom: '1rem',
              lineHeight: '1.75',
            },
            ul: {
              marginTop: '1rem',
              marginBottom: '1rem',
            },
            ol: {
              marginTop: '1rem',
              marginBottom: '1rem',
            },
            li: {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },
            strong: {
              color: '#111827',
              fontWeight: '600',
            },
            blockquote: {
              fontStyle: 'italic',
              color: '#6B7280',
              borderLeftColor: '#10B981',
              borderLeftWidth: '4px',
              paddingLeft: '1rem',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            code: {
              color: '#059669',
              backgroundColor: '#F3F4F6',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#1F2937',
              color: '#F9FAFB',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              overflow: 'auto',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0',
            },
            a: {
              color: '#10B981',
              textDecoration: 'underline',
              fontWeight: '500',
              '&:hover': {
                color: '#059669',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}