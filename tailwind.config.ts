import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#F5F5F5",
				secondary: "#f2c88c",
			},
			screens: {
				mobile: "300px",
				xs: "475px",
				sm: "640px",
				md: "768px",
				lg: "1024px",
				xl: "1280px",
				"2xl": "1350px",
				"3xl": "1500px",
				"4xl": "1920px",
			},
		},
	},
	plugins: [],
};
export default config;
