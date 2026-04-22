# font_face Liquid Filter Documentation

## Overview
The `font_face` filter generates a CSS `@font-face` declaration to load provided fonts within Shopify Liquid templates.

## Syntax
```liquid
font | font_face
```

## Return Type
String

## Basic Usage
```liquid
{{ settings.type_header_font | font_face }}
```

### Output Example
The filter produces a complete `@font-face` rule with:
- Font family name
- Font weight (default: 400)
- Font style (default: normal)
- Multiple font format URLs (woff2 and woff)

## Parameters

### font_display (Optional)
Specifies the CSS `font-display` property value for the declaration.

**Syntax:**
```liquid
{{ settings.type_header_font | font_face: font_display: 'value' }}
```

**Example:**
```liquid
{{ settings.type_header_font | font_face: font_display: 'swap' }}
```

The `font_display` parameter controls how the browser handles font loading behavior, using standard CSS font-display values like `swap`, `auto`, `block`, `fallback`, or `optional`.
