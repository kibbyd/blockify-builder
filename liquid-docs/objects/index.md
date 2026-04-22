# Liquid Reference Documentation

## Overview

Liquid is a template language created by Shopify and available as an open-source project on GitHub. This reference documents Liquid tags, filters, and objects used to build Shopify Themes.

## What is a Template Language?

A template language enables creation of a single template containing static content while dynamically inserting information based on rendering context. For example, a product template hosts standard attributes like image, title, and price, which render with appropriate content for the current product being viewed.

## Variations of Liquid

The documented variation extends the open-source Liquid version for Shopify themes, including theme-specific tags, filters, and objects. Shopify uses slightly different Liquid versions for:

- **Notification templates** - Email variables
- **Shopify Flow** - Workflow automation variables
- **Order printer templates** - Fulfillment printing variables
- **Packing slip templates** - Order packing variables

## Core Concepts

### Outputting Objects

Objects and properties are output using double curly braces: `{{ object.property }}`

Example:
```liquid
<title>{{ page_title }}</title>
{% if page_description -%}
  <meta name="description" content="{{ page_description | truncate: 150 }}">
{%- endif %}
```

### Defining Logic with Tags

Tags define template logic using curly brace-percentage delimiters: `{% tag %}`

**Example - Conditional Output:**
```liquid
{% if product.available %}
  Price: $99.99
{% else %}
  Sorry, this product is sold out.
{% endif %}
```

**Tags with Parameters:**
Some tags accept required or optional parameters:
```liquid
{% assign numbers = '1,2,3,4,5' | split: ',' %}
{% for item in numbers limit:2 -%}
  {{ item }}
{%- endfor %}
```

Output: `1 2`

### Modifying Output with Filters

Filters modify variable output using the pipe character: `{{ object | filter }}`

**Simple Filter:**
```liquid
{{ product.title | upcase }}
```
Input: "Health potion" → Output: "HEALTH POTION"

**Filters with Parameters:**
```liquid
{{ product.title | remove: 'Health' }}
```
Input: "Health potion" → Output: "potion"

**Multiple Filters:**
Filters apply left to right:
```liquid
{{ product.title | upcase | remove: 'HEALTH' }}
```

## Data Types

Liquid supports six basic data types for object output.

## Operators

Liquid includes basic logical and comparison operators for use with tags.
