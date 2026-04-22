# Liquid Collection Object Documentation

## Overview
The `collection` object represents a store collection in Shopify's Liquid template language.

## Key Properties

### Product Counts
- **all_products_count** (number): Total products in collection, including filtered items
- **products_count** (number): Products in current filtered view
- **products** (array): All products accessible in collection

### Tags & Classification
- **all_tags** (array): All tags from collection products (max 1,000); includes filtered-out items
- **all_types** (array): All product types in collection
- **all_vendors** (array): All product vendors in collection
- **tags** (array): Currently applied tags only

### Filtering & Navigation
- **current_type** (string): Active product type on type collection pages
- **current_vendor** (string): Active vendor on vendor collection pages
- **filters** (array): Storefront filters for collection (empty if >5,000 products)

### Sorting
- **default_sort_by** (string): Default sort set in Shopify admin
- **sort_by** (string): URL parameter sort value (nil if none)
- **sort_options** (array): Available sorting choices

### Collection Metadata
- **id** (number): Collection identifier
- **handle** (string): Collection URL handle
- **title** (string): Collection name
- **description** (string): Collection description
- **url** (string): Relative collection URL
- **published_at** (string): Publication timestamp

### Media & Template
- **image** (image): Collection image from admin
- **featured_image** (image): Primary image (falls back to first product's image)
- **template_suffix** (string): Custom template name (without prefix/extension)

### Navigation
- **next_product** (product): Following product in collection (nil if none)
- **previous_product** (product): Previous product in collection (nil if none)

### Additional
- **metafields** (array): Applied metafield data

## Common Use Cases

**Creating product type links:**
```liquid
{% for type in collection.all_types %}
  {{ type | link_to_type }}
{% endfor %}
```

**Creating vendor links:**
```liquid
{% for vendor in collection.all_vendors %}
  {{ vendor | link_to_vendor }}
{% endfor %}
```

**Building sort dropdown:**
```liquid
{% assign sort_by = collection.sort_by | default: collection.default_sort_by %}
<select>
  {% for option in collection.sort_options %}
    <option value="{{ option.value }}" {% if option.value == sort_by %}selected{% endif %}>
      {{ option.name }}
    </option>
  {% endfor %}
</select>
```

## Notes
- Query parameters are case-insensitive
- Maximum 1,000 tags returned
- Filters unavailable for collections exceeding 5,000 products
- Use `paginate` tag for product display (max 50 per page)
