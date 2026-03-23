# Chapter 3: Lists and Tables

## 1. Why Lists and Tables Matter
Lists and tables help you organize information in a way that browsers, search engines, and users can understand quickly.

- Lists group related items in a meaningful order or category.
- Tables display structured data in rows and columns.
- Both improve readability when used for the correct purpose.

This chapter matters because real applications often show navigation menus, feature lists, installation steps, definitions, schedules, pricing, reports, and comparison data. If you choose the wrong HTML structure, your page becomes harder to read, harder to maintain, and less accessible.

## 2. HTML Lists Overview
HTML provides three main list types:

| List Type | Element | Best Use Case |
|-----------|---------|---------------|
| Unordered list | `<ul>` | A collection of items where order does not matter |
| Ordered list | `<ol>` | A sequence of steps or ranked items where order matters |
| Description list | `<dl>` | Terms and their related descriptions or definitions |

Every list type has a semantic meaning. Use the correct one instead of picking a tag only because it looks convenient.

## 3. Unordered Lists
An unordered list uses the `<ul>` element and contains list items inside `<li>` elements.

```html
<ul>
	<li>HTML</li>
	<li>CSS</li>
	<li>JavaScript</li>
</ul>
```

Use unordered lists when the order of items is not important.

Common use cases:
- navigation menus,
- feature lists,
- categories,
- shopping lists,
- technology stacks.

Example:

```html
<h2>Frontend Topics</h2>
<ul>
	<li>HTML structure</li>
	<li>CSS styling</li>
	<li>JavaScript behavior</li>
</ul>
```

Important points:
- `<ul>` is the container.
- `<li>` represents one item in the list.
- Only use `<li>` elements for list items inside `<ul>` and `<ol>`.

## 4. Ordered Lists
An ordered list uses the `<ol>` element. Each item is still written with `<li>`, but the browser numbers the items automatically.

```html
<ol>
	<li>Open the editor</li>
	<li>Create an HTML file</li>
	<li>Run the page in a browser</li>
</ol>
```

Use ordered lists when order matters.

Common use cases:
- instructions,
- algorithms,
- ranked results,
- timelines,
- workflows.

### Useful Ordered List Attributes
The `<ol>` element supports attributes that change numbering behavior.

#### `start`
Starts numbering from a specific value.

```html
<ol start="4">
	<li>Write the CSS</li>
	<li>Test the layout</li>
	<li>Deploy the page</li>
</ol>
```

#### `reversed`
Counts backward.

```html
<ol reversed>
	<li>Launch</li>
	<li>Final review</li>
	<li>Development</li>
</ol>
```

#### `type`
Changes the marker style.

```html
<ol type="A">
	<li>Analysis</li>
	<li>Design</li>
	<li>Implementation</li>
</ol>
```

Possible values include:
- `1` for numbers,
- `A` for uppercase letters,
- `a` for lowercase letters,
- `I` for uppercase Roman numerals,
- `i` for lowercase Roman numerals.

## 5. Description Lists
A description list is used for terms and their descriptions. It uses:

- `<dl>` for the list,
- `<dt>` for the term,
- `<dd>` for the description.

```html
<dl>
	<dt>HTML</dt>
	<dd>The markup language used to structure web pages.</dd>

	<dt>CSS</dt>
	<dd>The language used to style web pages.</dd>
</dl>
```

Description lists are useful for:
- glossaries,
- FAQs,
- metadata blocks,
- configuration explanations,
- key-value reference content.

Do not use a description list just to indent text. Use it only when the content is truly a term-description relationship.

## 6. Nested Lists
You can place a list inside a list item to create a hierarchy.

```html
<ul>
	<li>
		Frontend
		<ul>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
		</ul>
	</li>
	<li>Backend</li>
</ul>
```

This is useful for:
- outlines,
- menu structures,
- module and submodule lists,
- parent-child categories.

Best practice: place the nested list inside the parent `<li>`. This keeps the document structure correct.

Incorrect structure:

```html
<ul>
	<li>Frontend</li>
	<ul>
		<li>HTML</li>
	</ul>
</ul>
```

Correct structure:

```html
<ul>
	<li>
		Frontend
		<ul>
			<li>HTML</li>
		</ul>
	</li>
</ul>
```

## 7. Choosing the Correct List Type
Ask one question first: what relationship exists between the items?

- Use `<ul>` if the order does not matter.
- Use `<ol>` if the order or sequence matters.
- Use `<dl>` if each item is a term paired with a description.

Examples:
- A website menu should usually use `<ul>`.
- A recipe or installation process should use `<ol>`.
- A glossary of technical terms should use `<dl>`.

Choosing semantic HTML matters because assistive technologies use this structure to communicate meaning to users.

## 8. Introduction to Tables
An HTML table is used to display data in rows and columns.

Basic elements:
- `<table>`: the table container,
- `<tr>`: a table row,
- `<th>`: a header cell,
- `<td>`: a data cell.

Basic example:

```html
<table>
	<tr>
		<th>Language</th>
		<th>Purpose</th>
	</tr>
	<tr>
		<td>HTML</td>
		<td>Structure</td>
	</tr>
	<tr>
		<td>CSS</td>
		<td>Presentation</td>
	</tr>
</table>
```

Use tables only for tabular data. Do not use tables to build page layout. Modern layout should be done with CSS.

## 9. Table Structure in Detail
HTML tables can be divided into logical sections.

- `<thead>` groups the header rows.
- `<tbody>` groups the main body rows.
- `<tfoot>` groups summary or footer rows.

Example:

```html
<table>
	<thead>
		<tr>
			<th>Student</th>
			<th>Course</th>
			<th>Grade</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Elena</td>
			<td>HTML</td>
			<td>95</td>
		</tr>
		<tr>
			<td>Matei</td>
			<td>CSS</td>
			<td>91</td>
		</tr>
	</tbody>
	<tfoot>
		<tr>
			<td colspan="2">Average</td>
			<td>93</td>
		</tr>
	</tfoot>
</table>
```

Why these sections matter:
- they make the HTML easier to read,
- they help browsers and tools understand table structure,
- they support styling and scripting more clearly,
- they improve accessibility when used correctly.

## 10. `colspan` and `rowspan`
Some tables need cells that span multiple columns or rows.

### `colspan`
`colspan` makes one cell stretch across multiple columns.

```html
<tr>
	<td colspan="2">Combined Cell</td>
</tr>
```

### `rowspan`
`rowspan` makes one cell stretch across multiple rows.

```html
<tr>
	<td rowspan="2">HTML Track</td>
	<td>Lesson 1</td>
</tr>
<tr>
	<td>Lesson 2</td>
</tr>
```

Use these attributes carefully. When overused, tables become harder to read and maintain.

## 11. Table Accessibility
Accessible tables are easier for everyone to understand, especially users of screen readers.

### Use a `<caption>`
A caption gives the table a clear title.

```html
<table>
	<caption>Frontend Bootcamp Scores</caption>
	<tr>
		<th>Student</th>
		<th>Score</th>
	</tr>
	<tr>
		<td>Ana</td>
		<td>97</td>
	</tr>
</table>
```

### Use `<th>` for Headers
Header cells should use `<th>`, not `<td>`.

```html
<tr>
	<th>Module</th>
	<th>Status</th>
</tr>
```

### Use the `scope` Attribute
The `scope` attribute explains whether a header applies to a row or a column.

```html
<table>
	<tr>
		<th scope="col">Student</th>
		<th scope="col">Grade</th>
	</tr>
	<tr>
		<th scope="row">Alex</th>
		<td>89</td>
	</tr>
</table>
```

Typical values:
- `col` for a column header,
- `row` for a row header.

### Keep Tables Simple
Good accessibility often starts with simple structure.

- Avoid unnecessary merged cells.
- Keep headers clear and specific.
- Make sure each row has the same number of logical columns.
- Do not leave users guessing what a number or abbreviation means.

## 12. Table Best Practices
Follow these practical rules when writing tables:

### Use Tables for Data, Not Layout
This is one of the most important HTML rules.

Bad use:
- placing page sections in columns with `<table>`,
- aligning content visually with table cells,
- building full page designs with rows and columns.

Correct use:
- grades,
- schedules,
- reports,
- product comparison data,
- financial summaries.

### Add Clear Headers
Users should understand what each column and row means immediately.

### Keep Content Consistent
If one column shows percentages, do not mix in dates or text that follow a different pattern without making the meaning explicit.

### Consider Responsive Design
Wide tables can break layouts on small screens. Later, with CSS, you may need horizontal scrolling or alternate mobile presentations. Good HTML structure makes that easier.

### Write Readable Captions and Labels
The caption should explain what the table contains, not repeat a vague word such as "Data" or "Results".

## 13. Common Mistakes
These mistakes appear often in beginner HTML.

### List Mistakes
- using `<br>` instead of a real list,
- using numbers manually instead of `<ol>`,
- placing text directly inside `<ul>` without `<li>`,
- choosing `<ul>` when the order actually matters.

Incorrect:

```html
<p>1. Install VS Code<br>2. Create a file<br>3. Open the browser</p>
```

Better:

```html
<ol>
	<li>Install VS Code</li>
	<li>Create a file</li>
	<li>Open the browser</li>
</ol>
```

### Table Mistakes
- using tables to position page layout,
- using `<td>` for headers instead of `<th>`,
- forgetting captions for important data tables,
- creating very complex merged-cell structures without need,
- not associating headers clearly with data.

## 14. Practical Comparison: Lists vs Tables
Lists and tables solve different problems.

| Content Type | Best Element |
|--------------|--------------|
| Navigation menu | `<ul>` |
| Step-by-step tutorial | `<ol>` |
| Glossary of terms | `<dl>` |
| Student grades report | `<table>` |
| Weekly timetable | `<table>` |

If the content reads like a sequence or collection, use a list. If the content must be compared across rows and columns, use a table.

## 15. Summary
By the end of this chapter, you should understand that:

- `<ul>` is for unordered collections,
- `<ol>` is for ordered sequences,
- `<dl>` is for terms and descriptions,
- `<table>` is for tabular data,
- `<thead>`, `<tbody>`, and `<tfoot>` organize a table,
- `colspan` and `rowspan` merge cells,
- accessibility depends on captions, headers, and semantic structure.

These concepts are fundamental because many real interfaces depend on them. Good semantic HTML makes later CSS styling, JavaScript interaction, testing, and accessibility work much easier.

## Further Reading
- [MDN: HTML Lists](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Lists)
- [MDN: HTML Tables](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_table_basics)
- [MDN: Table Accessibility](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Table_accessibility)
