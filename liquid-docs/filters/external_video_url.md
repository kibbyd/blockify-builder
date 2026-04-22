# external_video_url Filter

## Overview
This Liquid filter retrieves the URL for an external video, enabling customization of video player parameters via the `external_video_tag` filter.

## Syntax
```liquid
media | external_video_url: attribute: string
```

## Return Value
Returns a string containing the configured video URL.

## Description
The filter processes external video sources and allows you to "specify parameters for the external video player" by adding attributes matching the video platform's supported parameters.

## Supported Platforms
- **YouTube** - supports [YouTube player parameters](https://developers.google.com/youtube/player_parameters#Parameters)
- **Vimeo** - supports [Vimeo player parameters](https://vimeo.zendesk.com/hc/en-us/articles/360001494447-Using-Player-Parameters)

## Example Usage

**YouTube with color parameter:**
```liquid
{{ media | external_video_url: color: 'white' | external_video_tag }}
```

**Vimeo with loop and muted parameters:**
```liquid
{{ media | external_video_url: loop: '1', muted: '1' | external_video_tag }}
```

## Complete Example
The filter works within conditional logic to handle different video hosts:

```liquid
{% for media in product.media %}
  {% if media.media_type == 'external_video' %}
    {% if media.host == 'youtube' %}
      {{ media | external_video_url: color: 'white' | external_video_tag }}
    {% elsif media.host == 'vimeo' %}
      {{ media | external_video_url: loop: '1', muted: '1' | external_video_tag }}
    {% endif %}
  {% endif %}
{% endfor %}
```
