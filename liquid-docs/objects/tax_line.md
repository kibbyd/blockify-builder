# tax_line Liquid Object Documentation

## Overview
The `tax_line` object provides information about tax applied to a checkout or order.

## Properties

### price
**Type:** number

The tax amount expressed in the currency's subunit. Output reflects the customer's local (presentment) currency. For currencies without subunits (JPY, KRW), tenths and hundredths are appended—for instance, "1000 Japanese yen is output as 100000." Apply money filters for formatted display.

### rate
**Type:** number

A decimal representation of the tax rate (e.g., 0.05 for 5%).

### rate_percentage
**Type:** number

The tax rate expressed as a percentage value in decimal form.

### title
**Type:** string

A label identifying the type of tax being applied.

## Example Structure

```json
{
  "price": 1901,
  "rate": 0.05,
  "rate_percentage": 5,
  "title": "GST"
}
```

This example illustrates a Goods and Services Tax line with a 5% rate on an amount of 1901 in the currency's smallest unit.