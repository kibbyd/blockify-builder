# Liquid Filter: truncate

## Overview
The `truncate` filter shortens strings to a specified character limit. When the text exceeds this limit, an ellipsis gets appended to indicate truncation.

## Syntax
```liquid
string | truncate: number
string | truncate: number, string
```

## Parameters
- **number** (required): Character count for the truncated output
- **string** (optional): Custom ellipsis text (defaults to `...`)

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## How It Works
"If the specified number of characters is less than the length of the string, then an ellipsis (`...`) is appended to the truncated string." The ellipsis counts toward the total character limit.

## Examples

### Basic Usage
```liquid
{{ article.title | truncate: 15 }}
```

**Input:** `"How to tell if you're out of invisibility potion"`
**Output:** `How to tell ...`

### Custom Ellipsis
```liquid
{{ article.title | truncate: 15, '--' }}
{{ article.title | truncate: 15, '' }}
```

**Output:**
```
How to tell i--
How to tell if
```

The second example demonstrates using an empty string to remove the ellipsis entirely.
