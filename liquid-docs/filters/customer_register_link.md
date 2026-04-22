# customer_register_link

## Overview
This Liquid filter generates an HTML link directing users to the customer registration page.

## Syntax
```liquid
string | customer_register_link
```

## Return Type
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
The filter transforms input text into a hyperlink that points to "/account/register" with a specific ID attribute for styling or scripting purposes.

## Example

**Input:**
```liquid
{{ 'Create an account' | customer_register_link }}
```

**Output:**
```html
<a href="/account/register" id="customer_register_link">Create an account</a>
```

## Usage Notes
- The filter accepts any string as input, which becomes the link's display text
- The generated anchor tag automatically includes `id="customer_register_link"` for reference
- The href is hardcoded to "/account/register"
