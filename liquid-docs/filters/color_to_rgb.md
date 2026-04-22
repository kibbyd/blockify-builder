# color_to_rgb

## Overview
"Converts a CSS color string to `RGB` format." If the color includes an alpha component, the output switches to `RGBA` format instead.

## Syntax
```liquid
string | color_to_rgb
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Example

**Input:**
```liquid
{{ '#EA5AB9' | color_to_rgb }}
```

**Output:**
```html
rgb(234, 90, 185)
```

## Details
This filter transforms hexadecimal color codes into their RGB (or RGBA) functional notation equivalents. Colors with transparency channels are automatically formatted as RGBA values.
