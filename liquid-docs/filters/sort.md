# Liquid Filter: Sort

## Overview

The `sort` filter arranges items in an array using "case-sensitive alphabetical, or numerical, order."

## Basic Usage

### Syntax
```
array | sort
```

### Example

When applied to a collection's tags, the filter orders them alphabetically with capitals preceding lowercase letters:

```liquid
{% assign tags = collection.all_tags | sort %}

{% for tag in tags -%}
  {{ tag }}
{%- endfor %}
```

**Result:** Items beginning with uppercase letters (Burning, Salty) appear first, followed by lowercase entries.

## Sorting by Object Properties

### Syntax
```
array | sort: string
```

You can target a specific property within array objects for sorting purposes.

### Example

To arrange products by price:

```liquid
{% assign products = collection.products | sort: 'price' %}

{% for product in products -%}
  {{ product.title }}
{%- endfor %}
```

This organizes items numerically, starting with the lowest price value and progressing to the highest.

---

**API Reference:** [Shopify Liquid Documentation](https://shopify.dev/docs/api/liquid/filters/sort)
