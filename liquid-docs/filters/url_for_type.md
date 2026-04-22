# url_for_type

## Overview
The `url_for_type` filter "generates a URL for a collection page that lists all products of the given product type."

## Syntax
```liquid
string | url_for_type
```

## Return Type
String

## Usage Example

**Input:**
```liquid
{{ 'health' | url_for_type }}
```

**Output:**
```html
/collections/types?q=health
```

## Purpose
This filter creates collection URLs filtered by product type, enabling dynamic links to category pages without hardcoding collection URLs.
