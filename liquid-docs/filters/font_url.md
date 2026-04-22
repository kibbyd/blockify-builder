# font_url Filter Documentation

## Overview
The `font_url` filter retrieves "the CDN URL for the provided font in `woff2` format."

## Syntax
```liquid
font | font_url
```

## Return Type
String

## Basic Usage
```liquid
{{ settings.type_header_font | font_url }}
```

This generates a complete CDN path to the font asset with authentication parameters.

**Sample output:**
```
//polinas-potent-potions.myshopify.com/cdn/fonts/assistant/assistant_n4.9120912a469cad1cc292572851508ca49d12e768.woff2?h1=...&hmac=...
```

## Optional Parameter: Format Selection

By default, the filter serves fonts in `woff2` format. To request the older `woff` format instead, pass the format as a parameter:

```liquid
{{ settings.type_header_font | font_url: 'woff' }}
```

**Sample output with woff format:**
```
//polinas-potent-potions.myshopify.com/cdn/fonts/assistant/assistant_n4.6e9875ce64e0fefcd3f4446b7ec9036b3ddd2985.woff?h1=...&hmac=...
```

## Key Details
- Returns Shopify's CDN-hosted font URLs
- Default format is modern `woff2` for better compression
- Both formats include authentication query parameters
- Compatible with theme font settings objects
