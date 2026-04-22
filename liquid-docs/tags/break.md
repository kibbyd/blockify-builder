# break

## Overview
The `break` tag terminates execution of a `for` loop, preventing further iterations.

## Description
"Stops a [`for` loop](/docs/api/liquid/tags/for) from iterating."

## Syntax

```liquid
{% break %}
```

## Usage Example

The following code demonstrates how to exit a loop when a specific condition is met:

```liquid
{% for i in (1..5) -%}
  {%- if i == 4 -%}
    {% break %}
  {%- else -%}
    {{ i }}
  {%- endif -%}
{%- endfor %}
```

## Output

When executed, the loop terminates upon reaching the value 4, producing:

```
1
2
3
```

## Related Tags
- [`for` loop](/docs/api/liquid/tags/for)
