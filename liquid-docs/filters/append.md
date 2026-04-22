# Liquid Filter: append

## Overview
The `append` filter concatenates a specified string to the end of another string.

## Syntax
```liquid
string | append: string
```

## Return Type
[string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
"Adds a given string to the end of a string."

## Example

### Code
```liquid
{%-  assign path = product.url -%}

{{ request.origin | append: path }}
```

### Input Data
```json
{
  "product": {
    "url": "/products/health-potion"
  },
  "request": {
    "origin": "https://polinas-potent-potions.myshopify.com"
  }
}
```

### Output
```html
https://polinas-potent-potions.myshopify.com/products/health-potion
```

The example demonstrates combining a request origin URL with a product path to create a complete product URL.
