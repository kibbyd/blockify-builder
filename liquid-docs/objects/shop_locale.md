# shop_locale Object

## Overview
The `shop_locale` represents "a language in a store" and provides access to locale information for implementing multi-language support.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `endonym_name` | string | "The name of the locale in the locale itself" |
| `iso_code` | string | "The ISO code of the locale in IETF language tag format" |
| `name` | string | "The name of the locale in the store's primary locale" |
| `primary` | boolean | Returns `true` for the store's primary locale; `false` otherwise |
| `root_url` | string | "The relative root URL of the locale" |

## Example

```json
{
  "endonym_name": "English",
  "iso_code": "en",
  "name": "English",
  "primary": true,
  "root_url": "/"
}
```

## Related Resources
For implementation guidance, refer to Shopify's documentation on "Support multiple currencies and languages" for theme localization strategies.