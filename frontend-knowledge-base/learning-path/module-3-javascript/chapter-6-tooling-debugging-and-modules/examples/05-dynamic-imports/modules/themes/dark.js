// modules/themes/dark.js
export const colors = {
  background: '#1e1e2e',
  text: '#cdd6f4',
  primary: '#89b4fa',
  accent: '#cba6f7',
};

export function apply() {
  document.body.style.background = colors.background;
  document.body.style.color = colors.text;
  console.log('Dark theme applied');
}
