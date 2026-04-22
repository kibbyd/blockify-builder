# Liquid Filter: article_img_url

## Status
**Deprecated** — This filter has been replaced by [`image_url`](/docs/api/liquid/filters/image_url).

## Overview
"Returns the CDN URL for an article's image."

## Syntax
```liquid
{{ article.image | article_img_url }}
```

## Return Type
Returns a `string` value.

## Parameters

### size
- **Type:** string
- **Required:** No
- **Positional:** Yes
- **Description:** "The desired image size."

By default, the filter returns the `small` version (100 x 100 px), but you can specify an alternative size.

## Examples

### Basic Usage
**Code:**
```liquid
{{ article.image | article_img_url }}
```

**Data:**
```json
{
  "article": {
    "image": "articles/beakers-for-science-with-water.jpg"
  }
}
```

**Output:**
```
//polinas-potent-potions.myshopify.com/cdn/shop/articles/beakers-for-science-with-water_small.jpg?v=1654385193
```

### With Size Parameter
**Code:**
```liquid
{{ article.image | article_img_url: 'large' }}
```

**Data:**
```json
{
  "article": {
    "image": "articles/beakers-for-science-with-water.jpg"
  }
}
```

**Output:**
```
//polinas-potent-potions.myshopify.com/cdn/shop/articles/beakers-for-science-with-water_large.jpg?v=1654385193
```

## Migration Note
For new implementations, use the `image_url` filter instead, which provides more flexibility and is actively maintained.
