# Liquid Tag: sections

## Overview
This tag renders a section group as defined in Shopify theme architecture. It should be placed within the theme's layout file wherever you want the section group to appear.

## Description
"Renders a [section group](/themes/architecture/section-groups)." This functionality allows developers to incorporate pre-defined section groups into their theme layouts. For comprehensive information on implementing section groups, consult the [Section groups documentation](https://shopify.dev/themes/architecture/section-groups#usage).

## Syntax
```liquid
{% sections 'name' %}
```

## Parameters

**name** (required)
The identifier of the section group file you wish to render in your template.

## Related Resources
- [Section Groups Architecture](https://shopify.dev/themes/architecture/section-groups)
- [Theme Layouts](https://shopify.dev/themes/architecture/layouts)
