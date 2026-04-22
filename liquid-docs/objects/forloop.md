# Liquid forloop Object

## Overview

The `forloop` object provides information about a parent [`for` loop`](https://shopify.dev/docs/api/liquid/tags/for) during iteration.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `first` | boolean | Indicates whether the current iteration is the initial one |
| `index` | number | Position in sequence starting from 1 |
| `index0` | number | Position in sequence starting from 0 |
| `last` | boolean | Indicates whether the current iteration is the final one |
| `length` | number | Total count of iterations |
| `parentloop` | forloop | Reference to an enclosing loop; returns `nil` if not nested |
| `rindex` | number | Reverse position starting from 1 |
| `rindex0` | number | Reverse position starting from 0 |

## Example Usage

**Nested Loop with Parent Reference:**
```liquid
{% for i in (1..3) -%}
  {% for j in (1..3) -%}
    {{ forloop.parentloop.index }} - {{ forloop.index }}
  {%- endfor %}
{%- endfor %}
```

**Conditional Formatting:**
```liquid
{% for page in pages -%}
  {%- if forloop.length > 0 -%}
    {{ page.title }}{% unless forloop.last %}, {% endunless -%}
  {%- endif -%}
{% endfor %}
```

Output: `About us, Contact, Potion dosages`

## Sample Object Structure

```json
{
  "first": true,
  "index": 1,
  "index0": 0,
  "last": false,
  "length": 4,
  "rindex": 3
}
```
