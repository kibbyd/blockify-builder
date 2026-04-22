# Liquid Cart Object Documentation

## Overview
The `cart` object represents a customer's shopping cart in Shopify Liquid templates.

## Properties

### Core Attributes
- **attributes** - Custom data entered by customers (supports private attributes with `__` prefix)
- **note** - Additional information captured with cart; limited to single instance per page
- **currency** - Cart currency (presentment currency for multi-currency stores)
- **item_count** - Number of items in cart
- **empty?** - Boolean indicating if cart contains items

### Cart Contents
- **items** - Array of line_item objects in the cart
- **total_weight** - Total weight of all items in grams

### Pricing Information
- **items_subtotal_price** - Total after line discounts, excluding taxes/shipping
- **original_total_price** - Total before discounts applied
- **total_price** - Final total after discounts
- **total_discount** - Combined discount amount saved
- **checkout_charge_amount** - Amount customer pays at checkout

### Fulfillment & Tax Details
- **requires_shipping** - Boolean for shipping requirement
- **duties_included** - Boolean for duty inclusion
- **taxes_included** - Boolean for tax inclusion

### Discount Information
- **discount_applications** - Array of all discount applications
- **cart_level_discount_applications** - Cart-specific discounts only

## Key Notes

**Currency Subunits**: Values output in currency subunits. Currencies without subunits (JPY, KRW) append tenths/hundredths (e.g., 1000 JPY = 100000).

**Cart Notes Limitation**: "There can only be one instance of `{{ cart.note }}` on the cart page."

**Money Formatting**: Use money filters for proper price display.

## Deprecated Properties
- **discounts** - Replaced by `discount_applications` for comprehensive discount coverage
