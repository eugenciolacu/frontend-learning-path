// modules/pages/home.js
export function render() {
  return [
    '=== HOME PAGE ===',
    '',
    'Welcome to the homepage!',
    'This module was loaded lazily when you navigated here.',
    '',
    'In a real app (React Router, Vue Router, etc.),',
    'each route would use React.lazy() or defineAsyncComponent()',
    'to split the bundle — the same dynamic import() under the hood.',
  ].join('\n');
}
