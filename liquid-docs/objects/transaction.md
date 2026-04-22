# Transaction Object Documentation

## Overview

The `transaction` object represents a payment transaction linked to a checkout or order within Shopify's Liquid API.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `amount` | number | "The amount of the transaction in the currency's subunit." Displayed in the customer's local currency. For currencies without subunits (JPY, KRW), tenths and hundredths are appended. |
| `buyer_pending_payment_instructions` | array | Collection of pending payment instruction header-value pairs with payment method-specific details for offline completion. Returns empty array if unsupported. |
| `buyer_pending_payment_notice` | string | Instructions for customers on completing payment, customized per payment method. |
| `created_at` | string | Timestamp indicating when the transaction was created. Use the `date` filter for formatting. |
| `gateway` | string | Handleized name of the payment provider used. |
| `gateway_display_name` | string | Display name of the payment provider. |
| `id` | number | Unique transaction identifier. |
| `kind` | string | Transaction type: authorization, capture, sale, void, or refund. |
| `name` | string | Transaction name/reference. |
| `payment_details` | object | Detailed payment information via `transaction_payment_details` object. |
| `receipt` | string | Payment provider receipt data, including test status and authorization codes. |
| `show_buyer_pending_payment_instructions?` | boolean | Indicates if transaction is pending and requires additional customer info. |
| `status` | string | Transaction status: success, pending, failure, or error. |
| `status_label` | string | Localized status translation. |

## Transaction Kind Values

| Value | Meaning |
|-------|---------|
| authorization | "The reserving of money that the customer has agreed to pay." |
| capture | "The transfer of the money that was reserved during the `authorization` step." |
| sale | "A combination of `authorization` and `capture` in one step." |
| void | "The cancellation of a pending `authorization` or `capture`." |
| refund | "The partial, or full, refund of captured funds." |

## Example

```json
{
  "amount": "380.25",
  "created_at": "2022-06-15 19:13:14 -0400",
  "gateway": "shopify_payments",
  "gateway_display_name": "Shopify payments",
  "id": 5432242176065,
  "kind": "sale",
  "name": "c29944051400769.",
  "status": "success",
  "status_label": "Success"
}
```