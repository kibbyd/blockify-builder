# Liquid Filter: customer_logout_link

## Overview
The `customer_logout_link` filter generates "an HTML link to log the customer out of their account and redirect to the homepage."

## Syntax
```liquid
string | customer_logout_link
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Example

**Input:**
```liquid
{{ 'Log out' | customer_logout_link }}
```

**Output:**
```html
<a href="/account/logout" id="customer_logout_link">Log out</a>
```

## Description
This filter transforms a text string into a functional logout anchor element. The resulting HTML link directs to `/account/logout` and includes a default ID attribute for styling or JavaScript targeting purposes.
