# hmac_sha1 Filter Documentation

## Overview
The `hmac_sha1` filter "converts a string into an SHA-1 hash using a hash message authentication code (HMAC)."

## Syntax
```liquid
string | hmac_sha1: string
```

## Parameters
- **Input**: A string to be hashed
- **Secret Key**: A string parameter that serves as the authentication secret

## Return Value
Returns a hashed string in SHA-1 format.

## Example Usage

**Input Code:**
```liquid
{%- assign secret_potion = 'Polyjuice' | hmac_sha1: 'Polina' -%}
My secret potion: {{ secret_potion }}
```

**Output:**
```
My secret potion: 63304203b005ea4bc80546f1c6fdfe252d2062b2
```

## How It Works
The filter requires both the input string and a secret key parameter. "The secret key for the message is supplied as a parameter to the filter," enabling secure message authentication through HMAC-SHA1 cryptographic hashing.
