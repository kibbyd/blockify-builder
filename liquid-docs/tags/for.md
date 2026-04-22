# Liquid `for` Tag Documentation

## Overview

The `for` tag renders an expression repeatedly for each item in an array.

**Iteration Limit:** "You can do a maximum of 50 iterations with a `for` loop. If you need to iterate over more than 50 items, then use the [`paginate` tag](/docs/api/liquid/tags/paginate)" to distribute items across multiple pages.

**Associated Object:** Every loop has access to a `forloop` object containing iteration metadata.

---

## Basic Syntax

```liquid
{% for variable in array %}
  expression
{% endfor %}
```

### Parameters

- **variable**: The current item in the loop
- **array**: The collection being iterated
- **expression**: Content rendered for each iteration

---

## Tag Parameters

### `limit`

Restricts the number of iterations performed.

```liquid
{% for variable in array limit: number %}
  expression
{% endfor %}
```

**Example:**
```liquid
{% for product in collection.products limit: 2 -%}
  {{ product.title }}
{%- endfor %}
```

**Output:** Only the first 2 products display

---

### `offset`

Specifies a 1-based starting index for iteration.

```liquid
{% for variable in array offset: number %}
  expression
{% endfor %}
```

**Example:**
```liquid
{% for product in collection.products offset: 2 -%}
  {{ product.title }}
{%- endfor %}
```

**Output:** Iteration begins at the 3rd item

---

### `range`

Iterates over numeric values rather than array items.

```liquid
{% for variable in (number..number) %}
  expression
{% endfor %}
```

**Features:**
- Supports literal numbers: `(1..3)`
- Supports variable values: `(lower_limit..upper_limit)`

**Example:**
```liquid
{% for i in (1..3) -%}
  {{ i }}
{%- endfor %}
```

**Output:** 1, 2, 3

---

### `reversed`

Iterates through the array in reverse order.

```liquid
{% for variable in array reversed %}
  expression
{% endfor %}
```

**Example:**
```liquid
{% for product in collection.products reversed -%}
  {{ product.title }}
{%- endfor %}
```

**Output:** Products display in reverse sequence

---

## Performance Note

For paginated collections, prefer the `paginate` tag over `limit` for improved server-side performance when handling large datasets.
