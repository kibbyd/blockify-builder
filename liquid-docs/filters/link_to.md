# link_to Filter Documentation

## Overview
The `link_to` filter "generates an HTML `<a>` tag."

## Syntax
```liquid
string | link_to: string
```

**Return Type:** String

## Basic Usage

The filter converts text into a hyperlink by accepting a URL parameter:

```liquid
{{ 'Shopify' | link_to: 'https://www.shopify.com' }}
```

**Output:**
```html
<a href="https://www.shopify.com" title="" rel="nofollow">Shopify</a>
```

## HTML Attributes

You can add custom HTML attributes by including additional parameters matching attribute names with their desired values:

```liquid
{{ 'Shopify' | link_to: 'https://www.shopify.com', class: 'link-class' }}
```

**Output:**
```html
<a class="link-class" href="https://www.shopify.com" rel="nofollow">Shopify</a>
```

The filter supports any standard [HTML anchor attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) through this parameter syntax.
