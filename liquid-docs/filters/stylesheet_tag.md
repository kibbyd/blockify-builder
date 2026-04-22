# stylesheet_tag Filter

## Overview
The `stylesheet_tag` filter generates an HTML `<link>` tag for stylesheet resources.

## Syntax
```liquid
string | stylesheet_tag
```

**Returns:** [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
This filter creates a stylesheet link element with predefined attributes:

| Attribute | Value |
|-----------|-------|
| `rel` | `stylesheet` |
| `type` | `text/css` |
| `media` | `all` |

## Basic Usage

**Input:**
```liquid
{{ 'base.css' | asset_url | stylesheet_tag }}
```

**Output:**
```html
<link href="//polinas-potent-potions.myshopify.com/cdn/shop/t/4/assets/base.css?v=88290808517547527771663872409" rel="stylesheet" type="text/css" media="all" />
```

## Parameters

### preload (optional)
```liquid
stylesheet_url | stylesheet_tag: preload: boolean
```

When enabled, sends a resource hint as a [Link header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link):

```
Link: <STYLESHEET_URL>; rel=preload; as=style
```

**Note:** This parameter doesn't modify the HTML link tag itself—it only affects the HTTP header.

### Best Practices
Use preloading selectively for render-blocking stylesheets needed for above-the-fold content. See [Performance best practices for Shopify themes](https://shopify.dev/themes/best-practices/performance#preload-key-resources-defer-or-avoid-loading-others) for guidance.
