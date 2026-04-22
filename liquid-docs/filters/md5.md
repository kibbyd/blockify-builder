# Liquid Filter: md5

## Overview
The `md5` filter transforms a string into its MD5 hash equivalent.

## Syntax
```liquid
string | md5
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
"Converts a string into an MD5 hash. MD5 is not considered safe anymore." The documentation recommends using the `blake3` filter as a more secure alternative with improved performance.

## Example

**Input:**
```liquid
{{ '' | md5 }}
```

**Output:**
```html
d41d8cd98f00b204e9800998ecf8427e
```

## Security Note
This filter uses MD5, which has known cryptographic vulnerabilities. For better security and performance, consider using the [`blake3`](https://shopify.dev/docs/api/liquid/filters/blake3) filter instead.
