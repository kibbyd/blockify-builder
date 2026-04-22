# Liquid Object: Section

## Overview
The `section` object provides access to properties and settings for sections used in Shopify themes.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `blocks` | array of [block](https://shopify.dev/docs/api/liquid/objects/block) | Contains all blocks within the section |
| `id` | string | Unique identifier for the section; dynamically generated for JSON templates, or filename without `.liquid` extension for static sections |
| `index` | number | "The 1-based index of the current section within its location" |
| `index0` | number | Same as `index` but zero-based instead of one-based |
| `location` | string | "The scope or context of the section (template, section group, or global)" |
| `settings` | object | Configured settings for the section |

## Key Notes

- **Index Limitations**: The `index` property returns `nil` in these contexts:
  - Static section rendering
  - Online store editor rendering
  - Section Rendering API usage

- **Location Values**: Can be `template`, a section group type (`header`, `footer`, `custom.<type>`), `static`, or `content_for_index`

- **Use Cases**: "Use this property to adjust section behavior based on its position within its location" for purposes like lazy-loading images below the fold

## Example

```json
{
  "blocks": [],
  "id": "template--14453298921537__cart-items",
  "settings": {}
}
```