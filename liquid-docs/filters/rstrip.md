# rstrip Liquid Filter Documentation

## Overview
**Title:** Liquid filters: rstrip

**Description:** "Strips all whitespace from the right of a string."

## Syntax
```liquid
string | rstrip
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string) with trailing whitespace removed.

## Functionality
This filter removes all whitespace characters from the right side of a string while preserving content on the left and any internal spacing.

## Example

**Input Code:**
```liquid
{%- assign text = '  Some potions create whitespace.      ' -%}

"{{ text }}"
"{{ text | rstrip }}"
```

**Output:**
```
"  Some potions create whitespace.      "
"  Some potions create whitespace."
```

The example demonstrates that `rstrip` eliminates the trailing spaces on the right while maintaining the leading whitespace on the left side of the string.

---

**Source:** [Shopify Liquid API Documentation](https://shopify.dev/docs/api/liquid/filters/rstrip)
