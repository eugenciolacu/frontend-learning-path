import styles from "./Button.module.css";

export function Button({ tone = "primary", children = "Enroll now" }) {
	const toneClass = tone === "secondary" ? styles.secondary : styles.primary;

	return <button className={`${styles.button} ${toneClass}`}>{children}</button>;
}
