# product_img_url Filter Documentation

## Overview
Returns the CDN URL for a product image in Shopify Liquid.

## Status
**Deprecated** — This filter has been replaced by the `image_url` filter.

## Syntax
```liquid
variable | product_img_url
```

## Return Type
String

## Description
Generates a CDN URL for product images, accepting either the featured image or any image from the images array.

## Basic Usage
```liquid
{{ product.featured_image | product_img_url }}
```

**Example Output:**
```
//polinas-potent-potions.myshopify.com/cdn/shop/files/science-beakers-blue-light-new_small.jpg?v=1683744744
```

## Size Parameter
The filter accepts an optional size parameter to customize image dimensions.

**Syntax:**
```liquid
image | product_img_url: string
```

**Default Behavior:** Returns the small version (100 x 100 px)

**Example with Custom Size:**
```liquid
{{ product.images[0] | product_img_url: 'large' }}
```

**Output:**
```
//polinas-potent-potions.myshopify.com/cdn/shop/files/science-beakers-blue-light-new_large.jpg?v=1683744744
```

## Migration Note
Developers should use the `image_url` filter as the preferred alternative to this deprecated filter.
