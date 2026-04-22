# Liquid Settings Object Documentation

## Overview
The `settings` object provides access to all theme configuration values defined in the `settings_schema.json` file.

## Availability
- **Globally accessible** in Liquid templates

## Description
"Allows you to access all of the theme's settings from the settings_schema.json file." This enables theme developers to reference and utilize custom settings throughout their templates.

## Usage Example

### Basic Implementation
```liquid
{% if settings.favicon != blank %}
  <link rel="icon" type="image/png" href="{{ settings.favicon | image_url: width: 32, height: 32 }}">
{% endif %}
```

### Example Data Structure
```json
{
  "settings": {
    "favicon": null
  }
}
```

## Key Points
- Reference settings using dot notation: `settings.setting_name`
- Combine with conditional logic to handle blank or null values
- Apply filters like `image_url` to process setting values
- For available setting types, consult the Input settings documentation
