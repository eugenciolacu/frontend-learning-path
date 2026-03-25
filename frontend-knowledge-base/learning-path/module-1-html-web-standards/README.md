# Module 1: HTML & Web Standards

## Overview
This module builds a strong foundation in HTML, starting with document structure and core text elements, then moving through links, images, lists, tables, forms, semantic layout, embedded media, and advanced browser-facing capabilities. It combines standards-based markup, accessibility, SEO-aware structure, and practical examples so learners can move from writing valid documents to building accessible, production-ready interfaces and modern HTML-driven experiences.

## Learning Objectives
- Understand the role of HTML as the structural language of the web and apply correct document anatomy.
- Use core HTML elements for text, links, images, lists, tables, and forms with valid, readable markup.
- Choose semantic elements that improve accessibility, maintainability, and search engine understanding.
- Write accessible links, images, tables, forms, and media embeds using native HTML features first.
- Apply HTML best practices for metadata, document outline, ARIA usage, focus management, and keyboard navigation.
- Embed audio, video, iframes, and SVG content responsibly with attention to performance, privacy, and usability.
- Understand how HTML connects to modern browser capabilities such as Web Components, validation APIs, manifests, and Service Workers.
- Reinforce theory through hands-on examples and mini-projects that progress from static pages to interactive HTML-based solutions.

## Prerequisites
- None.
- Basic familiarity with using a code editor and web browser is helpful.

## Chapters

### Chapter 1: HTML Foundations
Introduces HTML as the backbone of the web and explains how browsers interpret document structure.

Topics covered:
- What HTML is, its history, and its role in web development.
- Anatomy of an HTML document: doctype, html, head, body, metadata, title, scripts, and linked resources.
- Core content elements: headings, paragraphs, line breaks, and horizontal rules.
- Text formatting elements such as strong, emphasis, underline, subscript, superscript, code, and blockquote.
- Comments, whitespace behavior, browser rendering notes, and common mistakes.
- Foundational accessibility practices such as using language metadata and semantic structure.

Practice assets:
- `01-basic-structure.html`
- `02-headings-paragraphs.html`
- `03-linebreaks-hr.html`
- `04-text-formatting.html`
- `05-comments-whitespace.html`

### Chapter 2: Working with Links and Images
Focuses on navigation, image embedding, responsive media, and accessible linking behavior.

Topics covered:
- Anchor tags and the `href` attribute.
- Internal links, external links, fragment links, `mailto:` links, and `tel:` links.
- Safe new-tab behavior with `target="_blank"` and `rel="noopener noreferrer"`.
- Writing meaningful link text for usability, accessibility, and SEO.
- Image fundamentals with `src`, `alt`, `title`, `width`, `height`, and `loading`.
- Informative, decorative, and functional images.
- Responsive images with `srcset` and `sizes`.
- Linked images, captions, and common performance mistakes.

Practice assets:
- `01-internal-and-external-links`
- `02-mailto-and-tel-links`
- `03-image-basics`
- `04-responsive-images`
- `05-linked-images-and-new-tabs`
- `06-accessible-links-and-images`

### Chapter 3: Lists and Tables
Teaches how to represent grouped information and tabular data with the right semantics.

Topics covered:
- Unordered, ordered, and description lists.
- Nested list structures and when each list type is appropriate.
- Table fundamentals with `table`, `tr`, `th`, and `td`.
- Table sectioning with `thead`, `tbody`, and `tfoot`.
- Complex cell relationships using `colspan` and `rowspan`.
- Table accessibility with captions, headers, `scope`, and clear data relationships.
- Best practices for avoiding layout tables and maintaining readable structures.

Practice assets:
- `unordered-and-nested-lists`
- `ordered-list-attributes`
- `description-list-course-glossary`
- `colspan-rowspan-class-schedule`
- `accessible-student-results-table`

### Chapter 4: Forms and User Input
Introduces HTML forms as the bridge between user interaction and data submission.

Topics covered:
- The `form` element and key attributes such as `action`, `method`, `autocomplete`, `novalidate`, and `enctype`.
- GET vs POST and how browsers submit name/value pairs.
- The importance of the `name` attribute.
- Common input types: text, password, email, number, date, checkbox, radio, file, and hidden.
- Labels, grouping, and form structure for usability and accessibility.
- Browser validation concepts and practical user input workflows.

Practice assets:
- `basic-search-form-get`
- `login-form-post`
- `course-registration-form`
- `feedback-form-validation`
- `file-upload-and-hidden-input`

### Chapter 5: Semantic HTML & Structure
Builds an architectural understanding of meaningful HTML and page-level landmarks.

Topics covered:
- Semantic vs non-semantic elements.
- Structural landmarks: `header`, `nav`, `main`, `article`, `section`, `aside`, and `footer`.
- Page organization with meaningful regions and content hierarchy.
- Inline vs block-level behavior.
- Accessibility implications of landmarks, tab order, and assistive technology navigation.
- Choosing native semantics before generic containers.

Practice assets:
- `semantic-vs-nonsemantic-structure`
- `semantic-page-landmarks`
- `article-section-aside-demo`
- `inline-vs-block-elements`
- `accessibility-landmarks-and-tab-order`

### Chapter 6: Embedding Content
Explains how to include media and external resources while balancing compatibility, accessibility, privacy, and performance.

Topics covered:
- Audio embedding with `audio`, `source`, and media attributes.
- Video embedding with controls, posters, multiple sources, and captions via `track`.
- Fallback strategies for unsupported media.
- Iframe embedding and the security implications of third-party content.
- SVG embedding techniques and media accessibility considerations.
- Performance and user experience tradeoffs such as autoplay, preload behavior, and large file handling.

Practice assets:
- `01-audio-element-basics`
- `02-video-element-and-captions`
- `03-iframe-embedding-and-sandbox`
- `04-svg-embedding-techniques`

### Chapter 7: HTML Architecture & Semantics (Advanced)
Extends semantic HTML into production concerns such as content architecture, metadata orchestration, accessibility conformance, and keyboard interaction.

Topics covered:
- Advanced semantic HTML and document outline strategy.
- Heading hierarchy and explicit structural clarity.
- Page architecture through landmarks, articles, sections, and supporting regions.
- SEO-focused head management with title, description, canonical, robots, Open Graph, and Twitter metadata.
- Advanced accessibility topics including WCAG-oriented structure, ARIA roles, states, and properties.
- Focus management and keyboard navigation patterns for interactive experiences.

Practice assets:
- `01-semantic-document-outline`
- `02-seo-meta-tags-orchestration`
- `03-aria-roles-states-properties`
- `04-focus-management-keyboard-navigation`

### Chapter 8: Web APIs & Modern Capabilities (Advanced)
Shows how HTML integrates with the wider browser platform to support reusable components, richer graphics, stronger form flows, and offline-ready experiences.

Topics covered:
- Web Components with Custom Elements, Shadow DOM, slots, and HTML templates.
- Browser platform thinking: DOM, rendering, storage, networking, and progressive enhancement.
- Graphics capabilities through Canvas, WebGL, and SVG-related workflows.
- Advanced form behavior with the Constraint Validation API and custom controls.
- Offline and installable experiences through web app manifests and Service Workers.
- Practical concerns around support, accessibility, security boundaries, and progressive enhancement.

Practice assets:
- `01-custom-elements-shadow-dom`
- `02-canvas-svg-webgl-basics`
- `03-constraint-validation-api`
- `04-form-associated-custom-element`
- `05-pwa-manifest-service-worker`

## Mini-Projects
The module concludes with larger practice exercises that combine multiple chapter concepts:

- `personal-homepage`: document structure, semantic layout, images, and presentation-ready HTML.
- `contact-form-with-validation`: forms, labels, validation, and user input workflows.
- `web-component-based-custom-tooltip`: advanced HTML platform capabilities, reusable components, and progressive enhancement.

## Module Outcomes
By the end of this module, learners should be able to create standards-compliant HTML documents, structure content semantically, build accessible navigation and forms, embed media responsibly, and understand how modern HTML participates in richer browser application features.
