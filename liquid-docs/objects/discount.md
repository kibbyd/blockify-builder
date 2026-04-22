# Discount Object Documentation

## Overview
The `discount` object represents a discount applied to a cart, line item, or order within Shopify's Liquid templating language.

⚠️ **Deprecation Notice**: This object is deprecated as it doesn't capture all discount types and details. Use [`discount_allocation`](https://shopify.dev/docs/api/liquid/objects/discount_allocation) or [`discount_application`](https://shopify.dev/docs/api/liquid/objects/discount_application) instead.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `amount` | number | "The amount of the discount in the currency's subunit." Equivalent to `total_amount`. Presented in customer's local currency. |
| `code` | string | "The customer-facing name of the discount." Same as `title`. |
| `savings` | number | Negative value representing discount amount in currency's subunit. Equivalent to `total_savings`. |
| `title` | string | "The customer-facing name of the discount." Same as `code`. |
| `total_amount` | number | Discount amount in currency subunit, matching `amount`. Uses presentment currency. |
| `total_savings` | number | Negative discount value matching `savings`. Uses presentment currency. |
| `type` | string | Discount category from: `FixedAmountDiscount`, `PercentageDiscount`, or `ShippingDiscount` |

**Currency Note**: For currencies without subunits (JPY, KRW), tenths and hundredths are appended—1000 yen outputs as 100000.

## Example

```json
{
  "amount": "40.00",
  "code": "DIY",
  "savings": "-40.00",
  "title": "DIY",
  "total_amount": "40.00",
  "total_savings": "-40.00",
  "type": "PercentageDiscount"
}
```

**Tip**: Apply [money filters](https://shopify.dev/docs/api/liquid/filters/money-filters) for formatted output.