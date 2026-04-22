# payment_type_svg_tag Filter Documentation

## Overview
The `payment_type_svg_tag` is a Liquid filter that "generates an HTML `<svg>` tag for a given payment type."

## Syntax
```liquid
{{ type | payment_type_svg_tag }}
```

## Return Type
Returns a string containing SVG markup.

## Parameters

### class (optional)
- **Type:** string
- **Description:** Specify the desired `class` attribute on the generated `<svg>` element
- **Usage:** `{{ type | payment_type_svg_tag: class: 'custom-class' }}`

## Basic Example

**Code:**
```liquid
{% for type in shop.enabled_payment_types -%}
  {{ type | payment_type_svg_tag }}
{% endfor %}
```

**Data:**
```json
{
  "shop": {
    "enabled_payment_types": [
      "visa",
      "master",
      "american_express",
      "paypal",
      "diners_club",
      "discover"
    ]
  }
}
```

**Output:** Generates individual SVG icons for each payment method with appropriate titles and accessibility attributes.

## Example with Class Parameter

**Code:**
```liquid
{% for type in shop.enabled_payment_types -%}
  {{ type | payment_type_svg_tag: class: 'custom-class' }}
{% endfor %}
```

**Output:** Each SVG includes `class="custom-class"` attribute alongside standard SVG properties.

## Category
Payment
