/**
 * script.js — Animated Card UI
 * Module 2: CSS & Styling Architecture — Mini-Project
 *
 * This file provides two progressive enhancements only.
 * All core visual styling lives in style.css.
 *
 * 1. Scroll-reveal fallback (Chapter 10)
 *    Modern browsers use animation-timeline: view() in CSS.
 *    Older browsers (or those where the @supports guard fails)
 *    receive IntersectionObserver-driven class-toggle animation instead.
 *
 * 2. Flip card keyboard interaction (Chapter 6 + Accessibility)
 *    Flip cards are <div role="button"> elements with tabindex="0".
 *    Keyboard users expect Enter and Space to activate them.
 */

"use strict";

/* ================================================================
   1. SCROLL-DRIVEN REVEAL FALLBACK
   Chapter 10: animation-timeline: view() is the CSS-native approach.
               CSS.supports() detects whether it is available.
               If not, IntersectionObserver triggers the .is-visible
               class which activates the @supports not {} CSS block.
   ================================================================ */

/**
 * Returns true when the browser natively supports scroll-driven
 * animations via animation-timeline: view().
 */
const supportsScrollTimeline = CSS.supports("animation-timeline: view()");

if (!supportsScrollTimeline) {
	/**
	 * Set up IntersectionObserver for all .reveal-card elements.
	 *
	 * threshold: 0.15 — the callback fires when at least 15% of the
	 * card has entered the viewport, matching the visual timing of the
	 * CSS animation-range: entry 0% entry 40% fallback.
	 */
	const revealCards = document.querySelectorAll(".reveal-card");

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;

				const card = entry.target;

				/**
				 * Chapter 8: --stagger is a CSS custom property set inline
				 * in HTML (e.g. style="--stagger: 2").
				 * getPropertyValue returns a string; Number() converts it.
				 * calc() in CSS handles the stagger ms delay, but here we
				 * replicate the same logic in JS for the class-toggle path.
				 */
				const stagger = Number(
					card.style.getPropertyValue("--stagger") || "0"
				);

				/**
				 * Delay the class addition so cards stagger their entrance:
				 * card 0 → 0 ms, card 1 → 80 ms, card 2 → 160 ms, etc.
				 * This mirrors the CSS transition-delay: calc(--stagger * 80ms)
				 * defined in the @supports not block in style.css.
				 */
				setTimeout(() => {
					card.classList.add("is-visible");
				}, stagger * 80);

				/* Stop observing once the card has been revealed */
				observer.unobserve(card);
			}
		},
		{ threshold: 0.15 }
	);

	for (const card of revealCards) {
		observer.observe(card);
	}
}


/* ================================================================
   2. FLIP CARD KEYBOARD INTERACTION
   Accessibility: <div role="button" tabindex="0"> elements must
   respond to Enter and Space keydown events, matching the
   behaviour expected of a native <button> element.
   Chapter 6: .is-flipped is the class that triggers the CSS
              rotateY(180deg) transform defined in style.css.
   ================================================================ */

const flipCards = document.querySelectorAll(".flip-card");

for (const card of flipCards) {
	card.addEventListener("keydown", (event) => {
		if (event.key !== "Enter" && event.key !== " ") return;

		/* Prevent the Space key from scrolling the page */
		event.preventDefault();

		/**
		 * Toggle .is-flipped so pressing Enter/Space a second time
		 * flips the card back to the front face.
		 * The CSS transition in .flip-card__inner handles the animation.
		 */
		card.classList.toggle("is-flipped");
	});
}
