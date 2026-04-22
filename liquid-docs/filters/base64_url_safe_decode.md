# base64_url_safe_decode

## Overview

This Liquid filter decodes strings that use "URL-safe Base64 format," a variant of standard Base64 encoding suitable for URLs.

## Syntax

```liquid
string | base64_url_safe_decode
```

## Return Value

Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description

The filter transforms "a string in URL-safe Base64 format" into its decoded, readable form.

## Example

**Input:**
```liquid
{{ 'b25lIHR3byB0aHJlZQ==' | base64_url_safe_decode }}
```

**Output:**
```
one two three
```

## Related Resources

- [Base64 documentation](https://developer.mozilla.org/en-US/docs/Glossary/Base64) on MDN Web Docs
