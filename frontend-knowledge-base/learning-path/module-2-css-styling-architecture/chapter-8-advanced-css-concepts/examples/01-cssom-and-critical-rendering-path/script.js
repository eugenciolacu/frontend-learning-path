const previewCard = document.getElementById("preview-card");
const output = document.getElementById("output");
const inspectButton = document.getElementById("inspect-button");
const accentButton = document.getElementById("accent-button");

const accentPalette = ["#0f766e", "#b45309", "#1d4ed8", "#7c3aed"];
let accentIndex = 0;

inspectButton.addEventListener("click", () => {
	const computed = getComputedStyle(previewCard);
	output.textContent = [
		"Computed styles for .preview-card",
		`background-color: ${computed.backgroundColor}`,
		`border-top-color: ${computed.borderTopColor}`,
		`border-radius: ${computed.borderTopLeftRadius}`,
		`box-shadow: ${computed.boxShadow}`,
		"",
		"This data comes from the computed style stage after the browser has matched selectors and resolved variables."
	].join("\n");
});

accentButton.addEventListener("click", () => {
	accentIndex = (accentIndex + 1) % accentPalette.length;
	const nextAccent = accentPalette[accentIndex];
	document.documentElement.style.setProperty("--accent", nextAccent);
	output.textContent = [
		`Updated --accent to ${nextAccent}.`,
		"The browser recalculates the affected styles and repaints the changed elements.",
		"This is a practical CSSOM pattern for theming and interactive tools."
	].join("\n");
});
