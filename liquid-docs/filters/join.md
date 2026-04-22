# Liquid Filter: join

## Overview

The `join` filter combines array elements into a single string. By default, items are separated by spaces.

## Basic Usage

**Syntax:** `array | join`

**Returns:** String

The filter "combines all of the items in an array into a single string, separated by a space."

### Example

Input array:
```
["extra-potent", "fresh", "healing", "ingredients"]
```

Output:
```
extra-potent fresh healing ingredients
```

## Custom Separator

**Syntax:** `array | join: string`

You can specify a custom delimiter between joined items instead of using the default space.

### Example with Comma Separator

Input array:
```
["extra-potent", "fresh", "healing", "ingredients"]
```

Liquid template:
```liquid
{{ collection.all_tags | join: ', ' }}
```

Output:
```
extra-potent, fresh, healing, ingredients
```
