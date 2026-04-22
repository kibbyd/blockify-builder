# Liquid Filter: prepend

## Overview
The `prepend` filter adds a specified string to the beginning of another string, returning a concatenated result.

## Syntax
```liquid
string | prepend: string
```

**Returns:** string

## Description
This filter takes the input string and prepends (adds before) a given string value to it.

## Example

### Code
```liquid
{%- assign origin = request.origin -%}

{{ product.url | prepend: origin }}
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

## Use Case
This filter is particularly useful for building complete URLs by combining domain information with relative paths, or for constructing strings where a prefix needs to precede existing content.