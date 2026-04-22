# asset_url Liquid Filter

## Overview
The `asset_url` filter "returns the CDN URL for a file in the assets directory of a theme."

## Syntax
```liquid
string | asset_url
```

## Return Type
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
This filter generates a content delivery network URL pointing to theme assets, enabling optimized file delivery through Shopify's CDN infrastructure.

## Usage Example

**Input:**
```liquid
{{ 'cart.js' | asset_url }}
```

**Output:**
```html
//polinas-potent-potions.myshopify.com/cdn/shop/t/4/assets/cart.js?v=83971781268232213281663872410
```

## Key Details
- Works with files stored in the theme's `assets` directory
- Automatically appends version parameters for cache busting
- Uses protocol-relative URLs (beginning with `//`)

**Related:** [Shopify CDN best practices](https://shopify.dev/themes/best-practices/performance/platform#shopify-cdn) | [Theme architecture](https://shopify.dev/themes/architecture#assets)
