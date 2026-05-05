// modules/themes/high-contrast.js
export const colors = {
  background: '#000000',
  text: '#ffffff',
  primary: '#ffff00',
  accent: '#00ffff',
};

export function apply() {
  document.body.style.background = colors.background;
  document.body.style.color = colors.text;
  console.log('High Contrast theme applied');
}
