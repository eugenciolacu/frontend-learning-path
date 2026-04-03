const lessons = [
	{
		id: "flip",
		kicker: "Layout Motion",
		title: "FLIP for Card Sorting",
		description: "Measure the first and last positions of each element, invert the delta with a transform, and then let the element play into place.",
		duration: "40 minutes",
		focus: "Transform-based layout transitions",
		gradient: ["#d4f6e7", "#3ba57d"]
	},
	{
		id: "view-transitions",
		kicker: "Navigation Motion",
		title: "View Transition Basics",
		description: "Wrap a DOM update in startViewTransition so the browser can connect the old and new visual states with smoother motion.",
		duration: "35 minutes",
		focus: "Same-document visual state changes",
		gradient: ["#d5eefc", "#3e8ec7"]
	},
	{
		id: "scroll-timeline",
		kicker: "Scroll Effects",
		title: "Scroll-Driven Reveals",
		description: "Use animation timelines tied to scroll or view progress so elements respond declaratively to user scrolling.",
		duration: "30 minutes",
		focus: "Modern CSS animation timelines",
		gradient: ["#fae6c7", "#d7892b"]
	}
];

const gallery = document.getElementById("gallery");
const detailVisual = document.getElementById("detail-visual");
const detailKicker = document.getElementById("detail-kicker");
const detailTitle = document.getElementById("detail-title");
const detailDescription = document.getElementById("detail-description");
const detailDuration = document.getElementById("detail-duration");
const detailFocus = document.getElementById("detail-focus");

let activeLessonId = lessons[0].id;

function setGradient(element, gradient) {
	element.style.setProperty("--accent-start", gradient[0]);
	element.style.setProperty("--accent-end", gradient[1]);
}

function renderGallery() {
	gallery.innerHTML = "";

	for (const lesson of lessons) {
		const card = document.createElement("button");
		card.type = "button";
		card.className = "lesson-card";
		card.dataset.lessonId = lesson.id;
		if (lesson.id === activeLessonId) {
			card.classList.add("is-active");
		}

		const visual = document.createElement("div");
		visual.className = "lesson-visual";
		setGradient(visual, lesson.gradient);

		const kicker = document.createElement("p");
		kicker.className = "detail-kicker";
		kicker.textContent = lesson.kicker;

		const title = document.createElement("h2");
		title.textContent = lesson.title;

		const description = document.createElement("p");
		description.textContent = lesson.description;

		card.append(visual, kicker, title, description);
		card.addEventListener("click", () => updateLesson(lesson.id));
		gallery.appendChild(card);
	}
}

function renderDetail(lesson) {
	setGradient(detailVisual, lesson.gradient);
	detailKicker.textContent = lesson.kicker;
	detailTitle.textContent = lesson.title;
	detailDescription.textContent = lesson.description;
	detailDuration.textContent = lesson.duration;
	detailFocus.textContent = lesson.focus;
	activeLessonId = lesson.id;
	renderGallery();
}

function updateLesson(lessonId) {
	if (lessonId === activeLessonId) {
		return;
	}

	const nextLesson = lessons.find((lesson) => lesson.id === lessonId);
	const render = () => renderDetail(nextLesson);

	if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		render();
		return;
	}

	document.startViewTransition(render);
}

renderDetail(lessons[0]);