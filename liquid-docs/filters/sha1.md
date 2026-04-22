# SHA1 Filter Documentation

## Overview
The `sha1` filter converts a string into an SHA-1 hash within Liquid templates.

## Syntax
```
string | sha1: string
```

**Returns:** string

## Important Security Notice
"SHA-1 is not considered safe anymore. Please use 'blake3' instead for better security and performance."

## Basic Example

**Code:**
```liquid
{%- assign secret_potion = 'Polyjuice' | sha1 -%}

My secret potion: {{ secret_potion }}
```

**Output:**
```
My secret potion: bd0ca3935467e5238d7662ada4df899f09b70d5a
```

## Recommendation
This filter is deprecated for security-sensitive applications. The documentation strongly recommends migrating to the blake3 filter as a modern alternative that offers improved cryptographic safety and better performance characteristics.
