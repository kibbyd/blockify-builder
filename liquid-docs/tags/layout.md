# Layout Tag Documentation

## Overview
The `layout` tag lets you choose which layout file to apply to a template. By default, templates use the `theme.liquid` layout, but this tag enables you to specify an alternate layout or use none at all.

## Syntax
```liquid
{% layout name %}
```

## Parameters

**name**
- The name of your desired layout file (in quotes), or `none` to skip using a layout entirely

## Examples

Using an alternate layout:
```liquid
{% layout 'full-width' %}
```

Rendering without any layout:
```liquid
{% layout none %}
```

## Related Resources
- Learn more about [layout architecture](https://shopify.dev/themes/architecture/layouts)
