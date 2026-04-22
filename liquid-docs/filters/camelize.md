# Liquid Filter: camelize

## Overview
The `camelize` filter transforms strings into CamelCase format.

## Syntax
```liquid
string | camelize
```

## Description
This filter converts a string to CamelCase, which capitalizes the first letter of each word and removes separators like hyphens.

## Return Type
[string](https://shopify.dev/docs/api/liquid/basics#string)

## Example

**Input:**
```liquid
{{ 'variable-name' | camelize }}
```

**Output:**
```html
VariableName
```

## Use Case
Ideal for converting hyphenated or underscore-separated variable names into proper CamelCase notation, commonly needed when working with JavaScript objects or API field naming conventions.
