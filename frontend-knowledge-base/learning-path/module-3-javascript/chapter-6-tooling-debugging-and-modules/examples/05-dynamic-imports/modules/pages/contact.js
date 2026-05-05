// modules/pages/contact.js
export function render() {
  return [
    '=== CONTACT PAGE ===',
    '',
    'This is the Contact page module.',
    'Open DevTools → Network to verify it loaded on demand.',
    '',
    'All three page modules are separate JS files.',
    'Only the current page\'s module was fetched from the server.',
  ].join('\n');
}
