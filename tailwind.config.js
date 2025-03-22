module.exports = {
	content: ["./pages/**/*.tsx", "./components/**/*.tsx"],
	theme: {
		extend: {},
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require("@tailwindcss/line-clamp")], // Add this line
};
