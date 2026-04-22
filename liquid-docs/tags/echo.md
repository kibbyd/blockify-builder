# Liquid Echo Tag Documentation

## Overview
The `echo` tag outputs an expression in Liquid template language. It functions identically to wrapping content in double curly brackets (`{{` `}}`), with the key advantage that it can be used within `liquid` tags.

## Description
"Outputs an expression." This tag provides an alternative syntax for expression output that integrates seamlessly with the `liquid` tag structure, enabling cleaner template organization.

## Syntax
```liquid
{% echo expression %}
```

Or within a liquid block:
```liquid
{% liquid
  echo expression
%}
```

## Parameters

**expression** – The expression to be rendered as output.

## Usage Notes
- Filters can be applied to expressions within echo tags
- The echo method provides equivalent functionality to bracket notation but with improved compatibility in certain contexts

## Example

**Code:**
```liquid
{% echo product.title %}

{% liquid
  echo product.price | money
%}
```

**Input Data:**
```json
{
  "product": {
    "price": "10.00",
    "title": "Health potion"
  }
}
```

**Output:**
```html
Health potion

$10.00
```
