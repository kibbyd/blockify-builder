# Liquid Filter: sort_natural

## Overview

The `sort_natural` filter arranges array items in case-insensitive alphabetical order.

## Syntax

```liquid
array | sort_natural
```

## Parameters

No parameters required for basic usage.

## Return Type

Returns an untyped array value.

## Description

"Sorts the items in an array in case-insensitive alphabetical order."

### Important Caveat

⚠️ **Caution:** This filter should not be used for numerical values. When comparing array items, each element converts to a string first, which can produce unexpected results with numbers.

## Basic Example

**Code:**
```liquid
{% assign tags = collection.all_tags | sort_natural %}

{% for tag in tags -%}
  {{ tag }}
{%- endfor %}
```

**Output:**
```
Burning
dried
extra-potent
extracts
fresh
healing
ingredients
music
plant
Salty
supplies
```

## Sort by Array Item Property

You can specify a property name to sort objects within an array:

```liquid
array | sort_natural: string
```

**Example:**
```liquid
{% assign products = collection.products | sort_natural: 'title' %}

{% for product in products -%}
  {{ product.title }}
{%- endfor %}
```

This produces alphabetically ordered product titles, treating uppercase and lowercase letters equivalently.
