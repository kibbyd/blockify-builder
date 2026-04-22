# url_param_escape Filter Documentation

## Overview
The `url_param_escape` filter is a Liquid filter that "escapes any characters in a string that are unsafe for URL parameters."

## Syntax
```liquid
string | url_param_escape
```

## Return Type
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Functionality
This filter encodes characters that could interfere with URL parameter formatting. It handles the same character set as the `url_escape` filter, plus the ampersand (`&`) character.

## Example

**Input:**
```liquid
{{ '<p>Health & Love potions</p>' | url_param_escape }}
```

**Output:**
```html
%3Cp%3EHealth%20%26%20Love%20potions%3C/p%3E
```

The example demonstrates encoding HTML tags (`<` → `%3C`, `>` → `%3E`), spaces (` ` → `%20`), and ampersands (`&` → `%26`).

## Related Filters
See also: [`url_escape`](https://shopify.dev/docs/api/liquid/filters/url_escape) filter
