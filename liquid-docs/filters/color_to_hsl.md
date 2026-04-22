# color_to_hsl Filter Documentation

## Overview
The `color_to_hsl` filter is a Liquid filter that transforms CSS color strings into HSL format. When dealing with colors that include transparency, it automatically converts to HSLA format instead.

## Syntax
```liquid
string | color_to_hsl
```

## Return Type
Returns a string value representing the color in HSL or HSLA notation.

## Usage Example

**Input:**
```liquid
{{ '#EA5AB9' | color_to_hsl }}
```

**Output:**
```html
hsl(320, 77%, 64%)
```

## Key Features
- Accepts CSS color strings as input
- Outputs standard HSL color format
- Automatically handles alpha channel colors by producing HSLA format when needed
