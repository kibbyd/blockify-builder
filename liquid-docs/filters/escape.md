# Liquid Filter: escape

## Overview
The `escape` filter converts special HTML characters into their corresponding escape sequences, making content safe for HTML rendering.

## Syntax
```
string | escape
```

## Return Type
[string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
This filter handles special characters like `<>`, `'`, and `&` by converting them into escape sequences. Characters without corresponding escape sequences remain unchanged in the output.

## Example

**Input:**
```liquid
{{ '<p>Text to be escaped.</p>' | escape }}
```

**Output:**
```html
&lt;p&gt;Text to be escaped.&lt;/p&gt;
```

In this example, the angle brackets are converted to `&lt;` and `&gt;` entities, preventing the HTML tags from being interpreted as markup.

---

**Source:** [Shopify Liquid Documentation](https://shopify.dev/docs/api/liquid/filters/escape)
