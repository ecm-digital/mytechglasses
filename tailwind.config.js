/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Modern color system with design tokens
      colors: {
        // Primary color scale (Deep Blue)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Base primary
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',  // Deep blue
          950: '#172554',
        },
        // Accent colors
        accent: {
          blue: '#06b6d4',    // Cyan
          purple: '#8b5cf6',  // Purple
          pink: '#ec4899',    // Pink
          orange: '#f97316',  // Orange
        },
        // Semantic colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#06b6d4',
        
        // Neutral colors for light/dark mode
        neutral: {
          0: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        
        // Background colors
        background: {
          light: '#ffffff',
          'light-secondary': '#f8fafc',
          dark: '#0f172a',
          'dark-secondary': '#1e293b',
        },
        
        // Text colors
        text: {
          light: '#0f172a',
          'light-secondary': '#475569',
          dark: '#f8fafc',
          'dark-secondary': '#cbd5e1',
        },
      },
      
      // Modern font system
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      
      // Enhanced typography scale
      fontSize: {
        'xs': ['12px', { lineHeight: '16px', letterSpacing: '0.05em' }],
        'sm': ['14px', { lineHeight: '20px', letterSpacing: '0.025em' }],
        'base': ['16px', { lineHeight: '24px', letterSpacing: '0' }],
        'lg': ['18px', { lineHeight: '28px', letterSpacing: '-0.025em' }],
        'xl': ['20px', { lineHeight: '32px', letterSpacing: '-0.025em' }],
        '2xl': ['24px', { lineHeight: '36px', letterSpacing: '-0.05em' }],
        '3xl': ['30px', { lineHeight: '40px', letterSpacing: '-0.05em' }],
        '4xl': ['36px', { lineHeight: '44px', letterSpacing: '-0.075em' }],
        '5xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.075em' }],
        
        // Mobile-specific sizes
        'mobile-xs': ['12px', { lineHeight: '16px' }],
        'mobile-sm': ['14px', { lineHeight: '20px' }],
        'mobile-base': ['16px', { lineHeight: '24px' }],
        'mobile-lg': ['18px', { lineHeight: '28px' }],
        'mobile-xl': ['20px', { lineHeight: '32px' }],
        'mobile-2xl': ['24px', { lineHeight: '36px' }],
        'mobile-3xl': ['30px', { lineHeight: '40px' }],
      },
      
      // 8px spacing system
      spacing: {
        '0.5': '2px',
        '1.5': '6px',
        '2.5': '10px',
        '3.5': '14px',
        '4.5': '18px',
        '5.5': '22px',
        '6.5': '26px',
        '7.5': '30px',
        '8.5': '34px',
        '9.5': '38px',
        '11': '44px',
        '13': '52px',
        '15': '60px',
        '17': '68px',
        '18': '72px',
        '19': '76px',
        '21': '84px',
        '22': '88px',
        '23': '92px',
        '25': '100px',
        
        // Touch-friendly sizes
        'touch': '44px',
        'touch-sm': '40px',
        'touch-lg': '48px',
        
        // Safe areas
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      
      // Modern gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)',
        'gradient-accent': 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)',
        'gradient-hero': 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 25%, #06b6d4 50%, #8b5cf6 75%, #ec4899 100%)',
        'gradient-card': 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        'gradient-dark': 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
      },
      
      // Enhanced shadows for depth
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'neumorphic': '20px 20px 60px #d1d1d1, -20px -20px 60px #ffffff',
        'neumorphic-dark': '20px 20px 60px #0a0f1c, -20px -20px 60px #1e293b',
        'floating': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-accent': '0 0 20px rgba(139, 92, 246, 0.5)',
      },
      
      // Animation system
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-left': 'slideLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-right': 'slideRight 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
      },
      
      // Custom keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      
      // Backdrop blur utilities
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      
      // Border radius system
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
    },
  },
  plugins: [],
}