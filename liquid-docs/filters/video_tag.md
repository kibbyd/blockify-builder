# video_tag Filter Documentation

## Overview
The `video_tag` filter generates an HTML `<video>` element for a given video in Shopify's Liquid templating language.

**Syntax:** `media | video_tag`
**Returns:** String

## Key Features

### HLS Streaming Support
When MP4 videos are uploaded to Shopify, the system automatically generates an `m3u8` file (HTTP Live Streaming format). This "enables video players to leverage HTTP live streaming (HLS), resulting in an optimized video experience based on the user's internet connection." The player falls back to MP4 if HLS isn't supported. Note: HLS is skipped when looping is enabled to allow progressive download caching.

## Parameters

### image_size
Customize the poster image dimensions in pixels.

**Syntax:** `media | video_tag: image_size: 'WIDTHxHEIGHT'`

Example: `image_size: '400x'`

### HTML5 Attributes
The filter supports standard HTML5 video attributes:

| Attribute | Purpose | Values |
|-----------|---------|--------|
| `autoplay` | Auto-play after loading | `true`, `false` |
| `loop` | Loop video playback | `true`, `false` |
| `muted` | Mute audio | `true`, `false` |
| `controls` | Show playback controls | `true`, `false` |

## Example Usage

```liquid
{% for media in product.media %}
  {% if media.media_type == 'video' %}
    {{ media | video_tag: autoplay: true, loop: true, muted: true, controls: true }}
  {% endif %}
{% endfor %}
```

The filter also includes built-in attributes like `playsinline`, `preload="metadata"`, and an `aria-label` for accessibility.
