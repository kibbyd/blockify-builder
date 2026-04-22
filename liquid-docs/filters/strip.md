# Liquid Filter: strip

## Overview
The `strip` filter removes all whitespace characters from both the beginning and end of a string.

## Syntax
```
string | strip
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
"Strips all whitespace from the left and right of a string."

## Example

### Input Code
```liquid
{%- assign text = '  Some potions create whitespace.      ' -%}

"{{ text }}"
"{{ text | strip }}"
```

### Output
```html
"  Some potions create whitespace.      "
"Some potions create whitespace."
```

The first line displays the original string with its surrounding spaces intact. The second line shows the same string after applying the `strip` filter, which removes the leading and trailing whitespace while preserving internal spacing.
