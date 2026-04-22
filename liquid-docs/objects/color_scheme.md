# color_scheme Liquid Object

## Overview
The `color_scheme` object represents a color scheme configuration from a `color_scheme` setting. It provides access to color scheme data within Shopify themes.

## Properties

### id
- **Type:** string
- **Description:** Identifies the specific color scheme

### settings
- **Type:** object
- **Description:** Contains the configuration values associated with the color scheme

## Example Structure
```json
{
  "id": "background-2",
  "settings": {}
}
```

## Direct Reference Usage

When accessing a color scheme setting directly through the settings object, only the scheme's ID is returned:

```liquid
{{ settings.card_color_scheme }}
```

**Output:**
```
background-2
```

## Related Resources
For information about organizing multiple color schemes, see the `color_scheme_group` setting documentation.