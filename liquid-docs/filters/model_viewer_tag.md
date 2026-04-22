# model_viewer_tag Filter Documentation

## Overview
The `model_viewer_tag` filter "generates a Google model viewer component for a given 3D model."

## Syntax
```liquid
media | model_viewer_tag
```

**Return Type:** String

## Basic Usage
Apply the filter to media objects with type `model`:

```liquid
{% for media in product.media %}
  {% if media.media_type == 'model' %}
    {{ media | model_viewer_tag }}
  {% endif %}
{% endfor %}
```

This produces a `<model-viewer>` HTML element with the 3D model embedded.

## Default Attributes
The generated component includes:
- `alt` – The media's alt text
- `poster` – Preview image URL
- `camera-controls` – Enables mouse/touch interactions

## Custom Attributes
Override default settings or add supported model viewer attributes by passing parameters:

```liquid
{{ media | model_viewer_tag: interaction-policy: 'allow-when-focused' }}
```

Any "supported model viewer component attributes" can be customized this way.

## image_size Parameter
Control the poster image dimensions in pixels:

```liquid
{{ media | model_viewer_tag: image_size: '400x' }}
```

This resizes the preview image (e.g., `WaterBottle_400x.jpg` instead of the default).

## Output Example
The filter generates a self-contained HTML element with src, styling, and metadata attributes automatically populated from the media object.
