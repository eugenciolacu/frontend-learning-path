module.exports = {
	content: ["./src/**/*.{html,js}"],
	theme: {
		extend: {
			colors: {
				brand: {
					DEFAULT: "#0f766e",
					soft: "#ccfbf1",
					deep: "#134e4a",
					ink: "#0f172a"
				}
			},
			borderRadius: {
				panel: "1.5rem"
			},
			boxShadow: {
				panel: "0 24px 60px rgba(15, 118, 110, 0.22)"
			}
		}
	}
};
