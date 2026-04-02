# Example 4: Scope Strategies - CSS Modules, CSS-in-JS, and Utilities

## Purpose
This example compares three ways to style the same button component in a React application.

## Files
- `index.html` and `styles.css`: standalone browser preview of the comparison.
- `Button.module.css` and `Button.module.jsx`: build-time local scoping with CSS Modules.
- `Button.styled.jsx`: prop-driven styling with Styled Components.
- `Button.tailwind.jsx`: utility-first styling in markup.

## What to Notice
- All three implementations solve the same UI problem.
- The difference is where the styling lives and how variants are expressed.
- CSS Modules keep standard CSS files.
- CSS-in-JS keeps styles close to component logic.
- Utility classes make the visual decisions visible directly in markup.

## How to Use
- Open `index.html` in a browser for a visual overview.
- Read the JSX files to compare how each strategy expresses the same button component.
