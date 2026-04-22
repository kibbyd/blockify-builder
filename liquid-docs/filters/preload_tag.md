# preload_tag Filter Documentation

## Overview
The `preload_tag` filter generates an HTML `<link>` element that prioritizes loading Shopify-hosted assets. It "adds the asset URL to the Link header with a rel attribute of preload."

## Syntax
```liquid
string | preload_tag: as: string
```

**Returns:** String (HTML markup)

## Parameters
- **`as`** (required): Specifies the resource type being preloaded (e.g., `script`, `style`, `image`, `font`)
- **Additional HTML attributes**: Any standard HTML `<link>` element attributes can be added as optional parameters

## Input Requirements
The filter accepts URLs from these sources only:
- `asset_url`
- `global_asset_url`
- `shopify_asset_url`

## Basic Example
```liquid
{{ 'cart.js' | asset_url | preload_tag: as: 'script' }}
```

**Output:**
```html
<link href="//polinas-potent-potions.myshopify.com/cdn/shop/t/4/assets/cart.js?v=83971781..." as="script" rel="preload">
```

## Extended Example with Attributes
```liquid
{{ 'cart.js' | asset_url | preload_tag: as: 'script', type: 'text/javascript' }}
```

**Output:**
```html
<link href="//polinas-potent-potions.myshopify.com/cdn/shop/t/4/assets/cart.js?v=83971781..." as="script" type="text/javascript" rel="preload">
```

## Best Practices
Use this filter judiciously—focus on resources needed for above-the-fold content. For stylesheets, prefer `stylesheet_tag`; for images, use `image_tag`.
