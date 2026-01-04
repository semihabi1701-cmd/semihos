/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6', // Blue-500
                'primary-light': '#60a5fa', // Blue-400
                dark: {
                    bg: '#0f172a', // Slate-900
                    card: '#1e293b', // Slate-800
                    border: '#334155', // Slate-700
                    text: '#f1f5f9', // Slate-100
                    muted: '#94a3b8' // Slate-400
                }
            }
        },
    },
    plugins: [],
}
