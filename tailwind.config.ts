
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
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
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
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
				amber: {
					50: '#fffbeb',
					100: '#fef3c7',
					200: '#fde68a',
					300: '#fcd34d',
					400: '#fbbf24',
					500: '#f59e0b',
					600: '#d97706',
					700: '#b45309',
					800: '#92400e',
					900: '#78350f',
				},
				orange: {
					50: '#fff7ed',
					100: '#ffedd5',
					200: '#fed7aa',
					300: '#fdba74',
					400: '#fb923c',
					500: '#f97316',
					600: '#ea580c',
					700: '#c2410c',
					800: '#9a3412',
					900: '#7c2d12',
				},
				ghibli: {
					sky: '#A4DDED',
					cloud: '#F0F9FF',
					grass: '#85C285',
					wood: '#DEB887',
					soil: '#9B7653',
					leaf: '#71C671',
					water: '#8ED6FF',
				}
			},
			fontFamily: {
				sans: ['Nunito', 'sans-serif'],
				serif: ['Playfair Display', 'serif'],
				indie: ['Indie Flower', 'cursive'],
				ghibli: ['Nunito', 'Indie Flower', 'cursive'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.98)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					from: { transform: 'scale(1)', opacity: '1' },
					to: { transform: 'scale(0.98)', opacity: '0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-8px)' }
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.85' }
				},
				'rotate-glow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'soft-bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                'sway': {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                'float-x': {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '50%': { transform: 'translateX(10px)' },
                },
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-out': 'fade-out 0.5s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'scale-out': 'scale-out 0.4s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
				'rotate-glow': 'rotate-glow 20s linear infinite',
				'shimmer': 'shimmer 3s ease-in-out infinite',
                'soft-bounce': 'soft-bounce 4s ease-in-out infinite',
                'sway': 'sway 6s ease-in-out infinite',
                'float-x': 'float-x 7s ease-in-out infinite',
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: '100%',
						color: 'hsl(var(--foreground))',
						h1: {
                            color: 'hsl(var(--foreground))',
                            fontFamily: 'Playfair Display, serif',
                        },
                        h2: {
                            color: 'hsl(var(--foreground))',
                            fontFamily: 'Playfair Display, serif',
                        },
                        h3: {
                            color: 'hsl(var(--foreground))',
                            fontFamily: 'Playfair Display, serif',
                        },
					},
				},
			},
			backdropFilter: {
				'none': 'none',
				'blur': 'blur(20px)',
			},
			boxShadow: {
                'elegant': '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
                'elegant-lg': '0 20px 40px -5px rgba(0, 0, 0, 0.1)',
                'inner-elegant': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
                'ghibli': '0 5px 15px -3px rgba(157, 107, 0, 0.15)',
                'ghibli-lg': '0 10px 25px -5px rgba(157, 107, 0, 0.2)',
            },
            backgroundImage: {
                'warm-gradient': 'linear-gradient(to right, hsla(30, 100%, 92%, 0.8), hsla(20, 100%, 92%, 0.8))',
                'warm-gradient-soft': 'linear-gradient(to right, hsla(30, 100%, 98%, 0.9), hsla(20, 100%, 98%, 0.9))',
                'primary-gradient': 'linear-gradient(to right, hsl(var(--primary)), hsl(calc(var(--primary) - 10), 95%, 45%))',
                'ghibli-sky': 'linear-gradient(to bottom, #A4DDED, #CEEAF2)',
                'ghibli-sunset': 'linear-gradient(to bottom, #FAD961, #F76B1C)',
                'ghibli-forest': 'linear-gradient(to bottom, #9FE160, #63C082)',
            },
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
