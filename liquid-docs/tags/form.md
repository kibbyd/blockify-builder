# Liquid Form Tag Documentation

## Overview

The `form` tag generates HTML `<form>` elements with required hidden inputs for submitting data to Shopify endpoints. It supports 15 different form types, each configured for specific use cases.

## Basic Syntax

```liquid
{% form 'form_type' %}
  content
{% endform %}
```

## Available Form Types

| Form Type | Purpose |
|-----------|---------|
| `activate_customer_password` | Account activation forms |
| `cart` | Checkout submissions (requires `cart` object) |
| `contact` | Email submissions to merchants |
| `create_customer` | New account registration |
| `currency` | Currency selection (deprecated) |
| `customer` | Customer info without account creation |
| `customer_address` | Address creation/editing (requires address parameter) |
| `customer_login` | Account login |
| `guest_login` | Guest checkout option |
| `localization` | Country/language/currency selection |
| `new_comment` | Article comments (requires `article` object) |
| `product` | Add-to-cart functionality (requires `product` object) |
| `recover_customer_password` | Password recovery |
| `reset_customer_password` | Password reset |
| `storefront_password` | Password-protected storefront access |

## Form Parameters

### return_to

Specifies redirect destination after form submission:

```liquid
{% form 'customer_login', return_to: routes.root_url %}
```

Accepts: `back`, relative paths (e.g., `/collections/all`), or route attributes.

### HTML Attributes

Add custom attributes using standard HTML names:

```liquid
{% form 'product', product, id: 'custom-id', class: 'custom-class' %}
```

## Key Examples

**Product form:**
```liquid
{% form 'product', product %}
  <!-- form content -->
{% endform %}
```
Outputs: `<form>` with `action="/cart/add"` and product ID input.

**Contact form:**
```liquid
{% form 'contact' %}
  <!-- form content -->
{% endform %}
```
Outputs: `<form>` with `action="/contact#contact_form"`.

**Customer address form:**
```liquid
{% form 'customer_address', customer.new_address %}
  <!-- form content -->
{% endform %}
```

## Default Behaviors

- All forms use `method="post"` and `accept-charset="UTF-8"`
- Hidden inputs automatically include form type and UTF-8 encoding marker
- Each form type posts to a specific endpoint (e.g., `/cart`, `/account/login`)
- Some forms add additional attributes like `enctype="multipart/form-data"` or unique IDs
