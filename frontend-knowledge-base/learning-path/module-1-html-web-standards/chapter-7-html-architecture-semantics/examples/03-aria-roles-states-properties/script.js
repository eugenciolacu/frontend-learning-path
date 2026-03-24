const faqToggle = document.getElementById("faq-toggle");
const faqPanel = document.getElementById("faq-panel");
const saveButton = document.getElementById("save-button");
const saveStatus = document.getElementById("save-status");

faqToggle.addEventListener("click", () => {
	const isExpanded = faqToggle.getAttribute("aria-expanded") === "true";
	faqToggle.setAttribute("aria-expanded", String(!isExpanded));
	faqPanel.hidden = isExpanded;
});

saveButton.addEventListener("click", () => {
	saveStatus.textContent = "Saving your preferences...";

	window.setTimeout(() => {
		saveStatus.textContent = "Preferences saved successfully.";
	}, 800);
});
