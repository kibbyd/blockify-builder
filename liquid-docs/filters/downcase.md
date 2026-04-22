# Liquid Filter: downcase

## Overview
The `downcase` filter transforms string content by converting all characters to lowercase.

## Syntax
```liquid
string | downcase
```

## Return Type
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
"Converts a string to all lowercase characters." This filter is useful for normalizing text display or ensuring consistent formatting regardless of the original casing.

## Example

**Template Code:**
```liquid
{{ product.title | downcase }}
```

**Input Data:**
```json
{
  "product": {
    "title": "Health potion"
  }
}
```

**Output:**
```html
health potion
```

## Use Case
Apply this filter when you need to display product names, titles, or other text content in all-lowercase formatting within your Liquid templates.
