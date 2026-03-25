const form = document.getElementById("enrollment-form");
const emailInput = document.getElementById("student-email");
const usernameInput = document.getElementById("username");
const hoursInput = document.getElementById("study-hours");
const portfolioToggle = document.getElementById("portfolio-toggle");
const portfolioInput = document.getElementById("portfolio-url");
const resultOutput = document.getElementById("result-output");

const errorElements = {
	email: document.getElementById("email-error"),
	username: document.getElementById("username-error"),
	hours: document.getElementById("hours-error"),
	portfolio: document.getElementById("portfolio-error")
};

function updatePortfolioRule() {
	portfolioInput.toggleAttribute("required", portfolioToggle.checked);
	portfolioInput.setCustomValidity("");

	if (portfolioToggle.checked && portfolioInput.value.trim() === "") {
		portfolioInput.setCustomValidity("Provide a portfolio URL if you enabled portfolio submission.");
	}
}

function getMessage(input) {
	if (input.validity.valueMissing) {
		return "This field is required.";
	}

	if (input.validity.typeMismatch) {
		return input.type === "email"
			? "Enter a valid email address."
			: "Enter a valid URL, including https://";
	}

	if (input.validity.tooShort) {
		return `Use at least ${input.minLength} characters.`;
	}

	if (input.validity.patternMismatch) {
		return "Use only letters and numbers, between 4 and 12 characters.";
	}

	if (input.validity.rangeOverflow) {
		return "Weekly study hours must be 20 or less for this course plan.";
	}

	if (input.validity.rangeUnderflow) {
		return "Weekly study hours must be at least 1.";
	}

	if (input.validity.customError) {
		return input.validationMessage;
	}

	return "";
}

function renderFieldError(input, errorElement) {
	errorElement.textContent = getMessage(input);
}

function validateHours() {
	hoursInput.setCustomValidity("");
	const value = Number(hoursInput.value);

	if (hoursInput.value !== "" && value > 15 && usernameInput.value.trim().length < 6) {
		hoursInput.setCustomValidity("Students planning more than 15 hours per week should use a username with at least 6 characters.");
	}
}

[emailInput, usernameInput, hoursInput, portfolioInput].forEach((input) => {
	input.addEventListener("input", () => {
		updatePortfolioRule();
		validateHours();
		renderFieldError(emailInput, errorElements.email);
		renderFieldError(usernameInput, errorElements.username);
		renderFieldError(hoursInput, errorElements.hours);
		renderFieldError(portfolioInput, errorElements.portfolio);
	});

	input.addEventListener("blur", () => {
		renderFieldError(input, errorElements[input.name === "studyHours" ? "hours" : input.name === "portfolioUrl" ? "portfolio" : input.name]);
	});
});

portfolioToggle.addEventListener("change", () => {
	updatePortfolioRule();
	renderFieldError(portfolioInput, errorElements.portfolio);
});

form.addEventListener("submit", (event) => {
	updatePortfolioRule();
	validateHours();

	[emailInput, usernameInput, hoursInput, portfolioInput].forEach((input) => {
		renderFieldError(input, errorElements[input.name === "studyHours" ? "hours" : input.name === "portfolioUrl" ? "portfolio" : input.name]);
	});

	if (!form.checkValidity()) {
		event.preventDefault();
		form.reportValidity();
		return;
	}

	event.preventDefault();
	const data = Object.fromEntries(new FormData(form).entries());
	resultOutput.textContent = JSON.stringify(data, null, 2);
	form.reset();
	updatePortfolioRule();
	Object.values(errorElements).forEach((element) => {
		element.textContent = "";
	});
});

updatePortfolioRule();