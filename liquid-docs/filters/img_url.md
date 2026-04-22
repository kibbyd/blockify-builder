# img_url Liquid Filter Documentation

## Overview
The `img_url` filter generates CDN URLs for images, though it's now deprecated in favor of `image_url`.

## Syntax
```liquid
variable | img_url
```

**Returns:** String

## Compatible Objects
- article
- collection
- image
- line_item
- product
- variant

## Basic Usage
```liquid
{{ product | img_url }}
```

Output example:
```
//polinas-potent-potions.myshopify.com/cdn/shop/files/science-beakers-blue-light-new_small.jpg?v=1683744744
```

## Parameters

### Size Parameter
Specifies image dimensions (maximum 5760 x 5760 px). Supports custom dimensions or named sizes:

| Named Size | Dimensions |
|---|---|
| pico | 16x16 px |
| icon | 32x32 px |
| thumb | 50x50 px |
| small | 100x100 px |
| compact | 160x160 px |
| medium | 240x240 px |
| large | 480x480 px |
| grande | 600x600 px |
| original/master | 1024x1024 px |

**Examples:** `'480x'`, `'x480'`, `'480x480'`, `'large'`

### Crop Parameter
Controls which portion displays when dimensions differ from original aspect ratio.

**Valid values:** top, center (default), bottom, left, right

### Format Parameter
Converts between image formats. Supported conversions include "png to jpg" and "png to pjpg".

**Valid formats:** pjpg, jpg

### Scale Parameter
Sets pixel density for high-resolution displays.

**Valid densities:** 2, 3

---

**Status:** Deprecated – use `image_url` instead
