import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx,js,jsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				glass: 'hsl(var(--glass))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: 'calc(var(--radius) + 4px)',
				'2xl': 'calc(var(--radius) + 8px)',
				'3xl': '1.5rem'
			},
			boxShadow: {
				elite: "0 6px 18px rgba(11,22,40,0.06), 0 2px 6px rgba(11,22,40,0.04)",
				"elite-strong": "0 10px 30px rgba(11,22,40,0.12), 0 4px 10px rgba(11,22,40,0.06)",
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				subtleScale: {
					"0%": { transform: "scale(1)" },
					"50%": { transform: "scale(1.02)" },
					"100%": { transform: "scale(1)" },
				},
				floatUp: {
					"0%": { opacity: 0, transform: "translateY(6px) scale(.98)" },
					"100%": { opacity: 1, transform: "translateY(0) scale(1)" },
				},
				"sf-float-up": {
					"0%": { opacity: "0", transform: "translateY(6px) scale(.98)" },
					"100%": { opacity: "1", transform: "translateY(0) scale(1)" },
				},
				"sf-celebrate": {
					"0%": { transform: "scale(.98)", filter: "hue-rotate(0deg)", opacity: ".98" },
					"50%": { transform: "scale(1.06)", filter: "hue-rotate(12deg)", opacity: "1" },
					"100%": { transform: "scale(1)", filter: "hue-rotate(0deg)", opacity: "1" },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeIn 0.3s ease-out',
				'scale-in': 'scaleIn 0.2s ease-out',
				subtleScale: "subtleScale 800ms ease-in-out",
				floatUp: "floatUp 240ms var(--ease-fast) forwards",
				"sf-float-up": "sf-float-up .24s var(--ease-fast) both",
				"sf-celebrate": "sf-celebrate .72s var(--ease-fast)",
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
