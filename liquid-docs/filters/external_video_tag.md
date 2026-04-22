# external_video_tag Filter Documentation

## Overview
The `external_video_tag` filter "generates an HTML `<iframe>` tag containing the player for a given external video."

## Syntax
```liquid
variable | external_video_tag
```

**Return Type:** String

## Input Requirements
The filter accepts either:
- A `media` object
- An `external_video_url` filter output

## Key Behavior
The filter automatically includes alt text in the iframe's `title` attribute when available. If no alt text exists, "the `title` attribute is set to the product title."

## HTML Attributes
Custom HTML attributes can be added using parameter syntax:
```liquid
variable | external_video_tag: attribute: value
```

Supported attributes follow standard [iframe element specifications](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attributes).

## Usage Example
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

## Custom Class Example
```liquid
{{ media | external_video_url: color: 'white' | external_video_tag: class:'youtube-video' }}
```
