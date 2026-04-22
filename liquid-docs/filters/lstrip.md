# Liquid Filter: lstrip

## Description
"Strips all whitespace from the left of a string."

## Syntax
```
string | lstrip
```

## Return Type
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Functionality
The `lstrip` filter removes all leading whitespace characters from the left side of a string while preserving any trailing whitespace or content on the right.

## Example

### Input Code
```liquid
{%- assign text = '  Some potions create whitespace.      ' -%}

"{{ text }}"
"{{ text | lstrip }}"
```

### Output
```html
"  Some potions create whitespace.      "
"Some potions create whitespace.      "
```

### Explanation
The first output shows the original text with leading spaces intact. The second output demonstrates the filter removing the leading whitespace while maintaining the trailing spaces after the final period.

---

**Source:** [Shopify Liquid Filter Documentation](https://shopify.dev/docs/api/liquid/filters/lstrip)
