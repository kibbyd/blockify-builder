# Liquid Tag: unless

## Overview

The `unless` tag displays content only when a specified condition evaluates to `false`. It functions as the inverse of the `if` tag.

## Description

"Renders an expression unless a specific condition is `true`."

## Syntax

```liquid
{% unless condition %}
  expression
{% endunless %}
```

### Parameters

- **condition**: The statement to evaluate
- **expression**: The code block to display when the condition is `false`

## Extended Conditionals

Like the `if` tag, you can chain multiple conditions using `elsif` statements to create more complex logic within `unless` blocks.

## Example

### Code
```liquid
{% unless product.has_only_default_variant %}
  // Variant selection functionality
{% endunless %}
```

### Sample Data
```json
{
  "product": {
    "has_only_default_variant": false
  }
}
```

### Result
```html
// Variant selection functionality
```

Since `has_only_default_variant` is `false`, the expression renders.

---

**Source**: Shopify Liquid API Documentation
