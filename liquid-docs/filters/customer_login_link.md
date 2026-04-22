# customer_login_link Filter

## Overview
The `customer_login_link` filter produces an HTML anchor element directing users to the login page.

## Syntax
```liquid
string | customer_login_link
```

## Return Type
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string) containing HTML markup.

## Description
This filter generates a complete HTML link pointing to the customer authentication page, automatically formatted with the appropriate href and ID attributes.

## Example

**Input:**
```liquid
{{ 'Log in' | customer_login_link }}
```

**Output:**
```html
<a href="/account/login" id="customer_login_link">Log in</a>
```

## Key Details
- The filter wraps your input text in an anchor tag
- The link destination is `/account/login`
- The generated link includes `id="customer_login_link"` for CSS/JavaScript targeting
- Useful for creating consistent login functionality throughout your theme
