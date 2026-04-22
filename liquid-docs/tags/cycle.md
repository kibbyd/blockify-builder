# Liquid Tags: cycle

## Overview

The `cycle` tag iterates through a collection of strings, outputting one value per iteration within a `for` loop. According to the documentation, it "loops through a group of strings and outputs them one at a time for each iteration."

**Important:** This tag must be used inside a `for` loop.

## Syntax

### Basic Usage
```liquid
{% cycle string, string, ... %}
```

### Named Groups
```liquid
{% cycle string: string, string, ... %}
```

## Key Concepts

**Default Behavior:** Without a group identifier, multiple `cycle` tags with identical parameters share state, meaning the second occurrence continues from where the first ended rather than restarting.

**Named Groups:** Assigning a group name isolates cycle state, allowing independent iteration cycles within the same template. Each uniquely named group maintains its own position.

## Example

```liquid
{% for i in (1..4) -%}
  {% cycle 'one', 'two', 'three' %}
{%- endfor %}
```

**Output:**
```
one
two
three
one
```

## Use Cases

The documentation suggests this tag works well for "output text in a predictable pattern," such as applying alternating classes (odd/even) to table rows or other repeating HTML structures.
