# url_for_vendor

## Overview
This Liquid filter generates a URL pointing to a collection page displaying all products from a specified vendor.

## Syntax
```liquid
string | url_for_vendor
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string) containing the generated URL.

## Description
The filter creates a link to a "[collection page](https://shopify.dev/docs/storefronts/themes/architecture/templates/collection) that lists all products from the given product vendor."

## Example

**Input:**
```liquid
{{ "Polina's Potent Potions" | url_for_vendor }}
```

**Output:**
```html
/collections/vendors?q=Polina%27s%20Potent%20Potions
```

The vendor name is URL-encoded in the query parameter, converting special characters (like apostrophes) to their encoded equivalents.
