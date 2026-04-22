# payment_type_img_url Filter

## Overview
"Returns the URL for an SVG image of a given payment type" for use in Shopify Liquid templates.

## Syntax
```liquid
string | payment_type_img_url
```

## Return Value
Returns a `string` containing the full URL path to an SVG payment icon.

## Usage Example
The filter iterates through enabled payment methods to display their corresponding icons:

```liquid
{% for type in shop.enabled_payment_types %}
<img src="{{ type | payment_type_img_url }}" width="50" height="50" />
{% endfor %}
```

## Sample Data
Works with payment type values such as:
- visa
- master
- american_express
- paypal
- diners_club
- discover

## Output Format
Generates complete image tags with URLs pointing to Shopify's CDN-hosted payment icon assets. Each URL follows the pattern: `//[store].myshopify.com/cdn/shopifycloud/storefront/assets/payment_icons/[type]-[hash].svg`

## Use Case
Ideal for displaying accepted payment method logos on checkout pages or payment information sections of a storefront.
