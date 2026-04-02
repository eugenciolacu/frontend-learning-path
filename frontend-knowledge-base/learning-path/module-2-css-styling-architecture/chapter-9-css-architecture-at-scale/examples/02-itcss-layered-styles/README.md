# Example 2: ITCSS Layered Styles

## Purpose
This example shows how ITCSS organizes styles from broad low-specificity rules to narrow component rules.

## Layer Order
1. `settings.tokens.css`
2. `generic.reset.css`
3. `elements.base.css`
4. `objects.layout.css`
5. `components.course-card.css`
6. `utilities.helpers.css`

## What to Notice
- Earlier layers set up the environment.
- Later layers become more specific in purpose, not necessarily in selector weight.
- Utility classes live near the end because they are designed to be applied intentionally in markup.

## How to Use
Open `index.html` and review `styles/main.css` to see the import order.
