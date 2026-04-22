# shopify_asset_url

## Description
"Returns the CDN URL for a globally accessible Shopify asset."

## Syntax
```liquid
string | shopify_asset_url
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string) containing the CDN URL.

## Globally Accessible Assets
This filter works with the following Shopify-hosted resources:
- `option_selection.js`
- `api.jquery.js`
- `shopify_common.js`
- `customer_area.js`
- `currencies.js`
- `customer.css`

## Example Usage

### Input
```liquid
{{ 'option_selection.js' | shopify_asset_url }}
```

### Output
```html
//polinas-potent-potions.myshopify.com/cdn/shopifycloud/storefront/assets/themes_support/option_selection-b017cd28.js
```

## Overview
This filter generates the complete CDN URL path for Shopify's built-in theme assets, enabling developers to reference these resources reliably across storefronts without managing separate asset hosting.
