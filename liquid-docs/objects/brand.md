# Brand Liquid Object

## Overview

The `brand` object provides access to a store's "[brand assets](https://help.shopify.com/manual/promoting-marketing/managing-brand-assets)."

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `colors` | object | The brand's color palette. See `brand_color` for access details. |
| `cover_image` | image | A square brand logo scaled to 32x32 pixels. |
| `favicon_url` | image | A square favicon version of the logo at 32x32 pixels. |
| `logo` | image | The primary logo for the brand. |
| `metafields` | object | Contains social media links accessible via `shop.brand.metafields.social_links.<platform>.value` |
| `short_description` | string | A brief overview describing the brand. |
| `slogan` | string | The brand's tagline or motto. |
| `square_logo` | image | A square-formatted version of the brand logo. |

## Supported Social Platforms

Social links can be accessed for these platforms: facebook, instagram, pinterest, snapchat, tiktok, tumblr, vimeo, twitter, and youtube.

## Usage Example

```liquid
{{ shop.brand.metafields.social_links.twitter.value }}
{{ shop.brand.metafields.social_links.youtube.value }}
```

This returns URLs like `https://twitter.com/ShopifyDevs` and `https://www.youtube.com/c/shopifydevs`.

## Sample Data Structure

```json
{
  "short_description": "Canada's foremost retailer for potions and potion accessories.",
  "slogan": "Save the toil and trouble!",
  "colors": {},
  "logo": {},
  "square_logo": {},
  "cover_image": {},
  "favicon_url": {},
  "metafields": {}
}
```