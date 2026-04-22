# Liquid Objects: Policy

## Overview

A **policy** object represents a store policy (such as privacy, return, refund, or terms of service policy) in Shopify's Liquid template language.

## Description

"A store policy, such as a privacy or return policy."

## Properties

The policy object contains four main properties for accessing policy information:

### body
- **Type:** string
- **Description:** "The content of the policy."
- Contains the HTML-formatted text of the policy document

### id
- **Type:** string
- **Description:** "The ID of the policy."
- A unique identifier for the policy record

### title
- **Type:** string
- **Description:** "The title of the policy."
- The display name of the policy (e.g., "Refund policy")

### url
- **Type:** string
- **Description:** "The relative URL of the policy."
- The path to access the policy page (e.g., "/policies/refund-policy")

## Example

```json
{
  "body": "<p>We have a 30-day return policy, which means you have 30 days after receiving your item to request a return. ...</p>",
  "id": 23805034561,
  "title": "Refund policy",
  "url": "/policies/refund-policy"
}
```

## Access

Policy objects are typically accessed through the `shop.policies` array, which contains all store policies.