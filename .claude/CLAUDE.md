# CLAUDE.md — Blockify
---

## What This System Does

A drag-and-drop builder that exports owned Shopify Liquid code. Elements on a canvas are exported as Liquid HTML, CSS with Liquid variables, and Shopify schema JSON.

The export pipeline is the most critical part of this system. It has invariants that must never be violated.

---

## The 4 Routes — Every Property Follows Exactly One

**Route 1 — User Opt-In:** Property exists in panel, no default, no toggle. Inert until user acts.

**Route 2 — Default + Editable:** In panel, toggled on by default, has a value, always in schema. Requires ALL 3:
1. `getDefaultStyle()` or `getDefaultProps()` in BlockBuilder.jsx
2. `getDefaultSchemaToggles()` set to `true` in BlockBuilder.jsx
3. `canBeSchemaEditable: true` in elementDefinitions.js

Missing any one = silent failure. Property won't appear in Shopify.

**Route 3 — Structural:** Not in panel. Not editable. Hardcoded in ALL three places:
1. Hardcoded in `cssGeneration.js` (export CSS)
2. Hardcoded in `ElementRenderer.jsx` (canvas display)
3. Removed from `elementDefinitions.js` (not in panel, not editable)

"Hardcode" means all three. Missing any one = visible in panel but not editable, or invisible on canvas, or wrong in export. Things like display:flex, box-sizing, cursor:pointer, border-style:solid on dividers.

**Template Route — Adds filtering on top of Routes 1-3:**
Every property is in exactly one of two places:
- **Filter map** (elementDefinitions.js → templatePropertyMaps) = editable, Liquid var
- **templateCSS** (templateCSS.js) = hardcoded

Nothing in neither. Nothing in both. Ever.

---

## Export Pipeline Invariants — NEVER Violate These

1. Every exported value must have schema editable checked
2. Nothing exports without that flag
3. Zero values ("0", "0px", "") are valid — never strip them
4. No property can be both in the filter map and hardcoded in templateCSS
5. xl and sm go through schema as Liquid vars — do NOT hardcode them in templateCSS

If you are about to produce output that violates any of these — STOP. Report it. Wait.

---

## Responsive Viewports

| Viewport | Handling | Schema breakpoint |
|----------|----------|-------------------|
| xs | Hardcoded CSS, only if user set value | — |
| sm | Liquid var | mobile |
| md | Hardcoded CSS, only if user set value | — |
| lg | Base CSS (no media query) | desktop |
| xl | Liquid var | fullscreen |

xs and md are builder-only. The pipeline reads them from `element.responsiveStyles` automatically. Do NOT hardcode xs/md/sm responsive values in templateCSS. Do not flag this as a problem. It works.

---

## Schema Limit

Shopify enforces a 250 schema property limit. Templates use conditional filtering to stay under it. Every template has a filter map that locks structural properties and exposes only what the template needs. Do not add schema properties without checking the count.

---

## Standard Editable Sets (All Templates)

**Container:** backgroundColor, paddingTop, paddingBottom

**Heading:** text, fontSize, fontWeight, fontFamily, color, textAlign, paddingTop, paddingBottom, marginTop, marginBottom

**Text:** text, fontSize, fontWeight, fontFamily, color, textAlign, paddingTop, paddingBottom, marginTop, marginBottom

**Button:** text, fontSize, fontWeight, fontFamily, color, hoverColor, backgroundColor, hoverBackgroundColor, borderColor, hoverBorderColor, hoverAnimation, marginTop, marginBottom, marginRight, marginLeft
- borderColor and hoverBorderColor default to #d3d3d3
- borderWidth and borderStyle are structural (hardcoded)
- No rgba — hex only

Exceptions to standard sets are decided by Commander only.

---

## Before Any Template Work

1. Read `scripts/template_styles_output.json` or `.txt` for the relevant template
2. Verify the 4 stages are in sync: template JSON, filter map, templateCSS, schema toggles
3. Do not rely on memory. Read the data.

---

## Key Files

| File | Role |
|------|------|
| `app/_config/elementDefinitions.js` | Property definitions, templatePropertyMaps |
| `app/_components/BlockBuilder.jsx` | getDefaultStyle, getDefaultProps, getDefaultSchemaToggles |
| `app/_utils/cssGeneration.js` | CSS export — Liquid vars + calls templateCSS |
| `app/_utils/schemaGeneration.js` | Shopify schema JSON export |
| `app/_utils/templateCSS.js` | Hardcoded template CSS generators |
| `app/_utils/jsonToLiquid.js` | Orchestrator — combines all 3 generators |
| `scripts/template_styles_output.json` | Source of truth for all 30 templates |

---

## Testing

Every interactive or targetable element must have a `data-id` attribute.
Format: `data-id="[component]--[element]--[purpose]"`
Never remove existing `data-id` attributes.
