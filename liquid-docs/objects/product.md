# Liquid Object: Product Documentation

## Overview
The `product` object represents a product in a Shopify store. It provides access to product properties, variants, pricing, media, and metadata.

## Core Properties

### Availability & Status
- **available** (boolean): Returns `true` if at least one variant meets availability criteria (inventory > 0, continue policy, or nil inventory management)
- **gift_card?** (boolean): Indicates whether the product is a gift card
- **requires_selling_plan** (boolean): `true` if all variants require a selling plan

### Identification
- **id** (number): Unique product identifier
- **handle** (string): URL-friendly product identifier
- **title** (string): Product name
- **type** (string): Product category/type
- **vendor** (string): Product maker/supplier

### Description & Content
- **description** (string): Full product description
- **content** (string): Same as description property
- **template_suffix** (string): Custom template name (without prefix/extension)

### Pricing
- **price** (number): Lowest variant price in currency subunits
- **price_min** (number): Same as price property
- **price_max** (number): Highest variant price
- **price_varies** (boolean): `true` if variant prices differ
- **compare_at_price** (number): Lowest compare-at price
- **compare_at_price_min** (number): Same as compare_at_price
- **compare_at_price_max** (number): Highest compare-at price
- **compare_at_price_varies** (boolean): `true` if compare-at prices vary

### Media
- **featured_image** (image): First product image
- **featured_media** (media): First product media asset
- **images** (array): All product images
- **media** (array): All media, sorted by addition date

### Organization
- **collections** (array): Collections containing product (Online Store only)
- **category** (taxonomy_category): Product taxonomy classification
- **tags** (array): Product tags (alphabetically ordered)
- **options** (array): Product option names
- **options_by_name**: Access specific option by case-insensitive name
- **options_with_values** (array): Complete option objects with values

### Variants & Selections
- **variants** (array): Up to 250 variants unpaginated (use paginate tag for more)
- **variants_count** (number): Total variant count
- **first_available_variant** (variant): First variant meeting availability criteria
- **selected_variant** (variant): Currently selected variant via URL parameter
- **selected_or_first_available_variant** (variant): Selected or fallback to first available

### Selling Plans
- **selling_plan_groups** (array): Subscription plan groups
- **selected_selling_plan** (selling_plan): Currently selected plan via URL parameter
- **selected_selling_plan_allocation**: Current plan allocation for selected variant
- **selected_or_first_available_selling_plan_allocation**: Current or first available plan

### Advanced Features
- **metafields**: Custom fields applied to product
- **quantity_price_breaks_configured?** (boolean): Has quantity discounts enabled
- **has_only_default_variant** (boolean): `true` if no options exist
- **url** (string): Relative product URL (may include tracking parameters if recommended)

### Timestamps
- **created_at** (string): Creation timestamp (use date filter for formatting)
- **published_at** (string): Publication timestamp

## Example Data Structure
```json
{
  "id": 6786188247105,
  "title": "Health potion",
  "handle": "health-potion",
  "vendor": "Polina's Potent Potions",
  "price": "10.00",
  "price_max": "22.00",
  "available": true,
  "variants_count": 9,
  "options": ["Size", "Strength"],
  "tags": ["healing"]
}
```

## Key Notes
- Prices output in customer's local (presentment) currency
- Currencies without subunits (JPY, KRW) append tenths/hundredths
- Use money filters for formatted price output
- Collections exclude non-Online Store channels
- Maximum 250 unpaginated variants; use paginate tag for pagination
- Selected parameters (variant, selling_plan) only available on product pages
