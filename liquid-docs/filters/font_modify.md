# font_modify Filter Documentation

## Overview
The `font_modify` filter adjusts specific properties of a font object, returning a modified font variant if available.

## Syntax
```liquid
font | font_modify: string, string
```

**Returns:** [font](https://shopify.dev/docs/api/liquid/objects/font)

## Description
"Modifies a specific property of a given font." The filter accepts two required parameters: the property name and either a new value or modification amount.

## Parameters

| Property | Modification Values | Behavior |
|----------|-------------------|----------|
| `style` | `normal`, `italic`, `oblique` | Returns the variant matching the specified style at the same weight |
| `weight` | `100`–`900`, `normal`, `bold`, `+100`–`+900`, `-100`–`-900`, `lighter`, `bolder` | Returns a variant with the specified or adjusted weight at the same style |

**Note:** "Oblique variants are similar to italic variants in appearance. All Shopify fonts have only oblique or italic variants, not both."

## Usage Example
```liquid
{%- assign bold_font = settings.type_body_font | font_modify: 'weight', 'bold' -%}

h2 {
  font-weight: {{ bold_font.weight }};
}
```

**Output:**
```css
h2 {
  font-weight: 700;
}
```

## Handling Missing Variants
When a requested variant doesn't exist, the filter returns `nil`. Use the `default` filter for fallbacks or conditional logic with `if` statements to manage missing variants gracefully.
