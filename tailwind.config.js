module.exports = {
	content: ["./pages/**/*.tsx", "./components/**/*.tsx"],
	theme: {
		extend: {},
		screens: {
			mobile: "500px",
			s: "630px",
		},
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require("@tailwindcss/line-clamp")], // Add this line
};
