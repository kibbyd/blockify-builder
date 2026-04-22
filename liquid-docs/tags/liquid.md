# Liquid Tag Documentation

## Overview

The `liquid` tag provides a way to write Liquid code blocks without requiring delimiters on individual tags. This streamlines syntax by allowing each tag to appear on its own line within a single block.

## Key Point

"Use the `echo` tag to output an expression inside `liquid` tags."

## Syntax Structure

```
{% liquid
  expression
%}
```

**Parameter:**
- `expression` — The Liquid code to execute within the block

## Example Implementation

The documentation demonstrates a practical use case that assigns variables and uses conditional logic:

```liquid
{% liquid
  assign product_type = product.type | downcase
  assign message = ''

  case product_type
    when 'health'
      assign message = 'This is a health potion!'
    when 'love'
      assign message = 'This is a love potion!'
    else
      assign message = 'This is a potion!'
  endcase

  echo message
%}
```

## Output Result

When executed with product data, the example produces:
```
This is a health potion!
```

## Important Constraint

Each tag must be placed on its own line since the block format eliminates individual tag delimiters, making line breaks essential for proper parsing.
