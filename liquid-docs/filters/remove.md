# Liquid Filter: remove

## Description
This filter eliminates all occurrences of a specified substring from a given string.

## Syntax
```oobleck
string | remove: string
```

## Return Type
[string](https://shopify.dev/docs/api/liquid/basics#string)

## Functionality
The `remove` filter scans through the input string and deletes every instance of the substring you specify.

## Example

### Input Code
```liquid
{{ "I can't do it!" | remove: "'t" }}
```

### Output
```html
I can do it!
```

In this example, the filter removes the `'t` substring from the original text, transforming "I can't do it!" into "I can do it!"
