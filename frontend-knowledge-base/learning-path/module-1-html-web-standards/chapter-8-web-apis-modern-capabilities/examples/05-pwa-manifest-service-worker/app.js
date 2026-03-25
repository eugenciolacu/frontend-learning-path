const connectionStatus = document.getElementById("connection-status");
const workerStatus = document.getElementById("worker-status");

function renderConnectionStatus() {
	connectionStatus.textContent = navigator.onLine
		? "You are currently online. Cached files should still be available if the network drops."
		: "You are currently offline. This page should still work if it was cached before.";
}

renderConnectionStatus();

window.addEventListener("online", renderConnectionStatus);
window.addEventListener("offline", renderConnectionStatus);

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("sw.js")
		.then((registration) => {
			workerStatus.textContent = `Service Worker registered with scope: ${registration.scope}`;
		})
		.catch((error) => {
			workerStatus.textContent = `Service Worker registration failed: ${error.message}`;
		});
} else {
	workerStatus.textContent = "Service Workers are not supported in this browser.";
}