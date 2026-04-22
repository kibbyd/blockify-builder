# Liquid Section Tag Documentation

## Overview
The `section` tag renders a [section](https://shopify.dev/themes/architecture/sections) statically within Shopify themes.

## Description
"Renders a [section](/themes/architecture/sections)." Using this tag allows developers to include section content without dynamic rendering. For more details, see the guide on [rendering sections](https://shopify.dev/themes/architecture/sections#render-a-section).

## Syntax

```liquid
{% section 'name' %}
```

## Parameters

**name** — Required string specifying the section file to render.

Example: `{% section 'header' %}`

## Example Usage

### Input
```liquid
{% section 'header' %}
```

### Context Data
The section receives access to global shop data including:
- Cart information (`cart.item_count`)
- Request details (`request.origin`, `request.page_type`)
- Route URLs (account, cart, root, search)
- Theme settings (accent icons, cart type, social links, etc.)
- Shop metadata (customer accounts enabled, shop name)

### Output
The tag generates an HTML wrapper with the structure:
```html
<div id="shopify-section-[name]" class="shopify-section section-[name]">
  [section content including stylesheets and markup]
</div>
```

The rendered output includes component stylesheets, inline styles, and the section's HTML markup.
