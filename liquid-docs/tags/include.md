# Liquid Tag: Include

## Overview

The `include` tag is used to render a [snippet](https://shopify.dev/themes/architecture/snippets) within Liquid templates.

## Description

"Renders a snippet." Within the snippet context, developers can both access and modify variables that were defined outside of the snippet file.

## Status

**Deprecated** — "The way that variables are handled reduces performance and makes code harder to both read and maintain." The `include` tag has been superseded by the [`render`](https://shopify.dev/docs/api/liquid/tags/render) tag, which is the recommended alternative.

## Syntax

```liquid
{% include 'filename' %}
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `filename` | The name of the snippet file to render, excluding the `.liquid` file extension |
