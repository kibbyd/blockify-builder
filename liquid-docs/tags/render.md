# Liquid Tag: render

## Overview

The `render` tag displays a [snippet](/themes/architecture/snippets) or [app block](/themes/architecture/sections/section-schema#render-app-blocks).

## Key Behaviors

**Variable Access:**
- Snippets and app blocks cannot directly access variables created outside them
- They can access global objects and objects directly available in their context
- Variables created inside snippets are inaccessible from outside

**Important Note:** "When you render a snippet using the `render` tag, you can't use the [`include` tag`]" within it.

## Basic Syntax

```
{% render 'filename' %}
```

**Parameter:**
- `filename` — snippet name without the `.liquid` extension

## Parameters

### for
Renders a snippet for each array item:

```
{% render 'filename' for array as item %}
```

Features:
- Iterates through array elements
- Uses optional `as` parameter to name the current item
- Provides access to the [`forloop` object](/docs/api/liquid/objects/forloop)

### Passing Variables

Pass external variables as parameters:

```
{% render 'filename', variable: value %}
```

**Constraint:** "Any changes that are made to a passed variable apply only within the snippet."

### with

Pass a single object to a snippet:

```
{% render 'filename' with object as name %}
```

- Optional `as` parameter specifies a custom reference name
- Without `as`, reference the object using the snippet filename
