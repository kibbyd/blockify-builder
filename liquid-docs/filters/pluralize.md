# Liquid Filter: Pluralize

## Overview
The `pluralize` filter outputs either the singular or plural version of a string based on a provided number.

## Syntax
```
number | pluralize: string, string
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
"Outputs the singular or plural version of a string based on a given number."

## Important Note
**Caution**: The filter uses English pluralization rules exclusively. "You shouldn't use this filter on non-English strings because it could lead to incorrect pluralizations."

## Example

**Template:**
```liquid
Cart item count: {{ cart.item_count }} {{ cart.item_count | pluralize: 'item', 'items' }}
```

**Data:**
```json
{
  "cart": {
    "item_count": 2
  }
}
```

**Output:**
```html
Cart item count: 2 items
```

In this example, since `item_count` equals 2 (a plural value), the filter outputs "items" rather than "item."
