# highlight_active_tag

## Overview

The `highlight_active_tag` filter wraps "a given tag within the collection object in an HTML `<span>` tag, with a `class` attribute of `active`, if the tag is currently active."

This filter exclusively applies to collection tags.

## Syntax

```liquid
string | highlight_active_tag
```

**Returns:** [string](https://shopify.dev/docs/api/liquid/basics#string)

## Usage Example

The filter is typically chained with `link_to_tag` to display collection tags:

```liquid
{% for tag in collection.all_tags %}
  {{- tag | highlight_active_tag | link_to_tag: tag }}
{% endfor %}
```

## Example Output

When a tag is active (e.g., "extra-potent"), the filter produces:

```html
<a href="/services/liquid_rendering/extra-potent">
  <span class="active">extra-potent</span>
</a>
```

Inactive tags render without the span wrapper:

```html
<a href="/services/liquid_rendering/fresh">fresh</a>
```

## Related Resources

- [Collection Object Documentation](https://shopify.dev/docs/api/liquid/objects/collection)
- Official API Reference: [highlight_active_tag Filter](https://shopify.dev/docs/api/liquid/filters/highlight_active_tag)
