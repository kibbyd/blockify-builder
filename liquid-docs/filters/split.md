# Liquid Filter: split

## Overview
"Splits a string into an array of substrings based on a given separator."

## Syntax
```liquid
string | split: string
```

## Return Value
Returns an array of strings.

## How It Works
This filter takes a string value and separates it at each occurrence of a specified delimiter, producing an array of the resulting segments.

## Example Usage

**Template Code:**
```liquid
{%- assign title_words = product.handle | split: '-' -%}

{% for word in title_words -%}
  {{ word }}
{%- endfor %}
```

**Sample Data:**
```json
{
  "product": {
    "handle": "health-potion"
  }
}
```

**Output:**
```
health
potion
```

In this example, the product handle "health-potion" is split using a hyphen as the separator, creating an array with two elements that are then iterated over and displayed individually.
