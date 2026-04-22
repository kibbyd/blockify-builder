# Liquid Filter: sort_by

## Overview
The `sort_by` filter appends a sorting parameter to collection URLs, enabling dynamic product sorting.

## Syntax
```
string | sort_by: string
```

**Returns:** String

## Description
"Generates a collection URL with the provided `sort_by` parameter appended." This filter must be applied to the `collection.url` property specifically.

## Accepted Values
- `manual` (per collection settings)
- `best-selling`
- `title-ascending`
- `title-descending`
- `price-ascending`
- `price-descending`
- `created-ascending`
- `created-descending`

## Example

**Liquid Code:**
```liquid
{{ collection.url | sort_by: 'best-selling' }}
```

**Input Data:**
```json
{
  "collection": {
    "url": "/collections/sale-potions"
  }
}
```

**Output:**
```html
/collections/sale-potions?sort_by=best-selling
```

## Related Filters
This filter works in conjunction with `url_for_type` and `url_for_vendor` filters.
