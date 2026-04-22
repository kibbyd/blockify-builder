# time_tag Filter Documentation

## Overview
The `time_tag` filter converts timestamps into HTML `<time>` tags, supporting Ruby's strftime formatting methods.

## Syntax
```liquid
string | time_tag: string
```
**Returns:** string

## Basic Usage
```liquid
{{ article.created_at | time_tag: '%B %d, %Y' }}
```

Converts `2022-04-14 16:56:02 -0400` to:
```html
<time datetime="2022-04-14T20:56:02Z">April 14, 2022</time>
```

## Parameters

### Display Format
Accepts strftime shorthand (e.g., `%B %d, %Y`). Reference [Ruby's strftime documentation](https://ruby-doc.org/core-3.1.1/Time.html#method-i-strftime) for available options.

### format (Named Parameter)
Specify locale-aware date formatting with predefined values:
- `abbreviated_date`
- `basic`
- `date`
- `date_at_time`
- `default`
- `on_date`
- `short` (deprecated)
- `long` (deprecated)

**Example:**
```liquid
{{ article.created_at | time_tag: format: 'abbreviated_date' }}
```
Output: `<time datetime="2022-04-14T20:56:02Z">Apr 14, 2022</time>`

### datetime (Named Parameter)
Customize the `datetime` attribute format using strftime syntax (defaults to ISO 8601 format).

```liquid
{{ article.created_at | time_tag: '%B %d, %Y', datetime: '%Y-%m-%d' }}
```
Output: `<time datetime="2022-04-14">April 14, 2022</time>`

## Custom Formats
Define reusable formats in theme locale files under `date_formats`:
```json
"date_formats": {
  "month_day_year": "%B %d, %Y"
}
```
