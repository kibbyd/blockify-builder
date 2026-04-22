# Liquid Filter: replace

## Overview
"Replaces any instance of a substring inside a string with a given string."

## Syntax
```liquid
string | replace: string, string
```

## Return Type
String

## Description
This filter searches through text content and substitutes all occurrences of a specified substring with a replacement value.

## Example

**Template Code:**
```liquid
{{ product.handle | replace: '-', ' ' }}
```

**Input Data:**
```json
{
  "product": {
    "handle": "komodo-dragon-scale"
  }
}
```

**Output:**
```html
komodo dragon scale
```

## How It Works
The filter takes two arguments:
1. **First argument** — the substring to find
2. **Second argument** — the replacement text

In the example above, all hyphens in the product handle are replaced with spaces, transforming "komodo-dragon-scale" into "komodo dragon scale".
