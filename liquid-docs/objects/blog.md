# Liquid Blog Object Documentation

## Overview

The `blog` object provides information about a specific blog in a Shopify store.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `all_tags` | array of string | "All of the tags on the articles in the blog" including hidden articles |
| `articles` | array of article | Articles within the blog (use paginate tag for up to 50 per page) |
| `articles_count` | number | Total number of articles (excludes hidden articles) |
| `comments_enabled?` | boolean | Returns true if blog comments are active |
| `handle` | string | The blog's handle identifier |
| `id` | number | The blog's unique ID |
| `metafields` | array of metafield | Custom metadata fields applied to the blog |
| `moderated?` | boolean | Returns true if comment moderation is enabled |
| `next_article` | article | The next older article (nil if unavailable) |
| `previous_article` | article | The previous newer article (nil if unavailable) |
| `tags` | array of string | Tags from articles in the current filtered view only |
| `template_suffix` | string | Custom template name (excludes prefix/extension; nil if none) |
| `title` | string | The blog's display title |
| `url` | string | Relative URL path of the blog |

## Example Output

```json
{
  "all_tags": [],
  "articles": [],
  "articles_count": 3,
  "comments_enabled?": true,
  "handle": "potion-notions",
  "id": 78580613185,
  "metafields": {},
  "moderated?": true,
  "next_article": {},
  "previous_article": {},
  "tags": [],
  "template_suffix": "",
  "title": "Potion Notions",
  "url": "/blogs/potion-notions"
}
```

## Usage Templates

Available on:
- Blog template
- Article template
