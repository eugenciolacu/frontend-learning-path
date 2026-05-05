// modules/themes/default.js
export const colors = {
  background: '#ffffff',
  text: '#1e1e2e',
  primary: '#89b4fa',
  accent: '#cba6f7',
};

export function apply() {
  document.body.style.background = colors.background;
  document.body.style.color = colors.text;
  console.log('Default theme applied');
}
