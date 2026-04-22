# hmac_sha256 Filter Documentation

## Overview
This Liquid filter converts strings into SHA-256 hashes using hash message authentication code (HMAC) technology. The secret key is provided as a parameter.

## Syntax
```
string | hmac_sha256: string
```

## Parameters
- **Input string**: The text to be hashed
- **Secret key**: A string parameter used as the authentication secret

## Return Value
Returns a string containing the hexadecimal SHA-256 hash.

## Example

**Code:**
```liquid
{%- assign secret_potion = 'Polyjuice' | hmac_sha256: 'Polina' -%}
My secret potion: {{ secret_potion }}
```

**Output:**
```
My secret potion: 8e0d5d65cff1242a4af66c8f4a32854fd5fb80edcc8aabe9b302b29c7c71dc20
```

## Use Case
This filter is useful when you need to generate cryptographic signatures for message authentication or security purposes within Liquid templates.
