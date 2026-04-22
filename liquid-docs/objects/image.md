# Liquid Image Object Documentation

## Overview
The `image` object represents images like product or collection images in Shopify's Liquid templating language. For supported formats, see the [Shopify Help Center](https://help.shopify.com/manual/online-store/images/theme-images#image-formats).

## Display Recommendations
"Use the `image_url` and `image_tag` filters to display images on the storefront."

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `alt` | string | Alternative text for the image |
| `aspect_ratio` | number | Aspect ratio expressed as a decimal value |
| `attached_to_variant?` | boolean | Returns `true` if associated with a variant; `nil` otherwise |
| `height` | number | Image height in pixels |
| `id` | number | Unique image identifier (returns `nil` for preview images) |
| `media_type` | string | Always returns `image` (limited availability) |
| `position` | number | Position in `product.images` or `product.media` array |
| `presentation` | image_presentation | Image presentation configuration settings |
| `preview_image` | image | Preview version of the image |
| `product_id` | number | Associated product's ID |
| `src` | string | Relative URL path to the image |
| `variants` | array | Product variants linked to the image |
| `width` | number | Image width in pixels |

## Usage Example

Filter media by type and display:
```liquid
{% assign images = product.media | where: 'media_type', 'image' %}
{% for image in images %}
  {{- image | image_url: width: 300 | image_tag }}
{% endfor %}
```

Direct reference returns the relative URL path:
```liquid
{{ product.featured_image }}
```
