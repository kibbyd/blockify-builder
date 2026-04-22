# Liquid Form Object Documentation

## Overview

The `form` object contains information about forms created using Liquid's `form` tag. Properties vary depending on the form type.

## Core Properties

**id** (string)
- The unique identifier for the form.

**errors** (form_errors)
- Contains validation errors, if any. Returns `nil` when no errors exist. The `default_errors` filter can simplify error message output.

**posted_successfully?** (boolean)
- Indicates whether form submission succeeded (`true`) or encountered errors (`false`). Note: The `customer_address` form always returns `true`.

## Address-Specific Properties

These properties are exclusive to the `customer_address` form type:

- **address1, address2** — Street address lines
- **city** — City name
- **province** — Province/state
- **country** — Country name
- **zip** — Postal code
- **phone** — Contact number
- **company** — Business name
- **first_name, last_name** — Person's name
- **set_as_default_checkbox** — HTML checkbox for marking as default address

## Customer & Contact Properties

- **email** — Available in contact, create_customer, customer, customer_login, new_comment, recover_customer_password, and product forms
- **first_name, last_name** — Available in create_customer and customer_address forms
- **password_needed** (boolean) — Exclusive to customer_login form; returns `true`

## Content Properties

- **author** — Article comment author name
- **body** — Contact submission or comment content
- **message** — Gift card recipient message
- **name** — Gift card recipient nickname

## Example Output

```json
{
  "id": "new",
  "first_name": "Cornelius",
  "last_name": "Potionmaker",
  "address1": "12 Phoenix Feather Alley",
  "city": "Calgary",
  "province": "Alberta",
  "country": "Canada",
  "zip": "T1X 0L4",
  "phone": "44 131 496 0905",
  "posted_successfully?": true,
  "errors": null
}
```