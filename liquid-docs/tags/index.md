# Liquid Reference Documentation

## Overview

**Liquid** is a template language created by Shopify and available as an open-source project on GitHub. It's utilized by various software projects and companies to build dynamic templates.

This reference documents Liquid tags, filters, and objects for constructing Shopify Themes.

## What is a Template Language?

A template language enables developers to create a single reusable template containing static content while dynamically inserting information based on context. For example, a product template can display consistent product attributes (image, title, price) while rendering different values depending on which product is being viewed.

## Variations of Liquid

The Liquid documented here extends the open-source version specifically for Shopify themes, including theme-specific tags, filters, and objects for rendering storefront functionality.

Shopify uses slightly different Liquid variations for:
- Notification templates
- Shopify Flow
- Order printer templates
- Packing slip templates

## Core Concepts

### Defining Logic with Tags

Liquid tags define template logic using curly brace-percentage delimiters: `{% %}`. Content within these delimiters represents instructions, not renderable output.

**Example:**
```liquid
{% if product.available %}
  Price: $99.99
{% else %}
  Sorry, this product is sold out.
{% endif %}
```

Tags can accept required or optional parameters. For instance, the `for` tag supports a `limit` parameter:

```liquid
{% for item in numbers limit:2 %}
  {{ item }}
{% endfor %}
```

### Modifying Output with Filters

Filters modify variable and object output using the pipe character `|` followed by the filter name.

**Example:**
```liquid
{{ product.title | upcase }}
```

#### Filters with Parameters

Many filters accept parameters to adjust output:

```liquid
{{ product.title | remove: 'Health' }}
```

#### Multiple Filters

Multiple filters chain left-to-right:

```liquid
{{ product.title | upcase | remove: 'HEALTH' }}
```

## Referencing Objects

Objects and their properties are output dynamically within templates using Liquid syntax, supporting six basic data types and standard logical and comparison operators.

## Resources

- [Basics documentation](/docs/api/liquid/basics)
- [Complete tag reference](/docs/api/liquid/tags)
- [Complete filter reference](/docs/api/liquid/filters)
- [Complete object reference](/docs/api/liquid/objects)
