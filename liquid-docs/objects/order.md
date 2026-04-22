# Liquid Order Object Documentation

## Overview

The `order` object represents a Shopify order and provides access to order-related data including customer information, line items, pricing, and fulfillment status.

## Key Properties

### Customer & Contact Information
- **customer**: References the customer object associated with the order
- **email**: The email linked to the order (returns `nil` if absent)
- **phone**: Phone number associated with the order

### Order Identification
- **id**: Numeric order identifier
- **name**: Order name (e.g., "#1001")
- **order_number**: Integer representation of order name
- **confirmation_number**: Randomly generated alphanumeric identifier shown to customers

### Financial Information
- **total_price**: Complete order cost in currency subunits
- **subtotal_price**: Line item total after discounts, excluding shipping/tax
- **tax_price**: Total taxes applied
- **shipping_price**: Shipping cost
- **total_discounts**: Cumulative discount amounts
- **total_duties**: Sum of duties on line items (returns `nil` if none)
- **total_net_amount**: Net cost after refunds applied
- **total_refunded_amount**: Refunded amount total

### Order Status
- **financial_status**: Payment status (authorized, paid, refunded, pending, etc.)
- **financial_status_label**: Localized version of financial status
- **fulfillment_status**: Delivery progress status
- **fulfillment_status_label**: Localized fulfillment status
- **cancelled**: Boolean indicating cancellation status
- **cancel_reason**: Reason for cancellation (customer, fraud, inventory, staff, other, declined)
- **cancel_reason_label**: Localized cancellation reason

### Addresses & Shipping
- **billing_address**: Address object for billing
- **shipping_address**: Address object for delivery
- **shipping_methods**: Array of shipping method objects
- **pickup_in_store?**: Boolean for store pickup orders

### Line Items & Discounts
- **line_items**: Array of products ordered
- **subtotal_line_items**: Non-tip line items (used for subtotal calculations)
- **item_count**: Number of items in order
- **discount_applications**: All applicable discounts
- **cart_level_discount_applications**: Order-level discounts only

### Additional Data
- **attributes**: Order attributes (collected with cart)
- **note**: Order notes (returns `nil` if absent)
- **tags**: Alphabetically sorted order tags
- **tax_lines**: Array of tax line objects
- **transactions**: Payment transaction records
- **metafields**: Custom metadata applied to order
- **created_at**: Order creation timestamp
- **cancelled_at**: Cancellation timestamp

### URLs
- **customer_url**: Link for viewing order in customer account
- **customer_order_url**: New order details page URL
- **order_status_url**: Order tracking status page URL

## Currency Handling

Monetary values are expressed in currency subunits. For currencies without subunits (JPY, KRW), tenths and hundredths are appended. Use "money filters to format displayed amounts appropriately."

## Deprecated Properties

- **discounts**: Replaced by `discount_applications` (does not capture all discount types)
