# newline_to_br Filter Documentation

## Overview
The `newline_to_br` filter is a Liquid filter that transforms newline characters into HTML line break elements.

## Syntax
```oobleck
string | newline_to_br
```

## Description
This filter processes text by replacing all newline characters (`\n`) with `<br>` HTML tags, making it useful for displaying multi-line content with proper line breaks in web output.

## Return Type
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Example

**Input Code:**
```liquid
{{ product.description | newline_to_br }}
```

**Sample Data:**
```json
{
  "product": {
    "description": "<h3>Are you low on health? Well we've got the potion just for you!</h3>\n<p>Just need a top up? Almost dead? In between? No need to worry because we have a range of sizes and strengths!</p>"
  }
}
```

**Output:**
```html
<h3>Are you low on health? Well we've got the potion just for you!</h3><br />
<p>Just need a top up? Almost dead? In between? No need to worry because we have a range of sizes and strengths!</p>
```

## Use Case
This filter is particularly useful when working with product descriptions or other text fields that contain line breaks that need to be preserved in HTML rendering.
