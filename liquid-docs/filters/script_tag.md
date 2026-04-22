# script_tag Liquid Filter

## Overview
The `script_tag` filter generates an HTML `<script>` element for a specified resource URL, automatically setting the `type` attribute to `"text/javascript"`.

## Syntax
```liquid
string | script_tag
```

## Return Value
Returns a string containing a complete `<script>` HTML tag.

## Usage Example

### Input
```liquid
{{ 'cart.js' | asset_url | script_tag }}
```

### Output
```html
<script src="//polinas-potent-potions.myshopify.com/cdn/shop/t/4/assets/cart.js?v=83971781268232213281663872410" type="text/javascript"></script>
```

## Description
This filter simplifies script tag generation by accepting a resource URL and wrapping it in proper HTML markup with the JavaScript MIME type already configured. It's commonly chained with the `asset_url` filter to reference shop assets.
