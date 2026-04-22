# Liquid Filter Object Documentation

## Overview
The `filter` object represents a [storefront filter](https://help.shopify.com/manual/online-store/themes/customizing-themes/storefront-filters) used in Shopify themes. For implementation guidance, see the [Support storefront filtering](https://shopify.dev/themes/navigation-search/filtering/storefront-filtering/support-storefront-filtering) resource.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `active_values` | array of `filter_value` | Currently active filter values; applies to `boolean` and `list` types only |
| `false_value` | `filter_value` | The false filter value for boolean type filters; returns `nil` if unavailable |
| `inactive_values` | array of `filter_value` | Currently inactive filter values; applies to `boolean` and `list` types only |
| `label` | string | Customer-facing filter label |
| `max_value` | `filter_value` | Highest filter value (price_range filters only) |
| `min_value` | `filter_value` | Lowest filter value (price_range filters only) |
| `operator` | string | Logical operator: `AND` or `OR`; applies to `boolean` and `list` types |
| `param_name` | string | URL parameter (e.g., `filter.v.option.color`) |
| `presentation` | string | Display format: `image`, `swatch`, or `text` (list filters only) |
| `range_max` | number | Highest product price in collection/search (price_range filters only) |
| `true_value` | `filter_value` | The true filter value for boolean type filters; returns `nil` if unavailable |
| `type` | string | Filter type: `boolean`, `list`, or `price_range` |
| `url_to_remove` | string | Page URL with filter parameter removed |
| `values` | array of `filter_value` | All filter values; applies to `boolean` and `list` types only |

## Returned By
- `collection.filters`
- `search.filters`