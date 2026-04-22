# url_escape Filter Documentation

## Overview
The `url_escape` filter is a Liquid filter that encodes URL-unsafe characters within strings.

## Syntax
```liquid
string | url_escape
```

## Return Type
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
This filter takes any characters that are unsafe for URLs and converts them into their percent-encoded equivalents, making strings safe for use in URLs.

## Example

**Input:**
```liquid
{{ '<p>Health & Love potions</p>' | url_escape }}
```

**Output:**
```
%3Cp%3EHealth%20&%20Love%20potions%3C/p%3E
```

The example demonstrates how special characters are encoded:
- `<` becomes `%3C`
- `>` becomes `%3E`
- Space becomes `%20`
- `&` remains `&` (though encoded in HTML context)

## Use Cases
This filter is essential when constructing URLs that contain user-generated content, special characters, or HTML entities that need to be safely transmitted via URLs.
