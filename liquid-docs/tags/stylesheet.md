# Stylesheet Liquid Tag

## Overview

The `stylesheet` tag enables CSS styling within [sections](https://shopify.dev/storefronts/themes/architecture/sections), [blocks](https://shopify.dev/storefronts/themes/architecture/blocks), and [snippet](https://shopify.dev/storefronts/themes/architecture/snippets) files.

## Key Constraints

- Each section, block, or snippet supports only one `{% stylesheet %}` tag
- "Liquid isn't rendered inside of `{% stylesheet %}` tags. Including Liquid code can cause syntax errors."

## Syntax

```liquid
{% stylesheet %}
  css_styles
{% endstylesheet %}
```

### Parameters

**css_styles**
The CSS declarations and rules applied to the parent section, block, or snippet.

## Additional Resources

For comprehensive information about how CSS within stylesheet tags loads and executes, consult the [stylesheet tags documentation](https://shopify.dev/storefronts/themes/best-practices/javascript-and-stylesheet-tags#stylesheet) in Shopify's best practices guide.
