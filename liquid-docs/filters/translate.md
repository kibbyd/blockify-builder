# Liquid Filter: translate

## Overview
The `translate` filter (alias: `t`) retrieves translated text from locale files based on a specified key.

## Syntax
```
string | t
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
"Returns a string of translated text for a given translation key from a [locale file](https://shopify.dev/themes/architecture/locales)."

The `t` alias is the more prevalent form in practice.

## Usage Context

### Theme-Level Translations
Content intended to be globally accessible throughout a theme should be stored in the theme's `locales` directory. This approach allows shared translations (like "See more") to be referenced across multiple template sections.

### Section-Level Translations
The filter can also access keys from a section file's `schema` tag within the `locales` object. "Content that you put in the `schema` under the `locales` object is only accessible to that section."

This approach is beneficial for creating standalone sections designed for multi-theme distribution.

## Important Note
Translations appearing in a section's `schema` tag outside the `locales` object serve as merchant-facing interface text within the theme editor and do not utilize the `t` filter.

## Related Resources
- [Storefront locale file usage](https://shopify.dev/themes/architecture/locales/storefront-locale-files#usage)
- [Schema locale file usage](https://shopify.dev/themes/architecture/locales/schema-locale-files#usage)
