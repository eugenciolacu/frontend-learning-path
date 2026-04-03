const replayButton = document.getElementById("replay-button");
const animatedTokens = [
	document.getElementById("token-layout"),
	document.getElementById("token-transform")
];

function restartAnimation() {
	for (const token of animatedTokens) {
		token.classList.remove("run");
		void token.offsetWidth;
		token.classList.add("run");
	}
}

replayButton.addEventListener("click", restartAnimation);
restartAnimation();