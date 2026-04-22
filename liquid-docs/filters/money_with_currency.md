# money_with_currency Filter

## Overview
The `money_with_currency` filter is a Liquid filter that formats monetary values according to store-specific currency settings.

## Description
"Formats a given price based on the store's **HTML with currency** setting"

## Syntax
```liquid
{{ product.price | money_with_currency }}
```

## Parameters
This filter accepts no additional parameters beyond the input value.

## Return Type
Returns a `string` value.

## Example

**Input Code:**
```liquid
{{ product.price | money_with_currency }}
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
$10.00 CAD
```

## Key Notes
- The filter applies formatting rules configured in the store's currency settings
- Output includes both the currency symbol and currency code
- Commonly used in e-commerce templates to display product and order prices with currency information
