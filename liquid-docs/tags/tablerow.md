# Liquid tablerow Tag Documentation

## Overview

The `tablerow` tag generates HTML table rows for iterating through array items. It must be wrapped in `<table>` and `</table>` tags.

## Basic Syntax

```liquid
{% tablerow variable in array %}
  expression
{% endtablerow %}
```

**Parameters:**
- `variable`: Current item in the iteration
- `array`: The collection to iterate over
- `expression`: Content to render for each item

## Core Parameters

### cols
Specifies the number of columns per row:
```liquid
{% tablerow product in collection.products cols: 2 %}
  {{ product.title }}
{% endtablerow %}
```

### limit
Restricts the number of iterations:
```liquid
{% tablerow product in collection.products limit: 2 %}
  {{ product.title }}
{% endtablerow %}
```

### offset
Starts iteration at a 1-based index position:
```liquid
{% tablerow product in collection.products offset: 2 %}
  {{ product.title }}
{% endtablerow %}
```

### range
Iterates over numeric ranges using literal or variable values:
```liquid
{% tablerow i in (1..3) %}
  {{ i }}
{% endtablerow %}
```

## tablerowloop Object

Provides loop metadata with these properties:

| Property | Type | Description |
|----------|------|-------------|
| `col` | number | 1-based column index |
| `col0` | number | 0-based column index |
| `col_first` | boolean | First column in row |
| `col_last` | boolean | Last column in row |
| `first` | boolean | First iteration |
| `index` | number | 1-based iteration count |
| `index0` | number | 0-based iteration count |
| `last` | boolean | Final iteration |
| `length` | number | Total iterations |
| `rindex` | number | Reverse 1-based index |
| `rindex0` | number | Reverse 0-based index |
| `row` | number | 1-based row number |
