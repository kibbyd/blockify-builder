# Liquid Tag: raw

## Overview
The `raw` tag outputs Liquid code as plain text rather than executing it. This allows you to display Liquid syntax literally without interpretation.

## Syntax
```
{% raw %}
  expression
{% endraw %}
```

## Parameters

**expression**
The code block to be displayed as text without any rendering or evaluation.

## Example

### Input
```liquid
{% raw %}
{{ 2 | plus: 2 }} equals 4.
{% endraw %}
```

### Output
```html
{{ 2 | plus: 2 }} equals 4.
```

## Use Case
Use this tag when you need to display Liquid syntax, filters, or expressions as literal text in your output, preventing the template engine from interpreting them.
