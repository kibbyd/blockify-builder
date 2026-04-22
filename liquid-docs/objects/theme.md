# Theme Object Documentation

## Overview
The `theme` object provides information about the current theme in Shopify's Liquid templating language.

⚠️ **Deprecation Notice**: "Deprecated because the values of this object's properties are subject to change, so can't be relied on within the theme." For linking to the theme editor, use `/admin/themes/current/editor` instead.

## Properties

### id
- **Type**: number
- **Description**: The theme's unique identifier

### name
- **Type**: string
- **Description**: The theme's display name

### role
- **Type**: string (enumerated values)
- **Description**: Indicates the theme's current status and availability

**Possible role values**:

| Value | Meaning |
|-------|---------|
| `main` | Published and visible to customers |
| `unpublished` | Hidden from customers |
| `demo` | Demo installation; requires purchase to publish |
| `development` | Temporary development version; cannot be published |

## Example Output

```json
{
  "id": 124051750977,
  "name": "Dawn",
  "role": "main"
}
```

## Related Resources
While deprecated in Liquid, this object remains accessible through the [REST Admin API](https://shopify.dev/api/admin-rest/current/resources/theme).