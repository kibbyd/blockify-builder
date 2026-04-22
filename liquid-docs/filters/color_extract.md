# color_extract

## Description
"Extracts a specific color component from a given color."

## Syntax
```liquid
string | color_extract: string
```

## Return Value
Returns a [number](https://shopify.dev/docs/api/liquid/basics#number)

## Supported Color Components
The filter accepts the following color component parameters:
- `alpha`
- `red`
- `green`
- `blue`
- `hue`
- `saturation`
- `lightness`

## Example

**Input:**
```liquid
{{ '#EA5AB9' | color_extract: 'red' }}
```

**Output:**
```html
234
```

This example demonstrates extracting the red component value from the hex color `#EA5AB9`, which yields `234`.
