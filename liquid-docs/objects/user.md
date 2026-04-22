# Liquid Object: user

## Overview
The `user` object represents the author of a blog article in Shopify's Liquid templating language.

## Description
"The author of a blog article." User information can be modified through the Account settings page in the Shopify admin dashboard.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `account_owner` | boolean | Indicates whether the author is the store's account owner |
| `bio` | string | Author biography (returns `nil` if not specified) |
| `email` | string | Author's email address |
| `first_name` | string | Author's first name |
| `homepage` | string | URL to author's personal website (returns `nil` if not specified) |
| `image` | image | Author's profile image (returns `nil` if not specified) |
| `last_name` | string | Author's last name |
| `name` | string | Author's full name (first and last) |

## Example Output

```json
{
  "account_owner": false,
  "bio": "Polina got her first cauldron at the tender age of six, and she has been passionate about potions ever since!!",
  "email": "polinas.potent.potions@gmail.com",
  "first_name": "Polina",
  "homepage": null,
  "image": {},
  "last_name": "Waters",
  "name": "Polina Waters"
}
```