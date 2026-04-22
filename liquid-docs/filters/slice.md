# Liquid Filter: slice

## Overview
The `slice` filter "returns a substring or series of array items, starting at a given 0-based index."

## Syntax
```liquid
string | slice
```

## Return Type
Returns a string value.

## Parameters
- **index** (required): A 0-based starting position in the string or array
- **length** (optional): Number of characters or array items to extract (defaults to 1)

## Basic Usage

The filter can extract a single character or item by default:
```liquid
{{ collection.title | slice: 0 }}
```
Output: `P`

Specify a length parameter to retrieve multiple characters or items:
```liquid
{{ collection.title | slice: 0, 5 }}
```
Output: `Produ`

Works with arrays when chained with other filters:
```liquid
{{ collection.all_tags | slice: 1, 2 | join: ', ' }}
```
Output: `dried, extra-potent`

## Negative Indexing

The filter supports negative indices to count from the end:
```liquid
{{ collection.title | slice: -3, 3 }}
```
Output: `cts`

This extracts the final 3 characters from "Products".
