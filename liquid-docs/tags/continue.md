# Liquid Tags: continue

## Overview
The `continue` tag directs a `for` loop to advance to its next iteration, bypassing any remaining code in the current cycle.

## Syntax
```
{% continue %}
```

## Description
"Causes a [`for` loop](/docs/api/liquid/tags/for) to skip to the next iteration."

## Example

**Code:**
```liquid
{% for i in (1..5) -%}
  {%- if i == 4 -%}
    {% continue %}
  {%- else -%}
    {{ i }}
  {%- endif -%}
{%- endfor %}
```

**Output:**
```
1
2
3
5
```

In this example, when the loop variable equals 4, the `continue` tag skips that iteration, preventing the number from being printed. All other values display normally.

---

**Source:** Shopify Liquid API Documentation
