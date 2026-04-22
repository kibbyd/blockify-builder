# Liquid `shop` Object Documentation

## Overview

The `shop` object provides information about a store, including its address, product count, configuration settings, and various metadata.

**Description:** "Information about the store, such as the store address, the total number of products, and various settings."

## Key Properties

### Store Identification
- **name** (string): Store name
- **id** (string): Unique store identifier
- **domain** (string): Primary store domain
- **permanent_domain** (string): The `.myshopify.com` domain
- **url** (string): Full store URL
- **secure_url** (string): Full URL with `https` protocol

### Business Information
- **currency** (string): Store's currency code
- **email** (string): Sender email address
- **phone** (string): Store phone number
- **description** (string): Store description
- **address** (address object): Store physical address
- **brand** (brand object): Brand assets and settings

### Product & Collection Data
- **products_count** (number): Total product count
- **collections_count** (number): Total collection count
- **types** (array): All product types available
- **vendors** (array): All product vendors
- **enabled_payment_types** (array): Accepted payment methods

### Customer & Account Settings
- **customer_accounts_enabled** (boolean): Whether login link displays
- **customer_accounts_optional** (boolean): Whether checkout requires account creation
- **accepts_gift_cards** (boolean): Gift card acceptance status

### Policies & Localization
- **policies** (array): Store policies collection
- **privacy_policy**, **refund_policy**, **shipping_policy**, **subscription_policy**, **terms_of_service**: Individual policy objects
- **published_locales** (array): Active store languages
- **enabled_currencies** (array): Supported currencies

### Additional Data
- **password_message** (string): Password page message
- **metafields**: Custom store metadata
- **money_format**, **money_with_currency_format**: Currency display formats

## Usage Example

```liquid
<ul>
{%- for policy in shop.policies %}
  <li>{{ policy.title }}</li>
{%- endfor %}
</ul>
```

## Deprecated Properties

- `enabled_locales` → Use `published_locales`
- `locale` → Use `request.locale`
- `metaobjects` → Use global `metaobjects`
- `taxes_included` → Use `cart.taxes_included`
