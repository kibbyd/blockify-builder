# Metaobject Documentation

## Overview

The `metaobject` is a Liquid object representing "a metaobject entry, which includes the values for a set of fields." Each metaobject's structure is determined by its parent `metaobject_definition`.

## Properties

### system
- **Type:** `metaobject_system`
- **Description:** "Basic information about the metaobject. These properties are grouped under the `system` object to avoid collisions between system property names and user-defined metaobject fields."

## Accessing Metaobjects

### Individual Access Pattern

Metaobjects are accessed using a two-layer path:

```liquid
{{ metaobjects.type.handle }}
{{ metaobjects['type']['handle'] }}
```

### Field Value Access

```liquid
{{ metaobjects.testimonials.homepage.title }}
{{ metaobjects['highlights']['washable'].image.value }}
```

## Within Metaobject Templates

Within a dedicated metaobject template, access the current metaobject directly:

```liquid
{{ metaobject.title.value }}
```

Replace `title` with the appropriate field key to retrieve that field's value.

## Important Note

When the `publishable` capability is enabled, only metaobjects with `active` status are accessible. Those with `draft` status return `nil`.

## Available Contexts

- Directly accessible in: metaobject templates
- Returned by: `metaobjects` object