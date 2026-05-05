// modules/heavy-chart.js
// ============================================================
// Simulates a "heavy" charting library (e.g., Chart.js, D3.js).
// In a real project this would be a large third-party import.
// The key point is: this file is NOT loaded until import() is called.
// ============================================================

// Simulated startup cost (mimics a large library initializing)
const BAR_COLORS = ['#89b4fa', '#cba6f7', '#a6e3a1', '#f9e2af', '#f38ba8'];

export function renderChart(container) {
  const data = [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 80 },
    { label: 'Mar', value: 55 },
    { label: 'Apr', value: 90 },
    { label: 'May', value: 72 },
  ];

  const maxValue = Math.max(...data.map((d) => d.value));

  // Build an ASCII-style bar chart using DOM
  container.innerHTML = '';
  container.style.display = 'flex';
  container.style.alignItems = 'flex-end';
  container.style.gap = '12px';
  container.style.padding = '16px';
  container.style.justifyContent = 'center';

  data.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * 100;
    const wrapper = document.createElement('div');
    wrapper.style.cssText =
      'display:flex; flex-direction:column; align-items:center; gap:4px;';

    const bar = document.createElement('div');
    bar.style.cssText = `
      width: 40px;
      height: ${barHeight}px;
      background: ${BAR_COLORS[index % BAR_COLORS.length]};
      border-radius: 4px 4px 0 0;
      transition: height 0.4s ease;
    `;
    bar.title = `${item.label}: ${item.value}`;

    const valueLabel = document.createElement('div');
    valueLabel.textContent = item.value;
    valueLabel.style.cssText = 'font-size:11px; color:#cdd6f4; font-family:monospace;';

    const xLabel = document.createElement('div');
    xLabel.textContent = item.label;
    xLabel.style.cssText = 'font-size:11px; color:#a6adc8; font-family:monospace;';

    wrapper.appendChild(valueLabel);
    wrapper.appendChild(bar);
    wrapper.appendChild(xLabel);
    container.appendChild(wrapper);
  });
}
