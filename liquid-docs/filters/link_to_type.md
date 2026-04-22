# link_to_type Filter Documentation

## Overview
The `link_to_type` filter "generates an HTML `<a>` tag with an `href` attribute linking to a collection page that lists all products of the given product type."

## Syntax
```liquid
string | link_to_type
```

**Return Type:** string

## Basic Usage

### Example
Input:
```liquid
{{ 'Health' | link_to_type }}
```

Output:
```html
<a href="/collections/types?q=Health" title="Health">Health</a>
```

## Parameters

### HTML Attributes
You can add HTML attributes by specifying the attribute name and desired value as parameters.

**Syntax:**
```liquid
string | link_to_type: attribute: string
```

### Example with Attributes
Input:
```liquid
{{ 'Health' | link_to_type: class: 'link-class' }}
```

Output:
```html
<a class="link-class" href="/collections/types?q=Health" title="Health">Health</a>
```

## Details
- The filter accepts any valid HTML attributes for the `<a>` element
- The generated link directs to `/collections/types` with a query parameter matching the product type
- The link text and title attribute both reflect the input product type
