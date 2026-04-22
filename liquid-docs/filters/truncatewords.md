# truncatewords Filter Documentation

## Overview
The `truncatewords` filter shortens a string to a specified word count, appending an ellipsis by default.

## Syntax
```liquid
string | truncatewords: number
string | truncatewords: number, string
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
This filter reduces text to a given number of words. When the input exceeds the word limit, "an ellipsis (`...`) is appended to the truncated string."

**Important caveat:** HTML tags count as words, so developers should use `strip_html` before applying this filter to prevent broken markup.

## Parameters

| Parameter | Type | Required | Details |
|-----------|------|----------|---------|
| number | integer | Yes | Word count limit |
| string | string | No | Custom ellipsis (defaults to `...`) |

## Examples

**Basic truncation:**
```liquid
{{ article.content | strip_html | truncatewords: 15 }}
```
Output: `We've all had this problem before: we peek into the potions vault to determine which...`

**Custom ellipsis:**
```liquid
{{ article.content | strip_html | truncatewords: 15, '--' }}
```
Output: `We've all had this problem before: we peek into the potions vault to determine which--`

**No ellipsis:**
```liquid
{{ article.content | strip_html | truncatewords: 15, '' }}
```
Output: `We've all had this problem before: we peek into the potions vault to determine which`
