# Liquid Comment Tag Documentation

## Overview

The `comment` tag prevents expressions from being rendered or producing output.

> "Any text inside `comment` tags won't be output, and any Liquid code will be parsed, but not executed."

## Purpose

This tag is useful for:
- Annotating code with explanatory notes
- Temporarily disabling logic without removing it from the template

## Syntax

### Block Comments

```liquid
{% comment %}
content
{% endcomment %}
```

The `content` parameter represents the material you wish to hide from rendering.

### Inline Comments

```liquid
{% # content %}
```

Inline comments suppress expressions within tag syntax `{% %}`. They're ideal for single-line annotations or temporarily preventing specific logic execution.

**Multi-line Support:** Each line requires its own `#` symbol, or a syntax error will occur.

### Inline Comments in Liquid Tags

When using the `liquid` tag, include inline comment syntax on each line you want to comment:

```liquid
{% liquid
  # this is a comment
  assign topic = 'Learning about comments!'
  echo topic
%}
```

**Output:** `Learning about comments!`

## Examples

**Basic block comment:**
```liquid
{% comment %}
This won't appear
{% endcomment %}
```

**Inline single-line:**
```liquid
{% # annotating code here %}
```

**Inline multi-line:**
```liquid
{%
  ###############################
  # This is a comment
  # across multiple lines
  ###############################
%}
```
