# Frontend Standards — Reference

Detailed tables and examples for the frontend-standards skill.

## HTML Entity Reference

| Character | Meaning     | Entity  |
|-----------|-------------|---------|
| <         | less than   | `&lt;`  |
| >         | greater than| `&gt;`  |
| &         | ampersand   | `&amp;` |
| (space)   | non-breaking space | `&nbsp;` |
| ®         | Registered  | `&reg;` |
| ©         | Copyright   | `&copy;`|
| ™         | Trademark   | `&trade;`|
| ￥        | Yen         | `&yen;` |

Use halfwidth `;` in code.

## CSS Font Stack

```css
font-family: "メイリオ", "Meiryo", "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "ＭＳ Ｐゴシック", "MS PGothic", "arial", "helvetica", "sans-serif";
```

## CSS Class Prefix Table (Common)

| Category   | Prefix | Examples |
|------------|--------|----------|
| Wrapper    | wrp    | .wrp-container |
| Box        | box    | .box-pict |
| Table      | tbl    | .tbl-data |
| Header     | hdg    | .hdg-page, .hdg-lv1 |
| Navigation | nav    | .nav-global |
| List       | lst    | .lst-note |
| Button     | btn    | .btn, .btn-caution |
| Link       | link   | .link-inner, .link-outer |
| Text       | txt    | .txt-copyright |
| Icon       | icn    | .icn-new |
| Label      | lbl    | .lbl, .lbl-date |
| Form       | form   | .form-submit |
| Error      | err    | .err-input |
| Image      | pct    | .pct-landscape |
| State      | is     | .is-hidden, .is-open, .is-close |

## BEM Quick Reference

- Block: `.[block-name]`
- Element: `.[block-name]__[element-name]`
- Sub-element: `.[block-name]__[element-name]__[sub-element-name]`
- Modifier: `.[block-name]--[modifier]` or `.[block-name]__[element-name]--[modifier]`

Simplified: `c-sectionCheckbox-list-item` instead of `c-sectionCheckbox__list-item` when preferred.

## SMACSS Categories

- **BASE**: reset (html, body, p, ul, li…)
- **LAYOUT**: .l-header, .l-footer, .grid…
- **MODULE**: .btn, .nav, .msg…
- **STATE**: .is-hidden, .is-error, .is-selected
- **THEME**: .theme-spring, .theme-special…

## Example: Small LP (BEM)

```html
<section class="section" id="hero">
  <div class="hero__inner">
    <h1 class="hero__title">Product intro</h1>
    <p class="hero__desc">Quick solution...</p>
    <a href="#" class="btn btn--primary">Register</a>
  </div>
</section>
```

## Example: Large Project (SMACSS + BEM)

```html
<main class="l-main">
  <section class="p-productList">
    <article class="c-card c-card--highlighted">
      <h2 class="c-card__title">Product A</h2>
      <p class="c-card__desc">Details...</p>
      <button class="c-button is-disabled">Buy</button>
    </article>
  </section>
</main>
```

Prefixes: `l-` layout, `p-` page, `c-` component, `u-` utility, `is-` state.

## CSS Comment Style

- Large section:
  `/* ----- [Section Name] ----- */`
- Medium:
  `/* Object / Module ----- */`
- Small/note:
  `/* comment */`
- Separator:
  `/* ----- */`

## Image Type Suffixes (Naming)

| Type   | Suffix | Example |
|--------|--------|---------|
| Header | hdg    | contact-hdg.png |
| Text   | txt    | contact-txt-copyright.png |
| Button | btn    | contact-btn-next.png |
| Icon   | icn    | contact-icn-arrow.png |
| Photo  | pct    | contact-pct-map.png |
| Number | (digits)| contact-icn-arrow01.png |

## Image Format Usage

| Format | Use case |
|--------|----------|
| PNG-8  | Few colors, simple transparency, charts, logos |
| PNG-24 | Alpha transparency |
| JPG    | Photos, many colors |
| GIF    | Animated GIFs (else consider PNG-8) |
| SVG    | Icons, resolution-independent graphics |
| WebP   | Only when explicitly required |

## Breakpoint SCSS (Optional vw-based)

```scss
@mixin pc {
  @media only screen and (max-width: 1600px) and (min-width: 960px) {
    @content;
  }
}

@function get_pc($fsize, $viewport: 1600) {
  $rate: 100 / $viewport;
  @return $rate * $fsize * 1vw;
}

@mixin sp {
  @media (max-width: 960px) {
    @content;
  }
}

@function get_sp($fsize, $viewport: 430) {
  $rate: 100 / $viewport;
  @return $rate * $fsize * 1vw;
}
```

Example:

```scss
.txt-common {
  color: #000;
  font-size: 14px;
  line-height: 26px;
  font-weight: 500;
  @include pc {
    font-size: get_pc(14);
    line-height: get_pc(26);
  }
  @include sp {
    font-size: get_sp(14);
    line-height: get_sp(26);
  }
}
```

## SSI Include Paths

- Store includes in `/common/include/` as `.inc` files.
- Example: `<!--#include virtual="/common/include/header.inc"-->`

## PHP Include

- Use absolute path from document root: `<?php include($_SERVER['DOCUMENT_ROOT'].'/common/include/header.inc'); ?>`
