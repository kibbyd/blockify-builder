# global_asset_url

## Description

Returns the CDN URL for a global asset. "Global assets are kept in a directory on Shopify's server. Using global assets can be faster than loading the resource directly."

## Syntax

```liquid
string | global_asset_url
```

## Return Value

Returns a `string` containing the CDN URL path.

## Resource Type Filters

Depending on the asset type, you may need to apply an additional filter:

| Type | Filter |
|------|--------|
| JavaScript (.js) | `script_tag` |
| CSS (.css) | `stylesheet_tag` |

## Available Global Assets

The following categories of assets are accessible:

- **Firebug**: CSS, HTML, JS files, and icon assets
- **JavaScript libraries**: controls.js, dragdrop.js, effects.js, ga.js, mootools.js
- **Lightbox**: Multiple versions (v1, v2, v204) with stylesheets, scripts, and image files
- **Prototype**: Multiple versions (1.5, 1.6)
- **script.aculo.us**: Version 1.8.2 library and modules
- **Shopify**: list-collection.css, textile.css

## Usage Examples

```liquid
{{ 'lightbox.js' | global_asset_url | script_tag }}

{{ 'lightbox.css' | global_asset_url | stylesheet_tag }}
```

## Output

```html
<script src="//polinas-potent-potions.myshopify.com/cdn/s/global/lightbox.js" type="text/javascript"></script>

<link href="//polinas-potent-potions.myshopify.com/cdn/s/global/lightbox.css" rel="stylesheet" type="text/css" media="all" />
```
