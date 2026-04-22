# Liquid Filter: highlight

## Overview
The `highlight` filter wraps all instances of a specific string within a given string using an HTML `<strong>` tag with a `class` attribute set to `highlight`.

## Syntax
```liquid
string | highlight: string
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
"Wraps all instances of a specific string, within a given string, with an HTML `<strong>` tag with a `class`"
attribute of `highlight`.

## Example

**Code:**
```liquid
{% for item in search.results %}
  {% if item.object_type == 'product' %}
    {{ item.description | highlight: search.terms }}
  {% else %}
    {{ item.content | highlight: search.terms }}
  {% endif %}
{% endfor %}
```

**Sample Data:**
```json
{
  "search": {
    "results": [
      { "description": "This is a love potion.", "object_type": "product" }
    ],
    "terms": "love"
  }
}
```

**Output:**
```html
This is a <strong class="highlight">love</strong> potion.
```

## Use Case
Ideal for highlighting search terms within product descriptions or content results, making matched terms visually distinct.
