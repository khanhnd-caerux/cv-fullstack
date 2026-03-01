# SEO Reference

Detailed examples and references for the SEO skill.

## Meta Tag Examples

### Basic SEO + Open Graph

```html
<title>How to Bake Sourdough Bread | Kitchen Blog</title>
<meta name="description" content="Step-by-step sourdough recipe with starter tips. Bake your first loaf in 24 hours. No special equipment needed.">
<link rel="canonical" href="https://example.com/blog/sourdough-bread">

<meta property="og:type" content="article">
<meta property="og:title" content="How to Bake Sourdough Bread | Kitchen Blog">
<meta property="og:description" content="Step-by-step sourdough recipe with starter tips. Bake your first loaf in 24 hours.">
<meta property="og:url" content="https://example.com/blog/sourdough-bread">
<meta property="og:image" content="https://example.com/images/sourdough-hero.jpg">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="How to Bake Sourdough Bread | Kitchen Blog">
<meta name="twitter:description" content="Step-by-step sourdough recipe with starter tips.">
<meta name="twitter:image" content="https://example.com/images/sourdough-hero.jpg">
```

### Character Limits (guidelines)

| Element           | Typical range |
|------------------|---------------|
| `<title>`        | 50–60 chars   |
| Meta description | 150–160 chars |
| og:title         | ~60 chars     |
| og:description   | ~155 chars    |

---

## JSON-LD Examples

### Organization (site-wide)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Example Co",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png"
}
```

### Article

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Bake Sourdough Bread",
  "description": "Step-by-step sourdough recipe with starter tips.",
  "image": "https://example.com/images/sourdough-hero.jpg",
  "datePublished": "2025-01-15T09:00:00Z",
  "dateModified": "2025-01-20T14:00:00Z",
  "author": {
    "@type": "Person",
    "name": "Jane Doe"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Kitchen Blog",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  }
}
```

### BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://example.com/blog" },
    { "@type": "ListItem", "position": 3, "name": "Sourdough Bread" }
  ]
}
```

---

## Sitemap and robots.txt

### robots.txt example

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /cart/

Sitemap: https://example.com/sitemap.xml
```

### Sitemap XML (minimal)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2025-02-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/blog/sourdough-bread</loc>
    <lastmod>2025-01-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## Validation and Tools

- **Rich results / structured data**: [Google Rich Results Test](https://search.google.com/test/rich-results)
- **Schema.org validator**: [validator.schema.org](https://validator.schema.org/)
- **Meta/social preview**: Check with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/), [Twitter Card Validator](https://cards-dev.twitter.com/validator) (or equivalent)
- **Core Web Vitals**: [PageSpeed Insights](https://pagespeed.web.dev/), Chrome DevTools Lighthouse

---

## Schema.org Types Quick Reference

| Use case        | Schema type(s)     |
|-----------------|--------------------|
| Company/site    | Organization       |
| Blog post       | Article            |
| Product page    | Product            |
| FAQ section     | FAQPage            |
| Navigation path | BreadcrumbList     |
| Event           | Event              |
| Recipe          | Recipe             |
| Local business  | LocalBusiness      |

Use the official [schema.org](https://schema.org/) documentation for required and recommended properties per type.
