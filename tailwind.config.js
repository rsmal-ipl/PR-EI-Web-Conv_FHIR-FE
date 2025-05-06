/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
	  './index.html',
	  './src/**/*.{ts,js,vue}',
	  './node_modules/flowbite/**/*.js'
	],
	theme: {
	  extend: {
		borderRadius: {
		  lg: 'var(--radius)',
		  md: 'calc(var(--radius) - 2px)',
		  sm: 'calc(var(--radius) - 4px)'
		},
		colors: {
			primary: '#ffffff',     
			secondary: '#f2f5f6',    
			darkPrimary: '#1f2937',  
			darkSecondary: '#101826',
		}
	  }
	},
	plugins: [
	  require('tailwindcss-animate'),
	  require('flowbite')
	]
  }
  