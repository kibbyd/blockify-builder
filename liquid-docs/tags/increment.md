# Liquid increment Tag Documentation

## Overview

The `increment` tag creates a new variable with a default value of 0 that increases by 1 with each subsequent call.

## Syntax

```liquid
{% increment variable_name %}
```

### Parameters

- **variable_name** (required): The name of the variable being incremented

## Important Notes

> "Predefined Liquid objects can be overridden by variables with the same name. To make sure that you can access all Liquid objects, make sure that your variable name doesn't match a predefined object's name."

### Scope & Behavior

Variables declared with `increment` are unique to the layout, template, or section file where they're created, but are shared across included snippets within that file.

The `increment` tag creates variables that are independent from those created with `assign` and `capture` tags. However, `increment` and `decrement` tags share the same variables.

## Example

### Code
```liquid
{% increment variable %}
{% increment variable %}
{% increment variable %}
```

### Output
```
0
1
2
```

The first call returns 0, then each subsequent call returns the incremented value.
