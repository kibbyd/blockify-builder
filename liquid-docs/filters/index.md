# Liquid Template Language Reference

## Overview

Liquid is a template language created by Shopify and available as an open source project on GitHub. It's used by many software projects and companies to dynamically render content in templates.

> "A template language allows you to create a single template to host static content, and dynamically insert information depending on where the template is rendered."

This reference documents Liquid tags, filters, and objects for building Shopify Themes.

## Variations of Liquid

Shopify extends the open-source Liquid version with additional tags, filters, and objects specific to storefronts. Other Shopify implementations use slightly different Liquid versions:

- Notification templates
- Shopify Flow
- Order printer templates
- Packing slip templates

## Core Concepts

### What is Liquid?

Template languages enable developers to create reusable templates with dynamic content insertion. For example, a product template can display different product information based on context while maintaining consistent structure.

### Basic Syntax

**Tags** (Logic):
- Wrapped in `{% %}` delimiters
- Define conditional logic and control flow
- Example: `{% if product.available %}` Price: $99.99 `{% endif %}`

**Filters** (Output Modification):
- Modify variable output using the pipe character `|`
- Can be chained for sequential transformations
- Example: `{{ product.title | upcase }}`

**Objects** (Data):
- Reference variables and their properties
- Access nested data structures

## Tags and Logic

Tags tell templates what to perform. The `if` tag demonstrates conditional rendering:

```liquid
{% if product.available %}
  Price: $99.99
{% else %}
  Sorry, this product is sold out.
{% endif %}
```

### Tags with Parameters

Tags accept optional or required parameters. The `for` tag accepts a `limit` parameter:

```liquid
{% assign numbers = '1,2,3,4,5' | split: ',' %}
{% for item in numbers limit:2 -%}
  {{ item }}
{%- endfor %}
```

Output: `1` and `2`

## Filters

Filters transform output by applying modifications. The pipe character separates objects from filters.

### Basic Filter Example

```liquid
{{ product.title | upcase }}
```

With data `{ "product": { "title": "Health potion" } }`, outputs: `HEALTH POTION`

### Filters with Parameters

Many filters accept adjustable parameters:

```liquid
{{ product.title | remove: 'Health' }}
```

Output: `potion`

### Multiple Filters

Filters chain left-to-right:

```liquid
{{ product.title | upcase | remove: 'HEALTH' }}
```

This converts text to uppercase, then removes the specified substring.

## Key Data Types

Liquid uses six basic data types for output and operations, supporting logical and comparison operators within tags.
