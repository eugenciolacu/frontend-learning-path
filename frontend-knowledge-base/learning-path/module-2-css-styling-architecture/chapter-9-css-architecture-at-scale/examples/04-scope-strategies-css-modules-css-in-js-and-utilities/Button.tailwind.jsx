export function Button({ tone = "primary", children = "Enroll now" }) {
	const toneClasses =
		tone === "secondary"
			? "bg-slate-200 text-slate-900 hover:bg-slate-300"
			: "bg-teal-700 text-white hover:bg-teal-800";

	return (
		<button
			className={`inline-flex items-center justify-center rounded-xl px-4 py-3 font-semibold transition-transform duration-150 hover:-translate-y-px ${toneClasses}`}
		>
			{children}
		</button>
	);
}
