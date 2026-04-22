# Liquid: if Tag Documentation

## Overview
The `if` tag renders content when a specified condition evaluates to `true`.

## Syntax
```liquid
{% if condition %}
  expression
{% endif %}
```

**Parameters:**
- `condition` — The logical expression to evaluate
- `expression` — Content rendered when the condition is met

## Basic Example

**Template:**
```liquid
{% if product.compare_at_price > product.price %}
  This product is on sale!
{% endif %}
```

**Data:**
```json
{
  "product": {
    "compare_at_price": "10.00",
    "price": "0.00"
  }
}
```

**Output:**
```html
This product is on sale!
```

## elsif for Multiple Conditions

Chain multiple conditions using the `elsif` tag to test alternatives:

**Template:**
```liquid
{% if product.type == 'Love' %}
  This is a love potion!
{% elsif product.type == 'Health' %}
  This is a health potion!
{% endif %}
```

**Data:**
```json
{
  "product": {
    "type": null
  }
}
```

**Output:**
```html
This is a health potion!
```
