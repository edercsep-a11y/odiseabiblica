/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Dynamic clan colors used with template literals
    'bg-cyan-900/30', 'border-cyan-500/50', 'text-cyan-400', 'text-cyan-400/80', 'bg-cyan-400',
    'bg-blue-900/30', 'border-blue-500/50', 'text-blue-400', 'text-blue-400/80', 'bg-blue-400',
    'bg-amber-900/30', 'border-amber-500/50', 'text-amber-400', 'text-amber-400/80', 'bg-amber-400',
    'bg-emerald-900/30', 'border-emerald-500/50', 'text-emerald-400', 'text-emerald-400/80', 'bg-emerald-400',
    // Clan border and bg variants
    'border-amber-500/30', 'border-blue-500/30', 'border-red-500/30', 'border-purple-500/30',
    'border-orange-500/30', 'border-green-500/30', 'border-cyan-500/30',
    'bg-amber-950/30', 'bg-blue-950/30', 'bg-red-950/30', 'bg-purple-950/30',
    'bg-orange-950/30', 'bg-green-950/30', 'bg-cyan-950/30',
    'text-amber-500', 'text-blue-400', 'text-red-500', 'text-purple-400',
    'text-orange-500', 'text-green-500', 'text-cyan-400',
    // Hover states for clans
    'hover:border-amber-500/50', 'hover:border-blue-500/50', 'hover:border-red-500/50',
    'hover:border-purple-500/50', 'hover:border-orange-500/50', 'hover:border-green-500/50',
    'hover:border-cyan-500/50',
    // Glow shadows
    'shadow-[0_0_20px_rgba(34,211,238,0.3)]', 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    'shadow-[0_0_20px_rgba(245,158,11,0.3)]', 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    // Scale + translate for active tabs
    'scale-[1.02]', 'translate-x-2',
    // Drop shadows
    'drop-shadow-[0_0_8px_currentColor]',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
