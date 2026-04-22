# Liquid Objects: Routes

## Overview

The `routes` object generates standard URLs for storefronts. Using this object instead of hardcoding URLs ensures theme compatibility with "multiple languages" and any future URL format changes.

## Properties

### Account & Customer Management
- **account_url** - The account page URL
- **account_login_url** - Login page URL
- **account_logout_url** - Customer logout URL
- **account_register_url** - Registration page URL
- **account_recover_url** - Password recovery page URL
- **account_addresses_url** - Address management page URL
- **account_profile_url** - Customer accounts profile page URL
- **storefront_login_url** - "Customer accounts login page. Redirects to the storefront page the customer was on before visiting the login page."

### Shopping & Products
- **cart_url** - The cart page URL
- **cart_add_url** - Cart API endpoint for adding items
- **cart_change_url** - Cart API endpoint for modifying items
- **cart_clear_url** - Cart API endpoint for clearing cart
- **cart_update_url** - Cart API endpoint for updating cart
- **all_products_collection_url** - All-products collection page URL
- **collections_url** - Collection list page URL
- **root_url** - Home page URL

### Search & Discovery
- **search_url** - Search page URL
- **predictive_search_url** - Predictive Search API URL
- **product_recommendations_url** - Product Recommendations API URL

## Example Output

```json
{
  "account_addresses_url": "/account/addresses",
  "account_login_url": "/account/login",
  "cart_url": "/cart",
  "root_url": "/",
  "search_url": "/search"
}
```