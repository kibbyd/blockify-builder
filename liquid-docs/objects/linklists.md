# Linklists Object Documentation

## Overview
The `linklists` object provides access to "all of the menus in a store" and is globally accessible throughout Liquid templates.

## Access Pattern
Retrieve specific menus by using the menu's handle with dot notation or bracket syntax:

```liquid
linklists.main-menu.links
linklists['footer'].links
```

## Key Properties
- **links**: Array of link objects within a specific menu

## Usage Example

Access menu items through iteration:

```liquid
{% for link in linklists.main-menu.links -%}
  {{ link.title | link_to: link.url }}
{%- endfor %}
```

## Sample Output Structure
```json
{
  "linklists": {
    "main-menu": {
      "links": [
        { "title": "Home", "url": "/" },
        { "title": "Catalog", "url": "/collections/all" },
        { "title": "Contact", "url": "/pages/contact" }
      ]
    },
    "footer": {
      "links": [
        { "title": "Search", "url": "/search" }
      ]
    }
  }
}
```

## Rendered Output
The example produces standard HTML anchor tags with href attributes and titles derived from menu configuration.