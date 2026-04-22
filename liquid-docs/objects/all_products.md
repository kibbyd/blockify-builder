# Liquid Objects: all_products

## Overview

The `all_products` object provides access to all products available in a store through their handles.

## Key Details

**Availability:** Globally accessible

**Primary Use:** Access individual products by their handle identifier, which returns a `product` object for the specified item. Returns `empty` if the product cannot be found.

**Important Limitation:** "The `all_products` object has a limit of 20 unique handles per page." For larger product collections, Shopify recommends using a collection instead.

## Usage Example

Access a product by referencing its handle:

```liquid
{{ all_products['love-potion'].title }}
```

This retrieves the product with handle `love-potion` and outputs its title:

```
Love Potion
```

## Data Structure

```json
{
  "all_products": {
    "love-potion": {
      "title": "Love Potion"
    }
  }
}
```

## Related Resources

- [Product object documentation](https://shopify.dev/docs/api/liquid/objects/product)
- [Handle basics guide](https://shopify.dev/docs/api/liquid/basics#handles)
