const form = document.getElementById("contact-form");
const messageField = document.getElementById("message");
const phoneField = document.getElementById("phone");
const phoneError = document.getElementById("phone-error");
const messageError = document.getElementById("message-error");
const preview = document.getElementById("submission-preview");
const contactMethodInputs = document.querySelectorAll('input[name="contactMethod"]');

function selectedContactMethod() {
	const selectedInput = document.querySelector('input[name="contactMethod"]:checked');
	return selectedInput ? selectedInput.value : "email";
}

function validatePhoneField() {
	phoneField.setCustomValidity("");
	phoneError.textContent = "";

	if (selectedContactMethod() !== "phone") {
		return;
	}

	if (phoneField.value.trim() === "") {
		phoneField.setCustomValidity("Enter a phone number if you prefer phone contact.");
		phoneError.textContent = phoneField.validationMessage;
		return;
	}

	if (phoneField.validity.patternMismatch) {
		phoneField.setCustomValidity("Use only digits, spaces, parentheses, hyphens, and an optional leading plus sign.");
		phoneError.textContent = phoneField.validationMessage;
	}
}

function validateMessageField() {
	messageField.setCustomValidity("");
	messageError.textContent = "";

	if (messageField.value.trim().length < 20) {
		messageField.setCustomValidity("Write at least 20 non-space characters in your message.");
		messageError.textContent = messageField.validationMessage;
	}
}

phoneField.addEventListener("input", validatePhoneField);
messageField.addEventListener("input", validateMessageField);

for (const contactMethodInput of contactMethodInputs) {
	contactMethodInput.addEventListener("change", validatePhoneField);
}

form.addEventListener("submit", function (event) {
	validatePhoneField();
	validateMessageField();

	if (!form.checkValidity()) {
		event.preventDefault();
		form.reportValidity();
		return;
	}

	event.preventDefault();

	const formData = new FormData(form);
	const lines = [];

	for (const [key, value] of formData.entries()) {
		lines.push(`${key}: ${value}`);
	}

	preview.textContent = lines.join("\n");
	form.reset();
	contactMethodInputs[0].checked = true;
	phoneField.setCustomValidity("");
	messageField.setCustomValidity("");
	phoneError.textContent = "";
	messageError.textContent = "";
});