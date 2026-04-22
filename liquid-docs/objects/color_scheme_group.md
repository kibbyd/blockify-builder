# color_scheme_group

## Overview

The `color_scheme_group` represents a color scheme configuration from a `color_scheme_group` setting in Shopify theme architecture.

## Description

"A color_scheme_group from a [`color_scheme_group` setting]" that enables theme developers to manage color configurations systematically.

## Related Resources

For deeper context on color management in themes, reference the `color_scheme` setting documentation within the input settings guide.

## Usage Example

Developers can iterate through color schemes and generate CSS variables dynamically:

```liquid
{% for scheme in settings.color_schemes %}
  .color-{{ scheme.id }} {
    --color-background: {{ scheme.settings.background }};
    --color-text: {{ scheme.settings.text }};
  }
{% endfor %}
```

## Sample Output

This pattern produces organized CSS custom properties for each color scheme:

```css
.color-background-1 {
  --color-background: #FFFFFF;
  --color-text: #121212;
}

.color-inverse {
  --color-background: #121212;
  --color-text: #FFFFFF;
}

.color-accent-2 {
  --color-background: #334FB4;
  --color-text: #FFFFFF;
}
```

## Key Properties

- `id` — Unique identifier for the color scheme
- `settings.background` — Background color value
- `settings.text` — Text color value