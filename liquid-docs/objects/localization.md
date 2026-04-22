# Liquid Objects: Localization

## Overview
The `localization` object provides details about countries and languages accessible within a store, enabling localization functionality in themes.

## Usage Context
This object integrates with "[localization form](https://shopify.dev/docs/api/liquid/tags/form#form-localization)" implementations. For comprehensive guidance on supporting multiple currencies and languages, refer to Shopify's internationalization documentation.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `available_countries` | array of country objects | "The countries that are available on the store." |
| `available_languages` | array of shop_locale objects | "The languages that are available on the store." |
| `country` | country object | "The currently selected country on the storefront." |
| `language` | shop_locale object | "The currently selected language on the storefront." |
| `market` | market object | "The currently selected market on the storefront." |

## JSON Structure

```json
{
  "available_countries": [],
  "available_languages": [],
  "country": {},
  "language": {},
  "market": {}
}
```

## Related Resources
- [Country object documentation](https://shopify.dev/docs/api/liquid/objects/country)
- [Shop locale object documentation](https://shopify.dev/docs/api/liquid/objects/shop_locale)
- [Market object documentation](https://shopify.dev/docs/api/liquid/objects/market)