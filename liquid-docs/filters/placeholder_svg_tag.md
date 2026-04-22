# Liquid Filter: placeholder_svg_tag

## Overview

The `placeholder_svg_tag` filter generates an HTML `<svg>` tag for a specified placeholder image name.

## Syntax

```liquid
string | placeholder_svg_tag
```

**Returns:** string

## Description

This filter accepts a placeholder name and returns the corresponding SVG markup. Two categories of placeholder illustrations are available: outline and color variants.

## Available Placeholders

### Outline Illustrations
- `product-1` through `product-6`
- `collection-1` through `collection-6`
- `lifestyle-1`, `lifestyle-2`
- `image`

### Color Illustrations
- `product-apparel-1` through `product-apparel-4`
- `collection-apparel-1` through `collection-apparel-4`
- `hero-apparel-1` through `hero-apparel-3`
- `blog-apparel-1` through `blog-apparel-3`
- `detailed-apparel-1`

## Basic Example

```liquid
{{ 'collection-1' | placeholder_svg_tag }}
```

Outputs an SVG element with the collection-1 placeholder image.

## Parameters

### class (optional)

Adds a CSS class attribute to the generated `<svg>` tag.

```liquid
{{ 'collection-1' | placeholder_svg_tag: 'custom-class' }}
```

This appends `class="custom-class"` to the SVG output, enabling targeted styling.
