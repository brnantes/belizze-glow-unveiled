import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // Belizze Sophisticated Color Palette
        "rose-gold": "hsl(var(--rose-gold))",
        "rose-gold-metallic": "hsl(var(--rose-gold-metallic))",
        "rose-gold-bright": "hsl(var(--rose-gold-bright))",
        "nude-elegant": "hsl(var(--nude-elegant))",
        "nude-warm": "hsl(var(--nude-warm))",
        "beige-light": "hsl(var(--beige-light))",
        "beige-soft": "hsl(var(--beige-soft))",
        "gray-soft": "hsl(var(--gray-soft))",
        "gray-elegant": "hsl(var(--gray-elegant))",
        "gray-subtle": "hsl(var(--gray-subtle))",
        "glass-light": "var(--glass-light)",
        "glass-elegant": "var(--glass-elegant)",
        "glass-sophisticated": "var(--glass-sophisticated)",
        
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backdropBlur: {
        'light': '12px',
        'medium': '20px',
        'heavy': '40px',
      },
      boxShadow: {
        'elegant': 'var(--shadow-elegant)',
        'sophisticated': 'var(--shadow-sophisticated)',
        'rose-gold': 'var(--shadow-rose-gold)',
        'glassmorphism': 'var(--shadow-glassmorphism)',
      },
      scale: {
        '102': '1.02',
      },
      transitionTimingFunction: {
        'sophisticated': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'elegant': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
