const toggleButton = document.getElementById("theme-toggle");
const rootElement = document.documentElement;

toggleButton.addEventListener("click", () => {
	const nextTheme = rootElement.dataset.theme === "light" ? "dark" : "light";
	rootElement.dataset.theme = nextTheme;
	toggleButton.textContent = nextTheme === "light" ? "Switch theme" : "Switch back";
});
