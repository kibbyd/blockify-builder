# image_tag Liquid Filter

## Overview
The `image_tag` filter generates an HTML `<img>` tag for a given image URL, automatically adding width and height attributes based on the image dimensions and aspect ratio.

## Syntax
```liquid
string | image_tag
```

**Returns:** string

## Basic Usage
```liquid
{{ product | image_url: width: 200 | image_tag }}
```

## Parameters

### width
Specifies the `width` attribute of the `<img>` tag. Set to `nil` to omit the attribute.

```liquid
{{ product | image_url: width: 400 | image_tag: width: 300 }}
```

### height
Specifies the `height` attribute of the `<img>` tag. Set to `nil` to omit the attribute.

```liquid
{{ product | image_url: width: 400 | image_tag: height: 300 }}
```

### sizes
Applies the HTML `sizes` attribute for responsive image sizing.

```liquid
{{ product | image_url: width: 200 | image_tag: sizes: '(min-width:1600px) 960px, calc(100vw - 4rem)' }}
```

### widths
Creates a custom `srcset` with specified widths instead of Shopify's defaults.

```liquid
{{ product | image_url: width: 600 | image_tag: widths: '200, 300, 400' }}
```

### srcset
Allows custom `srcset` creation. Set to `nil` to remove the attribute.

```liquid
{{ product | image_url: width: 200 | image_tag: srcset: nil }}
```

### preload
Sends a resource hint as a Link HTTP header with `rel=preload` for above-the-fold images.

```liquid
{{ product | image_url: width: 200 | image_tag: preload: true }}
```

### alt
Overrides the default alt text or provides custom alternative text.

```liquid
{{ product | image_url: width: 200 | image_tag: alt: "Custom alt text" }}
```

### HTML attributes
Any standard HTML `<img>` attribute can be specified as a parameter.

```liquid
{{ product | image_url: width: 200 | image_tag: class: 'custom-class', loading: 'lazy' }}
```

## Key Features

- **Automatic lazy loading:** Images load lazily by default unless `preload` is applied
- **Focal point support:** Automatically applies focal points using CSS `object-position` styling
- **Responsive srcset:** Generates optimized image variants for different screen sizes
- **Height calculation:** Maintains aspect ratio automatically from image URL dimensions
