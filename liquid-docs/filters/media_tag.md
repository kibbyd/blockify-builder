# Liquid Filter: media_tag

## Overview
The `media_tag` filter generates appropriate HTML markup for media objects in Shopify Liquid templates.

## Syntax
```liquid
media | media_tag
```

**Return Type:** String

## Description
This filter "generates an appropriate HTML tag for a given media object." The output adapts based on media type—producing `<iframe>` tags for embedded videos, `<video>` tags for hosted video files, or other suitable markup.

## Basic Usage

```liquid
{% for media in product.media %}
  {{- media | media_tag }}
{% endfor %}
```

The filter automatically generates optimized HTML. For YouTube embeds, it creates iframes with sandbox attributes. For hosted videos, it outputs `<video>` elements with poster images and source tags.

## Parameters

### image_size
Specify poster image dimensions in pixels using the `image_size` parameter:

```liquid
{% for media in product.media %}
  {{- media | media_tag: image_size: '400x' }}
{% endfor %}
```

This parameter controls the resolution of thumbnail images displayed with video media, allowing developers to optimize image file sizes for different layouts.

## Output Examples

- **YouTube:** `<iframe>` with embedded player and accessibility attributes
- **Video Files:** `<video>` element with controls, poster image, and fallback `<img>` tag
- **Responsive:** Poster images adjust resolution based on the `image_size` parameter
