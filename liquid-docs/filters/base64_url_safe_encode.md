# base64_url_safe_encode

## Overview

This Liquid filter transforms a string into URL-safe Base64 encoding, replacing the standard Base64 characters `+` and `/` with `-` and `_` respectively.

## Syntax

```liquid
string | base64_url_safe_encode
```

## Return Value

Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description

"Encodes a string to URL-safe Base64 format." The filter modifies standard Base64 output to be compatible with URL contexts by substituting special characters.

## Example

**Input:**
```liquid
{{ 'one two three' | base64_url_safe_encode }}
```

**Output:**
```
b25lIHR3byB0aHJlZQ==
```

## Related Resources

- [Base64 Format Reference](https://developer.mozilla.org/en-US/docs/Glossary/Base64)
- [Official Shopify Documentation](https://shopify.dev/docs/api/liquid/filters/base64_url_safe_encode)
