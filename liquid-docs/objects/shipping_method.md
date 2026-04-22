# shipping_method

Information regarding the shipping method assigned to an order.

## Properties

**discount_allocations**
- Type: array of `discount_allocation`
- "The discount allocations that apply to the shipping method."

**handle**
- Type: string
- "The handle of the shipping method."
- Note: The shipping cost is appended to the handle value.

**id**
- Type: string
- "The ID of the shipping method."

**original_price**
- Type: number
- "The price of the shipping method in the currency's subunit, before discounts have been applied."
- Presented in customer's local currency; for non-subunit currencies (JPY, KRW), tenths and hundredths are appended (e.g., 1000 JPY = 100000).
- Apply money filters for formatted display.

**price_with_discounts**
- Type: number
- "The price of the shipping method in the currency's subunit, after discounts have been applied, including order level discounts."
- Uses same currency conventions as original_price.
- Apply money filters for formatted display.

**tax_lines**
- Type: array of `tax_line`
- "The tax lines for the shipping method."

**title**
- Type: string
- "The title of the shipping method."
- Typically displays in customer's preferred language, except within order contexts where checkout language applies.

## Deprecated Properties

**price**
- Type: number
- Status: Deprecated
- Reason: "The price did not include order level discounts."
- Replacement: Use `price_with_discounts` instead.

## Example

```json
{
  "handle": "shopify-Standard-0.00",
  "id": "shopify-Standard-0.00",
  "original_price": "0.00",
  "price": "0.00",
  "price_with_discounts": "0.00",
  "tax_lines": [],
  "title": "Standard"
}
```