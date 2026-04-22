# link_to_add_tag Filter Documentation

## Overview
The `link_to_add_tag` filter creates an HTML anchor tag that links to the current blog or collection while applying a tag filter.

## Syntax
```liquid
string | link_to_add_tag
```

**Returns:** [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
"Generates an HTML `<a>` tag with an `href` attribute linking to the current blog or collection, filtered to show only articles or products that have a given tag, as well as any currently active tags."

## Parameters
The filter accepts a tag parameter that specifies which tag to filter by.

## Usage Example

```liquid
{% for tag in collection.all_tags %}
  {%- if current_tags contains tag -%}
    {{ tag }}
  {%- else -%}
    {{ tag | link_to_add_tag: tag }}
  {%- endif -%}
{% endfor %}
```

## Sample Output
The filter generates links with descriptive titles and appropriate href attributes:

```html
<a href="/services/liquid_rendering/extra-potent"
   title="Narrow selection to products matching tag extra-potent">
   extra-potent
</a>
```

## Related Resources
- Filter articles by tag documentation
- Filter collections by tag documentation
