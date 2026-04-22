# Liquid Tag: capture

## Overview

The `capture` tag allows you to create a new variable containing a string value. This is particularly useful for constructing complex strings using Liquid logic and variables within your templates.

## Syntax

```liquid
{% capture variable %}
  value
{% endcapture %}
```

## Parameters

**variable**
The identifier for the newly created variable.

**value**
The content to be stored in the variable, which may include Liquid logic, filters, and other variables.

## Important Note

⚠️ Be cautious when naming variables—avoid using names that match predefined Liquid objects, as this will override them and prevent access to those built-in objects.

## Example

Here's a practical implementation:

```liquid
{%- assign up_title = product.title | upcase -%}
{%- assign down_title = product.title | downcase -%}
{%- assign show_up_title = true -%}

{%- capture title -%}
  {% if show_up_title -%}
    Upcase title: {{ up_title }}
  {%- else -%}
    Downcase title: {{ down_title }}
  {%- endif %}
{%- endcapture %}

{{ title }}
```

**Sample Data:**
```json
{
  "product": {
    "title": "Health potion"
  }
}
```

**Expected Output:**
```
Upcase title: HEALTH POTION
```
