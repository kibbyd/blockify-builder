# Template Object Documentation

## Overview
The `template` object provides information about the current template being rendered within a Shopify theme.

## Properties

### directory
- **Type:** `string`
- **Description:** The parent directory name of the template. Returns `nil` if located in `/templates`.

### name
- **Type:** `string` (enumerated values)
- **Description:** "The name of the template's type"
- **Valid Values:** 404, article, blog, cart, collection, list-collections, customers/account, customers/activate_account, customers/addresses, customers/login, customers/order, customers/register, customers/reset_password, gift_card, index, page, password, product, search

### suffix
- **Type:** `string`
- **Description:** "The custom name of an alternate template." Returns `nil` when using the default template.

## Example Output

```json
{
  "directory": null,
  "name": "product",
  "suffix": null
}
```

This example demonstrates accessing the template object on a product page using the default template with no subdirectory.