/**
 * Nova Design System — Catalog Script
 *
 * Chapter 6:  CSS custom properties driven by JavaScript (theme)
 * Chapter 10: View Transitions API (theme switch animation)
 *             IntersectionObserver — scroll-reveal fallback
 *             Scroll-driven animations (progressive enhancement)
 *
 * All DOM interaction is confined to this file.
 * The stylesheet handles all visual presentation.
 */

(function () {
	'use strict';

	/* ============================================================
	 * 1. THEME TOGGLE
	 *
	 * Reads a saved preference from localStorage, applies it on
	 * load, then toggles between "light" and "dark" on click.
	 *
	 * Uses the View Transitions API (Chapter 10) when available
	 * to animate the theme change with a smooth crossfade.
	 * ============================================================ */

	const themeBtn  = document.getElementById('theme-toggle');
	const htmlEl    = document.documentElement;
	const THEME_KEY = 'nova-ds-theme';

	/**
	 * Apply a theme by setting the data-theme attribute and syncing
	 * the toggle button state.
	 * @param {string} theme - "light" | "dark"
	 */
	function applyTheme(theme) {
		htmlEl.dataset.theme = theme;
		localStorage.setItem(THEME_KEY, theme);

		if (themeBtn) {
			const isDark = theme === 'dark';
			themeBtn.setAttribute('aria-checked', String(isDark));
			themeBtn.classList.toggle('toggle--active', isDark);
		}
	}

	// Restore saved preference (or default to light)
	const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
	applyTheme(savedTheme);

	if (themeBtn) {
		themeBtn.addEventListener('click', () => {
			const nextTheme = htmlEl.dataset.theme === 'dark' ? 'light' : 'dark';

			/* Chapter 10 — View Transitions API for the theme swap.
			 * If not supported, fall back to an instant change.       */
			if (document.startViewTransition) {
				document.startViewTransition(() => applyTheme(nextTheme));
			} else {
				applyTheme(nextTheme);
			}
		});
	}


	/* ============================================================
	 * 2. SIDEBAR NAVIGATION — active state & breadcrumb
	 *
	 * Clicking a nav link marks it as active and updates the
	 * breadcrumb text in the main header.
	 * An IntersectionObserver also updates the active link as
	 * the user scrolls through sections.
	 * ============================================================ */

	const navLinks     = document.querySelectorAll('.sidebar-nav__item a[data-path]');
	const breadcrumbEl = document.getElementById('current-path');

	/** Build a map of section id → nav link for fast lookup. */
	const sectionLinkMap = {};
	navLinks.forEach(link => {
		const href = link.getAttribute('href');
		if (href && href.startsWith('#')) {
			sectionLinkMap[href.slice(1)] = link;
		}
	});

	/** Mark one link as active and clear others. */
	function setActiveLink(link) {
		navLinks.forEach(l => l.classList.remove('is-active'));
		if (link) {
			link.classList.add('is-active');
			if (breadcrumbEl) {
				breadcrumbEl.textContent = link.dataset.path || link.textContent.trim();
			}
		}
	}

	// Click handler — immediately update visual state
	navLinks.forEach(link => {
		link.addEventListener('click', () => setActiveLink(link));
	});

	// Scroll handler — update active link as sections pass the viewport
	const sections = document.querySelectorAll('.story-section[id]');

	const sectionObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const navLink = sectionLinkMap[entry.target.id];
				if (navLink) setActiveLink(navLink);
			}
		});
	}, {
		// Trigger when the top of a section crosses 20% from the viewport top
		rootMargin: '-20% 0px -70% 0px',
		threshold:  0
	});

	sections.forEach(section => sectionObserver.observe(section));


	/* ============================================================
	 * 3. SCROLL-REVEAL (IntersectionObserver fallback)
	 *
	 * Chapter 10 — Scroll-driven animations
	 *
	 * If the browser supports native animation-timeline: view()
	 * the CSS in 07-animations.css handles reveals automatically.
	 * Otherwise, this observer adds .is-revealed when elements
	 * enter the viewport, triggering the CSS transition.
	 * ============================================================ */

	const supportsScrollTimeline = CSS.supports('animation-timeline', 'view()');

	if (!supportsScrollTimeline) {
		const revealEls = document.querySelectorAll('.js-reveal');

		const revealObserver = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-revealed');
					// Stop observing once revealed — the element stays visible
					revealObserver.unobserve(entry.target);
				}
			});
		}, {
			threshold: 0.08
		});

		revealEls.forEach(el => revealObserver.observe(el));
	}


	/* ============================================================
	 * 4. ANIMATED PROGRESS BARS
	 *
	 * Chapter 6:  CSS transition on width
	 * Chapter 10: IntersectionObserver triggers the animation
	 *             only when the bar enters the viewport.
	 *
	 * Each .progress__fill element carries a data-value attribute
	 * (0‑100). The element starts at width: 0 in HTML and grows
	 * to data-value% when observed.
	 * ============================================================ */

	const progressFills = document.querySelectorAll('.progress__fill[data-value]');

	const progressObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const fill  = entry.target;
				const value = parseInt(fill.dataset.value, 10);
				if (!isNaN(value)) {
					// Setting width starts the CSS transition defined in
					// 05-components.css (.progress__fill transition).
					fill.style.width = value + '%';
				}
				progressObserver.unobserve(fill);
			}
		});
	}, {
		threshold: 0.5
	});

	progressFills.forEach(fill => {
		// Ensure bars start at zero before being observed
		fill.style.width = '0%';
		progressObserver.observe(fill);
	});


	/* ============================================================
	 * 5. ALERT DISMISS
	 *
	 * Allows the user to close dismissible alerts by clicking
	 * the × button. Uses a fade-out transition before removal.
	 * ============================================================ */

	document.addEventListener('click', event => {
		const dismiss = event.target.closest('.alert__dismiss');
		if (!dismiss) return;

		const alert = dismiss.closest('.alert');
		if (!alert) return;

		alert.style.transition = 'opacity 150ms ease, transform 150ms ease';
		alert.style.opacity    = '0';
		alert.style.transform  = 'translateY(-4px)';

		alert.addEventListener('transitionend', () => {
			alert.remove();
		}, { once: true });
	});


	/* ============================================================
	 * 6. CHIP TOGGLE
	 *
	 * Interactive chips in the Chip story can be selected and
	 * deselected. State is stored on the element only.
	 * ============================================================ */

	document.addEventListener('click', event => {
		const chip = event.target.closest('.chip--interactive');
		if (!chip) return;
		chip.classList.toggle('chip--selected');
	});

}());
