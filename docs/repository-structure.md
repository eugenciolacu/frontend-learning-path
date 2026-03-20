# Learning Path Repository Structure Example

```
/learning-path/
  /module-1-html-web-standards/
    README.md                # Module overview, goals, prerequisites
    /chapter-1-html-foundations/
      theory.md              # Main theory/lesson content
      examples/
        example1.html
        example2.html
    /chapter-2-links-images/
      theory.md
      examples/
    ...
  /module-2-css-styling-architecture/
    README.md
    /chapter-1-css-syntax-selectors/
      theory.md
      examples/
    ...
  ...
/shared-resources/           # Reusable images, code snippets, assets
/projects/              # Cross-module or capstone projects
```

## Folder/Document Purpose
- **/learning-path/**: Main content, organized by module and chapter.
- **README.md (per module)**: Overview, learning objectives, prerequisites.
- **theory.md (per chapter)**: Core explanations, concepts, and references.
- **examples/**: Hands-on code, demos, and sample solutions.
- **/shared-resources/**: Images, diagrams, or code used in multiple places.
- **/projects/**: Larger projects that span multiple modules or chapters.

## Example README.md (Module)
```markdown
# Module 1: HTML & Web Standards

## Overview
This module covers the foundations of HTML and web standards, including document structure, tags, and accessibility.

## Learning Objectives
- Understand the role of HTML in the web
- Master basic and advanced HTML elements
- Apply best practices for accessibility and SEO

## Prerequisites
- None

## Chapters
- Chapter 1: HTML Foundations
- Chapter 2: Working with Links and Images
- ...
```

## Example theory.md (Chapter)
```markdown
# Chapter 1: HTML Foundations

## What is HTML?
HTML (HyperText Markup Language) is the standard markup language for creating web pages...

## Anatomy of an HTML Document
- `<!DOCTYPE html>`
- `<html>`, `<head>`, `<body>`

## Key Tags
- Headings: `<h1>`–`<h6>`
- Paragraphs: `<p>`
- ...

## Further Reading
- [MDN HTML Reference](https://developer.mozilla.org/en-US/docs/Web/HTML)
```
