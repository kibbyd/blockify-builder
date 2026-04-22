# Liquid Country Object

## Overview
The `country` object represents a country supported by a store's localization settings. It enables theme developers to implement localization features for multiple currencies and languages.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `available_languages` | array of shop_locale | "The languages that have been added to the market that this country belongs to." |
| `continent` | string | "The continent that the country is in." (Africa, Asia, Central America, Europe, North America, Oceania, South America) |
| `currency` | currency object | "The currency used in the country." |
| `iso_code` | string | "The ISO code of the country in ISO 3166-1 (alpha 2) format." |
| `market` | market object | "The market that includes this country." |
| `name` | string | "The name of the country." |
| `popular?` | boolean | "Returns `true` if the country is popular for this shop." Useful for sorting selectors. |
| `unit_system` | string | "The unit system of the country." (imperial or metric) |

## Key Usage Examples

**Direct Reference:** When referenced directly, the object returns the country name automatically.

**Flag Images:** Passing the country object to the `image_url` filter generates a CDN URL for that country's flag SVG (4:3 aspect ratio).

```liquid
{{ localization.country | image_url: width: 32 | image_tag }}
```

This produces an optimized image tag with responsive sizing.

## Related Resources
Refer to the "Support multiple currencies and languages" guide for implementation strategies in theme development.