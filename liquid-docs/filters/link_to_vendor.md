# link_to_vendor

## Description

"Generates an HTML `<a>` tag with an `href` attribute linking to a collection page that lists all products of a given product vendor."

## Syntax

```liquid
string | link_to_vendor
```

**Returns:** string

## Basic Usage

### Example

```liquid
{{ "Polina's Potent Potions" | link_to_vendor }}
```

### Output

```html
<a href="/collections/vendors?q=Polina%27s%20Potent%20Potions" title="Polina&#39;s Potent Potions">Polina's Potent Potions</a>
```

## HTML Attributes

You may add standard HTML attributes by specifying the attribute name and value as parameters.

### Syntax

```liquid
string | link_to_vendor: attribute: string
```

### Example

```liquid
{{ "Polina's Potent Potions" | link_to_vendor: class: 'link-class' }}
```

### Output

```html
<a class="link-class" href="/collections/vendors?q=Polina%27s%20Potent%20Potions" title="Polina&#39;s Potent Potions">Polina's Potent Potions</a>
```
