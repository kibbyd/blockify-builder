# asset_img_url Filter Documentation

## Overview
The `asset_img_url` filter provides a CDN URL for images stored in a theme's assets directory.

## Syntax
```liquid
string | asset_img_url
```

**Returns:** string

## Description
This filter converts asset filenames into complete CDN URLs, enabling efficient image delivery. As noted in the documentation, it "returns the CDN URL for an image in the assets directory of a theme."

## Basic Example
```liquid
{{ 'red-and-black-bramble-berries.jpg' | asset_img_url }}
```

**Output:**
```
//polinas-potent-potions.myshopify.com/cdn/shop/t/4/assets/red-and-black-bramble-berries_small.jpg?336
```

## Size Parameter
```liquid
image | asset_img_url: string
```

The filter defaults to the `small` size variant (100 x 100 px), but you can specify alternative dimensions using the size parameter.

### Example with Size Specification
```liquid
{{ 'red-and-black-bramble-berries.jpg' | asset_img_url: 'large' }}
```

**Output:**
```
//polinas-potent-potions.myshopify.com/cdn/shop/t/4/assets/red-and-black-bramble-berries_large.jpg?336
```
