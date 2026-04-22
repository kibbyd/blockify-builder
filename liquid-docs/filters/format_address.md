# format_address Filter Documentation

## Overview
The `format_address` filter is a Liquid filter that generates an HTML address display with address components ordered according to the address's locale.

## Syntax
```liquid
{{ address | format_address }}
```

## Return Type
String

## Description
"Generates an HTML address display, with each address component ordered according to the address's locale."

## Usage Examples

### Example 1: Shop Address
**Code:**
```liquid
{{ shop.address | format_address }}
```

**Output:**
```html
<p>Polina's Potions, LLC<br>150 Elgin Street<br>8th floor<br>Ottawa ON K2P 1L4<br>Canada</p>
```

### Example 2: Customer Address
**Code:**
```liquid
{{ customer.default_address | format_address }}
```

**Output:**
```html
<p>Cornelius Potionmaker<br>12 Phoenix Feather Alley<br>1<br>Calgary AB T1X 0L4<br>Canada</p>
```

## Parameters
No parameters are required for this filter.

## Category
Localization

## Key Features
- Automatically orders address components based on locale
- Wraps output in paragraph tags with line breaks
- Works with shop addresses and customer addresses
- Returns properly formatted HTML
