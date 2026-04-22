# link_to_remove_tag

## Overview
The `link_to_remove_tag` filter generates an HTML anchor tag that links to the current blog or collection page while removing a specified tag from active filters.

## Syntax
```liquid
string | link_to_remove_tag
```

**Returns:** [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
"Generates an HTML `<a>` tag with an `href` attribute linking to the current blog or collection, filtered to show only articles or products that have any currently active tags, except the provided tag."

## Example Usage

### Liquid Code
```liquid
{% for tag in collection.all_tags %}
  {%- if current_tags contains tag -%}
    {{ tag | link_to_remove_tag: tag }}
  {%- else -%}
    {{ tag | link_to_add_tag: tag }}
  {%- endif -%}
{% endfor %}
```

### Sample Data
```json
{
  "collection": {
    "all_tags": ["extra-potent", "fresh", "healing", "ingredients"]
  },
  "template": "collection"
}
```

### Output
The filter produces anchor tags with appropriate href paths and title attributes that narrow product selection by removing the specified tag from current filters.

## Related Resources
- Filter articles by tag
- Filter collections by tag
