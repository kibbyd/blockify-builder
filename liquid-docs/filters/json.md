# JSON Filter Documentation

## Overview
The `json` filter transforms a string or object into JSON format within Liquid templates.

## Syntax
```liquid
variable | json
```

## Return Value
Returns a [string](https://shopify.dev/docs/api/liquid/basics#string)

## Description
This filter converts variables into properly formatted JSON, automatically handling quote escaping and formatting requirements for use in code.

## Key Considerations

### JavaScript Usage
"When using the JSON output in JavaScript, you don't need to wrap it in quotes because the `json` filter includes them." The filter also automatically escapes any internal quotation marks.

### Product Object Limitations
When applied to product objects on stores created after December 5, 2017, the filter excludes `inventory_quantity` and `inventory_policy` properties from variant data. This security measure prevents unauthorized access to inventory information via bots and crawlers.

For inventory data access, query individual variants directly instead.

## Example

**Input:**
```liquid
{{ product | json }}
```

**Output:**
A complete JSON representation of the product object, including properties like id, title, handle, variants array, pricing, images, and media information (without inventory quantities).
