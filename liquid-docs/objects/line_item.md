# Liquid Objects: line_item

## Overview

A `line_item` represents a single line within a cart, checkout, or order, with each instance corresponding to a product variant.

## Core Properties

### Identification
- **id**: Numeric identifier varying by context (variant ID for carts, temporary hash for checkouts, unique integer for orders)
- **key**: Unique string combining variant ID and characteristic hash; unstable as line characteristics change
- **variant_id**: The associated variant's ID
- **product_id**: The associated product's ID

### Pricing & Totals
- **final_price**: Line price after discounts, in currency subunits
- **final_line_price**: Combined price of all items in line (final_price × quantity)
- **original_price**: Pre-discount line price
- **original_line_price**: Combined pre-discount total
- **unit_price**: Per-unit price reflecting applied discounts

### Quantity & Physical Attributes
- **quantity**: Item count in this line
- **grams**: Weight in store's default unit
- **requires_shipping**: Boolean indicating shipping necessity

### Discounts & Tax
- **discount_allocations**: Array of applied discount allocations
- **line_level_discount_allocations**: Direct line-item discounts
- **line_level_total_discount**: Total discount amount applied
- **message**: Discount information summary
- **tax_lines**: Associated tax line array
- **taxable**: Boolean for tax applicability

### Product & Variant Details
- **title**: Combined product and variant title
- **vendor**: Variant vendor name
- **sku**: Associated variant SKU
- **image**: Product or variant image
- **url**: Relative variant URL
- **options_with_values**: Name-value pairs for variant options

### Custom Data
- **properties**: "Name and value pairs for custom line item information, captured via product forms or AJAX Cart API"

### Cart-Specific Fields
- **item_components**: Nested line items array
- **parent_relationship**: Parent relationship object
- **instructions**: Operations available on nested lines
- **error_message**: Informational status message
- **url_to_remove**: URL for line item removal

### Fulfillment & Orders
- **fulfillment**: Fulfillment object
- **fulfillment_service**: Service type (defaults to "manual")
- **successfully_fulfilled_quantity**: Number of items fulfilled
- **selling_plan_allocation**: Subscription plan data (if applicable)

### Other Properties
- **gift_card**: Boolean for gift card products
- **unit_price_measurement**: Unit pricing measurement details

## Deprecated Properties

Three legacy pricing properties now use newer equivalents:
- `price` → replaced by `final_price`
- `line_price` → replaced by `final_line_price`
- `total_discount` → replaced by `line_level_total_discount`
- `discounts` → replaced by `discount_allocations`

These older properties excluded certain discount types and should no longer be used.

## Usage Example

```liquid
{% for item in cart.items %}
  <div class="cart__item">
    <p>{{ item.title }}</p>
    {% unless item.product.has_only_default_variant %}
      <ul>
        {% for option in item.options_with_values %}
          <li>{{ option.name }}: {{ option.value }}</li>
        {% endfor %}
      </ul>
    {% endunless %}
  </div>
{% endfor %}
```

## Important Notes

- Currency subunits apply to all monetary values; currencies without subunits (JPY, KRW) append tenths/hundredths
- Use money filters for formatted price output
- Line item keys are unstable and change with characteristic modifications
- Discount allocations differ by context; item components do not receive separate discounts
- Selling plan availability varies; some properties unavailable in order contexts
