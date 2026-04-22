# default_pagination Filter Documentation

## Overview
The `default_pagination` filter generates HTML pagination links for paginated results. It must be applied to the [`paginate` object](https://shopify.dev/docs/api/liquid/objects/paginate).

## Syntax
```liquid
paginate | default_pagination
```

**Returns:** String (HTML markup)

## Basic Usage
```liquid
{% paginate collection.products by 2 %}
  {% for product in collection.products %}
    {{- product.title }}
  {% endfor %}

  {{- paginate | default_pagination -}}
{% endpaginate %}
```

The basic implementation outputs pagination controls including the current page, numbered page links, and next page navigation.

## Parameters

### previous
Customizes the text label for the previous page link.

```liquid
paginate | default_pagination: previous: 'Previous'
```

### next
Customizes the text label for the next page link.

```liquid
paginate | default_pagination: next: 'Next'
```

### anchor
Adds a URL anchor to all pagination links for page navigation.

```liquid
paginate | default_pagination: anchor: 'pagination'
```

This generates links with hash fragments (e.g., `?page=2#pagination`).

## Example Output
The filter produces HTML with semantic class names:
- `.page` — individual page numbers
- `.page.current` — the active page
- `.next` — the next page link

Combined parameters can be used together for fully customized pagination controls.
