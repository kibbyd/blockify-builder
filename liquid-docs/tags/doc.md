# Liquid `doc` Tag Documentation

## Overview

The `doc` tag is used to "include documentation within Liquid templates" where "content inside `doc` tags is not rendered or outputted."

## Purpose

This tag serves several functions:

- Embeds documentation directly in template files
- Enables parsing of Liquid code without execution
- Supports developer tooling features including code completion, linting, and inline documentation

## Syntax Structure

```liquid
{% doc %}
  Renders a message.

  @param {string} foo - A string value.
  @param {string} [bar] - An optional string value.

  @example
  {% render 'message', foo: 'Hello', bar: 'World' %}
{% enddoc %}
```

## Key Features

- Content between opening and closing tags is never rendered to users
- Liquid syntax is parsed but not executed within doc blocks
- Supports annotation-based documentation using `@param`, `@example`, and other LiquidDoc syntax
- Optional parameters are denoted with square brackets: `[paramName]`

## Related Resources

For comprehensive syntax details and additional examples, consult the [`LiquidDoc` reference documentation](https://shopify.dev/docs/storefronts/themes/tools/liquid-doc).
