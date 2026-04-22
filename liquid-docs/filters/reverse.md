# Liquid Filter: reverse

## Overview

The `reverse` filter inverts the sequence of items within an array. The syntax is straightforward: `array | reverse`.

## Basic Usage

This filter reorders array elements in descending order. For example:

**Original:** Draught of Immortality, Glacier ice, Health potion, Invisibility potion

**Reversed:** Invisibility potion, Health potion, Glacier ice, Draught of Immortality

## Implementation Example

```liquid
{{ collection.products | reverse | map: 'title' | join: ', ' }}
```

## Working with Strings

The `reverse` filter doesn't directly process text strings. To reverse a string's character order, you can:

1. Use `split: ''` to break the string into individual characters as an array
2. Apply the `reverse` filter
3. Combine characters back with `join: ''`

Example:
```liquid
{{ collection.title | split: '' | reverse | join: '' }}
```

This transforms "Sale potions" into "snoitop elaS".

## Key Takeaway

This filter is designed for array manipulation. String reversal requires a three-step process combining `split`, `reverse`, and `join` filters to achieve the desired result.
