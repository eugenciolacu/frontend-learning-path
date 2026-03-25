class StudentProfileCard extends HTMLElement {
	static observedAttributes = ["name", "track", "level"];

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
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
		const template = document.getElementById("profile-card-template");
		const fragment = template.content.cloneNode(true);

		fragment.querySelector(".name").textContent = this.getAttribute("name") ?? "Unknown student";
		fragment.querySelector(".track").textContent = this.getAttribute("track") ?? "Unassigned track";
		fragment.querySelector(".level").textContent = `Current level: ${this.getAttribute("level") ?? "Not set"}`;

		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: block;
				}

				.card {
					// height: 100%;
					padding: 1.5rem;
					border-radius: 24px;
					background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
					color: #e2e8f0;
					box-shadow: 0 20px 45px rgba(15, 23, 42, 0.16);
				}

				.badge {
					display: inline-block;
					margin-bottom: 1rem;
					padding: 0.35rem 0.75rem;
					border-radius: 999px;
					background: rgba(56, 189, 248, 0.2);
					color: #bae6fd;
					font-size: 0.85rem;
					font-weight: 600;
				}

				h2 {
					margin: 0 0 0.5rem;
					font-size: 1.5rem;
				}

				p {
					margin: 0.35rem 0;
					line-height: 1.5;
				}
			</style>
		`;

		this.shadowRoot.append(fragment);
	}
}

customElements.define("student-profile-card", StudentProfileCard);