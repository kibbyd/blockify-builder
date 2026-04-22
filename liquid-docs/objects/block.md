# Liquid Objects: Block

## Overview

The `block` object represents the content and settings of a [section block](https://shopify.dev/themes/architecture/sections/section-schema#blocks). Blocks are reusable content modules that comprise templates, with a maximum of 50 blocks allowed per section.

## Properties

### id
**Type:** string

"The ID of the block." This identifier is dynamically assigned by Shopify and may change, so avoid hardcoding literal ID values in your theme code.

### settings
**Type:** Object

Contains the configuration values for the block as defined in its schema. Access these values through the settings object to customize block behavior. Refer to input settings documentation for available configuration options.

### shopify_attributes
**Type:** string

"The data attributes for the block for use in the theme editor." These attributes enable the theme editor's JavaScript API to identify blocks and monitor events. Values only appear within the theme editor environment.

### type
**Type:** string

"The type of the block." This free-form string is defined in the block's schema and serves as an identifier. Use it to conditionally render different markup based on block type.

## Example

```json
{
  "id": "column1",
  "settings": "array",
  "shopify_attributes": "data-shopify-editor-block=\"{\"id\":\"column1\",\"type\":\"column\"}\"",
  "type": "column"
}
```