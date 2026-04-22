# url_encode Liquid Filter

## Overview
The `url_encode` filter converts URL-unsafe characters in a string to their percent-encoded equivalents.

## Syntax
```liquid
string | url_encode
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
This filter transforms any characters that are unsafe for use in URLs into their proper encoded format. An important distinction is that spaces become `+` characters rather than their percent-encoded form.

## Example

**Input:**
```liquid
{{ 'test@test.com' | url_encode }}
```

**Output:**
```html
test%40test.com
```

In this example, the `@` symbol is converted to `%40`, which is its percent-encoded representation suitable for URL transmission.

## References
- [Percent-encoding specification (MDN)](https://developer.mozilla.org/en-US/docs/Glossary/percent-encoding)
- [Source documentation](https://shopify.dev/docs/api/liquid/filters/url_encode)
