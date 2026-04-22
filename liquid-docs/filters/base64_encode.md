# base64_encode

## Overview
The `base64_encode` filter transforms a string into its Base64 representation.

## Syntax
```liquid
string | base64_encode
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
This filter performs encoding of text data into "Base64 format," which represents binary data in an ASCII string format.

## Example

**Input:**
```liquid
{{ 'one two three' | base64_encode }}
```

**Output:**
```
b25lIHR3byB0aHJlZQ==
```

## Related Resources
- [Base64 documentation](https://developer.mozilla.org/en-US/docs/Glossary/Base64) (external)
