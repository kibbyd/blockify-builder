# Liquid Objects: Recommendations

## Overview

The `recommendations` object delivers product suggestions for a specific item based on sales patterns, product details, and collection associations. Accuracy improves as additional order and product information accumulates.

## Key Constraint

This object only functions when rendered within a section via the Product Recommendations API and Section Rendering API. See the official documentation for implementation guidance.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `intent` | string | "The recommendation intent." Returns `nil` if `performed?` is `false`. |
| `performed?` | boolean | Indicates whether the object is referenced in a section rendered using both required APIs. |
| `products` | array (product objects) | "The recommended products." Returns an EmptyDrop when `performed?` is `false`. |
| `products_count` | number | The quantity of recommended products. Returns 0 if `performed?` is `false`. |

## Sample Response

```json
{
  "products": [],
  "products_count": 4,
  "performed?": true
}
```

## Additional Resources

For deeper understanding of recommendation generation mechanics and theme integration instructions, consult the linked guides on product merchandising and recommendations display.