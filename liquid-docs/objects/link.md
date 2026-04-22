# Liquid Objects: link

## Overview

A link represents an entry within a [menu structure](https://help.shopify.com/manual/online-store/menus-and-links/drop-down-menus). Links can point to various resources and support nested hierarchies.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| **active** | boolean | Indicates if the link matches the current URL path or is an ancestor of it |
| **child_active** | boolean | Indicates if any descendant link matches the current URL path |
| **child_current** | boolean | Indicates if a direct child link exactly matches the current URL path (URL parameters ignored) |
| **current** | boolean | Indicates if the link exactly matches the current URL path (URL parameters ignored) |
| **handle** | string | The unique identifier for the link |
| **levels** | number | Count of nested menu depths beneath this link |
| **links** | array | Collection of subordinate link objects |
| **object** | object | Associated resource (article, blog, collection, metaobject, page, policy, or product) |
| **title** | string | Display name for the navigation element |
| **type** | string | Categorizes the link destination |
| **url** | string | Navigation path or address |

## Link Types

Possible `type` values include: `article_link`, `blog_link`, `catalog_link`, `collection_link`, `collections_link`, `customer_account_page_link`, `frontpage_link`, `http_link`, `metaobject_link`, `page_link`, `policy_link`, `product_link`, `search_link`.

## Example Usage

```liquid
{% for link in linklists.main-menu.links -%}
  {% if link.links.size > 0 -%}
    - {{ link.title }} ({{ link.links.size }} children)<br>
  {%- else -%}
    - {{ link.title }}<br>
  {%- endif %}
{%- endfor %}
```

**Output:**
```html
- Home<br>
- Catalog (2 children)<br>
- Contact<br>
```