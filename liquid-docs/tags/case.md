# Liquid Case Tag Documentation

## Overview
The `case` tag renders specific expressions based on a variable's value, functioning as a conditional control structure.

## Basic Syntax
```liquid
{% case variable %}
  {% when first_value %}
    first_expression
  {% when second_value %}
    second_expression
  {% else %}
    third_expression
{% endcase %}
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `variable` | The variable whose value determines which branch executes |
| `first_value` | A specific value to compare against |
| `second_value` | Another value to evaluate |
| `first_expression` | Content rendered when variable matches `first_value` |
| `second_expression` | Content rendered when variable matches `second_value` |
| `third_expression` | Fallback content if no values match |

## Example

```liquid
{% case product.type %}
  {% when 'Health' %}
    This is a health potion.
  {% when 'Love' %}
    This is a love potion.
  {% else %}
    This is a potion.
{% endcase %}
```

**Output:** "This is a health potion."

## Multiple Values

The `when` tag supports checking against multiple values simultaneously using either comma separation or the `or` operator:

```liquid
{% case product.type %}
  {% when 'Love' or 'Luck' %}
    This is a love or luck potion.
  {% when 'Strength','Health' %}
    This is a strength or health potion.
  {% else %}
    This is a potion.
{% endcase %}
```
