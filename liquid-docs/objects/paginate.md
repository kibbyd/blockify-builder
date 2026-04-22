# Liquid Paginate Object Documentation

## Overview

The `paginate` object provides information about pagination within a set of `paginate` tags in Liquid templates.

> "Use the `default_pagination` filter to output pagination links."

## Properties

### current_offset
**Type:** number

Represents the total number of items appearing on pages prior to the current one. For example, displaying 5 items per page on page 3 yields a value of 10. Limited to 24,999.

### current_page
**Type:** number

The numerical identifier for the currently active page. Limited to 25,000.

### items
**Type:** number

Total count of items being paginated across all pages. For instance, paginating 120 products results in a value of 120. Limited to 25,000.

### next
**Type:** part

The pagination component used for navigating to the following page.

### page_param
**Type:** string

The URL query parameter controlling pagination, defaulting to `page`. When paginating arrays from settings or metafield list types, a unique identifier is appended (e.g., `page_a9e329dc`).

### page_size
**Type:** number

Quantity of items displayed per page. Limited to 250.

### pages
**Type:** number

Total quantity of pages in the paginated collection. Limited to 25,000.

### parts
**Type:** array of part

Collection of pagination components used for constructing navigation interfaces.

### previous
**Type:** part

The pagination component enabling navigation to the preceding page.

## Example

```json
{
  "current_offset": 10,
  "current_page": 3,
  "items": 17,
  "next": {},
  "page_param": "page",
  "page_size": 5,
  "pages": 4,
  "parts": [],
  "previous": {}
}
```