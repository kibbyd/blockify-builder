# Liquid Font Object Documentation

## Overview
The `font` object represents a font from a `font_picker` setting in Shopify themes. It enables developers to apply font setting values to theme CSS within Liquid assets or `style` tags.

## Key Properties

| Property | Type | Description |
|----------|------|-------------|
| `baseline_ratio` | Number | Decimal representation of the font's baseline ratio |
| `fallback_families` | String | Fallback font families for the typeface |
| `family` | String | The font's family name (wrapped in quotes if containing special characters) |
| `style` | String | The font's styling (e.g., normal, italic) |
| `system?` | Boolean | Indicates whether the font is system-based |
| `variants` | Array | Collection of font variants within the family |
| `weight` | Number | The font's weight value |

## Usage Context
"Use the `font` object in Liquid assets or inside a `style` tag to apply font setting values to theme CSS."

## Additional Resources
The documentation recommends using font filters to modify font properties, load fonts, or access font variants. The `system?` property helps determine if a corresponding `font-face` declaration is necessary.

## Example Structure
```json
{
  "baseline_ratio": 0.133,
  "fallback_families": "sans-serif",
  "family": "Assistant",
  "style": "normal",
  "system?": false,
  "variants": {},
  "weight": "400"
}
```