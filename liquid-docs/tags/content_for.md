# content_for

## Overview

"Creates a designated area in your theme where blocks can be rendered." The tag requires a type parameter to distinguish between rendering multiple theme blocks (`'blocks'`) or a single static block (`'block'`).

## Syntax

```liquid
{% content_for 'blocks' %}
{% content_for 'block', type: "slide", id: "slide-1" %}
```

## Parameters

### blocks
Establishes a region that displays theme blocks as set up in JSON templates or section groups. This enables merchants to manage blocks (add, remove, reorder) through the theme editor.

**Syntax:**
```liquid
{% content_for "blocks" %}
```

### block
Renders an individual static theme block with a specified type and ID. Supports passing custom parameters that become accessible within the block.

**Syntax:**
```liquid
{% content_for "block", type: "button", id: "static-block-1", color: "red" %}
```

**Parameters:**
- `type` - The block category
- `id` - Unique identifier for the block
- Additional arbitrary parameters (e.g., `color`) - Custom values passed to the block template

## Related Resources

- [Theme blocks documentation](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks)
- [Static blocks documentation](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks)
