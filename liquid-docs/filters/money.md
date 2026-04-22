# Liquid Money Filter Documentation

## Overview
The `money` filter formats a given price according to the store's HTML without currency setting.

## Syntax
```liquid
{{ product.price | money }}
```

## Return Type
Returns a `string` value.

## Description
This filter formats monetary values based on your store's currency formatting preferences. The output respects the "HTML without currency" setting configured in your Shopify store's payment settings.

## Example

**Input Code:**
```liquid
{{ product.price | money }}
```

**Input Data:**
```json
{
  "product": {
    "price": "10.00"
  }
}
```

**Output:**
```
$10.00
```

## Parameters
This filter accepts no parameters beyond the value being filtered.

## Related Filters
- `money_with_currency` - Includes currency code in output
- `money_without_currency` - Removes currency symbol
- `money_without_trailing_zeros` - Strips unnecessary decimal places

## Notes
The actual currency symbol and formatting applied depends on your store's configured currency settings and localization preferences.
