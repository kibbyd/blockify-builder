# Liquid Template Language Reference

## Overview

Liquid is a template language created by Shopify and available as an open-source project on GitHub. It's used by many software projects and companies to build dynamic templates.

This reference documents Liquid tags, filters, and objects for building Shopify Themes.

## What is a Template Language?

A template language allows developers to "create a single template to host static content, and dynamically insert information depending on where the template is rendered." For example, a product template can render different product attributes based on which product is currently being viewed.

## Variations of Liquid

The Shopify variation extends the open-source version with Shopify-specific tags, filters, and objects for theme development. Other Shopify systems use slightly different Liquid variants:

- **Notification templates** - Email variable templates
- **Shopify Flow** - Workflow automation
- **Order printer templates** - Fulfillment templates
- **Packing slip templates** - Order packaging

## Core Concepts

### Defining Logic with Tags

Liquid tags define conditional and iterative logic. Tags are wrapped in `{% %}` delimiters and don't render as content.

**Basic if/else example:**
```liquid
{% if product.available %}
  Price: $99.99
{% else %}
  Sorry, this product is sold out.
{% endif %}
```

Tags can accept parameters (required or optional). Use the `liquid` tag to nest multiple statements.

**Example with parameters:**
```liquid
{% assign numbers = '1,2,3,4,5' | split: ',' %}
{% for item in numbers limit:2 -%}
  {{ item }}
{%- endfor %}
```

Output: `1 2`

### Modifying Output with Filters

Filters transform variable output using the pipe `|` character syntax.

**Basic filter example:**
```liquid
{{ product.title | upcase }}
```
With data `"Health potion"`, outputs: `HEALTH POTION`

**Filters with parameters:**
```liquid
{{ product.title | remove: 'Health' }}
```
Outputs: ` potion`

**Chaining multiple filters:**
```liquid
{{ product.title | upcase | remove: 'HEALTH' }}
```
Filters apply left-to-right, outputting: ` POTION`

## Data Types

Liquid supports six basic data types for output and manipulation within templates.

## Operators

Liquid includes basic logical and comparison operators for use with conditional tags.
