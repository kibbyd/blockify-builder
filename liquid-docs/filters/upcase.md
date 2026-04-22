# Liquid Filter: upcase

## Description
"Converts a string to all uppercase characters."

## Syntax
```liquid
string | upcase
```

## Return Type
String

## Usage
The `upcase` filter transforms text by converting all characters to their uppercase equivalents.

## Example

**Template Code:**
```liquid
{{ product.title | upcase }}
```

**Input Data:**
```json
{
  "product": {
    "title": "Health potion"
  }
}
```

**Output:**
```html
HEALTH POTION
```

The filter accepts a string value and returns the same text with all letters transformed to capital form.
