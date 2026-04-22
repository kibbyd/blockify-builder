# Liquid Filter: modulo

## Overview
The `modulo` filter calculates the remainder when one number is divided by another.

## Syntax
```liquid
number | modulo: number
```

## Description
This filter performs a modulo operation, which "returns the remainder of dividing a number by a given number."

## Return Value
Returns a [number](https://shopify.dev/docs/api/liquid/basics#number)

## Example

**Input:**
```liquid
{{ 12 | modulo: 5 }}
```

**Output:**
```html
2
```

In this example, dividing 12 by 5 yields a quotient of 2 with a remainder of 2, so the filter outputs `2`.
