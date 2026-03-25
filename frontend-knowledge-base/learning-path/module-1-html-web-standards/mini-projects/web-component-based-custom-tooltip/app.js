class LearningTooltip extends HTMLElement {
	static observedAttributes = ["tooltip-title", "tooltip-text", "position"];

	static instanceCount = 0;

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.isOpen = false;
		this.pointerInside = false;
		this.focusInside = false;
		this.tooltipId = `learning-tooltip-${LearningTooltip.instanceCount += 1}`;
	}

	connectedCallback() {
		this.render();
	}

	attributeChangedCallback() {
		if (this.isConnected) {
			this.render();
		}
	}

	render() {
		const template = document.getElementById("tooltip-template");
		const fragment = template.content.cloneNode(true);

		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: inline-block;
					position: relative;
					vertical-align: baseline;
				}

				.tooltip-shell {
					position: relative;
					display: inline-flex;
					align-items: center;
				}

				.trigger {
					border: 0;
					border-bottom: 2px dashed #0f766e;
					padding: 0;
					background: transparent;
					color: #0f5c5e;
					font: inherit;
					font-weight: 700;
					cursor: pointer;
				}

				.trigger:hover {
					color: #0b4344;
				}

				.trigger:focus {
					outline: 3px solid #2aa198;
					outline-offset: 4px;
					border-radius: 0.35rem;
				}

				.panel {
					position: absolute;
					z-index: 20;
					width: min(18rem, 70vw);
					padding: 0.8rem 0.9rem;
					border: 1px solid #1e5c58;
					border-radius: 0.85rem;
					background: linear-gradient(180deg, #12343b 0%, #1b4d4f 100%);
					color: #ecfdf8;
					box-shadow: 0 18px 35px rgba(18, 52, 59, 0.28);
				}

				.panel[hidden] {
					display: none;
				}

				.panel-title {
					display: block;
					margin-bottom: 0.35rem;
					font-size: 0.95rem;
				}

				.panel-text {
					display: block;
					font-size: 0.92rem;
					line-height: 1.45;
				}

				:host([position="top"]) .panel {
					left: 50%;
					bottom: calc(100% + 0.65rem);
					transform: translateX(-50%);
				}

				:host([position="right"]) .panel {
					left: calc(100% + 0.65rem);
					top: 50%;
					transform: translateY(-50%);
				}

				:host([position="left"]) .panel {
					right: calc(100% + 0.65rem);
					top: 50%;
					transform: translateY(-50%);
				}

				:host([position="bottom"]) .panel,
				:host(:not([position])) .panel {
					left: 50%;
					top: calc(100% + 0.65rem);
					transform: translateX(-50%);
				}

				@media (max-width: 640px) {
					:host([position="left"]) .panel,
					:host([position="right"]) .panel,
					:host([position="top"]) .panel,
					:host([position="bottom"]) .panel,
					:host(:not([position])) .panel {
						left: 50%;
						right: auto;
						top: calc(100% + 0.65rem);
						bottom: auto;
						transform: translateX(-50%);
					}
				}
			</style>
		`;

		this.shadowRoot.append(fragment);

		this.shell = this.shadowRoot.querySelector(".tooltip-shell");
		this.trigger = this.shadowRoot.querySelector(".trigger");
		this.panel = this.shadowRoot.querySelector(".panel");
		this.titleElement = this.shadowRoot.querySelector(".panel-title");
		this.textElement = this.shadowRoot.querySelector(".panel-text");

		this.panel.id = this.tooltipId;
		this.trigger.setAttribute("aria-describedby", this.tooltipId);
		this.titleElement.textContent = this.getAttribute("tooltip-title") ?? "Tooltip";
		this.textElement.textContent = this.getAttribute("tooltip-text") ?? "Add tooltip-text to describe this concept.";

		this.shell.addEventListener("mouseenter", () => {
			this.pointerInside = true;
			this.showTooltip();
		});

		this.shell.addEventListener("mouseleave", () => {
			this.pointerInside = false;
			if (!this.focusInside) {
				this.hideTooltip();
			}
		});

		this.shell.addEventListener("focusin", () => {
			this.focusInside = true;
			this.showTooltip();
		});

		this.shell.addEventListener("focusout", (event) => {
			const nextTarget = event.relatedTarget;
			this.focusInside = nextTarget ? this.shadowRoot.contains(nextTarget) : false;

			if (!this.focusInside && !this.pointerInside) {
				this.hideTooltip();
			}
		});

		this.trigger.addEventListener("click", () => {
			if (this.isOpen && !this.pointerInside) {
				this.hideTooltip();
				return;
			}

			this.showTooltip();
		});

		this.trigger.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				this.hideTooltip();
				this.trigger.blur();
			}
		});

		this.updateTooltipState();
	}

	showTooltip() {
		this.isOpen = true;
		this.updateTooltipState();
	}

	hideTooltip() {
		this.isOpen = false;
		this.updateTooltipState();
	}

	updateTooltipState() {
		this.panel.hidden = !this.isOpen;
		this.trigger.setAttribute("aria-expanded", String(this.isOpen));
	}
}

customElements.define("learning-tooltip", LearningTooltip);