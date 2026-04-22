# Liquid Filter: within

## Overview
The `within` filter generates a product URL within the context of a provided collection, enabling collection-specific product page URLs.

## Syntax
```liquid
string | within: collection
```

## Return Type
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
"Generates a product URL within the context of the provided collection." When you include collection context, you can access the associated collection object in the product template.

## Parameters
- **collection** - The collection object providing context for the product URL

## Example

### Input Template
```liquid
{%- assign collection_product = collection.products.first -%}
{{ collection_product.url | within: collection }}
```

### Sample Data
```json
{
  "collection": {
    "products": [
      { "url": "/products/draught-of-immortality" },
      { "url": "/products/glacier-ice" },
      { "url": "/products/health-potion" },
      { "url": "/products/invisibility-potion" }
    ]
  }
}
```

### Output
```
/collections/sale-potions/products/draught-of-immortality
```

## Important Consideration
**SEO Note:** Since standard product pages and collection-contextual product pages share identical content across different URLs, "you should consider the SEO implications of using the within filter."
