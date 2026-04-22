# blake3 Filter Documentation

## Overview
The `blake3` filter converts text strings into Blake3 hash values within Liquid templates.

## Syntax
```liquid
string | blake3
```

## Return Type
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
"Converts a string into a Blake3 hash."

## Usage Example

**Input:**
```liquid
{{ '' | blake3 }}
```

**Output:**
```
af1349b9f5f9a1a6a0404dea36dcc9499bcb25c9adc112b7cc9a93cae41f3262
```

This example demonstrates hashing an empty string, which produces the Blake3 hash value shown above.
