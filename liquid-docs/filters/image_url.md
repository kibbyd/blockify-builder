# Liquid Filter: image_url

## Overview
Returns a CDN URL for an image with customizable dimensions and formatting options.

## Syntax
```liquid
variable | image_url: width: number, height: number
```

**Returns:** String

## Compatible Objects
Can be applied to:
- `article`
- `collection`
- `image`
- `line_item`
- `product`
- `variant`
- `country`

(Also works with the `src` property of these objects)

## Required Parameters
**At least one parameter is mandatory.** You must specify either `width` or `height`; an error occurs if neither is provided.

## Parameters

### width
Specifies image width (max `5760px`). When used alone, height auto-calculates based on original proportions.

```liquid
{{ product | image_url: width: 450 }}
```

### height
Specifies image height (max `5760px`). When used alone, width auto-calculates based on original proportions.

```liquid
{{ product | image_url: height: 450 }}
```

### crop
Defines which portion displays when dimensions create a different aspect ratio than the original.

**Values:** `top`, `center` (default), `bottom`, `left`, `right`, `region`

With `region` mode, use `crop_left`, `crop_top`, `crop_width`, and `crop_height` to define extraction boundaries.

```liquid
{{ product | image_url: width: 400, height: 400, crop: 'bottom' }}
```

### format
Converts image to specified format: `pjpg` or `jpg`.

Supported conversions: PNG→JPG, PNG→PJPG, JPG→PJPG

```liquid
{{ product | image_url: width: 450, format: 'pjpg' }}
```

### pad_color
Adds padding in hexadecimal color when dimensions differ from original aspect ratio. Accept `hex3` or `hex6` formats.

```liquid
{{ product | image_url: width: 400, height: 400, pad_color: '000' }}
```

## Important Notes
- "An image can never be resized to be larger than its original dimensions."
- Shopify automatically detects client-supported formats (WebP, AVIF, etc.) for optimization.
