---
name: cxl-seo
description: Applies on-page and technical SEO best practices for titles, meta tags, headings, structured data, sitemaps, and content. Use when optimizing for search, writing meta descriptions, implementing schema.org/JSON-LD, or when the user mentions SEO, search visibility, or indexing.
---

# CXL SEO

Apply this skill when implementing or reviewing SEO: meta tags, headings, structured data, technical setup, and content signals.

## When to Use

- Adding or editing `<title>`, meta description, Open Graph, or Twitter cards
- Structuring headings (H1–H6) for both users and crawlers
- Implementing structured data (JSON-LD, schema.org)
- Configuring sitemaps, robots.txt, or canonical URLs
- Optimizing content, URLs, or internal links for search

## Core Principles

1. **Crawlability**: Ensure important content is in HTML (not only JS-rendered) and linked from sitemap or internal links.
2. **Clarity**: One clear topic per page; unique title and description; logical heading hierarchy.
3. **Signals**: Use structured data and meta tags to describe content accurately.
4. **Performance**: Fast load and good Core Web Vitals support both UX and ranking.

---

## Title and Meta

- **`<title>`**: Unique per page. 50–60 characters; include primary keyword near the start. Format often: `Primary Keyword | Brand` or `Primary Keyword – Brand`.
- **Meta description**: Unique per page. 150–160 characters; compelling summary with a clear CTA or benefit. Not duplicated from title.
- **Canonical**: Use `<link rel="canonical" href="...">` with absolute URL when a page is accessible via multiple URLs (query params, trailing slash, etc.).
- **Open Graph** (optional but recommended): `og:title`, `og:description`, `og:image`, `og:url`, `og:type`. Keep title/description aligned with SEO meta but can be tailored for social.
- **Twitter Card**: Prefer `summary_large_image`; set `twitter:title`, `twitter:description`, `twitter:image` (and `twitter:card`).

## Headings

- One `<h1>` per page; reflects main topic or page title.
- Use `<h2>`–`<h6>` in logical order (no skipping levels). Headings outline page structure for users and crawlers.
- Include target keywords where natural; avoid keyword stuffing.

## Structured Data (JSON-LD)

- Prefer JSON-LD in `<script type="application/ld+json">` in `<head>` or start of `<body>`.
- Common types: `WebPage`, `Organization`, `Article`, `Product`, `BreadcrumbList`, `FAQPage`.
- Validate with [Google Rich Results Test](https://search.google.com/test/rich-results) or Schema.org validator.
- Do not duplicate visible content in structured data in a misleading way; reflect actual content.

## Technical

- **Sitemap**: Provide `sitemap.xml` (or equivalent) listing important URLs; reference from `robots.txt` with `Sitemap: https://example.com/sitemap.xml`.
- **robots.txt**: Allow crawlers for content that should be indexed; disallow only paths that must not be crawled (e.g. `/admin/`, `/api/`). Do not block CSS/JS if rendering depends on them.
- **URLs**: Prefer short, readable, keyword-relevant paths. Use hyphens; avoid unnecessary query parameters for main content.
- **Internal links**: Link to key pages with descriptive anchor text; avoid generic “click here.”

## Content and UX

- **Above the fold**: Place primary message and key info where users see it without scrolling.
- **Mobile**: Responsive design and mobile-friendly markup; avoid intrusive interstitials.
- **Performance**: Optimize images (format, size, lazy load); minimize render-blocking resources. Core Web Vitals (LCP, INP/FID, CLS) matter for SEO.

## Quick Checklist

- [ ] Unique `<title>` (50–60 chars) and meta description (150–160 chars)
- [ ] Canonical set when multiple URLs serve same content
- [ ] One `<h1>`; heading hierarchy H1→H6 in order
- [ ] JSON-LD where relevant (e.g. Article, Organization, BreadcrumbList)
- [ ] Sitemap and robots.txt configured; no accidental blocking of important content
- [ ] URLs readable and stable; internal links use meaningful anchor text

## Additional Resources

- For detailed meta examples, schema types, and validation links, see [reference.md](reference.md).
