---
name: cxl-frontend-standards
description: Applies HTML, CSS, JavaScript, and asset standards for web frontends. Use when writing or reviewing frontend code, markup, styles, scripts, image naming, directory structure, or responsive breakpoints.
---

# CXL Frontend Standards

Apply this skill when building or reviewing frontend code to ensure consistent quality, maintainability, and team alignment.

## When to Use

- Writing or editing HTML, CSS, or JavaScript for web pages
- Setting up or refactoring frontend directory structure
- Naming classes, IDs, files, folders, or images
- Implementing responsive layout or breakpoints
- Reviewing markup, styles, or scripts for compliance

## Core Principles

1. Mark up content with semantics and structure in mind.
2. Keep source minimal; write only what is needed.
3. Allow flexibility where content may grow or shrink.
4. Structure for easy operation and multi-person development.
5. Optimize for the user’s environment and devices.

---

## HTML

- **Charset**: UTF-8 (no BOM). Line endings: LF.
- **DOCTYPE**: HTML5 unless otherwise specified.
- **Markup**: Use elements that match content; follow W3C HTML5. Indent with tabs inside `<body>`.
- **Paths**: Prefer absolute paths for in-page links and images (e.g. `/company/index.html`). For SSI use `<!--#include virtual="/common/include/header.inc"-->`; for PHP use `$_SERVER['DOCUMENT_ROOT'].'/path'`.
- **Headings**: One `<h1>` per page (page title or logo on home). Use `<h2>`, `<h3>`, etc. in logical order. Wrap heading + subtitle in `<hgroup>`.
- **Images**: Always set `width` and `height` on `<img>`. Use `<img>` for content images (not background). Always set `alt`; use `alt=""` for decorative images.
- **Forms**: Wrap checkbox/radio in `<label>` (e.g. `<label><input type="checkbox">Label</label>`).
- **Sections**: Use `<section id="...">` to separate major page areas.
- **Other**: Lowercase tags and attributes. Attribute order: `class="base-name utility-class"`. Close all tags. Use halfwidth for numbers and Latin. Avoid `<table>` for layout. Encode special chars (e.g. `&lt;`, `&gt;`, `&amp;`, `&nbsp;`, `&copy;`, `&reg;`, `&trade;`, `&yen;`). Encode email with entities.

---

## CSS

- **Charset**: UTF-8 (no BOM). Use CSS2.1/CSS3; vendor prefixes (-moz-, -webkit-) when needed.
- **IDs**: Meaningful, hyphenated, no camelCase or underscore (e.g. `#document`, `#header`, `#nav-global`).
- **Classes**: Meaningful; hyphenated; no camelCase/underscore. Use BEM or SMACSS as appropriate.
  - **Small/LP**: BEM with short, descriptive names; sections as blocks.
  - **Large/long-term**: SMACSS + BEM — prefixes `l-`, `p-`, `c-`, `u-`, `is-`; components like `c-button`, `c-card`; BEM inside components (e.g. `c-card__title`, `c-card--highlighted`).
- **State classes**: Use `active` for active, `rollover` for hover when standardizing.
- **Selectors**: One property per line; indent with tab; space before value. Prefer low specificity (BEM). Avoid structure-dependent selectors (e.g. `.example div h3`).
- **Shorthand**: Prefer one shorthand (e.g. `margin`) over multiple longhand when setting more than one value.
- **Colors**: 6-digit hex lowercase; 3-digit when possible (e.g. `#fde96c`, `#000`, `#f00`).
- **Comments**: Use consistent comment blocks for sections (see [reference.md](reference.md)).
- Avoid inline styles. CSS variables and SASS/SCSS are allowed.

---

## JavaScript

- **Encoding**: UTF-8 (no BOM). Shared scripts in external files (e.g. `script.js`). jQuery is optional.
- **Naming**: camelCase for variables and functions; prefix jQuery objects with `$` (e.g. `$navItem`).
- **Classes in JS**: Do not use CSS-defined classes for JS behavior. Use a separate class with prefix `.js-` for JS hooks (e.g. `.js-open-menu`).

---

## Directory Structure

- **Root**: `index.html`, `assets/` (css, images, js, optionally libs), category folders with their `index.html`.
- **Assets**: `assets/css/`, `assets/images/`, `assets/js/`; add `libs/js/`, `libs/css/` for third-party libs if needed.
- **Folders**: Lowercase letters, digits, hyphen; no leading `-` or `_`; no spaces; multi-word with hyphen (e.g. `services/`, `contact/`). Use 2-digit numbers when needed (01, 02, …).
- **Images**: Shared under `assets/images/`; section-specific under `assets/images/section-name/`.
- **Files**: Lowercase a–z, 0–9, hyphen; no leading `-` or `_`; max 31 chars including extension.

---

## Image Naming and Usage

- **Template**: `[page-or-category]-[type]-[detail]-[2-digit-number].ext` (e.g. `faq-hdg-arrow01.gif`). Type suffixes: hdg, txt, btn, icn, pct (see [reference.md](reference.md)).
- **Formats**: PNG-8 for limited colors/transparency; PNG-24 for alpha; JPG for photos; GIF for animation; SVG for resolution-independent icons; WebP only if specified.
- **Dimensions**: Prefer even pixel sizes (Retina). Always set `width` and `height` on `<img>`.
- **Lazy loading**: Use `loading="lazy"` for non-critical large images.

---

## Breakpoints

- Default breakpoint: **960px** (PC vs SP) unless specified otherwise.
- Add more breakpoints between 960px and design width if layout breaks.
- Optional: fluid scaling with `vw` (e.g. PC viewport 1600px, SP 430px). See [reference.md](reference.md) for SCSS mixins `get_pc()`, `get_sp()` and `@mixin pc`, `@mixin sp`.

---

## Cleanup Before Delivery

Remove: `Thumbs.db`, `_notes`, `.bak`, `.DS_Store`, and files starting with `._`.

---

## Additional Reference

- Full class prefix tables, BEM/SMACSS examples, entity list, font stack, and breakpoint SCSS: [reference.md](reference.md).
