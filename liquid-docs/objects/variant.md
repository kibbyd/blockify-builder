# Liquid: Variant Object Documentation

## Overview

The `variant` object represents a product variant in Shopify's Liquid template language. According to the documentation, it's simply "A product variant" that developers can reference and manipulate in their themes.

## Key Properties

### Availability & Inventory
- **available** (boolean): Indicates whether the variant can be purchased
- **incoming** (boolean): Shows if the variant has incoming inventory from transfers or purchase orders
- **inventory_quantity** (number): Current stock level
- **inventory_policy** (string): Either "continue" (allow backorders) or "deny" (stop selling when out of stock)
- **inventory_management** (string): The service tracking inventory, or nil if untracked

### Pricing
- **price** (number): Current price in currency subunits
- **compare_at_price** (number): Original/comparison price
- **unit_price** (number): Price per unit of measurement

### Product Information
- **id** (number): Unique variant identifier
- **title** (string): Concatenated option values separated by forward slashes
- **sku** (string): Stock keeping unit
- **barcode** (string): Product barcode
- **options** (array): Individual option values for this variant

### Media & Images
- **image** / **featured_image** (image object): Primary variant image
- **featured_media** (media object): First attached media item

### Shipping & Taxes
- **requires_shipping** (boolean): Whether shipping applies
- **taxable** (boolean): Whether taxes should be charged
- **weight** (number): Weight in grams
- **weight_unit** (string): Unit designation for weight

### Selection & Matching
- **selected** (boolean): True if currently selected via URL parameter
- **matched** (boolean): True if matching storefront filters or no filters applied

### Commerce Features
- **quantity_price_breaks** (array): Tiered pricing for bulk orders
- **selling_plan_allocations** (array): Subscription plan options
- **store_availabilities** (array): In-store stock information

### Related Objects
- **product** (product object): Parent product reference
- **metafields** (untyped): Custom data fields attached to variant
- **url** (string): Variant link structure: `/products/[handle]?variant=[id]`

## Usage Example

The documentation provides this code sample for iterating through variant options:

```liquid
{% for variant in product.variants -%}
  {%- capture options -%}
    {% for option in variant.options -%}
      {{ option }}{%- unless forloop.last -%}/{%- endunless -%}
    {%- endfor %}
  {%- endcapture -%}
  {{ variant.id }}: {{ options }}
{%- endfor %}
```

Output: `39897499729985: S/Low`

## Deprecated Properties

Three legacy properties remain available but should be avoided:
- **option1**, **option2**, **option3**: Use the `options` array instead

## Global Access

The variant object is accessible through parent objects including line_item, product, and product_option_value contexts, as well as directly in global scope on product pages.
