# Liquid `request` Object Documentation

## Overview
The `request` object provides information about the current URL and the associated page in Shopify's Liquid template language.

## Properties

### `design_mode` (boolean)
Returns `true` when code executes within the theme editor, `false` otherwise. Useful for preventing session tracking in preview mode.

**Caution:** "You shouldn't use `request.design_mode` to change customer-facing functionality."

### `host` (string)
The domain where the request is hosted. Example: `polinas-potent-potions.myshopify.com`

### `locale` (shop_locale object)
Contains locale information for the current request.

### `origin` (string)
The protocol and host combined. Example: `https://polinas-potent-potions.myshopify.com`

**Use case:** Build absolute URLs from relative paths by combining with other objects/filters.

### `page_type` (string)
Identifies the current page category. Possible values include:
- `index`, `product`, `collection`, `cart`, `search`
- `article`, `blog`, `page`
- `customers/account`, `customers/login`, `customers/order`
- `gift_card`, `policy`, `password`, `404`, and others

### `path` (string)
The request path. Returns `nil` if the page doesn't exist. Example: `/products/health-potion`

### `visual_preview_mode` (boolean)
Returns `true` when viewing the editor's visual section preview, `false` otherwise. Helpful for removing interfering scripts during preview.

## Example Usage

```liquid
{{ product.selected_variant.url | default: product.url | prepend: request.origin }}
```

**Output:** `https://polinas-potent-potions.myshopify.com/products/health-potion`

This combines `request.origin` with object properties to create context-aware absolute URLs.
