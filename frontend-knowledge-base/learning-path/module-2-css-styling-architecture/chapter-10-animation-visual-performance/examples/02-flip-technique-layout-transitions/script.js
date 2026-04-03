const grid = document.getElementById("card-grid");
const sortButton = document.getElementById("sort-button");
const status = document.getElementById("status");

let ascending = false;

function getCards() {
	return [...grid.querySelectorAll(".lesson-card")];
}

function flipReorder(nextCards) {
	const cards = getCards();
	const firstRects = new Map(cards.map((card) => [card, card.getBoundingClientRect()]));

	for (const card of nextCards) {
		grid.appendChild(card);
	}

	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (prefersReducedMotion) {
		return;
	}

	for (const card of nextCards) {
		const first = firstRects.get(card);
		const last = card.getBoundingClientRect();
		const deltaX = first.left - last.left;
		const deltaY = first.top - last.top;

		card.animate(
			[
				{ transform: `translate(${deltaX}px, ${deltaY}px)` },
				{ transform: "translate(0, 0)" }
			],
			{
				duration: 420,
				easing: "cubic-bezier(0.2, 0, 0, 1)"
			}
		);
	}
}

sortButton.addEventListener("click", () => {
	ascending = !ascending;
	const cards = getCards();
	const nextCards = cards.sort((firstCard, secondCard) => {
		const firstDuration = Number(firstCard.dataset.duration);
		const secondDuration = Number(secondCard.dataset.duration);
		return ascending ? firstDuration - secondDuration : secondDuration - firstDuration;
	});

	flipReorder(nextCards);
	status.textContent = ascending
		? "Current order: shortest lesson first"
		: "Current order: longest lesson first";
	sortButton.textContent = ascending ? "Sort by longest duration" : "Sort by shortest duration";
});