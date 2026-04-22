# Comment Object - Liquid Documentation

## Overview
The `comment` object represents an article comment in Shopify's Liquid templating language.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `author` | string | "The full name of the author of the comment." |
| `content` | string | "The content of the comment." |
| `created_at` | string | "A timestamp for when the comment was created." Use the `date` filter for formatting. |
| `email` | string | "The email of he author of the comment." |
| `id` | number | "The ID of the comment." |
| `status` | string | "The status of the comment. Always returns `published`." |
| `updated_at` | string | "A timestamp for when the status of the comment was last updated." Use the `date` filter for formatting. |
| `url` | string | Relative URL pointing to the associated article with the comment ID appended. |

## Important Notes

- Only comments with `published` status appear in the `article.comments` array within Liquid contexts
- Outside Liquid, comment status varies based on spam detection and moderation settings
- For timestamp formatting, use the `date` filter
- For comprehensive information about managing blog comments, consult the Shopify Help Center

## Example

```json
{
  "author": "Cornelius",
  "content": "Wow, this is going to save me a fortune in invisibility potion!",
  "created_at": "2022-06-05 19:33:57 -0400",
  "email": "cornelius.potionmaker@gmail.com",
  "id": 129089273921,
  "status": "published",
  "updated_at": "2022-06-05 19:33:57 -0400",
  "url": "/blogs/potion-notions/how-to-tell-if-you-have-run-out-of-invisibility-potion#129089273921"
}
```
