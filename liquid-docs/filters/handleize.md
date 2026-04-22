# Liquid Filter: handleize

## Overview
The `handleize` filter transforms a text string into a handle format, which is a standardized way to represent names as URL-safe identifiers.

## Syntax
```liquid
string | handleize
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
This filter converts standard text into a handle—a simplified, hyphenated format suitable for URLs and identifiers. The `handle` filter serves as an equivalent alias.

## Usage Example

**Liquid Code:**
```liquid
{{ product.title | handleize }}
{{ product.title | handle }}
```

**Input Data:**
```json
{
  "product": {
    "title": "Health potion"
  }
}
```

**Output:**
```html
health-potion
health-potion
```

## Key Notes
- The filter has an alternative name: "The `handle` filter serves as an alias of `handleize`" for use in either form
- Both versions produce identical results
- Handles are commonly used in Shopify for creating clean, URL-friendly product and collection identifiers
