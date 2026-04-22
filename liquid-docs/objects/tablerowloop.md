# tablerowloop Object

The `tablerowloop` object provides information about a parent [`tablerow` loop](https://shopify.dev/docs/api/liquid/tags/tablerow).

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `col` | number | "The 1-based index of the current column." |
| `col_first` | boolean | "Returns `true` if the current column is the first in the row." |
| `col_last` | boolean | "Returns `true` if the current column is the last in the row." |
| `col0` | number | "The 0-based index of the current column." |
| `first` | boolean | "Returns `true` if the current iteration is the first." |
| `index` | number | "The 1-based index of the current iteration." |
| `index0` | number | "The 0-based index of the current iteration." |
| `last` | boolean | "Returns `true` if the current iteration is the last." |
| `length` | number | "The total number of iterations in the loop." |
| `rindex` | number | "The 1-based index of the current iteration, in reverse order." |
| `rindex0` | number | "The 0-based index of the current iteration, in reverse order." |
| `row` | number | "The 1-based index of current row." |

## Example Output

```json
{
  "col": 1,
  "col0": 0,
  "col_first": true,
  "col_last": false,
  "first": true,
  "index": 1,
  "index0": 0,
  "last": false,
  "length": 5,
  "rindex": 5,
  "rindex0": 4,
  "row": 1
}
```
