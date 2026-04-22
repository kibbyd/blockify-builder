# money_without_currency

## Description
"Formats a given price based on the store's HTML without currency setting, without the currency symbol."

## Syntax
```liquid
number | money_without_currency
```

## Return Type
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Usage Example

**Liquid Code:**
```liquid
{{ product.price | money_without_currency }}
```

**Sample Data:**
```json
{
  "product": {
    "price": "10.00"
  }
}
```

**Output:**
```
10.00
```

## Overview
This filter applies the store's currency formatting rules while omitting the currency symbol from the output. It's useful for displaying prices in a format matching your store's configuration without monetary indicators.
