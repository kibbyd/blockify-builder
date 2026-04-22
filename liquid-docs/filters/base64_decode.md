# base64_decode

## Description
Decodes strings encoded in Base64 format, converting encoded content back to its original readable form.

## Syntax
```liquid
string | base64_decode
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Example

**Input:**
```liquid
{{ 'b25lIHR3byB0aHJlZQ==' | base64_decode }}
```

**Output:**
```
one two three
```

## Overview
This filter accepts Base64-encoded text and produces the decoded output. It's useful when working with encoded data that needs conversion to plaintext format.

**Reference:** [Base64 on MDN](https://developer.mozilla.org/en-US/docs/Glossary/Base64)
