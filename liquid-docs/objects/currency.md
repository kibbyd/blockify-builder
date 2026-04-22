# Currency Object Documentation

## Overview
The currency object provides information about a currency, including its ISO code and symbol.

## Properties

### iso_code
- **Type:** string
- **Description:** "The ISO code of the currency" (references the ISO 4217 currency codes standard)

### name
- **Type:** string
- **Description:** "The name of the currency"

### symbol
- **Type:** string
- **Description:** "The symbol of the currency"

## Example

A Canadian Dollar currency object:

```json
{
  "iso_code": "CAD",
  "name": "Canadian Dollar",
  "symbol": "$"
}
```

This example demonstrates how the three properties work together to represent a single currency's complete information within Shopify's Liquid templating language.