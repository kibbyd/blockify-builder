# Liquid Tags: Decrement

## Overview

The `decrement` tag creates a variable that starts at `-1` and decreases by `1` with each call.

## Description

"Creates a new variable, with a default value of -1, that's decreased by 1 with each subsequent call."

**Important Note:** Variables established through `decrement` are confined to the layout, template, or section file where they're created, though they extend across included snippets within that file. These variables operate independently from `assign` and `capture` declarations but share state with `increment`.

## Caution

Predefined Liquid objects can be accidentally replaced by similarly-named variables, potentially blocking access to those built-in objects.

## Syntax

```liquid
{% decrement variable_name %}
```

### Parameter

**variable_name** — The identifier for the variable being reduced.

## Example

### Input

```liquid
{% decrement variable %}
{% decrement variable %}
{% decrement variable %}
```

### Output

```
-1
-2
-3
```

## Scope & Relationships

- Variables are scoped to their originating file (layout, template, or section)
- Shared across included snippets within the same file
- Independent from `assign` and `capture` variables
- Shares state with the `increment` tag
