# Liquid Objects: Page

## Overview

The `page` object represents a store page in Shopify's Liquid templating language. Pages are foundational content objects within theme structures.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `author` | string | The creator of the page |
| `content` | string | The page's main content |
| `handle` | string | The page's unique identifier handle |
| `id` | number | Numeric ID for the page |
| `metafields` | metafield | Custom metadata fields attached to the page |
| `published_at` | string | Publication timestamp (pair with the `date` filter for formatting) |
| `template_suffix` | string | Name of any assigned custom template (excludes `page.` prefix and file extensions; returns `nil` if none assigned) |
| `title` | string | The page's display title |
| `url` | string | The page's relative URL path |

## Example Object

```json
{
  "author": null,
  "content": "<p>Polina's Potent Potions was started by Polina in 1654...</p>",
  "handle": "about-us",
  "id": 83536642113,
  "metafields": {},
  "published_at": "2022-05-04 17:47:03 -0400",
  "template_suffix": "",
  "title": "About us",
  "url": {}
}
```

## Related Resources

- [Metafields documentation](https://shopify.dev/docs/api/liquid/objects/metafield)
- [Page template architecture](https://shopify.dev/themes/architecture/templates/page)
- [Theme structure overview](https://help.shopify.com/manual/online-store/themes/theme-structure/pages)
