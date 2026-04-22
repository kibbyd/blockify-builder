# Liquid Tag: style

## Overview

The `style` tag generates an HTML `<style>` element with a `data-shopify` attribute. A key feature is that CSS referencing color settings will dynamically update in the theme editor without requiring a page refresh.

## Syntax

```liquid
{% style %}
  CSS_rules
{% endstyle %}
```

### Parameter

**CSS_rules** — The cascading stylesheet declarations to include within the style tag.

## Example

### Input Code
```liquid
{% style %}
  .h1 {
    color: {{ settings.colors_accent_1 }};
  }
{% endstyle %}
```

### Data
```json
{
  "settings": {
    "colors_accent_1": "#121212"
  }
}
```

### Output
```html
<style data-shopify>
  .h1 {
    color: #121212;
  }
</style>
```

## Key Feature

"If you reference color settings inside `style` tags, then the associated CSS rules will update as the setting is" modified in the editor, without needing to refresh the page.
