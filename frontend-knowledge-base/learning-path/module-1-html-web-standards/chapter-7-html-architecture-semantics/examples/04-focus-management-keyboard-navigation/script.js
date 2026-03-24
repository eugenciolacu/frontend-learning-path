const openDialogButton = document.getElementById("open-dialog");
const closeDialogButton = document.getElementById("close-dialog");
const keyboardDialog = document.getElementById("keyboard-dialog");

openDialogButton.addEventListener("click", () => {
	keyboardDialog.showModal();
	closeDialogButton.focus();
});

closeDialogButton.addEventListener("click", () => {
	keyboardDialog.close();
	openDialogButton.focus();
});

keyboardDialog.addEventListener("close", () => {
	openDialogButton.focus();
});
