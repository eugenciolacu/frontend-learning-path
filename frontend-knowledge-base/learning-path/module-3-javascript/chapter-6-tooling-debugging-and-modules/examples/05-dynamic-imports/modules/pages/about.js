// modules/pages/about.js
export function render() {
  return [
    '=== ABOUT PAGE ===',
    '',
    'This is the About page module.',
    'It was NOT downloaded until you clicked "About".',
    '',
    'Code splitting means users only download the code',
    'for pages they actually visit — faster initial load!',
  ].join('\n');
}
