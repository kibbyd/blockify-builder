# Liquid Object: Fulfillment

## Overview

The fulfillment object represents an order fulfillment in Shopify, containing information about line items being fulfilled and shipment tracking details.

## Properties

### created_at
- **Type:** string
- **Description:** A timestamp for when the fulfillment was created
- **Note:** Use the `date` filter to format the timestamp

### fulfillment_line_items
- **Type:** array of line_item
- **Description:** The line items included in the fulfillment

### item_count
- **Type:** number
- **Description:** The quantity of items in the fulfillment

### tracking_company
- **Type:** string
- **Description:** The name of the fulfillment service provider

### tracking_number
- **Type:** string
- **Description:** The fulfillment's tracking number
- **Note:** Returns `nil` if no tracking number exists

### tracking_numbers
- **Type:** array of strings
- **Description:** An array of all tracking numbers associated with the fulfillment

### tracking_url
- **Type:** string
- **Description:** The URL for tracking the fulfillment
- **Note:** Returns `nil` if no tracking number exists

## Example

```json
{
  "created_at": "2022-06-15 17:08:30 -0400",
  "fulfillment_line_items": [
    {
      "quantity": 2,
      "line_item": "LineItemDrop"
    },
    {
      "quantity": 1,
      "line_item": "LineItemDrop"
    }
  ],
  "item_count": 3,
  "tracking_company": "Canada Post",
  "tracking_number": "01189998819991197253",
  "tracking_numbers": ["01189998819991197253"],
  "tracking_url": "https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor=01189998819991197253"
}
```

## Access

Fulfillment objects are typically accessed through order line items within customer orders.