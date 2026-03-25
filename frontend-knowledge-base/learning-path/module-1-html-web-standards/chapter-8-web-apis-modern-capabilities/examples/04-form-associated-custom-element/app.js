class SkillRating extends HTMLElement {
	static formAssociated = true;

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.internals = typeof this.attachInternals === "function" ? this.attachInternals() : null;
		this.value = this.getAttribute("value") ?? "3";
	}

	connectedCallback() {
		this.render();
		this.updateFormValue();
	}

	updateFormValue() {
		if (this.internals) {
			this.internals.setFormValue(this.value);
		}
	}

	setRating(nextValue) {
		this.value = String(nextValue);
		this.setAttribute("value", this.value);
		this.updateFormValue();
		this.render();
	}

	render() {
		const buttons = Array.from({ length: 5 }, (_, index) => {
			const score = String(index + 1);
			const selected = this.value === score;
			return `
				<button
					type="button"
					class="rating-button ${selected ? "selected" : ""}"
					data-value="${score}"
					aria-pressed="${selected}"
				>
					${score}
				</button>
			`;
		}).join("");

		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: block;
					margin-bottom: 1rem;
				}

				.wrapper {
					display: flex;
					gap: 0.5rem;
					flex-wrap: wrap;
				}

				.rating-button {
					width: 3rem;
					height: 3rem;
					border: 1px solid #86efac;
					border-radius: 999px;
					background: #ffffff;
					color: #166534;
					font: inherit;
					font-weight: 700;
					cursor: pointer;
				}

				.rating-button.selected {
					background: #16a34a;
					color: #f0fdf4;
				}
			</style>
			<div class="wrapper" role="group" aria-label="Web API confidence rating">
				${buttons}
			</div>
		`;

		this.shadowRoot.querySelectorAll(".rating-button").forEach((button) => {
			button.addEventListener("click", () => {
				this.setRating(button.dataset.value);
			});
		});
	}
}

customElements.define("skill-rating", SkillRating);

const form = document.getElementById("feedback-form");
const output = document.getElementById("output");
const supportNote = document.getElementById("support-note");

supportNote.textContent = typeof HTMLElement.prototype.attachInternals === "function"
	? "ElementInternals is supported in this browser, so the custom element participates directly in FormData."
	: "ElementInternals is not supported here. In older browsers, a hidden input fallback would be needed.";

form.addEventListener("submit", (event) => {
	event.preventDefault();
	const data = Object.fromEntries(new FormData(form).entries());
	output.textContent = JSON.stringify(data, null, 2);
});