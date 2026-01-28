/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Brutalist color palette
                'brutal-black': '#0a0a0a',
                'brutal-white': '#fafafa',
                'brutal-yellow': '#ffeb3b',
                'brutal-red': '#ff1744',
                'brutal-blue': '#2979ff',
                'brutal-green': '#00e676',
                'brutal-purple': '#d500f9',
                'brutal-orange': '#ff9100',
            },
            fontFamily: {
                'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
                'sans': ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'brutal': '4px 4px 0px 0px #0a0a0a',
                'brutal-lg': '8px 8px 0px 0px #0a0a0a',
                'brutal-hover': '6px 6px 0px 0px #0a0a0a',
            },
            animation: {
                'bounce-subtle': 'bounce-subtle 1s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'slide-up': 'slide-up 0.3s ease-out',
                'shake': 'shake 0.5s ease-in-out',
            },
            keyframes: {
                'bounce-subtle': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-4px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(255, 235, 59, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(255, 235, 59, 0.6)' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'shake': {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-5px)' },
                    '75%': { transform: 'translateX(5px)' },
                },
            },
        },
    },
    plugins: [],
}
