# Liquid Objects: Article

## Overview

An article represents a blog post within a Shopify blog. The article object provides access to blog post data including content, metadata, comments, and author information.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `author` | string | "The full name of the author of the article" |
| `comment_post_url` | string | "The relative URL where POST requests are sent when creating new comments" |
| `comments` | array | Published comments for the article (empty if disabled) |
| `comments_count` | number | Total count of published comments |
| `comments_enabled?` | boolean | Whether commenting is active on the article |
| `content` | string | "The content of the article" |
| `created_at` | string | Creation timestamp (use date filter for formatting) |
| `excerpt` | string | "The excerpt of the article" |
| `excerpt_or_content` | string | Returns excerpt if available; otherwise returns content |
| `handle` | string | URL-friendly identifier for the article |
| `id` | string | Unique article identifier |
| `image` | image | Featured image object |
| `metafields` | object | Custom metafields applied to the article |
| `moderated?` | boolean | Whether the parent blog has comment moderation enabled |
| `published_at` | string | Publication timestamp |
| `tags` | array | Tag labels applied to the article |
| `template_suffix` | string | Custom template name (without prefix/extension) |
| `title` | string | "The title of the article" |
| `updated_at` | string | Last update timestamp |
| `url` | string | "The relative URL of the article" |
| `user` | user | User object associated with the author |

## Tag Example

Loop through tags with their usage counts:

```liquid
{% for tag in article.tags -%}
  {{ tag }} ({{ tag.total_count }})
{%- endfor %}
```

Output: `clear potions (1)potion troubleshooting (2)tips (2)`

## Related Documentation

- [Theme Architecture: Article Template](https://shopify.dev/themes/architecture/templates/article)
