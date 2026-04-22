# Liquid Tag: assign

## Overview
The `assign` tag is a Liquid feature that "creates a new variable" within your templates.

## Capability
You can create variables using any basic type, object, or object property supported by Liquid.

## Syntax
```liquid
{% assign variable_name = value %}
```

## Parameters

**variable_name** — Identifies the variable being established

**value** — The data to store in that variable

## Example

### Input
```liquid
{%- assign product_title = product.title | upcase -%}

{{ product_title }}
```

With this data:
```json
{
  "product": {
    "title": "Health potion"
  }
}
```

### Output
```
HEALTH POTION
```

## Important Note
⚠️ Variables can override predefined Liquid objects. Avoid naming your variables to match existing object names to ensure full access to built-in Liquid functionality.
