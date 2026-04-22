# Liquid Search Object Documentation

## Overview
The `search` object provides information about storefront search queries, enabling theme developers to display and manage search results effectively.

## Properties

### default_sort_by
**Type:** string

"The default sort order of the search results, which is `relevance`."

### filters
**Type:** array of filter objects

The active filters applied to search results. Only relevant filters display, and the array remains empty when results exceed 1000 products.

### performed
**Type:** boolean

Indicates whether a search executed successfully (`true`) or failed (`false`).

### results
**Type:** array

Contains search result items that can be articles, pages, or products. Each result includes an `object_type` property identifying its category.

**Note:** "Use the paginate tag to choose how many results to show per page, up to a limit of 50."

### results_count
**Type:** number

The total quantity of results returned.

### sort_by
**Type:** string

Reflects the current sorting applied via the `sort_by` URL parameter, or `nil` if absent.

### sort_options
**Type:** array of sort_option objects

Available sorting choices for the current search.

### terms
**Type:** string

The search query entered by the user. "Use the highlight filter to highlight the search terms in search result content."

### types
**Type:** array of strings

Object types included in the search (`article`, `page`, `product`), determined by the `type` query parameter.

## Example JSON Structure

```json
{
  "default_sort_by": "relevance",
  "filters": {},
  "performed": true,
  "results": [],
  "results_count": 16,
  "sort_by": "relevance",
  "sort_options": [],
  "terms": "potion",
  "types": ["article", "page", "product"]
}
```