# link_to_tag Filter Documentation

## Overview
The `link_to_tag` filter "generates an HTML `<a>` tag with an `href` attribute linking to the current blog or collection, filtered to show only articles or products that have a given tag."

## Syntax
```liquid
string | link_to_tag
```

## Return Value
Returns a string containing HTML markup.

## Usage Example

### Code
```liquid
{% for tag in collection.all_tags %}
  {{- tag | link_to_tag: tag }}
{% endfor %}
```

### Sample Output
```html
<a href="/services/liquid_rendering/extra-potent" title="Show products matching tag extra-potent">extra-potent</a>
<a href="/services/liquid_rendering/fresh" title="Show products matching tag fresh">fresh</a>
<a href="/services/liquid_rendering/healing" title="Show products matching tag healing">healing</a>
<a href="/services/liquid_rendering/ingredients" title="Show products matching tag ingredients">ingredients</a>
```

## Related Resources
- Filter articles by tag documentation
- Filter collections by tag documentation

## Use Cases
This filter is particularly useful for generating navigational links that allow customers to explore products or articles grouped by specific tags within collections or blogs.
