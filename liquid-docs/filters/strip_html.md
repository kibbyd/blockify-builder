# strip_html Filter Documentation

## Overview
The `strip_html` filter removes all HTML tags from a string, leaving only the plain text content.

## Syntax
```liquid
string | strip_html
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string) with all HTML markup removed.

## Description
"Strips all HTML tags from a string." This filter is useful for displaying clean text content without any HTML formatting or markup.

## Usage Example

**Template Code:**
```liquid
<!-- With HTML -->
{{ product.description }}

<!-- HTML stripped -->
{{ product.description | strip_html }}
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
```
<!-- With HTML -->
<h3>Are you low on health? Well we've got the potion just for you!</h3>
<p>Just need a top up? Almost dead? In between? No need to worry because we have a range of sizes and strengths!</p>

<!-- HTML stripped -->
Are you low on health? Well we've got the potion just for you!
Just need a top up? Almost dead? In between? No need to worry because we have a range of sizes and strengths!
```

The filter preserves the text content while eliminating all HTML elements and their associated tags.
