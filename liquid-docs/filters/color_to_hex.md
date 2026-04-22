# Liquid Filter: color_to_hex

## Overview
The `color_to_hex` filter transforms CSS color values into hexadecimal format using the `hex6` standard.

## Syntax
```liquid
string | color_to_hex
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
This filter accepts CSS color strings and outputs their hexadecimal representation. When colors include an alpha (transparency) component, that component is stripped from the result since `hex6` format doesn't support transparency.

## Example

**Input:**
```liquid
{{ 'rgb(234, 90, 185)' | color_to_hex }}
```

**Output:**
```html
#ea5ab9
```

## Key Behavior
"If a color with an alpha component is provided, then the alpha component is excluded from the output" because the conversion targets the `hex6` standard, which lacks alpha support.
