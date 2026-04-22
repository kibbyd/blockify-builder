# Liquid Filter: size

## Overview
The `size` filter retrieves the number of characters in a string or the quantity of items within an array.

## Syntax
```
variable | size
```

**Returns:** number

## Usage

### String and Array Sizing
"The size of a string is the number of characters that the string includes. The size of an array is the number of items in the array."

**Example:**
```liquid
{{ collection.title | size }}
{{ collection.products | size }}
```

With sample data containing a title "Sale potions" (12 characters) and an empty products array:
- Output for title: `12`
- Output for array: `4` (if containing 4 items)

## Dot Notation Approach

When using the filter within conditional tags or object outputs, apply dot notation syntax:

```liquid
{% if collection.products.size >= 10 %}
  There are 10 or more products in this collection.
{% else %}
  There are less than 10 products in this collection.
{% endif %}
```

This method allows direct property access without pipe syntax, enabling comparison operations and integration into logical expressions.
