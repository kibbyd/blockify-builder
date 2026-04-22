# Liquid Filter: capitalize

## Overview
The `capitalize` filter modifies string text by making the initial character uppercase and converting all subsequent characters to lowercase.

## Syntax
```liquid
string | capitalize
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
This filter transforms the first character of a string to uppercase while converting the remaining text to lowercase.

## Example

**Input:**
```liquid
{{ 'this sentence should start with a capitalized word.' | capitalize }}
```

**Output:**
```html
This sentence should start with a capitalized word.
```

The example demonstrates how "this sentence should start with a capitalized word." becomes "This sentence should start with a capitalized word." after the filter is applied.
