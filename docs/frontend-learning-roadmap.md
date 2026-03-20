# Frontend Learning Roadmap: Junior to Senior

## Module 1: HTML & Web Standards

### Chapter 1: HTML Foundations
- What is HTML? History and role in the web
- Anatomy of an HTML document (doctype, html, head, body)
- Basic tags: headings (h1 - h6), paragraphs, line breaks, horizontal rules
- Text formatting: bold, italic, underline, subscript, superscript, code, blockquote
- Comments and whitespace

### Chapter 2: Working with Links and Images
- Anchor tags: internal, external, mailto, tel
- Image tags: src, alt, title, responsive images (srcset)
- Linking images, opening links in new tabs, accessibility for links/images

### Chapter 3: Lists and Tables
- Unordered, ordered, and description lists
- Table structure: table, tr, th, td, thead, tbody, tfoot, colspan, rowspan
- Table accessibility and best practices

### Chapter 4: Forms and User Input
- Form element, action, method, GET vs POST
- Input types: text, password, email, number, date, checkbox, radio, file, hidden
- Labels, fieldsets, legends, placeholders, required, disabled, readonly
- Buttons: submit, reset, button
- Select, option, textarea
- Form validation: required, pattern, min/max, custom validation

### Chapter 5: Semantic HTML & Structure
- Sectioning elements: header, nav, main, article, section, aside, footer
- Inline vs block elements
- Semantic vs non-semantic tags
- Accessibility: ARIA roles, alt text, tab order, landmarks

### Chapter 6: Embedding Content
- Audio and video tags: controls, autoplay, loop, source
- Iframes: embedding YouTube, Google Maps, other sites
- Embedding SVG and other media

### Chapter 7: HTML Architecture & Semantics (Advanced)
- Deep dive into Semantic HTML and Document Outline
- SEO best practices and meta tags orchestration
- Advanced Accessibility: WCAG 2.1/2.2 AA & AAA compliance, ARIA roles, states, and properties
- Focus management and keyboard navigation strategies, screen reader compatibility

### Chapter 8: Web APIs & Modern Capabilities (Advanced)
- Web Components: Custom Elements, Shadow DOM, HTML Templates
- Canvas API, WebGL, and SVG manipulation
- Forms: Advanced validation API, custom form controls mapping
- Offline capabilities: App Manifests, integration with Service Workers

### Mini-Projects (HTML)
- Personal homepage
- Contact form with validation
- Web component-based custom tooltip

---

## Module 2: CSS & Styling Architecture

### Chapter 1: CSS Syntax and Selectors
- CSS syntax: selectors, properties, values, comments
- Basic selectors: element, class, id
- Advanced selectors: descendant, child, sibling, attribute, pseudo-class, pseudo-element
- Specificity and inheritance

### Chapter 2: The Box Model and Layout
- Box model: content, padding, border, margin
- Display: block, inline, inline-block, none
- Position: static, relative, absolute, fixed, sticky
- Float and clear
- Overflow, z-index

### Chapter 3: Typography and Colors
- Fonts: font-family, font-size, font-weight, font-style, line-height
- Web fonts (Google Fonts)
- Text alignment, decoration, transform, spacing
- Colors: named, hex, rgb, rgba, hsl, hsla
- Backgrounds: color, image, repeat, position, size, gradients

### Chapter 4: Responsive Design
- Media queries: breakpoints, min/max width/height
- Mobile-first vs desktop-first
- Viewport meta tag
- Responsive images and typography

### Chapter 5: Flexbox and Grid
- Flexbox: container, direction, wrap, justify-content, align-items, align-content, order, flex-grow/shrink/basis
- Common flexbox layouts (navbars, cards, sidebars)
- CSS Grid: container, rows, columns, areas, gap, fr units
- Grid templates and responsive grids

### Chapter 6: Advanced Styling
- Pseudo-classes: hover, active, focus, nth-child, etc.
- Pseudo-elements: before, after, first-line, first-letter
- Transitions and animations: transition, keyframes, animation
- CSS variables (custom properties)
- Shadows, filters, border-radius, clip-path

### Chapter 7: CSS Frameworks & Libraries
- Installing Bootstrap (CDN, npm) or Tailwind CSS
- Utility classes and grid systems
- Customizing frameworks with variables and themes

### Chapter 8: Advanced CSS Concepts (Advanced)
- CSS Object Model (CSSOM) and Critical Rendering Path
- Modern Layouts: Advanced Grid (subgrid, masonry), Flexbox mastery
- Container Queries layer, CSS Custom Properties architecture
- CSS functions: clamp(), min(), max(), calc(), color spaces (lch, oklab)

### Chapter 9: CSS Architecture at Scale (Advanced)
- Methodologies: BEM, ITCSS, CUBE CSS, Utility-first
- CSS-in-JS (Styled Components, Emotion) vs CSS Modules vs Utility Frameworks (Tailwind)
- Preprocessors and Postprocessors: Sass advanced tooling, PostCSS ecosystem
- Design Tokens and Component Library architecture

### Chapter 10: Animation and Visual Performance (Advanced)
- High-performance animations (FLIP technique, hardware acceleration)
- View Transitions API
- Scroll-driven animations

### Mini-Projects (CSS)
- Responsive landing page
- Animated card UI
- Complete design system implementation using Storybook

---

## Module 3: JavaScript

### Chapter 1: JS Basics
- What is JavaScript? Where does it run?
- Variables: var, let, const, scope
- Data types: string, number, boolean, null, undefined, symbol, bigint
- Operators: arithmetic, assignment, comparison, logical, ternary

### Chapter 2: Control Flow and Functions
- Conditionals: if, else, else if, switch
- Loops: for, while, do-while, for...of, for...in
- Functions: declaration, expression, arrow functions, parameters, return, default/rest/spread
- Scope, hoisting, closures

### Chapter 3: Objects and Arrays
- Creating and using objects
- Object methods, this keyword
- Arrays: creation, methods (push, pop, shift, unshift, map, filter, reduce, etc.)
- Destructuring, spread/rest with objects and arrays

### Chapter 4: The DOM and Events
- The DOM tree, selecting elements (getElementById, querySelector, etc.)
- Reading and modifying content and attributes
- Creating, inserting, removing elements
- Event handling: addEventListener, event object, event delegation
- Forms and input events

### Chapter 5: Asynchronous JavaScript
- Callbacks, callback hell
- Promises: creation, chaining, error handling
- Async/await syntax
- Fetch API: GET, POST, working with JSON, error handling
- Working with APIs (public APIs, error handling, CORS)

### Chapter 6: Tooling, Debugging, and Modules
- Console methods (log, warn, error, table, etc.)
- Debugging in browser dev tools
- Linting (ESLint), formatting (Prettier)
- ES Modules: import/export, script type="module", dynamic imports

### Chapter 7: The JavaScript Engine & Execution (Advanced)
- V8 Engine basics, JIT Compilation, Call Stack
- Execution Context, Hoisting, and Scope Chains
- The Event Loop: Microtasks, Macrotasks, Web APIs
- Memory Management, Garbage Collection, and Memory Leaks

### Chapter 8: Advanced Language Mechanics (Advanced)
- Deep dive into `this`, Call/Apply/Bind
- Prototypes, Prototypal Inheritance, Class syntactic sugar, and Polymorphism
- Closures and their practical applications
- Iterators, Generators, and Symbols

### Chapter 9: Advanced Asynchronous Patterns (Advanced)
- Promises under the hood, custom Promise implementations
- Advanced `async/await` patterns, concurrency control, error boundaries
- Streams API, AbortController
- WebSockets, WebRTC, Server-Sent Events (SSE)

### Chapter 10: Design Patterns & Paradigms (Advanced)
- Object-Oriented JS (Creational, Structural, Behavioral patterns)
- Functional Programming (Pure functions, Immutability, Currying, Composition)
- Reactive Programming paradigms (RxJS basics)
- Modularity patterns (IIFE, UMD, CommonJS, ESM)

### Chapter 11: Browser Capabilities & Performance (Advanced)
- Web Workers and Service Workers
- IndexedDB and client-side storage architecture
- Performance APIs (Navigation Timing, Resource Timing, PerformanceObserver)
- Event management: Debounce, Throttle, passive event listeners, Event Delegation

### Mini-Projects (JavaScript)
- Data dashboard with public API
- Implement a custom Promise class from scratch

---

## Module 4: TypeScript

### Chapter 1: TypeScript Fundamentals
- What is TypeScript? Why use it?
- Installing and configuring TypeScript (tsconfig.json)
- Basic types: string, number, boolean, any, unknown, void, never
- Type inference, type annotations

### Chapter 2: Functions and Objects in TS
- Typing function parameters and return values
- Optional and default parameters
- Interfaces and type aliases
- Classes, Inheritance, Polymorphism, and Abstract Classes
- Enums

### Chapter 3: Advanced Types
- Union, intersection, literal types
- Generics
- Type guards, type assertions, keyof, typeof, mapped types

### Chapter 4: Working with JavaScript and Libraries
- Using JS libraries in TS (DefinitelyTyped, @types)
- Migrating JS codebases to TS
- Configuring strict mode and compiler options
- ES Modules and CommonJS Interoperability in TS

### Chapter 5: Advanced Type System (Advanced)
- Union, Intersection, Literal Combinations
- Generic constraints, default generic parameters
- Conditional Types (`infer` keyword)
- Mapped Types, Template Literal Types, Recursive Types

### Chapter 6: Mastery of Utility Types (Advanced)
- Deep dive: Partial, Required, Readonly, Record, Pick, Omit
- Exclude, Extract, NonNullable
- Parameters, ReturnType, InstanceType, ThisType

### Chapter 7: Architecture & Configuration (Advanced)
- Type Narrowing, Discriminated Unions, Custom Type Guards
- Declaration Merging, Module Augmentation, Ambient Namespaces
- Deep dive into `tsconfig.json` (strictness, module resolution, project references)

### Mini-Projects (TypeScript)
- Type-safe generic API client
- Strongly typed Event Emitter

---

## Module 5: React & Modern UI Architectures

### Chapter 1: React Basics
- What is React? SPA concept
- Setting up a React project (Vite, Create React App, etc.)
- JSX syntax and rules
- Components: function vs class, props, state

### Chapter 2: Component Patterns
- Component composition, children, props drilling
- Lifting state up
- Controlled vs uncontrolled components
- Lists and keys, conditional rendering

### Chapter 3: Hooks
- useState, useEffect, useRef
- useContext, useReducer, custom hooks
- Rules of hooks

### Chapter 4: Routing and State Management
- React Router: setup, routes, params, navigation
- Context API for global state
- Introduction to Redux or Zustand (optional)

### Chapter 5: TypeScript with React
- Typing props, state, refs, hooks
- Typing event handlers and forms

### Chapter 6: Testing and Best Practices
- Unit testing with Jest and React Testing Library
- Component structure and folder organization
- Code splitting, lazy loading, error boundaries

### Chapter 7: React Under the Hood (Advanced)
- Fiber Architecture, the Reconciliation process, Virtual DOM
- React Rendering Lifecycle, Commit & Render phases
- Concurrent Mode features: Transitions (`useTransition`), Deferring (`useDeferredValue`)
- React Server Components (RSC) vs Client Components

### Chapter 8: Advanced Component Patterns (Advanced)
- Compound Components
- Render Props and Higher-Order Components (HOCs)
- Custom Hooks Architecture and Composition
- Controlled/Uncontrolled pattern with Form libraries (React Hook Form)

### Chapter 9: State Management at Scale (Advanced)
- Flux architecture evolution
- Redux Toolkit (RTK Query), Zustand, Jotai
- Finite State Machines in UI (XState)
- Context API performance optimization

### Chapter 10: Performance & Optimization (Advanced)
- Memoization: `useMemo`, `useCallback`, `React.memo`
- Identifying and fixing superfluous re-renders (React Profiler)
- Virtualization/Windowing for large lists

### Chapter 11: React Ecosystem & Frameworks (Advanced)
- Server-Side Rendering (SSR) and Static Site Generation (SSG)
- Meta-frameworks: Deep dive into Next.js (App Router) or Remix
- Data fetching architectures (SWR, React Query)

### Mini-Projects (React)
- Multi-page e-commerce store with Context API
- Complex dashboard with Next.js App Router and Server Components

---

## Module 6: Modern Tooling & Build Systems (Advanced)

### Chapter 1: Bundlers and Compilers
- Webpack, Rollup, Vite (esbuild under the hood)
- Loaders, Plugins, Code Splitting configuration
- Transpilers: Babel vs SWC
- Tree-shaking and Dead Code Elimination

### Chapter 2: Monorepos & Workspace Management
- Monorepo tooling (Turborepo, Nx, Lerna)
- Dependency linking, cross-package configurations
- Versioning and publishing strategies

---

## Module 7: System Design & Network Architecture (Advanced)

### Chapter 1: Frontend Architecture
- Micro-frontends (Module Federation)
- Progressive Web Apps (PWA) architecture
- Offline-first strategies

### Chapter 2: API & Network Design
- RESTful principles vs GraphQL vs gRPC
- Advanced caching strategies, Optimistic UI updates
- HTTP/2 and HTTP/3 considerations for frontend
- Authentication & Authorization workflows (OAuth 2.0, OIDC, JWT, Session)

### Chapter 3: Security Basics
- Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF)
- Content Security Policy (CSP), CORS, Subresource Integrity (SRI)
- Secure cookie handling, strict HTTPS

---

## Module 8: Quality Assurance & Delivery (Advanced)

### Chapter 1: Testing Architectures
- Advanced Unit/Integration Testing (Vitest, Jest)
- E2E and Visual Regression Testing (Playwright, Cypress)
- Mocking Service Workers (MSW) for API simulation
- Component Driven Development (Storybook)

### Chapter 2: CI/CD & DevOps for Frontend
- GitHub Actions / GitLab CI for frontend pipelines
- Performance budgeting (Lighthouse CI)
- Deployment strategies (Blue-Green, Canary, Feature Flags)

