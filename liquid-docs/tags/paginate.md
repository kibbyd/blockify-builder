# Liquid Tag: Paginate

## Overview

The `paginate` tag divides array items across multiple pages. Since `for` loops are restricted to 50 iterations per page, this tag enables iteration over arrays exceeding that limit.

## Paginable Arrays

- `article.comments`
- `blog.articles`
- `collections`
- `collection.products`
- `customer.addresses`
- `customer.orders`
- `pages`
- `product.variants`
- `search.results`
- `collection_list` settings
- `product_list` settings

## Syntax

```liquid
{% paginate array by page_size %}
  {% for item in array %}
    forloop_content
  {% endfor %}
{% endpaginate %}
```

## Parameters

**array**: The collection to iterate over.

**page_size**: Items displayed per page (range: 1–250).

**window_size**: Number of pages visible in pagination navigation.

## Key Constraints

- Maximum pagination reaches the 25,000th item; arrays requiring deeper access should be filtered beforehand.

## Associated Objects & Filters

- [`paginate` object](https://shopify.dev/docs/api/liquid/objects/paginate): Provides pagination metadata
- [`default_pagination` filter](https://shopify.dev/docs/api/liquid/filters/default_pagination): Generates navigation markup

## Example

```liquid
{% paginate collection.products by 5 %}
  {% for product in collection.products -%}
    {{ product.title }}
  {%- endfor %}
  {{- paginate | default_pagination }}
{% endpaginate %}
```

## Performance Optimization

Combining `paginate` with matching `limit` parameters reduces data fetching and improves response times.
