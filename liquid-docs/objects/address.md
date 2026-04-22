# Liquid Address Object

## Overview

The address object represents a physical address, commonly used for customer profiles or order shipments in Shopify's Liquid template language.

**Pro tip:** "Use the `format_address` filter to output an address according to its locale."

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `address1` | string | First line of the address |
| `address2` | string | Second line (returns `nil` if unspecified) |
| `city` | string | City name |
| `company` | string | Company name (returns `nil` if unspecified) |
| `country` | country object | Full country object |
| `country_code` | string | ISO 3166-1 (alpha 2) format country code |
| `first_name` | string | Given name |
| `id` | number | Unique address identifier |
| `last_name` | string | Family name |
| `name` | string | Combined first and last name |
| `phone` | string | Contact number (returns `nil` if unspecified) |
| `province` | string | State or province name |
| `province_code` | string | ISO 3166-2 format code (excludes country prefix) |
| `street` | string | Combined first and second address lines |
| `summary` | string | Full address summary with name, lines, city, province, and country |
| `url` | string | Relative URL path (customer addresses only) |
| `zip` | string | Postal or zip code |

## Example Data Structure

```json
{
  "address1": "150 Elgin Street",
  "address2": "8th floor",
  "city": "Ottawa",
  "company": "Polina's Potions, LLC",
  "country_code": "CA",
  "id": 56174706753,
  "phone": "416-123-1234",
  "province": "Ontario",
  "province_code": "ON",
  "street": "150 Elgin Street, 8th floor",
  "summary": "150 Elgin Street, 8th floor, Ottawa, Ontario, Canada",
  "zip": "K2P 1L4"
}
```
