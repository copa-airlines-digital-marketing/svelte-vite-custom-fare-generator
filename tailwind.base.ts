/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html}'],
	presets: [require('cmds-tailwind-styles')],
	theme: {
		extend: {}
	},

	plugins: [require('@tailwindcss/typography')]
};