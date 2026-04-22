# Liquid Customer Object Documentation

## Overview

The `customer` object represents a store customer and is directly accessible globally when a customer is logged into their account.

## Availability

The object is defined in these contexts:
- `customers/account` template
- `customers/addresses` template
- `customers/order` template
- `checkout.customer` property
- `gift_card.customer` property
- `order.customer` property

Outside these contexts, the `customer` object returns `nil` if the customer isn't authenticated.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `accepts_marketing` | boolean | "Returns `true` if the customer accepts marketing" |
| `addresses` | array of address | All customer addresses (paginate up to 20) |
| `addresses_count` | number | Total addresses associated with customer |
| `b2b?` | boolean | Whether customer is B2B |
| `company_available_locations` | array | "The company locations that the customer has access to" |
| `company_available_locations_count` | number | Count of available locations |
| `current_company` | company | Company customer is purchasing for |
| `current_location` | company_location | Currently selected company location |
| `default_address` | address | Primary customer address |
| `email` | string | Customer email address |
| `first_name` | string | Customer first name |
| `has_account` | boolean | Whether email is tied to account |
| `has_avatar?` | boolean | Whether avatar exists |
| `id` | number | Unique customer ID |
| `last_name` | string | Customer last name |
| `last_order` | order | Most recent order (excluding tests) |
| `name` | string | Full customer name |
| `orders` | array of order | All customer orders (paginate up to 20) |
| `orders_count` | number | Total orders placed |
| `payment_methods` | array | Saved payment methods |
| `phone` | string | Customer phone number |
| `store_credit_account` | store_credit_account | Account in current currency context |
| `tags` | array of string | Associated customer tags |
| `tax_exempt` | boolean | Tax exemption status |
| `total_spent` | number | "Total amount spent in currency's subunit" |

## Usage Example

```liquid
{% if customer %}
  Hello, {{ customer.first_name }}!
{% endif %}
```

Always check whether `customer` is defined before accessing its properties outside dedicated customer templates.
