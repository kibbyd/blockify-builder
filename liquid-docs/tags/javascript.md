# JavaScript Liquid Tag Documentation

## Overview
The `javascript` tag allows developers to include JavaScript code within [sections](https://shopify.dev/storefronts/themes/architecture/sections), [blocks](https://shopify.dev/storefronts/themes/architecture/blocks), and [snippet](https://shopify.dev/storefronts/themes/architecture/snippets) files.

## Key Constraint
Each section, block, or snippet file supports only a single `{% javascript %}` tag.

## Syntax

```
{% javascript %}
  javascript_code
{% endjavascript %}
```

### Parameter

**javascript_code** — The actual JavaScript statements intended for the section, block, or snippet.

## Important Limitations

⚠️ **Liquid Processing:** "Liquid isn't rendered inside of `{% javascript %}` tags. Including Liquid code can cause syntax errors."

This means developers should not embed Liquid variables or logic within JavaScript tags, as they won't be processed and may result in broken code.

## Additional Resources

For comprehensive details on how JavaScript defined within these tags is loaded and executed, consult the [javascript tags best practices guide](https://shopify.dev/storefronts/themes/best-practices/javascript-and-stylesheet-tags#javascript).
