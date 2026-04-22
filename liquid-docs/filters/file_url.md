# file_url Filter

## Overview
The `file_url` filter generates a CDN URL pointing to files stored in the Shopify admin's Files section.

## Syntax
```liquid
string | file_url
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string) containing the CDN URL.

## Description
This filter retrieves "the CDN URL for a file from the Files page of the Shopify admin." The resulting URL leverages Shopify's content delivery network for optimal performance.

## Example

**Input:**
```liquid
{{ 'disclaimer.pdf' | file_url }}
```

**Output:**
```
//polinas-potent-potions.myshopify.com/cdn/shop/files/disclaimer.pdf?v=9043651738044769859
```

## Key Points
- Accesses files uploaded through the Shopify admin interface
- Generates optimized CDN URLs automatically
- Includes version parameters for cache management
- Works with any file type stored in the Files section
