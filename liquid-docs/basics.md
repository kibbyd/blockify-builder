# Liquid Basics Documentation

## Overview

Liquid is a template language used in Shopify development. This page covers fundamental concepts needed to work with Liquid tags, filters, and objects.

## Object Handles

### Definition

Objects representing store resources (products, collections, articles, blogs) have handles for identification. "Handles are used to build the URL for the resource, or to return properties for the resource."

### Handle Creation Rules

Handles are automatically generated from resource titles following these conventions:

- Always lowercase
- Whitespace and special characters replaced with hyphens
- Multiple consecutive special characters reduced to single hyphen
- Leading whitespace/special characters removed
- Duplicates auto-increment (e.g., `potion` and `potion-1`)

### Important Note

After resource creation, changing the title doesn't update the handle. You can modify handles in the Shopify admin's Handle or Edit website SEO sections.

### Referencing Handles

Two notations access objects by handle:

**Square bracket notation**: `pages['about-us'].url`
- Accepts quoted handles, variables, or object references

**Dot notation**: `settings.predictive_search_enabled`
- Accepts unquoted handles

## Logical and Comparison Operators

| Operator | Function |
|----------|----------|
| `==` | equals |
| `!=` | does not equal |
| `>` | greater than |
| `<` | less than |
| `>=` | greater than or equal to |
| `<=` | less than or equal to |
| `or` | Condition A or Condition B |
| `and` | Condition A and Condition B |
| `contains` | String/array presence check |

### The `contains` Operator

Use `contains` to check for strings within arrays or other strings. "You can't use `contains` to check for an object in an array of objects."

### Order of Operations

Operators evaluate right-to-left with no ability to change precedence. Parentheses are invalid in Liquid tags.

## Data Types

Liquid supports six data types:

**String**: Series of characters in single or double quotes

**Number**: Numeric values including floats and integers

**Boolean**: Binary values—`true` or `false`

**Nil**: Undefined value that returns nothing and evaluates as falsy

**Array**: List of variables of any type, accessed via loops or index notation (zero-based)

**Empty**: Returned when accessing defined objects with no value; used to verify object existence

Use the `empty` comparison to check object validity before accessing attributes.
