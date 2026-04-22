# collection_img_url Filter Documentation

## Overview
The `collection_img_url` filter retrieves the CDN URL for a collection's image. This filter is **deprecated** and has been replaced by the `image_url` filter.

## Syntax
```liquid
variable | collection_img_url
```

## Return Type
String

## Basic Usage
```liquid
{{ collection.image | collection_img_url }}
```

**Example Output:**
```
//polinas-potent-potions.myshopify.com/cdn/shop/collections/sale-written-in-lights.jpg?v=1657654130
```

## Size Parameter
The filter accepts an optional size parameter to specify image dimensions. By default, it returns the small version (100 x 100 pixels).

### Syntax with Size
```liquid
image | collection_img_url: string
```

### Example
```liquid
{{ collection.image | collection_img_url: 'large' }}
```

**Example Output:**
```
//polinas-potent-potions.myshopify.com/cdn/shop/collections/sale-written-in-lights_large.jpg?v=1657654130
```

## Deprecation Notice
"The `collection_img_url` filter has been replaced by [`image_url`](https://shopify.dev/docs/api/liquid/filters/image_url)." Use the newer filter for new development.
