# strip_newlines Liquid Filter

## Overview
The `strip_newlines` filter eliminates all line break characters from a string value.

## Syntax
```liquid
string | strip_newlines
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
This filter removes every newline character present in the input string, effectively collapsing multi-line text into a single line.

## Example

**Input Code:**
```liquid
{{ product.description }}
{{ product.description | strip_newlines }}
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

Without the filter, the HTML markup renders with line breaks preserved. After applying `strip_newlines`, the closing `</h3>` tag connects directly to the opening `<p>` tag without any whitespace between them.

## Use Case
This filter proves helpful when formatting needs to eliminate unwanted line breaks from stored content while preserving the actual HTML structure.
