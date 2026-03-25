const chartCanvas = document.getElementById("skill-chart");
const context = chartCanvas.getContext("2d");

const bars = [
	{ label: "HTML", value: 92, color: "#38bdf8" },
	{ label: "CSS", value: 84, color: "#22c55e" },
	{ label: "JS", value: 78, color: "#f59e0b" },
	{ label: "Web APIs", value: 61, color: "#f97316" }
];

function drawChart() {
	context.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
	context.fillStyle = "#020617";
	context.fillRect(0, 0, chartCanvas.width, chartCanvas.height);

	context.fillStyle = "#e2e8f0";
	context.font = "16px Segoe UI";
	context.fillText("Frontend Skills Snapshot", 18, 26);

	bars.forEach((bar, index) => {
		const x = 28 + index * 82;
		const height = bar.value * 1.5;
		const y = 190 - height;

		context.fillStyle = bar.color;
		context.fillRect(x, y, 50, height);

		context.fillStyle = "#cbd5e1";
		context.fillText(bar.label, x - 2, 210);
		context.fillText(`${bar.value}%`, x, y - 10);
	});
}

drawChart();

const ring = document.getElementById("progress-ring");
const progressLabel = document.getElementById("progress-label");
const progressButton = document.getElementById("update-progress");
let progressValue = 68;

function drawRing(value) {
	const radius = 48;
	const circumference = 2 * Math.PI * radius;
	ring.style.strokeDasharray = String(circumference);
	ring.style.strokeDashoffset = String(circumference * (1 - value / 100));
	progressLabel.textContent = `${value}%`;
}

drawRing(progressValue);

progressButton.addEventListener("click", () => {
	progressValue = progressValue >= 100 ? 12 : progressValue + 8;
	drawRing(progressValue);
});

const glCanvas = document.getElementById("gl-canvas");
const glStatus = document.getElementById("gl-status");
const gl = glCanvas.getContext("webgl");

if (!gl) {
	glStatus.textContent = "WebGL is not available. This browser may block GPU rendering or the feature may be disabled.";
} else {
	gl.viewport(0, 0, glCanvas.width, glCanvas.height);
	gl.clearColor(0.07, 0.11, 0.2, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	glStatus.textContent = "WebGL context created successfully. The colored canvas was cleared by the GPU pipeline.";
}