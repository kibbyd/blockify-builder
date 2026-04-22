# url_decode Filter Documentation

## Overview
The `url_decode` filter converts percent-encoded characters within a string to their decoded equivalents.

## Syntax
```liquid
string | url_decode
```

## Return Type
String

## Description
This filter processes "any percent-encoded characters in a string," transforming them into their literal character representations based on the percent-encoding standard.

## Example Usage

**Input:**
```liquid
{{ 'test%40test.com' | url_decode }}
```

**Output:**
```html
test@test.com
```

In this example, `%40` (the encoded form of the `@` symbol) is converted to its actual character.

## Related Resources
- Learn more about percent-encoding standards at [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Glossary/percent-encoding)
