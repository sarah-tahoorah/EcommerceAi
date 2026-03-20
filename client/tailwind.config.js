/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        primary: "#121212",
        secondary: "#1e1e1e",
        // Cards
        card: "#242424",
        // Text
        textPrimary: "#ffffff",
        textSecondary: "#b3b3b3",
        // Accents
        neonPink: "#ff2e63",
        electricPurple: "#8b5cf6",
        brightBlue: "#3b82f6",
        softGold: "#facc15",
        // Legacy colors (keeping for compatibility)
        noir: "#0b0b0b",
        ivory: "#f7f5f2",
        gold: "#d4af37",
        charcoal: "#1a1a1a",
        pink: "#ff2e63",
        lavender: "#6c2bd9",
        sky: "#2563eb",
        peach: "#ff7a00",
        mint: "#6ee7b7",
        royal: "#6c2bd9",
        electric: "#2563eb",
        blaze: "#ff7a00"
      },
      boxShadow: {
        luxe: "0 24px 60px rgba(10,10,10,0.18)",
        "gold-glow": "0 16px 40px rgba(108,43,217,0.25)",
        "card-lift": "0 10px 30px rgba(0,0,0,0.3)",
        "glow-pink": "0 0 20px rgba(255,46,99,0.5)",
        "glow-purple": "0 0 20px rgba(139,92,246,0.5)",
        "glow-blue": "0 0 20px rgba(59,130,246,0.5)"
      },
      backgroundImage: {
        "hero-luxe":
          "linear-gradient(120deg, rgba(255,46,99,0.85), rgba(108,43,217,0.7), rgba(37,99,235,0.75))",
        "gold-sheen":
          "linear-gradient(120deg, rgba(255,46,99,0.25), rgba(108,43,217,0.25), rgba(37,99,235,0.25))",
        "gradient-pink-purple": "linear-gradient(135deg, #ff2e63 0%, #8b5cf6 100%)",
        "gradient-purple-blue": "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)"
      },
      animation: {
        "scale-up": "scaleUp 0.2s ease-out",
        "lift": "lift 0.3s ease-out"
      },
      keyframes: {
        scaleUp: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" }
        },
        lift: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-5px)" }
        }
      }
    }
  },
  plugins: []
};
