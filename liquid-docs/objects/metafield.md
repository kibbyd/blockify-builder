# Liquid Metafield Object Documentation

## Overview

A metafield is a custom data field attached to a parent object in Shopify's Liquid template language. Metafields support multiple data types and can be accessed through the `metafield` object.

## Key Characteristics

**Creation**: "You can't create metafields in Liquid. Metafields can be created in only the following ways" - through the Shopify admin or via an app.

**Data Types**: Metafields support 24+ types including text fields, references (product, collection, variant, page, file), numbers, dates, JSON, and specialized types like color, weight, volume, rating, and money.

## Core Properties

### `list?` (boolean)
Indicates whether the metafield is a list-type field, returning `true` or `false`.

### `type` (string)
Specifies the metafield type from a predefined set of values. Examples include `single_line_text_field`, `product_reference`, `json`, `boolean`, and `money`.

### `value`
Contains the actual metafield data. The format depends on the type:
- Text fields return strings
- Reference types return corresponding objects (product, collection, etc.)
- Numbers and dates return appropriately typed values
- JSON returns a JSON object allowing property access

## Accessing Metafields

Metafields use a two-layer access path:
- **Namespace**: Groups metafields to prevent conflicts
- **Key**: The metafield name

Syntax: `{{ resource.metafields.namespace.key }}`

## Working with Complex Types

**JSON Metafields**: Access properties directly by name or index, or iterate through them using loops.

**List Metafields**:
- Reference types use `.count` property for length
- Non-reference array types use the `size` filter

## Deprecated Types

Older metafield types (`integer`, `json_string`, `string`) lack modern properties and filter compatibility. These return values directly rather than through the metafield object structure.