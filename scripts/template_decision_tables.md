# Template Decision Tables

For each property: mark **E** (editable in Shopify) or **H** (hardcoded).
Content props (text, src, alt, url) listed separately.

---

## Announcement Bar (`announcement-bar`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| text | text | Free shipping on all orders over $50 | |
| button | text | Shop Now | |
| button | href |  | |
| button | url |  | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | alignItems | center | — | |
| container | backgroundColor | #1a1a1a | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | row | — | |
| container | gap | 12px | — | |
| container | height | 100% | — | |
| container | justifyContent | center | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 12px | — | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 12px | — | |
| container | width | 100% | — | |
| container > text | color | #e1e4e8 | — | |
| container > text | display | block | — | |
| container > text | fontSize | 13px | xs:11px | |
| container > text | fontWeight | 500 | — | |
| container > text | letterSpacing | 0.5px | — | |
| container > text | lineHeight | 1 | — | |
| container > text | marginBottom | 0 | — | |
| container > text | marginLeft | 0 | — | |
| container > text | marginRight | 0 | — | |
| container > text | marginTop | 0 | — | |
| container > text | paddingBottom | 0 | — | |
| container > text | paddingLeft | 0 | — | |
| container > text | paddingRight | 0 | — | |
| container > text | paddingTop | 0 | — | |
| container > text | textAlign | center | — | |
| container > button | backgroundColor | #667eea | — | |
| container > button | borderColor | rgba(255,255,255,0.3) | — | |
| container > button | borderRadius | 3px | — | |
| container > button | borderStyle | solid | — | |
| container > button | borderWidth | 1px | — | |
| container > button | color | #ffffff | — | |
| container > button | cursor | pointer | — | |
| container > button | display | inline-block | — | |
| container > button | fontSize | 11px | — | |
| container > button | fontWeight | 600 | — | |
| container > button | letterSpacing | 0.5px | — | |
| container > button | marginBottom | 0 | — | |
| container > button | marginLeft | 0 | — | |
| container > button | marginRight | 0 | — | |
| container > button | marginTop | 0 | — | |
| container > button | paddingBottom | 6px | — | |
| container > button | paddingLeft | 16px | — | |
| container > button | paddingRight | 16px | — | |
| container > button | paddingTop | 6px | — | |

---

## Before / After Showcase (`before-after`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| heading | text | See the Difference | |
| heading | level | h2 | |
| heading | tag | h2 | |
| columns-2 | columns | 2 | |
| image | src | /images/placeholder.jpg | |
| image | alt | Before | |
| image | settingId | image | |
| text | text | BEFORE | |
| text | text | Describe the problem, starting point, or... | |
| image | src | /images/placeholder.jpg | |
| image | alt | After | |
| image | settingId | image_2 | |
| text | text | AFTER | |
| text | text | Show the transformation, result, or impr... | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | alignItems | center | — | |
| container | backgroundColor | #ffffff | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 60px | xs:30px, sm:42px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 60px | xs:30px, sm:42px | |
| container | width | 100% | — | |
| container > heading | color | #1a1a1a | — | |
| container > heading | display | block | — | |
| container > heading | fontSize | 36px | xs:22px, sm:27px | |
| container > heading | fontWeight | bold | — | |
| container > heading | lineHeight | 1.2 | — | |
| container > heading | marginBottom | 10px | — | |
| container > heading | marginLeft | 0 | — | |
| container > heading | marginRight | 0 | — | |
| container > heading | marginTop | 0 | — | |
| container > heading | paddingBottom | 0 | — | |
| container > heading | paddingLeft | 0 | — | |
| container > heading | paddingRight | 0 | — | |
| container > heading | paddingTop | 0 | — | |
| container > heading | textAlign | center | — | |
| container > columns-2 | alignItems | stretch | — | |
| container > columns-2 | flexDirection | row | — | |
| container > columns-2 | gap | 24px | — | |
| container > columns-2 | justifyContent | flex-start | — | |
| ...> columns-2 > col-0 > image | display | block | — | |
| ...> columns-2 > col-0 > image | height | 280px | — | |
| ...> columns-2 > col-0 > image | marginBottom | 0 | — | |
| ...> columns-2 > col-0 > image | marginLeft | 0 | — | |
| ...> columns-2 > col-0 > image | marginRight | 0 | — | |
| ...> columns-2 > col-0 > image | marginTop | 0 | — | |
| ...> columns-2 > col-0 > image | objectFit | cover | — | |
| ...> columns-2 > col-0 > image | width | 100% | — | |
| ...lumns-2 > col-0 > container | alignItems | flex-start | — | |
| ...lumns-2 > col-0 > container | backgroundColor | #fafbfc | — | |
| ...lumns-2 > col-0 > container | borderStyle | none | — | |
| ...lumns-2 > col-0 > container | borderWidth | 0px | — | |
| ...lumns-2 > col-0 > container | boxSizing | border-box | — | |
| ...lumns-2 > col-0 > container | display | flex | — | |
| ...lumns-2 > col-0 > container | flex | 0 | — | |
| ...lumns-2 > col-0 > container | flexDirection | column | — | |
| ...lumns-2 > col-0 > container | height | auto | — | |
| ...lumns-2 > col-0 > container | marginBottom | 0 | — | |
| ...lumns-2 > col-0 > container | marginLeft | 0 | — | |
| ...lumns-2 > col-0 > container | marginRight | 0 | — | |
| ...lumns-2 > col-0 > container | marginTop | 0 | — | |
| ...lumns-2 > col-0 > container | maxWidth | 100% | — | |
| ...lumns-2 > col-0 > container | overflow | hidden | — | |
| ...lumns-2 > col-0 > container | paddingBottom | 20px | — | |
| ...lumns-2 > col-0 > container | paddingLeft | 20px | — | |
| ...lumns-2 > col-0 > container | paddingRight | 20px | — | |
| ...lumns-2 > col-0 > container | paddingTop | 20px | — | |
| ...lumns-2 > col-0 > container | width | 100% | — | |
| ... > col-0 > container > text | color | #6a737d | — | |
| ... > col-0 > container > text | display | block | — | |
| ... > col-0 > container > text | fontSize | 11px | — | |
| ... > col-0 > container > text | fontWeight | 700 | — | |
| ... > col-0 > container > text | letterSpacing | 2px | — | |
| ... > col-0 > container > text | lineHeight | 1 | — | |
| ... > col-0 > container > text | marginBottom | 0 | — | |
| ... > col-0 > container > text | marginLeft | 0 | — | |
| ... > col-0 > container > text | marginRight | 0 | — | |
| ... > col-0 > container > text | marginTop | 0 | — | |
| ... > col-0 > container > text | paddingBottom | 0 | — | |
| ... > col-0 > container > text | paddingLeft | 0 | — | |
| ... > col-0 > container > text | paddingRight | 0 | — | |
| ... > col-0 > container > text | paddingTop | 0 | — | |
| ... > col-0 > container > text | color | #586069 | — | |
| ... > col-0 > container > text | display | block | — | |
| ... > col-0 > container > text | fontSize | 14px | — | |
| ... > col-0 > container > text | lineHeight | 1.6 | — | |
| ... > col-0 > container > text | marginBottom | 0 | — | |
| ... > col-0 > container > text | marginLeft | 0 | — | |
| ... > col-0 > container > text | marginRight | 0 | — | |
| ... > col-0 > container > text | marginTop | 8px | — | |
| ... > col-0 > container > text | paddingBottom | 0 | — | |
| ... > col-0 > container > text | paddingLeft | 0 | — | |
| ... > col-0 > container > text | paddingRight | 0 | — | |
| ... > col-0 > container > text | paddingTop | 8px | — | |
| ...> columns-2 > col-1 > image | display | block | — | |
| ...> columns-2 > col-1 > image | height | 280px | — | |
| ...> columns-2 > col-1 > image | marginBottom | 0 | — | |
| ...> columns-2 > col-1 > image | marginLeft | 0 | — | |
| ...> columns-2 > col-1 > image | marginRight | 0 | — | |
| ...> columns-2 > col-1 > image | marginTop | 0 | — | |
| ...> columns-2 > col-1 > image | objectFit | cover | — | |
| ...> columns-2 > col-1 > image | width | 100% | — | |
| ...lumns-2 > col-1 > container | alignItems | flex-start | — | |
| ...lumns-2 > col-1 > container | backgroundColor | #f6f8fa | — | |
| ...lumns-2 > col-1 > container | borderStyle | none | — | |
| ...lumns-2 > col-1 > container | borderWidth | 0px | — | |
| ...lumns-2 > col-1 > container | boxSizing | border-box | — | |
| ...lumns-2 > col-1 > container | display | flex | — | |
| ...lumns-2 > col-1 > container | flex | 0 | — | |
| ...lumns-2 > col-1 > container | flexDirection | column | — | |
| ...lumns-2 > col-1 > container | height | auto | — | |
| ...lumns-2 > col-1 > container | marginBottom | 0 | — | |
| ...lumns-2 > col-1 > container | marginLeft | 0 | — | |
| ...lumns-2 > col-1 > container | marginRight | 0 | — | |
| ...lumns-2 > col-1 > container | marginTop | 0 | — | |
| ...lumns-2 > col-1 > container | maxWidth | 100% | — | |
| ...lumns-2 > col-1 > container | overflow | hidden | — | |
| ...lumns-2 > col-1 > container | paddingBottom | 20px | — | |
| ...lumns-2 > col-1 > container | paddingLeft | 20px | — | |
| ...lumns-2 > col-1 > container | paddingRight | 20px | — | |
| ...lumns-2 > col-1 > container | paddingTop | 20px | — | |
| ...lumns-2 > col-1 > container | width | 100% | — | |
| ... > col-1 > container > text | color | #667eea | — | |
| ... > col-1 > container > text | display | block | — | |
| ... > col-1 > container > text | fontSize | 11px | — | |
| ... > col-1 > container > text | fontWeight | 700 | — | |
| ... > col-1 > container > text | letterSpacing | 2px | — | |
| ... > col-1 > container > text | lineHeight | 1 | — | |
| ... > col-1 > container > text | marginBottom | 0 | — | |
| ... > col-1 > container > text | marginLeft | 0 | — | |
| ... > col-1 > container > text | marginRight | 0 | — | |
| ... > col-1 > container > text | marginTop | 0 | — | |
| ... > col-1 > container > text | paddingBottom | 0 | — | |
| ... > col-1 > container > text | paddingLeft | 0 | — | |
| ... > col-1 > container > text | paddingRight | 0 | — | |
| ... > col-1 > container > text | paddingTop | 0 | — | |
| ... > col-1 > container > text | color | #586069 | — | |
| ... > col-1 > container > text | display | block | — | |
| ... > col-1 > container > text | fontSize | 14px | — | |
| ... > col-1 > container > text | lineHeight | 1.6 | — | |
| ... > col-1 > container > text | marginBottom | 0 | — | |
| ... > col-1 > container > text | marginLeft | 0 | — | |
| ... > col-1 > container > text | marginRight | 0 | — | |
| ... > col-1 > container > text | marginTop | 8px | — | |
| ... > col-1 > container > text | paddingBottom | 0 | — | |
| ... > col-1 > container > text | paddingLeft | 0 | — | |
| ... > col-1 > container > text | paddingRight | 0 | — | |
| ... > col-1 > container > text | paddingTop | 8px | — | |

**Column Styles:**

| Element | Column | Property | Value | E/H |
|---------|--------|----------|-------|-----|
| columns-2 | 0 | borderRadius | 8px | |
| columns-2 | 0 | overflow | hidden | |
| columns-2 | 0 | borderWidth | 1px | |
| columns-2 | 0 | borderStyle | solid | |
| columns-2 | 0 | borderColor | #e0e0e0 | |
| columns-2 | 1 | borderRadius | 8px | |
| columns-2 | 1 | overflow | hidden | |
| columns-2 | 1 | borderWidth | 2px | |
| columns-2 | 1 | borderStyle | solid | |
| columns-2 | 1 | borderColor | #0066cc | |

---

## Bestsellers Row (`bestsellers-row`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| columns-2 | columns | 2 | |
| heading | text | Bestsellers | |
| heading | level | h2 | |
| heading | tag | h2 | |
| button | text | View All | |
| button | href |  | |
| button | url |  | |
| columns-4 | columns | 4 | |
| image | src | /images/placeholder.jpg | |
| image | alt | Product 1 | |
| image | settingId | image | |
| text | text | BEST SELLER | |
| heading | text | Product Name | |
| heading | level | h4 | |
| heading | tag | h4 | |
| text | text | $49.00 | |
| image | src | /images/placeholder.jpg | |
| image | alt | Product 2 | |
| image | settingId | image_2 | |
| text | text | NEW | |
| heading | text | Product Name | |
| heading | level | h4 | |
| heading | tag | h4 | |
| text | text | $59.00 | |
| image | src | /images/placeholder.jpg | |
| image | alt | Product 3 | |
| image | settingId | image_3 | |
| text | text | POPULAR | |
| heading | text | Product Name | |
| heading | level | h4 | |
| heading | tag | h4 | |
| text | text | $39.00 | |
| image | src | /images/placeholder.jpg | |
| image | alt | Product 4 | |
| image | settingId | image_4 | |
| text | text | SALE | |
| heading | text | Product Name | |
| heading | level | h4 | |
| heading | tag | h4 | |
| text | text | $29.00 | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | backgroundColor | #fafbfc | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 60px | xs:30px, sm:42px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 60px | xs:30px, sm:42px | |
| container | width | 100% | — | |
| container > columns-2 | alignItems | stretch | — | |
| container > columns-2 | flexDirection | row | — | |
| container > columns-2 | gap | 24px | — | |
| container > columns-2 | justifyContent | flex-start | — | |
| ...columns-2 > col-0 > heading | color | #1a1a1a | — | |
| ...columns-2 > col-0 > heading | display | block | — | |
| ...columns-2 > col-0 > heading | fontSize | 32px | xs:20px, sm:24px | |
| ...columns-2 > col-0 > heading | fontWeight | bold | — | |
| ...columns-2 > col-0 > heading | lineHeight | 1.2 | — | |
| ...columns-2 > col-0 > heading | marginBottom | 8px | — | |
| ...columns-2 > col-0 > heading | marginLeft | 0 | — | |
| ...columns-2 > col-0 > heading | marginRight | 0 | — | |
| ...columns-2 > col-0 > heading | marginTop | 0 | — | |
| ...columns-2 > col-0 > heading | paddingBottom | 8px | — | |
| ...columns-2 > col-0 > heading | paddingLeft | 0 | — | |
| ...columns-2 > col-0 > heading | paddingRight | 0 | — | |
| ...columns-2 > col-0 > heading | paddingTop | 0 | — | |
| ...columns-2 > col-0 > heading | textAlign | left | — | |
| ... columns-2 > col-1 > button | borderColor | #667eea | — | |
| ... columns-2 > col-1 > button | borderRadius | 4px | — | |
| ... columns-2 > col-1 > button | borderStyle | solid | — | |
| ... columns-2 > col-1 > button | borderWidth | 1px | — | |
| ... columns-2 > col-1 > button | color | #667eea | — | |
| ... columns-2 > col-1 > button | cursor | pointer | — | |
| ... columns-2 > col-1 > button | display | block | — | |
| ... columns-2 > col-1 > button | fontSize | 13px | — | |
| ... columns-2 > col-1 > button | fontWeight | 600 | — | |
| ... columns-2 > col-1 > button | marginBottom | 0 | — | |
| ... columns-2 > col-1 > button | marginLeft | auto | — | |
| ... columns-2 > col-1 > button | marginRight | 0 | — | |
| ... columns-2 > col-1 > button | marginTop | 0 | — | |
| ... columns-2 > col-1 > button | paddingBottom | 10px | — | |
| ... columns-2 > col-1 > button | paddingLeft | 24px | — | |
| ... columns-2 > col-1 > button | paddingRight | 24px | — | |
| ... columns-2 > col-1 > button | paddingTop | 10px | — | |
| container > columns-4 | alignItems | stretch | — | |
| container > columns-4 | flexDirection | row | — | |
| container > columns-4 | gap | 24px | — | |
| container > columns-4 | justifyContent | flex-start | — | |
| ...> columns-4 > col-0 > image | borderRadius | 6px | — | |
| ...> columns-4 > col-0 > image | display | block | — | |
| ...> columns-4 > col-0 > image | height | 220px | — | |
| ...> columns-4 > col-0 > image | marginBottom | 0 | — | |
| ...> columns-4 > col-0 > image | marginLeft | 0 | — | |
| ...> columns-4 > col-0 > image | marginRight | 0 | — | |
| ...> columns-4 > col-0 > image | marginTop | 0 | — | |
| ...> columns-4 > col-0 > image | objectFit | cover | — | |
| ...> columns-4 > col-0 > image | width | 100% | — | |
| ... > columns-4 > col-0 > text | color | #667eea | — | |
| ... > columns-4 > col-0 > text | display | block | — | |
| ... > columns-4 > col-0 > text | fontSize | 10px | — | |
| ... > columns-4 > col-0 > text | fontWeight | 700 | — | |
| ... > columns-4 > col-0 > text | letterSpacing | 1px | — | |
| ... > columns-4 > col-0 > text | lineHeight | 1 | — | |
| ... > columns-4 > col-0 > text | marginBottom | 0 | — | |
| ... > columns-4 > col-0 > text | marginLeft | 0 | — | |
| ... > columns-4 > col-0 > text | marginRight | 0 | — | |
| ... > columns-4 > col-0 > text | marginTop | 10px | — | |
| ... > columns-4 > col-0 > text | paddingBottom | 0 | — | |
| ... > columns-4 > col-0 > text | paddingLeft | 0 | — | |
| ... > columns-4 > col-0 > text | paddingRight | 0 | — | |
| ... > columns-4 > col-0 > text | paddingTop | 10px | — | |
| ... > columns-4 > col-0 > text | textAlign | center | — | |
| ...columns-4 > col-0 > heading | color | #1a1a1a | — | |
| ...columns-4 > col-0 > heading | display | block | — | |
| ...columns-4 > col-0 > heading | fontSize | 14px | — | |
| ...columns-4 > col-0 > heading | fontWeight | 600 | — | |
| ...columns-4 > col-0 > heading | lineHeight | 1.2 | — | |
| ...columns-4 > col-0 > heading | marginBottom | 0 | — | |
| ...columns-4 > col-0 > heading | marginLeft | 0 | — | |
| ...columns-4 > col-0 > heading | marginRight | 0 | — | |
| ...columns-4 > col-0 > heading | marginTop | 6px | — | |
| ...columns-4 > col-0 > heading | paddingBottom | 0 | — | |
| ...columns-4 > col-0 > heading | paddingLeft | 0 | — | |
| ...columns-4 > col-0 > heading | paddingRight | 0 | — | |
| ...columns-4 > col-0 > heading | paddingTop | 6px | — | |
| ...columns-4 > col-0 > heading | textAlign | center | — | |
| ... > columns-4 > col-0 > text | color | #586069 | — | |
| ... > columns-4 > col-0 > text | display | block | — | |
| ... > columns-4 > col-0 > text | fontSize | 14px | — | |
| ... > columns-4 > col-0 > text | lineHeight | 1 | — | |
| ... > columns-4 > col-0 > text | marginBottom | 0 | — | |
| ... > columns-4 > col-0 > text | marginLeft | 0 | — | |
| ... > columns-4 > col-0 > text | marginRight | 0 | — | |
| ... > columns-4 > col-0 > text | marginTop | 4px | — | |
| ... > columns-4 > col-0 > text | paddingBottom | 0 | — | |
| ... > columns-4 > col-0 > text | paddingLeft | 0 | — | |
| ... > columns-4 > col-0 > text | paddingRight | 0 | — | |
| ... > columns-4 > col-0 > text | paddingTop | 4px | — | |
| ... > columns-4 > col-0 > text | textAlign | center | — | |
| ...> columns-4 > col-1 > image | borderRadius | 6px | — | |
| ...> columns-4 > col-1 > image | display | block | — | |
| ...> columns-4 > col-1 > image | height | 220px | — | |
| ...> columns-4 > col-1 > image | marginBottom | 0 | — | |
| ...> columns-4 > col-1 > image | marginLeft | 0 | — | |
| ...> columns-4 > col-1 > image | marginRight | 0 | — | |
| ...> columns-4 > col-1 > image | marginTop | 0 | — | |
| ...> columns-4 > col-1 > image | objectFit | cover | — | |
| ...> columns-4 > col-1 > image | width | 100% | — | |
| ... > columns-4 > col-1 > text | color | #667eea | — | |
| ... > columns-4 > col-1 > text | display | block | — | |
| ... > columns-4 > col-1 > text | fontSize | 10px | — | |
| ... > columns-4 > col-1 > text | fontWeight | 700 | — | |
| ... > columns-4 > col-1 > text | letterSpacing | 1px | — | |
| ... > columns-4 > col-1 > text | lineHeight | 1 | — | |
| ... > columns-4 > col-1 > text | marginBottom | 0 | — | |
| ... > columns-4 > col-1 > text | marginLeft | 0 | — | |
| ... > columns-4 > col-1 > text | marginRight | 0 | — | |
| ... > columns-4 > col-1 > text | marginTop | 10px | — | |
| ... > columns-4 > col-1 > text | paddingBottom | 0 | — | |
| ... > columns-4 > col-1 > text | paddingLeft | 0 | — | |
| ... > columns-4 > col-1 > text | paddingRight | 0 | — | |
| ... > columns-4 > col-1 > text | paddingTop | 10px | — | |
| ... > columns-4 > col-1 > text | textAlign | center | — | |
| ...columns-4 > col-1 > heading | color | #1a1a1a | — | |
| ...columns-4 > col-1 > heading | display | block | — | |
| ...columns-4 > col-1 > heading | fontSize | 14px | — | |
| ...columns-4 > col-1 > heading | fontWeight | 600 | — | |
| ...columns-4 > col-1 > heading | lineHeight | 1.2 | — | |
| ...columns-4 > col-1 > heading | marginBottom | 0 | — | |
| ...columns-4 > col-1 > heading | marginLeft | 0 | — | |
| ...columns-4 > col-1 > heading | marginRight | 0 | — | |
| ...columns-4 > col-1 > heading | marginTop | 6px | — | |
| ...columns-4 > col-1 > heading | paddingBottom | 0 | — | |
| ...columns-4 > col-1 > heading | paddingLeft | 0 | — | |
| ...columns-4 > col-1 > heading | paddingRight | 0 | — | |
| ...columns-4 > col-1 > heading | paddingTop | 6px | — | |
| ...columns-4 > col-1 > heading | textAlign | center | — | |
| ... > columns-4 > col-1 > text | color | #586069 | — | |
| ... > columns-4 > col-1 > text | display | block | — | |
| ... > columns-4 > col-1 > text | fontSize | 14px | — | |
| ... > columns-4 > col-1 > text | lineHeight | 1 | — | |
| ... > columns-4 > col-1 > text | marginBottom | 0 | — | |
| ... > columns-4 > col-1 > text | marginLeft | 0 | — | |
| ... > columns-4 > col-1 > text | marginRight | 0 | — | |
| ... > columns-4 > col-1 > text | marginTop | 4px | — | |
| ... > columns-4 > col-1 > text | paddingBottom | 0 | — | |
| ... > columns-4 > col-1 > text | paddingLeft | 0 | — | |
| ... > columns-4 > col-1 > text | paddingRight | 0 | — | |
| ... > columns-4 > col-1 > text | paddingTop | 4px | — | |
| ... > columns-4 > col-1 > text | textAlign | center | — | |
| ...> columns-4 > col-2 > image | borderRadius | 6px | — | |
| ...> columns-4 > col-2 > image | display | block | — | |
| ...> columns-4 > col-2 > image | height | 220px | — | |
| ...> columns-4 > col-2 > image | marginBottom | 0 | — | |
| ...> columns-4 > col-2 > image | marginLeft | 0 | — | |
| ...> columns-4 > col-2 > image | marginRight | 0 | — | |
| ...> columns-4 > col-2 > image | marginTop | 0 | — | |
| ...> columns-4 > col-2 > image | objectFit | cover | — | |
| ...> columns-4 > col-2 > image | width | 100% | — | |
| ... > columns-4 > col-2 > text | color | #667eea | — | |
| ... > columns-4 > col-2 > text | display | block | — | |
| ... > columns-4 > col-2 > text | fontSize | 10px | — | |
| ... > columns-4 > col-2 > text | fontWeight | 700 | — | |
| ... > columns-4 > col-2 > text | letterSpacing | 1px | — | |
| ... > columns-4 > col-2 > text | lineHeight | 1 | — | |
| ... > columns-4 > col-2 > text | marginBottom | 0 | — | |
| ... > columns-4 > col-2 > text | marginLeft | 0 | — | |
| ... > columns-4 > col-2 > text | marginRight | 0 | — | |
| ... > columns-4 > col-2 > text | marginTop | 10px | — | |
| ... > columns-4 > col-2 > text | paddingBottom | 0 | — | |
| ... > columns-4 > col-2 > text | paddingLeft | 0 | — | |
| ... > columns-4 > col-2 > text | paddingRight | 0 | — | |
| ... > columns-4 > col-2 > text | paddingTop | 10px | — | |
| ... > columns-4 > col-2 > text | textAlign | center | — | |
| ...columns-4 > col-2 > heading | color | #1a1a1a | — | |
| ...columns-4 > col-2 > heading | display | block | — | |
| ...columns-4 > col-2 > heading | fontSize | 14px | — | |
| ...columns-4 > col-2 > heading | fontWeight | 600 | — | |
| ...columns-4 > col-2 > heading | lineHeight | 1.2 | — | |
| ...columns-4 > col-2 > heading | marginBottom | 0 | — | |
| ...columns-4 > col-2 > heading | marginLeft | 0 | — | |
| ...columns-4 > col-2 > heading | marginRight | 0 | — | |
| ...columns-4 > col-2 > heading | marginTop | 6px | — | |
| ...columns-4 > col-2 > heading | paddingBottom | 0 | — | |
| ...columns-4 > col-2 > heading | paddingLeft | 0 | — | |
| ...columns-4 > col-2 > heading | paddingRight | 0 | — | |
| ...columns-4 > col-2 > heading | paddingTop | 6px | — | |
| ...columns-4 > col-2 > heading | textAlign | center | — | |
| ... > columns-4 > col-2 > text | color | #586069 | — | |
| ... > columns-4 > col-2 > text | display | block | — | |
| ... > columns-4 > col-2 > text | fontSize | 14px | — | |
| ... > columns-4 > col-2 > text | lineHeight | 1 | — | |
| ... > columns-4 > col-2 > text | marginBottom | 0 | — | |
| ... > columns-4 > col-2 > text | marginLeft | 0 | — | |
| ... > columns-4 > col-2 > text | marginRight | 0 | — | |
| ... > columns-4 > col-2 > text | marginTop | 4px | — | |
| ... > columns-4 > col-2 > text | paddingBottom | 0 | — | |
| ... > columns-4 > col-2 > text | paddingLeft | 0 | — | |
| ... > columns-4 > col-2 > text | paddingRight | 0 | — | |
| ... > columns-4 > col-2 > text | paddingTop | 4px | — | |
| ... > columns-4 > col-2 > text | textAlign | center | — | |
| ...> columns-4 > col-3 > image | borderRadius | 6px | — | |
| ...> columns-4 > col-3 > image | display | block | — | |
| ...> columns-4 > col-3 > image | height | 220px | — | |
| ...> columns-4 > col-3 > image | marginBottom | 0 | — | |
| ...> columns-4 > col-3 > image | marginLeft | 0 | — | |
| ...> columns-4 > col-3 > image | marginRight | 0 | — | |
| ...> columns-4 > col-3 > image | marginTop | 0 | — | |
| ...> columns-4 > col-3 > image | objectFit | cover | — | |
| ...> columns-4 > col-3 > image | width | 100% | — | |
| ... > columns-4 > col-3 > text | color | #667eea | — | |
| ... > columns-4 > col-3 > text | display | block | — | |
| ... > columns-4 > col-3 > text | fontSize | 10px | — | |
| ... > columns-4 > col-3 > text | fontWeight | 700 | — | |
| ... > columns-4 > col-3 > text | letterSpacing | 1px | — | |
| ... > columns-4 > col-3 > text | lineHeight | 1 | — | |
| ... > columns-4 > col-3 > text | marginBottom | 0 | — | |
| ... > columns-4 > col-3 > text | marginLeft | 0 | — | |
| ... > columns-4 > col-3 > text | marginRight | 0 | — | |
| ... > columns-4 > col-3 > text | marginTop | 10px | — | |
| ... > columns-4 > col-3 > text | paddingBottom | 0 | — | |
| ... > columns-4 > col-3 > text | paddingLeft | 0 | — | |
| ... > columns-4 > col-3 > text | paddingRight | 0 | — | |
| ... > columns-4 > col-3 > text | paddingTop | 10px | — | |
| ... > columns-4 > col-3 > text | textAlign | center | — | |
| ...columns-4 > col-3 > heading | color | #1a1a1a | — | |
| ...columns-4 > col-3 > heading | display | block | — | |
| ...columns-4 > col-3 > heading | fontSize | 14px | — | |
| ...columns-4 > col-3 > heading | fontWeight | 600 | — | |
| ...columns-4 > col-3 > heading | lineHeight | 1.2 | — | |
| ...columns-4 > col-3 > heading | marginBottom | 0 | — | |
| ...columns-4 > col-3 > heading | marginLeft | 0 | — | |
| ...columns-4 > col-3 > heading | marginRight | 0 | — | |
| ...columns-4 > col-3 > heading | marginTop | 6px | — | |
| ...columns-4 > col-3 > heading | paddingBottom | 0 | — | |
| ...columns-4 > col-3 > heading | paddingLeft | 0 | — | |
| ...columns-4 > col-3 > heading | paddingRight | 0 | — | |
| ...columns-4 > col-3 > heading | paddingTop | 6px | — | |
| ...columns-4 > col-3 > heading | textAlign | center | — | |
| ... > columns-4 > col-3 > text | color | #586069 | — | |
| ... > columns-4 > col-3 > text | display | block | — | |
| ... > columns-4 > col-3 > text | fontSize | 14px | — | |
| ... > columns-4 > col-3 > text | lineHeight | 1 | — | |
| ... > columns-4 > col-3 > text | marginBottom | 0 | — | |
| ... > columns-4 > col-3 > text | marginLeft | 0 | — | |
| ... > columns-4 > col-3 > text | marginRight | 0 | — | |
| ... > columns-4 > col-3 > text | marginTop | 4px | — | |
| ... > columns-4 > col-3 > text | paddingBottom | 0 | — | |
| ... > columns-4 > col-3 > text | paddingLeft | 0 | — | |
| ... > columns-4 > col-3 > text | paddingRight | 0 | — | |
| ... > columns-4 > col-3 > text | paddingTop | 4px | — | |
| ... > columns-4 > col-3 > text | textAlign | center | — | |

---

## Brand Story (`brand-story`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| columns-2 | columns | 2 | |
| image | src | /images/placeholder.jpg | |
| image | alt | Our story | |
| image | settingId | image | |
| text | text | OUR STORY | |
| heading | text | Built with Purpose | |
| heading | level | h2 | |
| heading | tag | h2 | |
| text | text | We started with a simple belief: everyon... | |
| text | text | Our commitment goes beyond products. For... | |
| button | text | Learn More About Us | |
| button | href |  | |
| button | url |  | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | backgroundColor | #fafbfc | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 0 | — | |
| container | paddingLeft | 0 | — | |
| container | paddingRight | 0 | — | |
| container | paddingTop | 0 | — | |
| container | width | 100% | — | |
| container > columns-2 | alignItems | stretch | — | |
| container > columns-2 | flexDirection | row | — | |
| container > columns-2 | gap | 24px | — | |
| container > columns-2 | justifyContent | flex-start | — | |
| ...> columns-2 > col-0 > image | display | block | — | |
| ...> columns-2 > col-0 > image | height | 100% | — | |
| ...> columns-2 > col-0 > image | marginBottom | 0 | — | |
| ...> columns-2 > col-0 > image | marginLeft | 0 | — | |
| ...> columns-2 > col-0 > image | marginRight | 0 | — | |
| ...> columns-2 > col-0 > image | marginTop | 0 | — | |
| ...> columns-2 > col-0 > image | minHeight | 400px | — | |
| ...> columns-2 > col-0 > image | objectFit | cover | — | |
| ...> columns-2 > col-0 > image | width | 100% | — | |
| ...lumns-2 > col-1 > container | alignItems | flex-start | — | |
| ...lumns-2 > col-1 > container | borderStyle | none | — | |
| ...lumns-2 > col-1 > container | borderWidth | 0px | — | |
| ...lumns-2 > col-1 > container | boxSizing | border-box | — | |
| ...lumns-2 > col-1 > container | display | flex | — | |
| ...lumns-2 > col-1 > container | flex | 1 | — | |
| ...lumns-2 > col-1 > container | flexDirection | column | — | |
| ...lumns-2 > col-1 > container | height | 100% | — | |
| ...lumns-2 > col-1 > container | justifyContent | center | — | |
| ...lumns-2 > col-1 > container | marginBottom | 0 | — | |
| ...lumns-2 > col-1 > container | marginLeft | 0 | — | |
| ...lumns-2 > col-1 > container | marginRight | 0 | — | |
| ...lumns-2 > col-1 > container | marginTop | 0 | — | |
| ...lumns-2 > col-1 > container | maxWidth | 100% | — | |
| ...lumns-2 > col-1 > container | overflow | hidden | — | |
| ...lumns-2 > col-1 > container | paddingBottom | 60px | xs:30px, sm:42px | |
| ...lumns-2 > col-1 > container | paddingLeft | 40px | xs:16px | |
| ...lumns-2 > col-1 > container | paddingRight | 40px | xs:16px | |
| ...lumns-2 > col-1 > container | paddingTop | 60px | xs:30px, sm:42px | |
| ...lumns-2 > col-1 > container | width | 100% | — | |
| ... > col-1 > container > text | color | #667eea | — | |
| ... > col-1 > container > text | display | block | — | |
| ... > col-1 > container > text | fontSize | 11px | — | |
| ... > col-1 > container > text | fontWeight | 700 | — | |
| ... > col-1 > container > text | letterSpacing | 2px | — | |
| ... > col-1 > container > text | lineHeight | 1 | — | |
| ... > col-1 > container > text | marginBottom | 0 | — | |
| ... > col-1 > container > text | marginLeft | 0 | — | |
| ... > col-1 > container > text | marginRight | 0 | — | |
| ... > col-1 > container > text | marginTop | 0 | — | |
| ... > col-1 > container > text | paddingBottom | 0 | — | |
| ... > col-1 > container > text | paddingLeft | 0 | — | |
| ... > col-1 > container > text | paddingRight | 0 | — | |
| ... > col-1 > container > text | paddingTop | 0 | — | |
| ...col-1 > container > heading | color | #1a1a1a | — | |
| ...col-1 > container > heading | display | block | — | |
| ...col-1 > container > heading | fontSize | 32px | xs:20px, sm:24px | |
| ...col-1 > container > heading | fontWeight | bold | — | |
| ...col-1 > container > heading | lineHeight | 1.2 | — | |
| ...col-1 > container > heading | marginBottom | 0 | — | |
| ...col-1 > container > heading | marginLeft | 0 | — | |
| ...col-1 > container > heading | marginRight | 0 | — | |
| ...col-1 > container > heading | marginTop | 16px | — | |
| ...col-1 > container > heading | paddingBottom | 0 | — | |
| ...col-1 > container > heading | paddingLeft | 0 | — | |
| ...col-1 > container > heading | paddingRight | 0 | — | |
| ...col-1 > container > heading | paddingTop | 16px | — | |
| ...col-1 > container > heading | textAlign | left | — | |
| ... > col-1 > container > text | color | #586069 | — | |
| ... > col-1 > container > text | display | block | — | |
| ... > col-1 > container > text | fontSize | 15px | — | |
| ... > col-1 > container > text | lineHeight | 1.8 | — | |
| ... > col-1 > container > text | marginBottom | 0 | — | |
| ... > col-1 > container > text | marginLeft | 0 | — | |
| ... > col-1 > container > text | marginRight | 0 | — | |
| ... > col-1 > container > text | marginTop | 16px | — | |
| ... > col-1 > container > text | paddingBottom | 0 | — | |
| ... > col-1 > container > text | paddingLeft | 0 | — | |
| ... > col-1 > container > text | paddingRight | 0 | — | |
| ... > col-1 > container > text | paddingTop | 16px | — | |
| ... > col-1 > container > text | color | #586069 | — | |
| ... > col-1 > container > text | display | block | — | |
| ... > col-1 > container > text | fontSize | 15px | — | |
| ... > col-1 > container > text | lineHeight | 1.8 | — | |
| ... > col-1 > container > text | marginBottom | 0 | — | |
| ... > col-1 > container > text | marginLeft | 0 | — | |
| ... > col-1 > container > text | marginRight | 0 | — | |
| ... > col-1 > container > text | marginTop | 16px | — | |
| ... > col-1 > container > text | paddingBottom | 0 | — | |
| ... > col-1 > container > text | paddingLeft | 0 | — | |
| ... > col-1 > container > text | paddingRight | 0 | — | |
| ... > col-1 > container > text | paddingTop | 16px | — | |
| ... col-1 > container > button | borderColor | #667eea | — | |
| ... col-1 > container > button | borderRadius | 4px | — | |
| ... col-1 > container > button | borderStyle | solid | — | |
| ... col-1 > container > button | borderWidth | 1px | — | |
| ... col-1 > container > button | color | #667eea | — | |
| ... col-1 > container > button | cursor | pointer | — | |
| ... col-1 > container > button | display | inline-block | — | |
| ... col-1 > container > button | fontSize | 13px | — | |
| ... col-1 > container > button | fontWeight | 600 | — | |
| ... col-1 > container > button | marginBottom | 0 | — | |
| ... col-1 > container > button | marginLeft | 0 | — | |
| ... col-1 > container > button | marginRight | 0 | — | |
| ... col-1 > container > button | marginTop | 24px | — | |
| ... col-1 > container > button | paddingBottom | 12px | — | |
| ... col-1 > container > button | paddingLeft | 28px | — | |
| ... col-1 > container > button | paddingRight | 28px | — | |
| ... col-1 > container > button | paddingTop | 12px | — | |

---

## Collection Showcase (`collection-showcase`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| heading | text | Shop by Category | |
| heading | level | h2 | |
| heading | tag | h2 | |
| columns-3 | columns | 3 | |
| image-background | src | /images/placeholder.jpg | |
| image-background | alt |  | |
| image-background | settingId | background_image | |
| image-background | minHeight | 300px | |
| image-background | backgroundSize | cover | |
| image-background | backgroundPosition | center | |
| image-background | backgroundRepeat | no-repeat | |
| heading | text | New Arrivals | |
| heading | level | h3 | |
| heading | tag | h3 | |
| button | text | Shop Now | |
| button | href |  | |
| button | url |  | |
| image-background | src | /images/placeholder.jpg | |
| image-background | alt |  | |
| image-background | settingId | background_image_2 | |
| image-background | minHeight | 300px | |
| image-background | backgroundSize | cover | |
| image-background | backgroundPosition | center | |
| image-background | backgroundRepeat | no-repeat | |
| heading | text | Bestsellers | |
| heading | level | h3 | |
| heading | tag | h3 | |
| button | text | Shop Now | |
| button | href |  | |
| button | url |  | |
| image-background | src | /images/placeholder.jpg | |
| image-background | alt |  | |
| image-background | settingId | background_image_3 | |
| image-background | minHeight | 300px | |
| image-background | backgroundSize | cover | |
| image-background | backgroundPosition | center | |
| image-background | backgroundRepeat | no-repeat | |
| heading | text | Sale | |
| heading | level | h3 | |
| heading | tag | h3 | |
| button | text | Shop Now | |
| button | href |  | |
| button | url |  | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | alignItems | center | — | |
| container | backgroundColor | #ffffff | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 60px | xs:30px, sm:42px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 60px | xs:30px, sm:42px | |
| container | width | 100% | — | |
| container > heading | color | #1a1a1a | — | |
| container > heading | display | block | — | |
| container > heading | fontSize | 36px | xs:22px, sm:27px | |
| container > heading | fontWeight | bold | — | |
| container > heading | lineHeight | 1.2 | — | |
| container > heading | marginBottom | 10px | — | |
| container > heading | marginLeft | 0 | — | |
| container > heading | marginRight | 0 | — | |
| container > heading | marginTop | 0 | — | |
| container > heading | paddingBottom | 0 | — | |
| container > heading | paddingLeft | 0 | — | |
| container > heading | paddingRight | 0 | — | |
| container > heading | paddingTop | 0 | — | |
| container > heading | textAlign | center | — | |
| container > columns-3 | alignItems | stretch | — | |
| container > columns-3 | flexDirection | row | — | |
| container > columns-3 | gap | 24px | — | |
| container > columns-3 | justifyContent | flex-start | — | |
| ... > col-0 > image-background | alignItems | flex-end | — | |
| ... > col-0 > image-background | backgroundColor | #f6f8fa | — | |
| ... > col-0 > image-background | backgroundPosition | center | — | |
| ... > col-0 > image-background | backgroundRepeat | no-repeat | — | |
| ... > col-0 > image-background | backgroundSize | cover | — | |
| ... > col-0 > image-background | borderRadius | 8px | — | |
| ... > col-0 > image-background | borderStyle | none | — | |
| ... > col-0 > image-background | borderWidth | 0px | — | |
| ... > col-0 > image-background | display | flex | — | |
| ... > col-0 > image-background | justifyContent | center | — | |
| ... > col-0 > image-background | marginBottom | 0 | — | |
| ... > col-0 > image-background | marginLeft | 0 | — | |
| ... > col-0 > image-background | marginRight | 0 | — | |
| ... > col-0 > image-background | marginTop | 0 | — | |
| ... > col-0 > image-background | minHeight | 300px | — | |
| ... > col-0 > image-background | overflow | hidden | — | |
| ... > col-0 > image-background | paddingBottom | 0 | — | |
| ... > col-0 > image-background | paddingLeft | 0 | — | |
| ... > col-0 > image-background | paddingRight | 0 | — | |
| ... > col-0 > image-background | paddingTop | 0 | — | |
| ... > col-0 > image-background | position | relative | — | |
| ...mage-background > container | alignItems | center | — | |
| ...mage-background > container | backgroundColor | rgba(0,0,0,0.5) | — | |
| ...mage-background > container | borderStyle | none | — | |
| ...mage-background > container | borderWidth | 0px | — | |
| ...mage-background > container | boxSizing | border-box | — | |
| ...mage-background > container | display | flex | — | |
| ...mage-background > container | flex | 0 | — | |
| ...mage-background > container | flexDirection | column | — | |
| ...mage-background > container | height | auto | — | |
| ...mage-background > container | marginBottom | 0 | — | |
| ...mage-background > container | marginLeft | 0 | — | |
| ...mage-background > container | marginRight | 0 | — | |
| ...mage-background > container | marginTop | 0 | — | |
| ...mage-background > container | maxWidth | 100% | — | |
| ...mage-background > container | overflow | hidden | — | |
| ...mage-background > container | paddingBottom | 16px | — | |
| ...mage-background > container | paddingLeft | 16px | — | |
| ...mage-background > container | paddingRight | 16px | — | |
| ...mage-background > container | paddingTop | 16px | — | |
| ...mage-background > container | width | 100% | — | |
| ...round > container > heading | color | #ffffff | — | |
| ...round > container > heading | display | block | — | |
| ...round > container > heading | fontSize | 20px | — | |
| ...round > container > heading | fontWeight | bold | — | |
| ...round > container > heading | lineHeight | 1.2 | — | |
| ...round > container > heading | marginBottom | 0 | — | |
| ...round > container > heading | marginLeft | 0 | — | |
| ...round > container > heading | marginRight | 0 | — | |
| ...round > container > heading | marginTop | 0 | — | |
| ...round > container > heading | paddingBottom | 0 | — | |
| ...round > container > heading | paddingLeft | 0 | — | |
| ...round > container > heading | paddingRight | 0 | — | |
| ...round > container > heading | paddingTop | 0 | — | |
| ...round > container > heading | textAlign | center | — | |
| ...ground > container > button | backgroundColor | #667eea | — | |
| ...ground > container > button | borderColor | #ffffff | — | |
| ...ground > container > button | borderRadius | 3px | — | |
| ...ground > container > button | borderStyle | solid | — | |
| ...ground > container > button | borderWidth | 1px | — | |
| ...ground > container > button | color | #ffffff | — | |
| ...ground > container > button | cursor | pointer | — | |
| ...ground > container > button | display | inline-block | — | |
| ...ground > container > button | fontSize | 12px | — | |
| ...ground > container > button | fontWeight | 600 | — | |
| ...ground > container > button | marginBottom | 0 | — | |
| ...ground > container > button | marginLeft | 0 | — | |
| ...ground > container > button | marginRight | 0 | — | |
| ...ground > container > button | marginTop | 10px | — | |
| ...ground > container > button | paddingBottom | 8px | — | |
| ...ground > container > button | paddingLeft | 24px | — | |
| ...ground > container > button | paddingRight | 24px | — | |
| ...ground > container > button | paddingTop | 8px | — | |
| ... > col-1 > image-background | alignItems | flex-end | — | |
| ... > col-1 > image-background | backgroundColor | #d5d5d5 | — | |
| ... > col-1 > image-background | backgroundPosition | center | — | |
| ... > col-1 > image-background | backgroundRepeat | no-repeat | — | |
| ... > col-1 > image-background | backgroundSize | cover | — | |
| ... > col-1 > image-background | borderRadius | 8px | — | |
| ... > col-1 > image-background | borderStyle | none | — | |
| ... > col-1 > image-background | borderWidth | 0px | — | |
| ... > col-1 > image-background | display | flex | — | |
| ... > col-1 > image-background | justifyContent | center | — | |
| ... > col-1 > image-background | marginBottom | 0 | — | |
| ... > col-1 > image-background | marginLeft | 0 | — | |
| ... > col-1 > image-background | marginRight | 0 | — | |
| ... > col-1 > image-background | marginTop | 0 | — | |
| ... > col-1 > image-background | minHeight | 300px | — | |
| ... > col-1 > image-background | overflow | hidden | — | |
| ... > col-1 > image-background | paddingBottom | 0 | — | |
| ... > col-1 > image-background | paddingLeft | 0 | — | |
| ... > col-1 > image-background | paddingRight | 0 | — | |
| ... > col-1 > image-background | paddingTop | 0 | — | |
| ... > col-1 > image-background | position | relative | — | |
| ...mage-background > container | alignItems | center | — | |
| ...mage-background > container | backgroundColor | rgba(0,0,0,0.5) | — | |
| ...mage-background > container | borderStyle | none | — | |
| ...mage-background > container | borderWidth | 0px | — | |
| ...mage-background > container | boxSizing | border-box | — | |
| ...mage-background > container | display | flex | — | |
| ...mage-background > container | flex | 0 | — | |
| ...mage-background > container | flexDirection | column | — | |
| ...mage-background > container | height | auto | — | |
| ...mage-background > container | marginBottom | 0 | — | |
| ...mage-background > container | marginLeft | 0 | — | |
| ...mage-background > container | marginRight | 0 | — | |
| ...mage-background > container | marginTop | 0 | — | |
| ...mage-background > container | maxWidth | 100% | — | |
| ...mage-background > container | overflow | hidden | — | |
| ...mage-background > container | paddingBottom | 16px | — | |
| ...mage-background > container | paddingLeft | 16px | — | |
| ...mage-background > container | paddingRight | 16px | — | |
| ...mage-background > container | paddingTop | 16px | — | |
| ...mage-background > container | width | 100% | — | |
| ...round > container > heading | color | #ffffff | — | |
| ...round > container > heading | display | block | — | |
| ...round > container > heading | fontSize | 20px | — | |
| ...round > container > heading | fontWeight | bold | — | |
| ...round > container > heading | lineHeight | 1.2 | — | |
| ...round > container > heading | marginBottom | 0 | — | |
| ...round > container > heading | marginLeft | 0 | — | |
| ...round > container > heading | marginRight | 0 | — | |
| ...round > container > heading | marginTop | 0 | — | |
| ...round > container > heading | paddingBottom | 0 | — | |
| ...round > container > heading | paddingLeft | 0 | — | |
| ...round > container > heading | paddingRight | 0 | — | |
| ...round > container > heading | paddingTop | 0 | — | |
| ...round > container > heading | textAlign | center | — | |
| ...ground > container > button | backgroundColor | #667eea | — | |
| ...ground > container > button | borderColor | #ffffff | — | |
| ...ground > container > button | borderRadius | 3px | — | |
| ...ground > container > button | borderStyle | solid | — | |
| ...ground > container > button | borderWidth | 1px | — | |
| ...ground > container > button | color | #ffffff | — | |
| ...ground > container > button | cursor | pointer | — | |
| ...ground > container > button | display | inline-block | — | |
| ...ground > container > button | fontSize | 12px | — | |
| ...ground > container > button | fontWeight | 600 | — | |
| ...ground > container > button | marginBottom | 0 | — | |
| ...ground > container > button | marginLeft | 0 | — | |
| ...ground > container > button | marginRight | 0 | — | |
| ...ground > container > button | marginTop | 10px | — | |
| ...ground > container > button | paddingBottom | 8px | — | |
| ...ground > container > button | paddingLeft | 24px | — | |
| ...ground > container > button | paddingRight | 24px | — | |
| ...ground > container > button | paddingTop | 8px | — | |
| ... > col-2 > image-background | alignItems | flex-end | — | |
| ... > col-2 > image-background | backgroundColor | #c5c5c5 | — | |
| ... > col-2 > image-background | backgroundPosition | center | — | |
| ... > col-2 > image-background | backgroundRepeat | no-repeat | — | |
| ... > col-2 > image-background | backgroundSize | cover | — | |
| ... > col-2 > image-background | borderRadius | 8px | — | |
| ... > col-2 > image-background | borderStyle | none | — | |
| ... > col-2 > image-background | borderWidth | 0px | — | |
| ... > col-2 > image-background | display | flex | — | |
| ... > col-2 > image-background | justifyContent | center | — | |
| ... > col-2 > image-background | marginBottom | 0 | — | |
| ... > col-2 > image-background | marginLeft | 0 | — | |
| ... > col-2 > image-background | marginRight | 0 | — | |
| ... > col-2 > image-background | marginTop | 0 | — | |
| ... > col-2 > image-background | minHeight | 300px | — | |
| ... > col-2 > image-background | overflow | hidden | — | |
| ... > col-2 > image-background | paddingBottom | 0 | — | |
| ... > col-2 > image-background | paddingLeft | 0 | — | |
| ... > col-2 > image-background | paddingRight | 0 | — | |
| ... > col-2 > image-background | paddingTop | 0 | — | |
| ... > col-2 > image-background | position | relative | — | |
| ...mage-background > container | alignItems | center | — | |
| ...mage-background > container | backgroundColor | rgba(0,0,0,0.5) | — | |
| ...mage-background > container | borderStyle | none | — | |
| ...mage-background > container | borderWidth | 0px | — | |
| ...mage-background > container | boxSizing | border-box | — | |
| ...mage-background > container | display | flex | — | |
| ...mage-background > container | flex | 0 | — | |
| ...mage-background > container | flexDirection | column | — | |
| ...mage-background > container | height | auto | — | |
| ...mage-background > container | marginBottom | 0 | — | |
| ...mage-background > container | marginLeft | 0 | — | |
| ...mage-background > container | marginRight | 0 | — | |
| ...mage-background > container | marginTop | 0 | — | |
| ...mage-background > container | maxWidth | 100% | — | |
| ...mage-background > container | overflow | hidden | — | |
| ...mage-background > container | paddingBottom | 16px | — | |
| ...mage-background > container | paddingLeft | 16px | — | |
| ...mage-background > container | paddingRight | 16px | — | |
| ...mage-background > container | paddingTop | 16px | — | |
| ...mage-background > container | width | 100% | — | |
| ...round > container > heading | color | #ffffff | — | |
| ...round > container > heading | display | block | — | |
| ...round > container > heading | fontSize | 20px | — | |
| ...round > container > heading | fontWeight | bold | — | |
| ...round > container > heading | lineHeight | 1.2 | — | |
| ...round > container > heading | marginBottom | 0 | — | |
| ...round > container > heading | marginLeft | 0 | — | |
| ...round > container > heading | marginRight | 0 | — | |
| ...round > container > heading | marginTop | 0 | — | |
| ...round > container > heading | paddingBottom | 0 | — | |
| ...round > container > heading | paddingLeft | 0 | — | |
| ...round > container > heading | paddingRight | 0 | — | |
| ...round > container > heading | paddingTop | 0 | — | |
| ...round > container > heading | textAlign | center | — | |
| ...ground > container > button | backgroundColor | #667eea | — | |
| ...ground > container > button | borderColor | #ffffff | — | |
| ...ground > container > button | borderRadius | 3px | — | |
| ...ground > container > button | borderStyle | solid | — | |
| ...ground > container > button | borderWidth | 1px | — | |
| ...ground > container > button | color | #ffffff | — | |
| ...ground > container > button | cursor | pointer | — | |
| ...ground > container > button | display | inline-block | — | |
| ...ground > container > button | fontSize | 12px | — | |
| ...ground > container > button | fontWeight | 600 | — | |
| ...ground > container > button | marginBottom | 0 | — | |
| ...ground > container > button | marginLeft | 0 | — | |
| ...ground > container > button | marginRight | 0 | — | |
| ...ground > container > button | marginTop | 10px | — | |
| ...ground > container > button | paddingBottom | 8px | — | |
| ...ground > container > button | paddingLeft | 24px | — | |
| ...ground > container > button | paddingRight | 24px | — | |
| ...ground > container > button | paddingTop | 8px | — | |

---

## Full-Width Text (`content-fullwidth-text`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| heading | text | Our Mission | |
| heading | level | h2 | |
| heading | tag | h2 | |
| text | text | We believe in building tools that empowe... | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | alignItems | center | — | |
| container | backgroundColor | #ffffff | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 60px | xs:30px, sm:42px | |
| container | paddingLeft | 40px | xs:16px | |
| container | paddingRight | 40px | xs:16px | |
| container | paddingTop | 60px | xs:30px, sm:42px | |
| container | width | 100% | — | |
| container > heading | color | #1a1a1a | — | |
| container > heading | display | block | — | |
| container > heading | fontSize | 36px | xs:22px, sm:27px | |
| container > heading | fontWeight | bold | — | |
| container > heading | lineHeight | 1.2 | — | |
| container > heading | marginBottom | 0 | — | |
| container > heading | marginLeft | 0 | — | |
| container > heading | marginRight | 0 | — | |
| container > heading | marginTop | 0 | — | |
| container > heading | paddingBottom | 0 | — | |
| container > heading | paddingLeft | 0 | — | |
| container > heading | paddingRight | 0 | — | |
| container > heading | paddingTop | 0 | — | |
| container > heading | textAlign | center | — | |
| container > text | color | #586069 | — | |
| container > text | display | block | — | |
| container > text | fontSize | 17px | — | |
| container > text | lineHeight | 1.8 | — | |
| container > text | marginBottom | 0 | — | |
| container > text | marginLeft | 0 | — | |
| container > text | marginRight | 0 | — | |
| container > text | marginTop | 0 | — | |
| container > text | maxWidth | 700px | — | |
| container > text | paddingBottom | 0 | — | |
| container > text | paddingLeft | 0 | — | |
| container > text | paddingRight | 0 | — | |
| container > text | paddingTop | 0 | — | |
| container > text | textAlign | center | — | |

---

## Stats Row (`content-stats`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| columns-4 | columns | 4 | |
| heading | text | 10K+ | |
| heading | level | h2 | |
| heading | tag | h2 | |
| text | text | Customers | |
| heading | text | 99.9% | |
| heading | level | h2 | |
| heading | tag | h2 | |
| text | text | Uptime | |
| heading | text | 50M+ | |
| heading | level | h2 | |
| heading | tag | h2 | |
| text | text | Page Views | |
| heading | text | 24/7 | |
| heading | level | h2 | |
| heading | tag | h2 | |
| text | text | Support | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | backgroundColor | #1a1a1a | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 40px | xs:20px, sm:28px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 40px | xs:20px, sm:28px | |
| container | width | 100% | — | |
| container > columns-4 | alignItems | stretch | — | |
| container > columns-4 | flexDirection | row | — | |
| container > columns-4 | gap | 24px | — | |
| container > columns-4 | justifyContent | flex-start | — | |
| ...columns-4 > col-0 > heading | color | #ffffff | — | |
| ...columns-4 > col-0 > heading | display | block | — | |
| ...columns-4 > col-0 > heading | fontSize | 36px | xs:22px, sm:27px | |
| ...columns-4 > col-0 > heading | fontWeight | bold | — | |
| ...columns-4 > col-0 > heading | lineHeight | 1.2 | — | |
| ...columns-4 > col-0 > heading | marginBottom | 0 | — | |
| ...columns-4 > col-0 > heading | marginLeft | 0 | — | |
| ...columns-4 > col-0 > heading | marginRight | 0 | — | |
| ...columns-4 > col-0 > heading | marginTop | 0 | — | |
| ...columns-4 > col-0 > heading | paddingBottom | 0 | — | |
| ...columns-4 > col-0 > heading | paddingLeft | 0 | — | |
| ...columns-4 > col-0 > heading | paddingRight | 0 | — | |
| ...columns-4 > col-0 > heading | paddingTop | 0 | — | |
| ...columns-4 > col-0 > heading | textAlign | center | — | |
| ... > columns-4 > col-0 > text | color | #e1e4e8 | — | |
| ... > columns-4 > col-0 > text | display | block | — | |
| ... > columns-4 > col-0 > text | fontSize | 14px | — | |
| ... > columns-4 > col-0 > text | lineHeight | 1 | — | |
| ... > columns-4 > col-0 > text | marginBottom | 0 | — | |
| ... > columns-4 > col-0 > text | marginLeft | 0 | — | |
| ... > columns-4 > col-0 > text | marginRight | 0 | — | |
| ... > columns-4 > col-0 > text | marginTop | 8px | — | |
| ... > columns-4 > col-0 > text | paddingBottom | 0 | — | |
| ... > columns-4 > col-0 > text | paddingLeft | 0 | — | |
| ... > columns-4 > col-0 > text | paddingRight | 0 | — | |
| ... > columns-4 > col-0 > text | paddingTop | 8px | — | |
| ... > columns-4 > col-0 > text | textAlign | center | — | |
| ...columns-4 > col-1 > heading | color | #ffffff | — | |
| ...columns-4 > col-1 > heading | display | block | — | |
| ...columns-4 > col-1 > heading | fontSize | 36px | xs:22px, sm:27px | |
| ...columns-4 > col-1 > heading | fontWeight | bold | — | |
| ...columns-4 > col-1 > heading | lineHeight | 1.2 | — | |
| ...columns-4 > col-1 > heading | marginBottom | 0 | — | |
| ...columns-4 > col-1 > heading | marginLeft | 0 | — | |
| ...columns-4 > col-1 > heading | marginRight | 0 | — | |
| ...columns-4 > col-1 > heading | marginTop | 0 | — | |
| ...columns-4 > col-1 > heading | paddingBottom | 0 | — | |
| ...columns-4 > col-1 > heading | paddingLeft | 0 | — | |
| ...columns-4 > col-1 > heading | paddingRight | 0 | — | |
| ...columns-4 > col-1 > heading | paddingTop | 0 | — | |
| ...columns-4 > col-1 > heading | textAlign | center | — | |
| ... > columns-4 > col-1 > text | color | #e1e4e8 | — | |
| ... > columns-4 > col-1 > text | display | block | — | |
| ... > columns-4 > col-1 > text | fontSize | 14px | — | |
| ... > columns-4 > col-1 > text | lineHeight | 1 | — | |
| ... > columns-4 > col-1 > text | marginBottom | 0 | — | |
| ... > columns-4 > col-1 > text | marginLeft | 0 | — | |
| ... > columns-4 > col-1 > text | marginRight | 0 | — | |
| ... > columns-4 > col-1 > text | marginTop | 8px | — | |
| ... > columns-4 > col-1 > text | paddingBottom | 0 | — | |
| ... > columns-4 > col-1 > text | paddingLeft | 0 | — | |
| ... > columns-4 > col-1 > text | paddingRight | 0 | — | |
| ... > columns-4 > col-1 > text | paddingTop | 8px | — | |
| ... > columns-4 > col-1 > text | textAlign | center | — | |
| ...columns-4 > col-2 > heading | color | #ffffff | — | |
| ...columns-4 > col-2 > heading | display | block | — | |
| ...columns-4 > col-2 > heading | fontSize | 36px | xs:22px, sm:27px | |
| ...columns-4 > col-2 > heading | fontWeight | bold | — | |
| ...columns-4 > col-2 > heading | lineHeight | 1.2 | — | |
| ...columns-4 > col-2 > heading | marginBottom | 0 | — | |
| ...columns-4 > col-2 > heading | marginLeft | 0 | — | |
| ...columns-4 > col-2 > heading | marginRight | 0 | — | |
| ...columns-4 > col-2 > heading | marginTop | 0 | — | |
| ...columns-4 > col-2 > heading | paddingBottom | 0 | — | |
| ...columns-4 > col-2 > heading | paddingLeft | 0 | — | |
| ...columns-4 > col-2 > heading | paddingRight | 0 | — | |
| ...columns-4 > col-2 > heading | paddingTop | 0 | — | |
| ...columns-4 > col-2 > heading | textAlign | center | — | |
| ... > columns-4 > col-2 > text | color | #e1e4e8 | — | |
| ... > columns-4 > col-2 > text | display | block | — | |
| ... > columns-4 > col-2 > text | fontSize | 14px | — | |
| ... > columns-4 > col-2 > text | lineHeight | 1 | — | |
| ... > columns-4 > col-2 > text | marginBottom | 0 | — | |
| ... > columns-4 > col-2 > text | marginLeft | 0 | — | |
| ... > columns-4 > col-2 > text | marginRight | 0 | — | |
| ... > columns-4 > col-2 > text | marginTop | 8px | — | |
| ... > columns-4 > col-2 > text | paddingBottom | 0 | — | |
| ... > columns-4 > col-2 > text | paddingLeft | 0 | — | |
| ... > columns-4 > col-2 > text | paddingRight | 0 | — | |
| ... > columns-4 > col-2 > text | paddingTop | 8px | — | |
| ... > columns-4 > col-2 > text | textAlign | center | — | |
| ...columns-4 > col-3 > heading | color | #ffffff | — | |
| ...columns-4 > col-3 > heading | display | block | — | |
| ...columns-4 > col-3 > heading | fontSize | 36px | xs:22px, sm:27px | |
| ...columns-4 > col-3 > heading | fontWeight | bold | — | |
| ...columns-4 > col-3 > heading | lineHeight | 1.2 | — | |
| ...columns-4 > col-3 > heading | marginBottom | 0 | — | |
| ...columns-4 > col-3 > heading | marginLeft | 0 | — | |
| ...columns-4 > col-3 > heading | marginRight | 0 | — | |
| ...columns-4 > col-3 > heading | marginTop | 0 | — | |
| ...columns-4 > col-3 > heading | paddingBottom | 0 | — | |
| ...columns-4 > col-3 > heading | paddingLeft | 0 | — | |
| ...columns-4 > col-3 > heading | paddingRight | 0 | — | |
| ...columns-4 > col-3 > heading | paddingTop | 0 | — | |
| ...columns-4 > col-3 > heading | textAlign | center | — | |
| ... > columns-4 > col-3 > text | color | #e1e4e8 | — | |
| ... > columns-4 > col-3 > text | display | block | — | |
| ... > columns-4 > col-3 > text | fontSize | 14px | — | |
| ... > columns-4 > col-3 > text | lineHeight | 1 | — | |
| ... > columns-4 > col-3 > text | marginBottom | 0 | — | |
| ... > columns-4 > col-3 > text | marginLeft | 0 | — | |
| ... > columns-4 > col-3 > text | marginRight | 0 | — | |
| ... > columns-4 > col-3 > text | marginTop | 8px | — | |
| ... > columns-4 > col-3 > text | paddingBottom | 0 | — | |
| ... > columns-4 > col-3 > text | paddingLeft | 0 | — | |
| ... > columns-4 > col-3 > text | paddingRight | 0 | — | |
| ... > columns-4 > col-3 > text | paddingTop | 8px | — | |
| ... > columns-4 > col-3 > text | textAlign | center | — | |

**Column Styles:**

| Element | Column | Property | Value | E/H |
|---------|--------|----------|-------|-----|
| columns-4 | 0 | alignItems | center | |
| columns-4 | 1 | alignItems | center | |
| columns-4 | 2 | alignItems | center | |
| columns-4 | 3 | alignItems | center | |

---

## Text + Image (`content-text-image`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| columns-2 | columns | 2 | |
| heading | text | About Our Story | |
| heading | level | h2 | |
| heading | tag | h2 | |
| text | text | Share your story with the world. Tell vi... | |
| image | src | /images/placeholder.jpg | |
| image | alt | Content image | |
| image | settingId | image | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | backgroundColor | #ffffff | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 0 | — | |
| container | paddingLeft | 0 | — | |
| container | paddingRight | 0 | — | |
| container | paddingTop | 0 | — | |
| container | width | 100% | — | |
| container > columns-2 | alignItems | stretch | — | |
| container > columns-2 | flexDirection | row | — | |
| container > columns-2 | gap | 24px | — | |
| container > columns-2 | justifyContent | flex-start | — | |
| ...lumns-2 > col-0 > container | alignItems | flex-start | — | |
| ...lumns-2 > col-0 > container | borderStyle | none | — | |
| ...lumns-2 > col-0 > container | borderWidth | 0px | — | |
| ...lumns-2 > col-0 > container | boxSizing | border-box | — | |
| ...lumns-2 > col-0 > container | display | flex | — | |
| ...lumns-2 > col-0 > container | flex | 1 | — | |
| ...lumns-2 > col-0 > container | flexDirection | column | — | |
| ...lumns-2 > col-0 > container | height | 100% | — | |
| ...lumns-2 > col-0 > container | justifyContent | center | — | |
| ...lumns-2 > col-0 > container | marginBottom | 0 | — | |
| ...lumns-2 > col-0 > container | marginLeft | 0 | — | |
| ...lumns-2 > col-0 > container | marginRight | 0 | — | |
| ...lumns-2 > col-0 > container | marginTop | 0 | — | |
| ...lumns-2 > col-0 > container | maxWidth | 100% | — | |
| ...lumns-2 > col-0 > container | overflow | hidden | — | |
| ...lumns-2 > col-0 > container | paddingBottom | 40px | xs:20px, sm:28px | |
| ...lumns-2 > col-0 > container | paddingLeft | 40px | xs:16px | |
| ...lumns-2 > col-0 > container | paddingRight | 40px | xs:16px | |
| ...lumns-2 > col-0 > container | paddingTop | 40px | xs:20px, sm:28px | |
| ...lumns-2 > col-0 > container | width | 100% | — | |
| ...col-0 > container > heading | color | #1a1a1a | — | |
| ...col-0 > container > heading | display | block | — | |
| ...col-0 > container > heading | fontSize | 32px | xs:20px, sm:24px | |
| ...col-0 > container > heading | fontWeight | bold | — | |
| ...col-0 > container > heading | lineHeight | 1.2 | — | |
| ...col-0 > container > heading | marginBottom | 0 | — | |
| ...col-0 > container > heading | marginLeft | 0 | — | |
| ...col-0 > container > heading | marginRight | 0 | — | |
| ...col-0 > container > heading | marginTop | 0 | — | |
| ...col-0 > container > heading | paddingBottom | 0 | — | |
| ...col-0 > container > heading | paddingLeft | 0 | — | |
| ...col-0 > container > heading | paddingRight | 0 | — | |
| ...col-0 > container > heading | paddingTop | 0 | — | |
| ...col-0 > container > heading | textAlign | left | — | |
| ... > col-0 > container > text | color | #586069 | — | |
| ... > col-0 > container > text | display | block | — | |
| ... > col-0 > container > text | fontSize | 15px | — | |
| ... > col-0 > container > text | lineHeight | 1.8 | — | |
| ... > col-0 > container > text | marginBottom | 0 | — | |
| ... > col-0 > container > text | marginLeft | 0 | — | |
| ... > col-0 > container > text | marginRight | 0 | — | |
| ... > col-0 > container > text | marginTop | 16px | — | |
| ... > col-0 > container > text | paddingBottom | 0 | — | |
| ... > col-0 > container > text | paddingLeft | 0 | — | |
| ... > col-0 > container > text | paddingRight | 0 | — | |
| ... > col-0 > container > text | paddingTop | 16px | — | |
| ...> columns-2 > col-1 > image | display | block | — | |
| ...> columns-2 > col-1 > image | height | 100% | — | |
| ...> columns-2 > col-1 > image | marginBottom | 0 | — | |
| ...> columns-2 > col-1 > image | marginLeft | 0 | — | |
| ...> columns-2 > col-1 > image | marginRight | 0 | — | |
| ...> columns-2 > col-1 > image | marginTop | 0 | — | |
| ...> columns-2 > col-1 > image | minHeight | 300px | — | |
| ...> columns-2 > col-1 > image | objectFit | cover | — | |
| ...> columns-2 > col-1 > image | width | 100% | — | |

---

## Countdown Sale Banner (`countdown-sale`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| text | text | LIMITED TIME OFFER | |
| heading | text | Flash Sale - Up to 50% Off | |
| heading | level | h2 | |
| heading | tag | h2 | |
| countdown | targetDate | 2026-04-01T00:00:00 | |
| countdown | expiredMessage | Offer has ended! | |
| countdown | label | Sale ends in | |
| button | text | Shop the Sale | |
| button | href |  | |
| button | url |  | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | alignItems | center | — | |
| container | backgroundColor | #667eea | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 40px | xs:20px, sm:28px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 40px | xs:20px, sm:28px | |
| container | textAlign | center | — | |
| container | width | 100% | — | |
| container > text | color | #e1e4e8 | — | |
| container > text | display | block | — | |
| container > text | fontSize | 11px | — | |
| container > text | fontWeight | 700 | — | |
| container > text | letterSpacing | 3px | — | |
| container > text | lineHeight | 1 | — | |
| container > text | marginBottom | 0 | — | |
| container > text | marginLeft | 0 | — | |
| container > text | marginRight | 0 | — | |
| container > text | marginTop | 0 | — | |
| container > text | paddingBottom | 0 | — | |
| container > text | paddingLeft | 0 | — | |
| container > text | paddingRight | 0 | — | |
| container > text | paddingTop | 0 | — | |
| container > heading | color | #ffffff | — | |
| container > heading | display | block | — | |
| container > heading | fontSize | 32px | sm:24px, xs:20px | |
| container > heading | fontWeight | bold | — | |
| container > heading | lineHeight | 1.2 | — | |
| container > heading | marginBottom | 0 | — | |
| container > heading | marginLeft | 0 | — | |
| container > heading | marginRight | 0 | — | |
| container > heading | marginTop | 12px | — | |
| container > heading | paddingBottom | 0 | — | |
| container > heading | paddingLeft | 0 | — | |
| container > heading | paddingRight | 0 | — | |
| container > heading | paddingTop | 12px | — | |
| container > heading | textAlign | center | — | |
| container > countdown | digitColor | #ffffff | — | |
| container > countdown | digitFontSize | 36px | — | |
| container > countdown | labelColor | #cccccc | — | |
| container > countdown | labelFontSize | 12px | — | |
| container > countdown | marginBottom | 0 | — | |
| container > countdown | marginLeft | 0 | — | |
| container > countdown | marginRight | 0 | — | |
| container > countdown | marginTop | 20px | — | |
| container > countdown | separatorStyle | colon | — | |
| container > button | backgroundColor | #ffffff | — | |
| container > button | borderRadius | 6px | — | |
| container > button | borderStyle | none | — | |
| container > button | borderWidth | 0px | — | |
| container > button | color | #667eea | — | |
| container > button | cursor | pointer | — | |
| container > button | display | inline-block | — | |
| container > button | fontSize | 15px | — | |
| container > button | fontWeight | 700 | — | |
| container > button | marginBottom | 0 | — | |
| container > button | marginLeft | 0 | — | |
| container > button | marginRight | 0 | — | |
| container > button | marginTop | 24px | — | |
| container > button | paddingBottom | 14px | — | |
| container > button | paddingLeft | 40px | — | |
| container > button | paddingRight | 40px | — | |
| container > button | paddingTop | 14px | — | |

---

## Banner CTA (`cta-banner`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| heading | text | Ready to Get Started? | |
| heading | level | h2 | |
| heading | tag | h2 | |
| text | text | Join thousands of satisfied customers an... | |
| button | text | Start Free Trial | |
| button | href |  | |
| button | url |  | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | alignItems | center | — | |
| container | backgroundColor | #667eea | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 60px | xs:30px, sm:42px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 60px | xs:30px, sm:42px | |
| container | textAlign | center | — | |
| container | width | 100% | — | |
| container > heading | color | #ffffff | — | |
| container > heading | display | block | — | |
| container > heading | fontSize | 36px | sm:28px, xs:22px | |
| container > heading | fontWeight | bold | — | |
| container > heading | lineHeight | 1.2 | — | |
| container > heading | marginBottom | 0 | — | |
| container > heading | marginLeft | 0 | — | |
| container > heading | marginRight | 0 | — | |
| container > heading | marginTop | 0 | — | |
| container > heading | paddingBottom | 0 | — | |
| container > heading | paddingLeft | 0 | — | |
| container > heading | paddingRight | 0 | — | |
| container > heading | paddingTop | 0 | — | |
| container > heading | textAlign | center | — | |
| container > text | color | #e1e4e8 | — | |
| container > text | display | block | — | |
| container > text | fontSize | 18px | xs:14px | |
| container > text | lineHeight | 1.6 | — | |
| container > text | marginBottom | 0 | — | |
| container > text | marginLeft | 0 | — | |
| container > text | marginRight | 0 | — | |
| container > text | marginTop | 16px | — | |
| container > text | maxWidth | 500px | — | |
| container > text | paddingBottom | 0 | — | |
| container > text | paddingLeft | 0 | — | |
| container > text | paddingRight | 0 | — | |
| container > text | paddingTop | 16px | — | |
| container > text | textAlign | center | — | |
| container > button | backgroundColor | #ffffff | — | |
| container > button | borderRadius | 6px | — | |
| container > button | borderStyle | none | — | |
| container > button | borderWidth | 0px | — | |
| container > button | color | #667eea | — | |
| container > button | cursor | pointer | — | |
| container > button | display | inline-block | — | |
| container > button | fontSize | 16px | — | |
| container > button | fontWeight | 700 | — | |
| container > button | marginBottom | 0 | — | |
| container > button | marginLeft | 0 | — | |
| container > button | marginRight | 0 | — | |
| container > button | marginTop | 24px | — | |
| container > button | paddingBottom | 16px | — | |
| container > button | paddingLeft | 40px | — | |
| container > button | paddingRight | 40px | — | |
| container > button | paddingTop | 16px | — | |

---

## Minimal CTA (`cta-minimal`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| text | text | Ready to start building? | |
| button | text | Get Started | |
| button | href |  | |
| button | url |  | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | alignItems | center | — | |
| container | backgroundColor | #fafbfc | — | |
| container | borderBottom | 1px solid #eee | — | |
| container | borderStyle | none | — | |
| container | borderTop | 1px solid #eee | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | row | sm:column | |
| container | gap | 24px | — | |
| container | height | 100% | — | |
| container | justifyContent | center | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 40px | sm:28px, xs:20px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 40px | sm:28px, xs:20px | |
| container | textAlign | — | sm:center | |
| container | width | 100% | — | |
| container > text | color | #586069 | — | |
| container > text | display | block | — | |
| container > text | fontSize | 18px | xs:14px | |
| container > text | fontWeight | 500 | — | |
| container > text | lineHeight | 1 | — | |
| container > text | marginBottom | 0 | — | |
| container > text | marginLeft | 0 | — | |
| container > text | marginRight | 0 | — | |
| container > text | marginTop | 0 | — | |
| container > text | paddingBottom | 0 | — | |
| container > text | paddingLeft | 0 | — | |
| container > text | paddingRight | 0 | — | |
| container > text | paddingTop | 0 | — | |
| container > text | textAlign | center | — | |
| container > button | backgroundColor | #22c55e | — | |
| container > button | borderRadius | 4px | — | |
| container > button | borderStyle | none | — | |
| container > button | borderWidth | 0px | — | |
| container > button | color | #ffffff | — | |
| container > button | cursor | pointer | — | |
| container > button | display | inline-block | — | |
| container > button | fontSize | 14px | — | |
| container > button | fontWeight | 600 | — | |
| container > button | marginBottom | 0 | — | |
| container > button | marginLeft | 0 | — | |
| container > button | marginRight | 0 | — | |
| container > button | marginTop | 0 | — | |
| container > button | paddingBottom | 12px | — | |
| container > button | paddingLeft | 32px | — | |
| container > button | paddingRight | 32px | — | |
| container > button | paddingTop | 12px | — | |

---

## Split CTA (`cta-split`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| columns-2 | columns | 2 | |
| heading | text | Don't Miss Out | |
| heading | level | h2 | |
| heading | tag | h2 | |
| text | text | Sign up today and get exclusive access t... | |
| button | text | Sign Up Now | |
| button | href |  | |
| button | url |  | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | backgroundColor | #f6f8fa | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 0 | — | |
| container | paddingLeft | 0 | — | |
| container | paddingRight | 0 | — | |
| container | paddingTop | 0 | — | |
| container | width | 100% | — | |
| container > columns-2 | alignItems | stretch | — | |
| container > columns-2 | flexDirection | row | — | |
| container > columns-2 | gap | 24px | — | |
| container > columns-2 | justifyContent | flex-start | — | |
| ...lumns-2 > col-0 > container | alignItems | flex-start | — | |
| ...lumns-2 > col-0 > container | borderStyle | none | — | |
| ...lumns-2 > col-0 > container | borderWidth | 0px | — | |
| ...lumns-2 > col-0 > container | boxSizing | border-box | — | |
| ...lumns-2 > col-0 > container | display | flex | — | |
| ...lumns-2 > col-0 > container | flex | 1 | — | |
| ...lumns-2 > col-0 > container | flexDirection | column | — | |
| ...lumns-2 > col-0 > container | height | 100% | — | |
| ...lumns-2 > col-0 > container | justifyContent | center | — | |
| ...lumns-2 > col-0 > container | marginBottom | 0 | — | |
| ...lumns-2 > col-0 > container | marginLeft | 0 | — | |
| ...lumns-2 > col-0 > container | marginRight | 0 | — | |
| ...lumns-2 > col-0 > container | marginTop | 0 | — | |
| ...lumns-2 > col-0 > container | maxWidth | 100% | — | |
| ...lumns-2 > col-0 > container | overflow | hidden | — | |
| ...lumns-2 > col-0 > container | paddingBottom | 40px | xs:20px, sm:28px | |
| ...lumns-2 > col-0 > container | paddingLeft | 40px | xs:16px | |
| ...lumns-2 > col-0 > container | paddingRight | 40px | xs:16px | |
| ...lumns-2 > col-0 > container | paddingTop | 40px | xs:20px, sm:28px | |
| ...lumns-2 > col-0 > container | width | 100% | — | |
| ...col-0 > container > heading | color | #1a1a1a | — | |
| ...col-0 > container > heading | display | block | — | |
| ...col-0 > container > heading | fontSize | 32px | xs:20px, sm:24px | |
| ...col-0 > container > heading | fontWeight | bold | — | |
| ...col-0 > container > heading | lineHeight | 1.2 | — | |
| ...col-0 > container > heading | marginBottom | 0 | — | |
| ...col-0 > container > heading | marginLeft | 0 | — | |
| ...col-0 > container > heading | marginRight | 0 | — | |
| ...col-0 > container > heading | marginTop | 0 | — | |
| ...col-0 > container > heading | paddingBottom | 0 | — | |
| ...col-0 > container > heading | paddingLeft | 0 | — | |
| ...col-0 > container > heading | paddingRight | 0 | — | |
| ...col-0 > container > heading | paddingTop | 0 | — | |
| ...col-0 > container > heading | textAlign | left | — | |
| ... > col-0 > container > text | color | #586069 | — | |
| ... > col-0 > container > text | display | block | — | |
| ... > col-0 > container > text | fontSize | 16px | — | |
| ... > col-0 > container > text | lineHeight | 1.6 | — | |
| ... > col-0 > container > text | marginBottom | 0 | — | |
| ... > col-0 > container > text | marginLeft | 0 | — | |
| ... > col-0 > container > text | marginRight | 0 | — | |
| ... > col-0 > container > text | marginTop | 12px | — | |
| ... > col-0 > container > text | paddingBottom | 0 | — | |
| ... > col-0 > container > text | paddingLeft | 0 | — | |
| ... > col-0 > container > text | paddingRight | 0 | — | |
| ... > col-0 > container > text | paddingTop | 12px | — | |
| ... > col-0 > container > text | textAlign | left | — | |
| ...lumns-2 > col-1 > container | alignItems | center | — | |
| ...lumns-2 > col-1 > container | borderStyle | none | — | |
| ...lumns-2 > col-1 > container | borderWidth | 0px | — | |
| ...lumns-2 > col-1 > container | boxSizing | border-box | — | |
| ...lumns-2 > col-1 > container | display | flex | — | |
| ...lumns-2 > col-1 > container | flex | 1 | — | |
| ...lumns-2 > col-1 > container | flexDirection | column | — | |
| ...lumns-2 > col-1 > container | height | 100% | — | |
| ...lumns-2 > col-1 > container | justifyContent | center | — | |
| ...lumns-2 > col-1 > container | marginBottom | 0 | — | |
| ...lumns-2 > col-1 > container | marginLeft | 0 | — | |
| ...lumns-2 > col-1 > container | marginRight | 0 | — | |
| ...lumns-2 > col-1 > container | marginTop | 0 | — | |
| ...lumns-2 > col-1 > container | maxWidth | 100% | — | |
| ...lumns-2 > col-1 > container | overflow | hidden | — | |
| ...lumns-2 > col-1 > container | paddingBottom | 40px | xs:20px, sm:28px | |
| ...lumns-2 > col-1 > container | paddingLeft | 40px | xs:16px | |
| ...lumns-2 > col-1 > container | paddingRight | 40px | xs:16px | |
| ...lumns-2 > col-1 > container | paddingTop | 40px | xs:20px, sm:28px | |
| ...lumns-2 > col-1 > container | width | 100% | — | |
| ... col-1 > container > button | backgroundColor | #22c55e | — | |
| ... col-1 > container > button | borderRadius | 6px | — | |
| ... col-1 > container > button | borderStyle | none | — | |
| ... col-1 > container > button | borderWidth | 0px | — | |
| ... col-1 > container > button | color | #ffffff | — | |
| ... col-1 > container > button | cursor | pointer | — | |
| ... col-1 > container > button | display | inline-block | — | |
| ... col-1 > container > button | fontSize | 18px | xs:14px | |
| ... col-1 > container > button | fontWeight | 700 | — | |
| ... col-1 > container > button | marginBottom | 0 | — | |
| ... col-1 > container > button | marginLeft | 0 | — | |
| ... col-1 > container > button | marginRight | 0 | — | |
| ... col-1 > container > button | marginTop | 0 | — | |
| ... col-1 > container > button | paddingBottom | 16px | — | |
| ... col-1 > container > button | paddingLeft | 48px | xs:24px | |
| ... col-1 > container > button | paddingRight | 48px | xs:24px | |
| ... col-1 > container > button | paddingTop | 16px | — | |

---

## FAQ Section (`faq-accordion`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| columns-1 | columns | 1 | |
| heading | text | Frequently Asked Questions | |
| heading | level | h2 | |
| heading | tag | h2 | |
| columns-1 | columns | 1 | |
| accordion | itemCount | 4 | |
| accordion | panelTitle_1 | What is included in the free plan? | |
| accordion | panelContent_1 | The free plan includes all basic feature... | |
| accordion | panelTitle_2 | Can I upgrade at any time? | |
| accordion | panelContent_2 | Yes! You can upgrade or downgrade your p... | |
| accordion | panelTitle_3 | Do you offer refunds? | |
| accordion | panelContent_3 | We offer a 30-day money-back guarantee o... | |
| accordion | panelTitle_4 | How do I get support? | |
| accordion | panelContent_4 | Free users get community support. Paid u... | |
| accordion | items | [object Object],[object Object],[object Object],[object Object] | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | backgroundColor | #ffffff | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 60px | xs:30px, sm:42px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 60px | xs:30px, sm:42px | |
| container | width | 100% | — | |
| container > columns-1 | alignItems | stretch | — | |
| container > columns-1 | gap | 24px | — | |
| container > columns-1 | justifyContent | flex-start | — | |
| ...columns-1 > col-0 > heading | color | #1a1a1a | — | |
| ...columns-1 > col-0 > heading | display | block | — | |
| ...columns-1 > col-0 > heading | fontSize | 36px | xs:22px, sm:27px | |
| ...columns-1 > col-0 > heading | fontWeight | bold | — | |
| ...columns-1 > col-0 > heading | lineHeight | 1.2 | — | |
| ...columns-1 > col-0 > heading | marginBottom | 10px | — | |
| ...columns-1 > col-0 > heading | marginLeft | 0 | — | |
| ...columns-1 > col-0 > heading | marginRight | 0 | — | |
| ...columns-1 > col-0 > heading | marginTop | 0 | — | |
| ...columns-1 > col-0 > heading | paddingBottom | 0 | — | |
| ...columns-1 > col-0 > heading | paddingLeft | 0 | — | |
| ...columns-1 > col-0 > heading | paddingRight | 0 | — | |
| ...columns-1 > col-0 > heading | paddingTop | 0 | — | |
| ...columns-1 > col-0 > heading | textAlign | center | — | |
| container > columns-1 | alignItems | stretch | — | |
| container > columns-1 | gap | 24px | — | |
| container > columns-1 | justifyContent | flex-start | — | |
| ...lumns-1 > col-0 > accordion | width | 100% | — | |

---

## 3-Column Features (`features-3col`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| heading | text | Why Choose Us | |
| heading | level | h2 | |
| heading | tag | h2 | |
| columns-3 | columns | 3 | |
| icon | src | /icons/star-o.svg | |
| icon | alt | Feature 1 | |
| icon | iconCategory | icons | |
| icon | uploadedFileName | star-o.svg | |
| icon | size | 48px | |
| heading | text | Fast Performance | |
| heading | level | h3 | |
| heading | tag | h3 | |
| text | text | Lightning-fast load times that keep your... | |
| icon | src | /icons/star-o.svg | |
| icon | alt | Feature 2 | |
| icon | iconCategory | icons | |
| icon | uploadedFileName | star-o.svg | |
| icon | size | 48px | |
| heading | text | Easy to Use | |
| heading | level | h3 | |
| heading | tag | h3 | |
| text | text | Intuitive interface designed for everyon... | |
| icon | src | /icons/star-o.svg | |
| icon | alt | Feature 3 | |
| icon | iconCategory | icons | |
| icon | uploadedFileName | star-o.svg | |
| icon | size | 48px | |
| heading | text | Fully Responsive | |
| heading | level | h3 | |
| heading | tag | h3 | |
| text | text | Looks perfect on every device, from desk... | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | alignItems | center | — | |
| container | backgroundColor | #ffffff | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 60px | xs:30px, sm:42px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 60px | xs:30px, sm:42px | |
| container | width | 100% | — | |
| container > heading | color | #1a1a1a | — | |
| container > heading | display | block | — | |
| container > heading | fontSize | 36px | xs:22px, sm:27px | |
| container > heading | fontWeight | bold | — | |
| container > heading | lineHeight | 1.2 | — | |
| container > heading | marginBottom | 10px | — | |
| container > heading | marginLeft | 0 | — | |
| container > heading | marginRight | 0 | — | |
| container > heading | marginTop | 0 | — | |
| container > heading | paddingBottom | 0 | — | |
| container > heading | paddingLeft | 0 | — | |
| container > heading | paddingRight | 0 | — | |
| container > heading | paddingTop | 0 | — | |
| container > heading | textAlign | center | — | |
| container > columns-3 | alignItems | stretch | — | |
| container > columns-3 | flexDirection | row | — | |
| container > columns-3 | gap | 24px | — | |
| container > columns-3 | justifyContent | flex-start | — | |
| ... > columns-3 > col-0 > icon | display | inline-block | — | |
| ... > columns-3 > col-0 > icon | height | 48px | — | |
| ... > columns-3 > col-0 > icon | iconColor | #667eea | — | |
| ... > columns-3 > col-0 > icon | iconSize | 48px | — | |
| ... > columns-3 > col-0 > icon | marginBottom | 0 | — | |
| ... > columns-3 > col-0 > icon | marginLeft | auto | — | |
| ... > columns-3 > col-0 > icon | marginRight | auto | — | |
| ... > columns-3 > col-0 > icon | marginTop | 0 | — | |
| ... > columns-3 > col-0 > icon | width | 48px | — | |
| ...columns-3 > col-0 > heading | color | #1a1a1a | — | |
| ...columns-3 > col-0 > heading | display | block | — | |
| ...columns-3 > col-0 > heading | fontSize | 20px | — | |
| ...columns-3 > col-0 > heading | fontWeight | bold | — | |
| ...columns-3 > col-0 > heading | lineHeight | 1.2 | — | |
| ...columns-3 > col-0 > heading | marginBottom | 0 | — | |
| ...columns-3 > col-0 > heading | marginLeft | 0 | — | |
| ...columns-3 > col-0 > heading | marginRight | 0 | — | |
| ...columns-3 > col-0 > heading | marginTop | 16px | — | |
| ...columns-3 > col-0 > heading | paddingBottom | 0 | — | |
| ...columns-3 > col-0 > heading | paddingLeft | 0 | — | |
| ...columns-3 > col-0 > heading | paddingRight | 0 | — | |
| ...columns-3 > col-0 > heading | paddingTop | 16px | — | |
| ...columns-3 > col-0 > heading | textAlign | center | — | |
| ... > columns-3 > col-0 > text | color | #586069 | — | |
| ... > columns-3 > col-0 > text | display | block | — | |
| ... > columns-3 > col-0 > text | fontSize | 14px | — | |
| ... > columns-3 > col-0 > text | lineHeight | 1.6 | — | |
| ... > columns-3 > col-0 > text | marginBottom | 0 | — | |
| ... > columns-3 > col-0 > text | marginLeft | 0 | — | |
| ... > columns-3 > col-0 > text | marginRight | 0 | — | |
| ... > columns-3 > col-0 > text | marginTop | 8px | — | |
| ... > columns-3 > col-0 > text | paddingBottom | 0 | — | |
| ... > columns-3 > col-0 > text | paddingLeft | 0 | — | |
| ... > columns-3 > col-0 > text | paddingRight | 0 | — | |
| ... > columns-3 > col-0 > text | paddingTop | 8px | — | |
| ... > columns-3 > col-0 > text | textAlign | center | — | |
| ... > columns-3 > col-1 > icon | display | inline-block | — | |
| ... > columns-3 > col-1 > icon | height | 48px | — | |
| ... > columns-3 > col-1 > icon | iconColor | #667eea | — | |
| ... > columns-3 > col-1 > icon | iconSize | 48px | — | |
| ... > columns-3 > col-1 > icon | marginBottom | 0 | — | |
| ... > columns-3 > col-1 > icon | marginLeft | auto | — | |
| ... > columns-3 > col-1 > icon | marginRight | auto | — | |
| ... > columns-3 > col-1 > icon | marginTop | 0 | — | |
| ... > columns-3 > col-1 > icon | width | 48px | — | |
| ...columns-3 > col-1 > heading | color | #1a1a1a | — | |
| ...columns-3 > col-1 > heading | display | block | — | |
| ...columns-3 > col-1 > heading | fontSize | 20px | — | |
| ...columns-3 > col-1 > heading | fontWeight | bold | — | |
| ...columns-3 > col-1 > heading | lineHeight | 1.2 | — | |
| ...columns-3 > col-1 > heading | marginBottom | 0 | — | |
| ...columns-3 > col-1 > heading | marginLeft | 0 | — | |
| ...columns-3 > col-1 > heading | marginRight | 0 | — | |
| ...columns-3 > col-1 > heading | marginTop | 16px | — | |
| ...columns-3 > col-1 > heading | paddingBottom | 0 | — | |
| ...columns-3 > col-1 > heading | paddingLeft | 0 | — | |
| ...columns-3 > col-1 > heading | paddingRight | 0 | — | |
| ...columns-3 > col-1 > heading | paddingTop | 16px | — | |
| ...columns-3 > col-1 > heading | textAlign | center | — | |
| ... > columns-3 > col-1 > text | color | #586069 | — | |
| ... > columns-3 > col-1 > text | display | block | — | |
| ... > columns-3 > col-1 > text | fontSize | 14px | — | |
| ... > columns-3 > col-1 > text | lineHeight | 1.6 | — | |
| ... > columns-3 > col-1 > text | marginBottom | 0 | — | |
| ... > columns-3 > col-1 > text | marginLeft | 0 | — | |
| ... > columns-3 > col-1 > text | marginRight | 0 | — | |
| ... > columns-3 > col-1 > text | marginTop | 8px | — | |
| ... > columns-3 > col-1 > text | paddingBottom | 0 | — | |
| ... > columns-3 > col-1 > text | paddingLeft | 0 | — | |
| ... > columns-3 > col-1 > text | paddingRight | 0 | — | |
| ... > columns-3 > col-1 > text | paddingTop | 8px | — | |
| ... > columns-3 > col-1 > text | textAlign | center | — | |
| ... > columns-3 > col-2 > icon | display | inline-block | — | |
| ... > columns-3 > col-2 > icon | height | 48px | — | |
| ... > columns-3 > col-2 > icon | iconColor | #667eea | — | |
| ... > columns-3 > col-2 > icon | iconSize | 48px | — | |
| ... > columns-3 > col-2 > icon | marginBottom | 0 | — | |
| ... > columns-3 > col-2 > icon | marginLeft | auto | — | |
| ... > columns-3 > col-2 > icon | marginRight | auto | — | |
| ... > columns-3 > col-2 > icon | marginTop | 0 | — | |
| ... > columns-3 > col-2 > icon | width | 48px | — | |
| ...columns-3 > col-2 > heading | color | #1a1a1a | — | |
| ...columns-3 > col-2 > heading | display | block | — | |
| ...columns-3 > col-2 > heading | fontSize | 20px | — | |
| ...columns-3 > col-2 > heading | fontWeight | bold | — | |
| ...columns-3 > col-2 > heading | lineHeight | 1.2 | — | |
| ...columns-3 > col-2 > heading | marginBottom | 0 | — | |
| ...columns-3 > col-2 > heading | marginLeft | 0 | — | |
| ...columns-3 > col-2 > heading | marginRight | 0 | — | |
| ...columns-3 > col-2 > heading | marginTop | 16px | — | |
| ...columns-3 > col-2 > heading | paddingBottom | 0 | — | |
| ...columns-3 > col-2 > heading | paddingLeft | 0 | — | |
| ...columns-3 > col-2 > heading | paddingRight | 0 | — | |
| ...columns-3 > col-2 > heading | paddingTop | 16px | — | |
| ...columns-3 > col-2 > heading | textAlign | center | — | |
| ... > columns-3 > col-2 > text | color | #586069 | — | |
| ... > columns-3 > col-2 > text | display | block | — | |
| ... > columns-3 > col-2 > text | fontSize | 14px | — | |
| ... > columns-3 > col-2 > text | lineHeight | 1.6 | — | |
| ... > columns-3 > col-2 > text | marginBottom | 0 | — | |
| ... > columns-3 > col-2 > text | marginLeft | 0 | — | |
| ... > columns-3 > col-2 > text | marginRight | 0 | — | |
| ... > columns-3 > col-2 > text | marginTop | 8px | — | |
| ... > columns-3 > col-2 > text | paddingBottom | 0 | — | |
| ... > columns-3 > col-2 > text | paddingLeft | 0 | — | |
| ... > columns-3 > col-2 > text | paddingRight | 0 | — | |
| ... > columns-3 > col-2 > text | paddingTop | 8px | — | |
| ... > columns-3 > col-2 > text | textAlign | center | — | |

**Column Styles:**

| Element | Column | Property | Value | E/H |
|---------|--------|----------|-------|-----|
| columns-3 | 0 | alignItems | center | |
| columns-3 | 1 | alignItems | center | |
| columns-3 | 2 | alignItems | center | |

---

## Alternating Feature Rows (`features-alternating`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| columns-2 | columns | 2 | |
| image | src | /images/placeholder.jpg | |
| image | alt | Feature image | |
| image | settingId | image | |
| heading | text | Feature One | |
| heading | level | h3 | |
| heading | tag | h3 | |
| text | text | Explain this feature in detail. What pro... | |
| columns-2 | columns | 2 | |
| heading | text | Feature Two | |
| heading | level | h3 | |
| heading | tag | h3 | |
| text | text | Describe the second feature. Paint a pic... | |
| image | src | /images/placeholder.jpg | |
| image | alt | Feature image | |
| image | settingId | image | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | backgroundColor | #ffffff | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | gap | 40px | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 60px | xs:30px, sm:42px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 60px | xs:30px, sm:42px | |
| container | width | 100% | — | |
| container > columns-2 | alignItems | stretch | — | |
| container > columns-2 | flexDirection | row | — | |
| container > columns-2 | gap | 24px | — | |
| container > columns-2 | justifyContent | flex-start | — | |
| ...> columns-2 > col-0 > image | borderRadius | 8px | — | |
| ...> columns-2 > col-0 > image | display | block | — | |
| ...> columns-2 > col-0 > image | height | 300px | — | |
| ...> columns-2 > col-0 > image | marginBottom | 0 | — | |
| ...> columns-2 > col-0 > image | marginLeft | 0 | — | |
| ...> columns-2 > col-0 > image | marginRight | 0 | — | |
| ...> columns-2 > col-0 > image | marginTop | 0 | — | |
| ...> columns-2 > col-0 > image | objectFit | cover | — | |
| ...> columns-2 > col-0 > image | width | 100% | — | |
| ...columns-2 > col-1 > heading | color | #1a1a1a | — | |
| ...columns-2 > col-1 > heading | display | block | — | |
| ...columns-2 > col-1 > heading | fontSize | 28px | xs:20px, sm:22px | |
| ...columns-2 > col-1 > heading | fontWeight | bold | — | |
| ...columns-2 > col-1 > heading | lineHeight | 1.2 | — | |
| ...columns-2 > col-1 > heading | marginBottom | 0 | — | |
| ...columns-2 > col-1 > heading | marginLeft | 0 | — | |
| ...columns-2 > col-1 > heading | marginRight | 0 | — | |
| ...columns-2 > col-1 > heading | marginTop | 0 | — | |
| ...columns-2 > col-1 > heading | paddingBottom | 0 | — | |
| ...columns-2 > col-1 > heading | paddingLeft | 0 | — | |
| ...columns-2 > col-1 > heading | paddingRight | 0 | — | |
| ...columns-2 > col-1 > heading | paddingTop | 0 | — | |
| ...columns-2 > col-1 > heading | textAlign | left | — | |
| ... > columns-2 > col-1 > text | color | #586069 | — | |
| ... > columns-2 > col-1 > text | display | block | — | |
| ... > columns-2 > col-1 > text | fontSize | 15px | — | |
| ... > columns-2 > col-1 > text | lineHeight | 1.6 | — | |
| ... > columns-2 > col-1 > text | marginBottom | 0 | — | |
| ... > columns-2 > col-1 > text | marginLeft | 0 | — | |
| ... > columns-2 > col-1 > text | marginRight | 0 | — | |
| ... > columns-2 > col-1 > text | marginTop | 12px | — | |
| ... > columns-2 > col-1 > text | paddingBottom | 0 | — | |
| ... > columns-2 > col-1 > text | paddingLeft | 0 | — | |
| ... > columns-2 > col-1 > text | paddingRight | 0 | — | |
| ... > columns-2 > col-1 > text | paddingTop | 12px | — | |
| ... > columns-2 > col-1 > text | textAlign | left | — | |
| container > columns-2 | alignItems | stretch | — | |
| container > columns-2 | flexDirection | row | — | |
| container > columns-2 | gap | 24px | — | |
| container > columns-2 | justifyContent | flex-start | — | |
| ...columns-2 > col-0 > heading | color | #1a1a1a | — | |
| ...columns-2 > col-0 > heading | display | block | — | |
| ...columns-2 > col-0 > heading | fontSize | 28px | xs:20px, sm:22px | |
| ...columns-2 > col-0 > heading | fontWeight | bold | — | |
| ...columns-2 > col-0 > heading | lineHeight | 1.2 | — | |
| ...columns-2 > col-0 > heading | marginBottom | 0 | — | |
| ...columns-2 > col-0 > heading | marginLeft | 0 | — | |
| ...columns-2 > col-0 > heading | marginRight | 0 | — | |
| ...columns-2 > col-0 > heading | marginTop | 0 | — | |
| ...columns-2 > col-0 > heading | paddingBottom | 0 | — | |
| ...columns-2 > col-0 > heading | paddingLeft | 0 | — | |
| ...columns-2 > col-0 > heading | paddingRight | 0 | — | |
| ...columns-2 > col-0 > heading | paddingTop | 0 | — | |
| ...columns-2 > col-0 > heading | textAlign | left | — | |
| ... > columns-2 > col-0 > text | color | #586069 | — | |
| ... > columns-2 > col-0 > text | display | block | — | |
| ... > columns-2 > col-0 > text | fontSize | 15px | — | |
| ... > columns-2 > col-0 > text | lineHeight | 1.6 | — | |
| ... > columns-2 > col-0 > text | marginBottom | 0 | — | |
| ... > columns-2 > col-0 > text | marginLeft | 0 | — | |
| ... > columns-2 > col-0 > text | marginRight | 0 | — | |
| ... > columns-2 > col-0 > text | marginTop | 12px | — | |
| ... > columns-2 > col-0 > text | paddingBottom | 0 | — | |
| ... > columns-2 > col-0 > text | paddingLeft | 0 | — | |
| ... > columns-2 > col-0 > text | paddingRight | 0 | — | |
| ... > columns-2 > col-0 > text | paddingTop | 12px | — | |
| ... > columns-2 > col-0 > text | textAlign | left | — | |
| ...> columns-2 > col-1 > image | borderRadius | 8px | — | |
| ...> columns-2 > col-1 > image | display | block | — | |
| ...> columns-2 > col-1 > image | height | 300px | — | |
| ...> columns-2 > col-1 > image | marginBottom | 0 | — | |
| ...> columns-2 > col-1 > image | marginLeft | 0 | — | |
| ...> columns-2 > col-1 > image | marginRight | 0 | — | |
| ...> columns-2 > col-1 > image | marginTop | 0 | — | |
| ...> columns-2 > col-1 > image | objectFit | cover | — | |
| ...> columns-2 > col-1 > image | width | 100% | — | |

**Column Styles:**

| Element | Column | Property | Value | E/H |
|---------|--------|----------|-------|-----|
| columns-2 | 1 | justifyContent | center | |
| columns-2 | 1 | paddingTop | 20px | |
| columns-2 | 1 | paddingBottom | 20px | |
| columns-2 | 1 | paddingLeft | 20px | |
| columns-2 | 1 | paddingRight | 20px | |
| columns-2 | 0 | justifyContent | center | |
| columns-2 | 0 | paddingTop | 20px | |
| columns-2 | 0 | paddingBottom | 20px | |
| columns-2 | 0 | paddingLeft | 20px | |
| columns-2 | 0 | paddingRight | 20px | |

---

## Centered Hero (`hero-centered`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| heading | text | Your Bold Headline Here | |
| heading | level | h1 | |
| heading | tag | h1 | |
| text | text | A compelling subtitle that supports your... | |
| button | text | Get Started | |
| button | href |  | |
| button | url |  | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | alignItems | center | — | |
| container | backgroundColor | #1a1a1a | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | justifyContent | center | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 80px | xs:40px, sm:56px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 80px | xs:40px, sm:56px | |
| container | textAlign | center | — | |
| container | width | 100% | — | |
| container > heading | color | #ffffff | — | |
| container > heading | display | block | — | |
| container > heading | fontSize | 48px | sm:36px, xs:28px | |
| container > heading | fontWeight | bold | — | |
| container > heading | lineHeight | 1.2 | — | |
| container > heading | marginBottom | 0 | — | |
| container > heading | marginLeft | 0 | — | |
| container > heading | marginRight | 0 | — | |
| container > heading | marginTop | 0 | — | |
| container > heading | paddingBottom | 0 | — | |
| container > heading | paddingLeft | 0 | — | |
| container > heading | paddingRight | 0 | — | |
| container > heading | paddingTop | 0 | — | |
| container > heading | textAlign | center | — | |
| container > text | color | #e1e4e8 | — | |
| container > text | display | block | — | |
| container > text | fontSize | 18px | sm:16px, xs:14px | |
| container > text | lineHeight | 1.6 | — | |
| container > text | marginBottom | 0 | — | |
| container > text | marginLeft | 0 | — | |
| container > text | marginRight | 0 | — | |
| container > text | marginTop | 20px | — | |
| container > text | maxWidth | 600px | — | |
| container > text | paddingBottom | 0 | — | |
| container > text | paddingLeft | 0 | — | |
| container > text | paddingRight | 0 | — | |
| container > text | paddingTop | 20px | — | |
| container > text | textAlign | center | — | |
| container > button | backgroundColor | #667eea | — | |
| container > button | borderRadius | 6px | — | |
| container > button | borderStyle | none | — | |
| container > button | borderWidth | 0px | — | |
| container > button | color | #ffffff | — | |
| container > button | cursor | pointer | — | |
| container > button | display | inline-block | — | |
| container > button | fontSize | 16px | — | |
| container > button | fontWeight | 600 | — | |
| container > button | marginBottom | 0 | — | |
| container > button | marginLeft | 0 | — | |
| container > button | marginRight | 0 | — | |
| container > button | marginTop | 20px | — | |
| container > button | paddingBottom | 16px | — | |
| container > button | paddingLeft | 40px | — | |
| container > button | paddingRight | 40px | — | |
| container > button | paddingTop | 16px | — | |

---

## Image Background Hero (`hero-image-bg`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| image-background | src | /images/placeholder.jpg | |
| image-background | alt |  | |
| image-background | settingId | background_image | |
| image-background | minHeight | 500px | |
| image-background | backgroundSize | cover | |
| image-background | backgroundPosition | center | |
| image-background | backgroundRepeat | no-repeat | |
| heading | text | Immersive Experience | |
| heading | level | h1 | |
| heading | tag | h1 | |
| text | text | Create stunning visual experiences that ... | |
| button | text | Explore | |
| button | href |  | |
| button | url |  | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| image-background | alignItems | center | — | |
| image-background | backgroundColor | #1a1a1a | — | |
| image-background | backgroundPosition | center center | — | |
| image-background | backgroundRepeat | no-repeat | — | |
| image-background | backgroundSize | cover | — | |
| image-background | borderStyle | none | — | |
| image-background | borderWidth | 0px | — | |
| image-background | display | flex | — | |
| image-background | justifyContent | center | — | |
| image-background | marginBottom | 0 | — | |
| image-background | marginLeft | 0 | — | |
| image-background | marginRight | 0 | — | |
| image-background | marginTop | 0 | — | |
| image-background | minHeight | 500px | — | |
| image-background | overflow | hidden | — | |
| image-background | paddingBottom | 80px | — | |
| image-background | paddingLeft | 20px | — | |
| image-background | paddingRight | 20px | — | |
| image-background | paddingTop | 80px | — | |
| image-background | position | relative | — | |
| image-background > container | alignItems | center | — | |
| image-background > container | backgroundColor | #333333 | — | |
| image-background > container | borderStyle | none | — | |
| image-background > container | borderWidth | 0px | — | |
| image-background > container | boxSizing | border-box | — | |
| image-background > container | display | flex | — | |
| image-background > container | flex | 1 | — | |
| image-background > container | flexDirection | column | — | |
| image-background > container | height | 100% | — | |
| image-background > container | justifyContent | center | — | |
| image-background > container | marginBottom | 0 | — | |
| image-background > container | marginLeft | 0 | — | |
| image-background > container | marginRight | 0 | — | |
| image-background > container | marginTop | 0 | — | |
| image-background > container | maxWidth | 100% | — | |
| image-background > container | overflow | visible | — | |
| image-background > container | paddingBottom | 0 | — | |
| image-background > container | paddingLeft | 0 | — | |
| image-background > container | paddingRight | 0 | — | |
| image-background > container | paddingTop | 0 | — | |
| image-background > container | width | 100% | — | |
| ...round > container > heading | color | #ffffff | — | |
| ...round > container > heading | display | block | — | |
| ...round > container > heading | fontSize | 52px | sm:36px, xs:28px | |
| ...round > container > heading | fontWeight | bold | — | |
| ...round > container > heading | lineHeight | 1.2 | — | |
| ...round > container > heading | marginBottom | 0 | — | |
| ...round > container > heading | marginLeft | 0 | — | |
| ...round > container > heading | marginRight | 0 | — | |
| ...round > container > heading | marginTop | 0 | — | |
| ...round > container > heading | paddingBottom | 0 | — | |
| ...round > container > heading | paddingLeft | 0 | — | |
| ...round > container > heading | paddingRight | 0 | — | |
| ...round > container > heading | paddingTop | 0 | — | |
| ...round > container > heading | textAlign | center | — | |
| ...ckground > container > text | color | #e1e4e8 | — | |
| ...ckground > container > text | display | block | — | |
| ...ckground > container > text | fontSize | 18px | xs:14px | |
| ...ckground > container > text | lineHeight | 1.6 | — | |
| ...ckground > container > text | marginBottom | 0 | — | |
| ...ckground > container > text | marginLeft | 0 | — | |
| ...ckground > container > text | marginRight | 0 | — | |
| ...ckground > container > text | marginTop | 16px | — | |
| ...ckground > container > text | paddingBottom | 0 | — | |
| ...ckground > container > text | paddingLeft | 0 | — | |
| ...ckground > container > text | paddingRight | 0 | — | |
| ...ckground > container > text | paddingTop | 0 | — | |
| ...ckground > container > text | textAlign | center | — | |
| ...ground > container > button | backgroundColor | #667eea | — | |
| ...ground > container > button | borderColor | rgba(255,255,255,0.3) | — | |
| ...ground > container > button | borderRadius | 6px | — | |
| ...ground > container > button | borderStyle | solid | — | |
| ...ground > container > button | borderWidth | 2px | — | |
| ...ground > container > button | color | #ffffff | — | |
| ...ground > container > button | cursor | pointer | — | |
| ...ground > container > button | display | inline-block | — | |
| ...ground > container > button | fontSize | 16px | — | |
| ...ground > container > button | fontWeight | 600 | — | |
| ...ground > container > button | marginTop | 30px | — | |
| ...ground > container > button | paddingBottom | 16px | — | |
| ...ground > container > button | paddingLeft | 40px | — | |
| ...ground > container > button | paddingRight | 40px | — | |
| ...ground > container > button | paddingTop | 16px | — | |

---

## Split Hero (`hero-split`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| columns-2 | columns | 2 | H |
| heading | text | Build Something Amazing | E |
| heading | level | h1 | H |
| heading | tag | h1 | H |
| text | text | Describe your product or service with a ... | E |
| button | text | Learn More | E |
| button | href |  | H |
| button | url |  | H |
| image | src | /images/placeholder.jpg | E |
| image | alt | Hero image | E |
| image | settingId | image | H |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | backgroundColor | #ffffff | — | H |
| container | borderStyle | none | — | H |
| container | borderWidth | 0px | — | H |
| container | boxSizing | border-box | — | H |
| container | display | flex | — | H |
| container | flex | 1 | — | H |
| container | flexDirection | column | — | H |
| container | height | 100% | — | H |
| container | marginBottom | 0 | — | H |
| container | marginLeft | 0 | — | H |
| container | marginRight | 0 | — | H |
| container | marginTop | 0 | — | H |
| container | maxWidth | 100% | — | H |
| container | overflow | hidden | — | H |
| container | paddingBottom | 0 | — | E |
| container | paddingLeft | 0 | — | H |
| container | paddingRight | 0 | — | H |
| container | paddingTop | 0 | — | E |
| container | width | 100% | — | H |
| columns-2 | alignItems | stretch | — | H |
| columns-2 | flexDirection | row | — | H |
| columns-2 | gap | 24px | — | H |
| columns-2 | justifyContent | flex-start | — | H |
| col-0 | alignItems | flex-start | — | E |
| col-0 | backgroundColor | — | — | E |
| col-0 | flexDirection | column | — | H |
| col-0 | justifyContent | center | — | H |
| col-0 | paddingBottom | 60px | xs:30px, sm:42px | H |
| col-0 | paddingLeft | 40px | xs:16px | H |
| col-0 | paddingRight | 40px | xs:16px | H |
| col-0 | paddingTop | 60px | xs:30px, sm:42px | H |
| col-0 > heading | color | #1a1a1a | — | E |
| col-0 > heading | display | block | — | H |
| col-0 > heading | fontSize | 42px | sm:32px, xs:25px | E |
| col-0 > heading | fontWeight | bold | — | E |
| col-0 > heading | lineHeight | 1.2 | — | H |
| col-0 > heading | marginBottom | 0 | — | H |
| col-0 > heading | marginLeft | 0 | — | H |
| col-0 > heading | marginRight | 0 | — | H |
| col-0 > heading | marginTop | 0 | — | H |
| col-0 > heading | paddingBottom | 0 | — | H |
| col-0 > heading | paddingLeft | 0 | — | H |
| col-0 > heading | paddingRight | 0 | — | H |
| col-0 > heading | paddingTop | 0 | — | H |
| col-0 > heading | textAlign | left | — | H |
| col-0 > text | color | #586069 | — | E |
| col-0 > text | display | block | — | H |
| col-0 > text | fontSize | 16px | — | E |
| col-0 > text | lineHeight | 1.6 | — | H |
| col-0 > text | marginBottom | 0 | — | H |
| col-0 > text | marginLeft | 0 | — | H |
| col-0 > text | marginRight | 0 | — | H |
| col-0 > text | marginTop | 20px | — | H |
| col-0 > text | paddingBottom | 0 | — | H |
| col-0 > text | paddingLeft | 0 | — | H |
| col-0 > text | paddingRight | 0 | — | H |
| col-0 > text | paddingTop | 20px | — | H |
| col-0 > text | textAlign | left | — | H |
| col-0 > button | backgroundColor | #667eea | — | E |
| col-0 > button | borderRadius | 6px | — | H |
| col-0 > button | borderStyle | solid | — | H |
| col-0 > button | borderWidth | 1px | — | H |
| col-0 > button | color | #ffffff | — | E |
| col-0 > button | cursor | pointer | — | H |
| col-0 > button | display | inline-block | — | H |
| col-0 > button | fontSize | 15px | — | E |
| col-0 > button | fontWeight | 600 | — | E |
| col-0 > button | marginBottom | 0 | — | H |
| col-0 > button | marginLeft | 0 | — | E |
| col-0 > button | marginRight | 0 | — | H |
| col-0 > button | marginTop | 24px | — | H |
| col-0 > button | paddingBottom | 14px | — | H |
| col-0 > button | paddingLeft | 32px | — | H |
| col-0 > button | paddingRight | 32px | — | H |
| col-0 > button | paddingTop | 14px | — | H |
| col-1 > image | display | block | — | H |
| col-1 > image | height | 100% | — | H |
| col-1 > image | marginBottom | 0 | — | H |
| col-1 > image | marginLeft | 0 | — | H |
| col-1 > image | marginRight | 0 | — | H |
| col-1 > image | marginTop | 0 | — | H |
| col-1 > image | objectFit | cover | — | H |
| col-1 > image | width | 100% | — | H |

---

## Image Gallery / Lookbook (`image-gallery`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| heading | text | The Lookbook | |
| heading | level | h2 | |
| heading | tag | h2 | |
| columns-3 | columns | 3 | |
| image | src | /images/placeholder.jpg | |
| image | alt | Gallery 1 | |
| image | settingId | image | |
| image | src | /images/placeholder.jpg | |
| image | alt | Gallery 2 | |
| image | settingId | image_2 | |
| image | src | /images/placeholder.jpg | |
| image | alt | Gallery 3 | |
| image | settingId | image_3 | |
| image | src | /images/placeholder.jpg | |
| image | alt | Gallery 4 | |
| image | settingId | image_4 | |
| image | src | /images/placeholder.jpg | |
| image | alt | Gallery 5 | |
| image | settingId | image_5 | |
| image | src | /images/placeholder.jpg | |
| image | alt | Gallery 6 | |
| image | settingId | image_6 | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | alignItems | center | — | |
| container | backgroundColor | #ffffff | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 60px | xs:30px, sm:42px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 60px | xs:30px, sm:42px | |
| container | width | 100% | — | |
| container > heading | color | #1a1a1a | — | |
| container > heading | display | block | — | |
| container > heading | fontSize | 36px | xs:22px, sm:27px | |
| container > heading | fontWeight | bold | — | |
| container > heading | lineHeight | 1.2 | — | |
| container > heading | marginBottom | 10px | — | |
| container > heading | marginLeft | 0 | — | |
| container > heading | marginRight | 0 | — | |
| container > heading | marginTop | 0 | — | |
| container > heading | paddingBottom | 0 | — | |
| container > heading | paddingLeft | 0 | — | |
| container > heading | paddingRight | 0 | — | |
| container > heading | paddingTop | 0 | — | |
| container > heading | textAlign | center | — | |
| container > columns-3 | alignItems | stretch | — | |
| container > columns-3 | flexDirection | row | — | |
| container > columns-3 | gap | 24px | — | |
| container > columns-3 | justifyContent | flex-start | — | |
| ...> columns-3 > col-0 > image | borderRadius | 4px | — | |
| ...> columns-3 > col-0 > image | display | block | — | |
| ...> columns-3 > col-0 > image | height | 300px | — | |
| ...> columns-3 > col-0 > image | marginBottom | 0 | — | |
| ...> columns-3 > col-0 > image | marginLeft | 0 | — | |
| ...> columns-3 > col-0 > image | marginRight | 0 | — | |
| ...> columns-3 > col-0 > image | marginTop | 0 | — | |
| ...> columns-3 > col-0 > image | objectFit | cover | — | |
| ...> columns-3 > col-0 > image | width | 100% | — | |
| ...> columns-3 > col-0 > image | borderRadius | 4px | — | |
| ...> columns-3 > col-0 > image | display | block | — | |
| ...> columns-3 > col-0 > image | height | 200px | — | |
| ...> columns-3 > col-0 > image | marginBottom | 0 | — | |
| ...> columns-3 > col-0 > image | marginLeft | 0 | — | |
| ...> columns-3 > col-0 > image | marginRight | 0 | — | |
| ...> columns-3 > col-0 > image | marginTop | 8px | — | |
| ...> columns-3 > col-0 > image | objectFit | cover | — | |
| ...> columns-3 > col-0 > image | width | 100% | — | |
| ...> columns-3 > col-1 > image | borderRadius | 4px | — | |
| ...> columns-3 > col-1 > image | display | block | — | |
| ...> columns-3 > col-1 > image | height | 200px | — | |
| ...> columns-3 > col-1 > image | marginBottom | 0 | — | |
| ...> columns-3 > col-1 > image | marginLeft | 0 | — | |
| ...> columns-3 > col-1 > image | marginRight | 0 | — | |
| ...> columns-3 > col-1 > image | marginTop | 0 | — | |
| ...> columns-3 > col-1 > image | objectFit | cover | — | |
| ...> columns-3 > col-1 > image | width | 100% | — | |
| ...> columns-3 > col-1 > image | borderRadius | 4px | — | |
| ...> columns-3 > col-1 > image | display | block | — | |
| ...> columns-3 > col-1 > image | height | 300px | — | |
| ...> columns-3 > col-1 > image | marginBottom | 0 | — | |
| ...> columns-3 > col-1 > image | marginLeft | 0 | — | |
| ...> columns-3 > col-1 > image | marginRight | 0 | — | |
| ...> columns-3 > col-1 > image | marginTop | 8px | — | |
| ...> columns-3 > col-1 > image | objectFit | cover | — | |
| ...> columns-3 > col-1 > image | width | 100% | — | |
| ...> columns-3 > col-2 > image | borderRadius | 4px | — | |
| ...> columns-3 > col-2 > image | display | block | — | |
| ...> columns-3 > col-2 > image | height | 300px | — | |
| ...> columns-3 > col-2 > image | marginBottom | 0 | — | |
| ...> columns-3 > col-2 > image | marginLeft | 0 | — | |
| ...> columns-3 > col-2 > image | marginRight | 0 | — | |
| ...> columns-3 > col-2 > image | marginTop | 0 | — | |
| ...> columns-3 > col-2 > image | objectFit | cover | — | |
| ...> columns-3 > col-2 > image | width | 100% | — | |
| ...> columns-3 > col-2 > image | borderRadius | 4px | — | |
| ...> columns-3 > col-2 > image | display | block | — | |
| ...> columns-3 > col-2 > image | height | 200px | — | |
| ...> columns-3 > col-2 > image | marginBottom | 0 | — | |
| ...> columns-3 > col-2 > image | marginLeft | 0 | — | |
| ...> columns-3 > col-2 > image | marginRight | 0 | — | |
| ...> columns-3 > col-2 > image | marginTop | 8px | — | |
| ...> columns-3 > col-2 > image | objectFit | cover | — | |
| ...> columns-3 > col-2 > image | width | 100% | — | |

---

## Instagram / UGC Feed (`instagram-feed`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| text | text | #YOURBRAND | |
| heading | text | Share Your Style | |
| heading | level | h2 | |
| heading | tag | h2 | |
| columns-6 | columns | 6 | |
| image | src | /images/placeholder.jpg | |
| image | alt | UGC 1 | |
| image | settingId | image | |
| image | src | /images/placeholder.jpg | |
| image | alt | UGC 2 | |
| image | settingId | image_2 | |
| image | src | /images/placeholder.jpg | |
| image | alt | UGC 3 | |
| image | settingId | image_3 | |
| image | src | /images/placeholder.jpg | |
| image | alt | UGC 4 | |
| image | settingId | image_4 | |
| image | src | /images/placeholder.jpg | |
| image | alt | UGC 5 | |
| image | settingId | image_5 | |
| image | src | /images/placeholder.jpg | |
| image | alt | UGC 6 | |
| image | settingId | image_6 | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | alignItems | center | — | |
| container | backgroundColor | #fafbfc | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 60px | xs:30px, sm:42px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 60px | xs:30px, sm:42px | |
| container | width | 100% | — | |
| container > text | color | #6a737d | — | |
| container > text | display | block | — | |
| container > text | fontSize | 12px | — | |
| container > text | fontWeight | 600 | — | |
| container > text | letterSpacing | 2px | — | |
| container > text | lineHeight | 1 | — | |
| container > text | marginBottom | 0 | — | |
| container > text | marginLeft | 0 | — | |
| container > text | marginRight | 0 | — | |
| container > text | marginTop | 0 | — | |
| container > text | paddingBottom | 0 | — | |
| container > text | paddingLeft | 0 | — | |
| container > text | paddingRight | 0 | — | |
| container > text | paddingTop | 0 | — | |
| container > text | textAlign | center | — | |
| container > heading | color | #1a1a1a | — | |
| container > heading | display | block | — | |
| container > heading | fontSize | 32px | xs:20px, sm:24px | |
| container > heading | fontWeight | bold | — | |
| container > heading | lineHeight | 1.2 | — | |
| container > heading | marginBottom | 10px | — | |
| container > heading | marginLeft | 0 | — | |
| container > heading | marginRight | 0 | — | |
| container > heading | marginTop | 12px | — | |
| container > heading | paddingBottom | 0 | — | |
| container > heading | paddingLeft | 0 | — | |
| container > heading | paddingRight | 0 | — | |
| container > heading | paddingTop | 12px | — | |
| container > heading | textAlign | center | — | |
| container > columns-6 | alignItems | stretch | — | |
| container > columns-6 | flexDirection | row | — | |
| container > columns-6 | gap | 24px | — | |
| container > columns-6 | justifyContent | flex-start | — | |
| ...> columns-6 > col-0 > image | display | block | — | |
| ...> columns-6 > col-0 > image | height | 160px | — | |
| ...> columns-6 > col-0 > image | marginBottom | 0 | — | |
| ...> columns-6 > col-0 > image | marginLeft | 0 | — | |
| ...> columns-6 > col-0 > image | marginRight | 0 | — | |
| ...> columns-6 > col-0 > image | marginTop | 0 | — | |
| ...> columns-6 > col-0 > image | objectFit | cover | — | |
| ...> columns-6 > col-0 > image | width | 100% | — | |
| ...> columns-6 > col-1 > image | display | block | — | |
| ...> columns-6 > col-1 > image | height | 160px | — | |
| ...> columns-6 > col-1 > image | marginBottom | 0 | — | |
| ...> columns-6 > col-1 > image | marginLeft | 0 | — | |
| ...> columns-6 > col-1 > image | marginRight | 0 | — | |
| ...> columns-6 > col-1 > image | marginTop | 0 | — | |
| ...> columns-6 > col-1 > image | objectFit | cover | — | |
| ...> columns-6 > col-1 > image | width | 100% | — | |
| ...> columns-6 > col-2 > image | display | block | — | |
| ...> columns-6 > col-2 > image | height | 160px | — | |
| ...> columns-6 > col-2 > image | marginBottom | 0 | — | |
| ...> columns-6 > col-2 > image | marginLeft | 0 | — | |
| ...> columns-6 > col-2 > image | marginRight | 0 | — | |
| ...> columns-6 > col-2 > image | marginTop | 0 | — | |
| ...> columns-6 > col-2 > image | objectFit | cover | — | |
| ...> columns-6 > col-2 > image | width | 100% | — | |
| ...> columns-6 > col-3 > image | display | block | — | |
| ...> columns-6 > col-3 > image | height | 160px | — | |
| ...> columns-6 > col-3 > image | marginBottom | 0 | — | |
| ...> columns-6 > col-3 > image | marginLeft | 0 | — | |
| ...> columns-6 > col-3 > image | marginRight | 0 | — | |
| ...> columns-6 > col-3 > image | marginTop | 0 | — | |
| ...> columns-6 > col-3 > image | objectFit | cover | — | |
| ...> columns-6 > col-3 > image | width | 100% | — | |
| ...> columns-6 > col-4 > image | display | block | — | |
| ...> columns-6 > col-4 > image | height | 160px | — | |
| ...> columns-6 > col-4 > image | marginBottom | 0 | — | |
| ...> columns-6 > col-4 > image | marginLeft | 0 | — | |
| ...> columns-6 > col-4 > image | marginRight | 0 | — | |
| ...> columns-6 > col-4 > image | marginTop | 0 | — | |
| ...> columns-6 > col-4 > image | objectFit | cover | — | |
| ...> columns-6 > col-4 > image | width | 100% | — | |
| ...> columns-6 > col-5 > image | display | block | — | |
| ...> columns-6 > col-5 > image | height | 160px | — | |
| ...> columns-6 > col-5 > image | marginBottom | 0 | — | |
| ...> columns-6 > col-5 > image | marginLeft | 0 | — | |
| ...> columns-6 > col-5 > image | marginRight | 0 | — | |
| ...> columns-6 > col-5 > image | marginTop | 0 | — | |
| ...> columns-6 > col-5 > image | objectFit | cover | — | |
| ...> columns-6 > col-5 > image | width | 100% | — | |

---

## Logo Trust Bar (`logo-banner`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| text | text | AS FEATURED IN | |
| columns-5 | columns | 5 | |
| image | src | /images/placeholder.jpg | |
| image | alt | Logo 1 | |
| image | settingId | image | |
| image | src | /images/placeholder.jpg | |
| image | alt | Logo 2 | |
| image | settingId | image_2 | |
| image | src | /images/placeholder.jpg | |
| image | alt | Logo 3 | |
| image | settingId | image_3 | |
| image | src | /images/placeholder.jpg | |
| image | alt | Logo 4 | |
| image | settingId | image_4 | |
| image | src | /images/placeholder.jpg | |
| image | alt | Logo 5 | |
| image | settingId | image_5 | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | alignItems | center | — | |
| container | backgroundColor | #fafbfc | — | |
| container | borderBottom | 1px solid #eee | — | |
| container | borderStyle | none | — | |
| container | borderTop | 1px solid #eee | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | gap | 20px | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 32px | — | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 32px | — | |
| container | width | 100% | — | |
| container > text | color | #6a737d | — | |
| container > text | display | block | — | |
| container > text | fontSize | 11px | — | |
| container > text | fontWeight | 600 | — | |
| container > text | letterSpacing | 2px | — | |
| container > text | lineHeight | 1 | — | |
| container > text | marginBottom | 0 | — | |
| container > text | marginLeft | 0 | — | |
| container > text | marginRight | 0 | — | |
| container > text | marginTop | 0 | — | |
| container > text | paddingBottom | 0 | — | |
| container > text | paddingLeft | 0 | — | |
| container > text | paddingRight | 0 | — | |
| container > text | paddingTop | 0 | — | |
| container > text | textAlign | center | — | |
| container > columns-5 | alignItems | stretch | — | |
| container > columns-5 | flexDirection | row | — | |
| container > columns-5 | gap | 24px | — | |
| container > columns-5 | justifyContent | flex-start | — | |
| ...> columns-5 > col-0 > image | display | block | — | |
| ...> columns-5 > col-0 > image | height | 40px | — | |
| ...> columns-5 > col-0 > image | marginBottom | 0 | — | |
| ...> columns-5 > col-0 > image | marginLeft | auto | — | |
| ...> columns-5 > col-0 > image | marginRight | auto | — | |
| ...> columns-5 > col-0 > image | marginTop | 0 | — | |
| ...> columns-5 > col-0 > image | objectFit | contain | — | |
| ...> columns-5 > col-0 > image | opacity | 0.5 | — | |
| ...> columns-5 > col-0 > image | width | 120px | — | |
| ...> columns-5 > col-1 > image | display | block | — | |
| ...> columns-5 > col-1 > image | height | 40px | — | |
| ...> columns-5 > col-1 > image | marginBottom | 0 | — | |
| ...> columns-5 > col-1 > image | marginLeft | auto | — | |
| ...> columns-5 > col-1 > image | marginRight | auto | — | |
| ...> columns-5 > col-1 > image | marginTop | 0 | — | |
| ...> columns-5 > col-1 > image | objectFit | contain | — | |
| ...> columns-5 > col-1 > image | opacity | 0.5 | — | |
| ...> columns-5 > col-1 > image | width | 120px | — | |
| ...> columns-5 > col-2 > image | display | block | — | |
| ...> columns-5 > col-2 > image | height | 40px | — | |
| ...> columns-5 > col-2 > image | marginBottom | 0 | — | |
| ...> columns-5 > col-2 > image | marginLeft | auto | — | |
| ...> columns-5 > col-2 > image | marginRight | auto | — | |
| ...> columns-5 > col-2 > image | marginTop | 0 | — | |
| ...> columns-5 > col-2 > image | objectFit | contain | — | |
| ...> columns-5 > col-2 > image | opacity | 0.5 | — | |
| ...> columns-5 > col-2 > image | width | 120px | — | |
| ...> columns-5 > col-3 > image | display | block | — | |
| ...> columns-5 > col-3 > image | height | 40px | — | |
| ...> columns-5 > col-3 > image | marginBottom | 0 | — | |
| ...> columns-5 > col-3 > image | marginLeft | auto | — | |
| ...> columns-5 > col-3 > image | marginRight | auto | — | |
| ...> columns-5 > col-3 > image | marginTop | 0 | — | |
| ...> columns-5 > col-3 > image | objectFit | contain | — | |
| ...> columns-5 > col-3 > image | opacity | 0.5 | — | |
| ...> columns-5 > col-3 > image | width | 120px | — | |
| ...> columns-5 > col-4 > image | display | block | — | |
| ...> columns-5 > col-4 > image | height | 40px | — | |
| ...> columns-5 > col-4 > image | marginBottom | 0 | — | |
| ...> columns-5 > col-4 > image | marginLeft | auto | — | |
| ...> columns-5 > col-4 > image | marginRight | auto | — | |
| ...> columns-5 > col-4 > image | marginTop | 0 | — | |
| ...> columns-5 > col-4 > image | objectFit | contain | — | |
| ...> columns-5 > col-4 > image | opacity | 0.5 | — | |
| ...> columns-5 > col-4 > image | width | 120px | — | |

**Column Styles:**

| Element | Column | Property | Value | E/H |
|---------|--------|----------|-------|-----|
| columns-5 | 0 | alignItems | center | |
| columns-5 | 1 | alignItems | center | |
| columns-5 | 2 | alignItems | center | |
| columns-5 | 3 | alignItems | center | |
| columns-5 | 4 | alignItems | center | |

---

## Multi-Column Text (`multi-column-text`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| heading | text | Our Values | |
| heading | level | h2 | |
| heading | tag | h2 | |
| columns-3 | columns | 3 | |
| heading | text | Sustainability | |
| heading | level | h3 | |
| heading | tag | h3 | |
| text | text | We source materials responsibly and mini... | |
| heading | text | Quality | |
| heading | level | h3 | |
| heading | tag | h3 | |
| text | text | Each product undergoes rigorous testing ... | |
| heading | text | Community | |
| heading | level | h3 | |
| heading | tag | h3 | |
| text | text | We believe in giving back. A portion of ... | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | backgroundColor | #ffffff | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 60px | xs:30px, sm:42px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 60px | xs:30px, sm:42px | |
| container | width | 100% | — | |
| container > heading | color | #1a1a1a | — | |
| container > heading | display | block | — | |
| container > heading | fontSize | 36px | xs:22px, sm:27px | |
| container > heading | fontWeight | bold | — | |
| container > heading | lineHeight | 1.2 | — | |
| container > heading | marginBottom | 10px | — | |
| container > heading | marginLeft | 0 | — | |
| container > heading | marginRight | 0 | — | |
| container > heading | marginTop | 0 | — | |
| container > heading | paddingBottom | 0 | — | |
| container > heading | paddingLeft | 0 | — | |
| container > heading | paddingRight | 0 | — | |
| container > heading | paddingTop | 0 | — | |
| container > heading | textAlign | center | — | |
| container > columns-3 | alignItems | stretch | — | |
| container > columns-3 | flexDirection | row | — | |
| container > columns-3 | gap | 24px | — | |
| container > columns-3 | justifyContent | flex-start | — | |
| ...columns-3 > col-0 > heading | color | #1a1a1a | — | |
| ...columns-3 > col-0 > heading | display | block | — | |
| ...columns-3 > col-0 > heading | fontSize | 20px | — | |
| ...columns-3 > col-0 > heading | fontWeight | bold | — | |
| ...columns-3 > col-0 > heading | lineHeight | 1.2 | — | |
| ...columns-3 > col-0 > heading | marginBottom | 0 | — | |
| ...columns-3 > col-0 > heading | marginLeft | 0 | — | |
| ...columns-3 > col-0 > heading | marginRight | 0 | — | |
| ...columns-3 > col-0 > heading | marginTop | 0 | — | |
| ...columns-3 > col-0 > heading | paddingBottom | 0 | — | |
| ...columns-3 > col-0 > heading | paddingLeft | 0 | — | |
| ...columns-3 > col-0 > heading | paddingRight | 0 | — | |
| ...columns-3 > col-0 > heading | paddingTop | 0 | — | |
| ...columns-3 > col-0 > heading | textAlign | left | — | |
| ...columns-3 > col-0 > divider | borderColor | #667eea | — | |
| ...columns-3 > col-0 > divider | marginBottom | 12px | — | |
| ...columns-3 > col-0 > divider | marginLeft | 0 | — | |
| ...columns-3 > col-0 > divider | marginRight | 0 | — | |
| ...columns-3 > col-0 > divider | marginTop | 12px | — | |
| ...columns-3 > col-0 > divider | width | 40px | — | |
| ... > columns-3 > col-0 > text | color | #586069 | — | |
| ... > columns-3 > col-0 > text | display | block | — | |
| ... > columns-3 > col-0 > text | fontSize | 14px | — | |
| ... > columns-3 > col-0 > text | lineHeight | 1.8 | — | |
| ... > columns-3 > col-0 > text | marginBottom | 0 | — | |
| ... > columns-3 > col-0 > text | marginLeft | 0 | — | |
| ... > columns-3 > col-0 > text | marginRight | 0 | — | |
| ... > columns-3 > col-0 > text | marginTop | 0 | — | |
| ... > columns-3 > col-0 > text | paddingBottom | 0 | — | |
| ... > columns-3 > col-0 > text | paddingLeft | 0 | — | |
| ... > columns-3 > col-0 > text | paddingRight | 0 | — | |
| ... > columns-3 > col-0 > text | paddingTop | 0 | — | |
| ...columns-3 > col-1 > heading | color | #1a1a1a | — | |
| ...columns-3 > col-1 > heading | display | block | — | |
| ...columns-3 > col-1 > heading | fontSize | 20px | — | |
| ...columns-3 > col-1 > heading | fontWeight | bold | — | |
| ...columns-3 > col-1 > heading | lineHeight | 1.2 | — | |
| ...columns-3 > col-1 > heading | marginBottom | 0 | — | |
| ...columns-3 > col-1 > heading | marginLeft | 0 | — | |
| ...columns-3 > col-1 > heading | marginRight | 0 | — | |
| ...columns-3 > col-1 > heading | marginTop | 0 | — | |
| ...columns-3 > col-1 > heading | paddingBottom | 0 | — | |
| ...columns-3 > col-1 > heading | paddingLeft | 0 | — | |
| ...columns-3 > col-1 > heading | paddingRight | 0 | — | |
| ...columns-3 > col-1 > heading | paddingTop | 0 | — | |
| ...columns-3 > col-1 > heading | textAlign | left | — | |
| ...columns-3 > col-1 > divider | borderColor | #667eea | — | |
| ...columns-3 > col-1 > divider | marginBottom | 12px | — | |
| ...columns-3 > col-1 > divider | marginLeft | 0 | — | |
| ...columns-3 > col-1 > divider | marginRight | 0 | — | |
| ...columns-3 > col-1 > divider | marginTop | 12px | — | |
| ...columns-3 > col-1 > divider | width | 40px | — | |
| ... > columns-3 > col-1 > text | color | #586069 | — | |
| ... > columns-3 > col-1 > text | display | block | — | |
| ... > columns-3 > col-1 > text | fontSize | 14px | — | |
| ... > columns-3 > col-1 > text | lineHeight | 1.8 | — | |
| ... > columns-3 > col-1 > text | marginBottom | 0 | — | |
| ... > columns-3 > col-1 > text | marginLeft | 0 | — | |
| ... > columns-3 > col-1 > text | marginRight | 0 | — | |
| ... > columns-3 > col-1 > text | marginTop | 0 | — | |
| ... > columns-3 > col-1 > text | paddingBottom | 0 | — | |
| ... > columns-3 > col-1 > text | paddingLeft | 0 | — | |
| ... > columns-3 > col-1 > text | paddingRight | 0 | — | |
| ... > columns-3 > col-1 > text | paddingTop | 0 | — | |
| ...columns-3 > col-2 > heading | color | #1a1a1a | — | |
| ...columns-3 > col-2 > heading | display | block | — | |
| ...columns-3 > col-2 > heading | fontSize | 20px | — | |
| ...columns-3 > col-2 > heading | fontWeight | bold | — | |
| ...columns-3 > col-2 > heading | lineHeight | 1.2 | — | |
| ...columns-3 > col-2 > heading | marginBottom | 0 | — | |
| ...columns-3 > col-2 > heading | marginLeft | 0 | — | |
| ...columns-3 > col-2 > heading | marginRight | 0 | — | |
| ...columns-3 > col-2 > heading | marginTop | 0 | — | |
| ...columns-3 > col-2 > heading | paddingBottom | 0 | — | |
| ...columns-3 > col-2 > heading | paddingLeft | 0 | — | |
| ...columns-3 > col-2 > heading | paddingRight | 0 | — | |
| ...columns-3 > col-2 > heading | paddingTop | 0 | — | |
| ...columns-3 > col-2 > heading | textAlign | left | — | |
| ...columns-3 > col-2 > divider | borderColor | #667eea | — | |
| ...columns-3 > col-2 > divider | marginBottom | 12px | — | |
| ...columns-3 > col-2 > divider | marginLeft | 0 | — | |
| ...columns-3 > col-2 > divider | marginRight | 0 | — | |
| ...columns-3 > col-2 > divider | marginTop | 12px | — | |
| ...columns-3 > col-2 > divider | width | 40px | — | |
| ... > columns-3 > col-2 > text | color | #586069 | — | |
| ... > columns-3 > col-2 > text | display | block | — | |
| ... > columns-3 > col-2 > text | fontSize | 14px | — | |
| ... > columns-3 > col-2 > text | lineHeight | 1.8 | — | |
| ... > columns-3 > col-2 > text | marginBottom | 0 | — | |
| ... > columns-3 > col-2 > text | marginLeft | 0 | — | |
| ... > columns-3 > col-2 > text | marginRight | 0 | — | |
| ... > columns-3 > col-2 > text | marginTop | 0 | — | |
| ... > columns-3 > col-2 > text | paddingBottom | 0 | — | |
| ... > columns-3 > col-2 > text | paddingLeft | 0 | — | |
| ... > columns-3 > col-2 > text | paddingRight | 0 | — | |
| ... > columns-3 > col-2 > text | paddingTop | 0 | — | |

---

## Newsletter Signup (`newsletter-signup`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| columns-1 | columns | 1 | |
| heading | text | Stay in the Loop | |
| heading | level | h2 | |
| heading | tag | h2 | |
| text | text | Subscribe for exclusive offers, new arri... | |
| columns-1 | columns | 1 | |
| form | fields | [object Object] | |
| form | submitText | Subscribe | |
| form | emailPlaceholder | Enter your email | |
| form | action | # | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | backgroundColor | #f6f8fa | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 60px | xs:30px, sm:42px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 60px | xs:30px, sm:42px | |
| container | width | 100% | — | |
| container > columns-1 | alignItems | stretch | — | |
| container > columns-1 | gap | 24px | — | |
| container > columns-1 | justifyContent | flex-start | — | |
| ...columns-1 > col-0 > heading | color | #1a1a1a | — | |
| ...columns-1 > col-0 > heading | display | block | — | |
| ...columns-1 > col-0 > heading | fontSize | 32px | xs:20px, sm:24px | |
| ...columns-1 > col-0 > heading | fontWeight | bold | — | |
| ...columns-1 > col-0 > heading | lineHeight | 1.2 | — | |
| ...columns-1 > col-0 > heading | marginBottom | 0 | — | |
| ...columns-1 > col-0 > heading | marginLeft | 0 | — | |
| ...columns-1 > col-0 > heading | marginRight | 0 | — | |
| ...columns-1 > col-0 > heading | marginTop | 0 | — | |
| ...columns-1 > col-0 > heading | paddingBottom | 0 | — | |
| ...columns-1 > col-0 > heading | paddingLeft | 0 | — | |
| ...columns-1 > col-0 > heading | paddingRight | 0 | — | |
| ...columns-1 > col-0 > heading | paddingTop | 0 | — | |
| ...columns-1 > col-0 > heading | textAlign | center | — | |
| ... > columns-1 > col-0 > text | color | #586069 | — | |
| ... > columns-1 > col-0 > text | display | block | — | |
| ... > columns-1 > col-0 > text | fontSize | 15px | — | |
| ... > columns-1 > col-0 > text | lineHeight | 1.6 | — | |
| ... > columns-1 > col-0 > text | marginBottom | 0 | — | |
| ... > columns-1 > col-0 > text | marginLeft | 0 | — | |
| ... > columns-1 > col-0 > text | marginRight | 0 | — | |
| ... > columns-1 > col-0 > text | marginTop | 0 | — | |
| ... > columns-1 > col-0 > text | paddingBottom | 0 | — | |
| ... > columns-1 > col-0 > text | paddingLeft | 0 | — | |
| ... > columns-1 > col-0 > text | paddingRight | 0 | — | |
| ... > columns-1 > col-0 > text | paddingTop | 0 | — | |
| ... > columns-1 > col-0 > text | textAlign | center | — | |
| container > columns-1 | alignItems | stretch | — | |
| container > columns-1 | gap | 24px | — | |
| container > columns-1 | justifyContent | flex-start | — | |
| ... > columns-1 > col-0 > form | buttonBackgroundColor | #000000 | — | |
| ... > columns-1 > col-0 > form | buttonColor | #ffffff | — | |
| ... > columns-1 > col-0 > form | marginBottom | 0 | — | |
| ... > columns-1 > col-0 > form | marginLeft | 0 | — | |
| ... > columns-1 > col-0 > form | marginRight | 0 | — | |
| ... > columns-1 > col-0 > form | marginTop | 24px | — | |
| ... > columns-1 > col-0 > form | width | 100% | — | |

---

## 2-Tier Comparison (`pricing-2tier`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| heading | text | Choose Your Plan | |
| heading | level | h2 | |
| heading | tag | h2 | |
| columns-2 | columns | 2 | |
| heading | text | Free | |
| heading | level | h3 | |
| heading | tag | h3 | |
| heading | text | $0 | |
| heading | level | h2 | |
| heading | tag | h2 | |
| text | text | Basic features
Community support
1 Proje... | |
| button | text | Get Started Free | |
| button | href |  | |
| button | url |  | |
| heading | text | Pro | |
| heading | level | h3 | |
| heading | tag | h3 | |
| heading | text | $19/mo | |
| heading | level | h2 | |
| heading | tag | h2 | |
| text | text | All features
Priority support
Unlimited ... | |
| button | text | Upgrade to Pro | |
| button | href |  | |
| button | url |  | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | alignItems | center | — | |
| container | backgroundColor | #fafbfc | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 60px | xs:30px, sm:42px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 60px | xs:30px, sm:42px | |
| container | width | 100% | — | |
| container > heading | color | #1a1a1a | — | |
| container > heading | display | block | — | |
| container > heading | fontSize | 36px | xs:22px, sm:27px | |
| container > heading | fontWeight | bold | — | |
| container > heading | lineHeight | 1.2 | — | |
| container > heading | marginBottom | 10px | — | |
| container > heading | marginLeft | 0 | — | |
| container > heading | marginRight | 0 | — | |
| container > heading | marginTop | 0 | — | |
| container > heading | paddingBottom | 0 | — | |
| container > heading | paddingLeft | 0 | — | |
| container > heading | paddingRight | 0 | — | |
| container > heading | paddingTop | 0 | — | |
| container > heading | textAlign | center | — | |
| container > columns-2 | alignItems | stretch | — | |
| container > columns-2 | flexDirection | row | xs:column | |
| container > columns-2 | gap | 24px | — | |
| container > columns-2 | justifyContent | flex-start | — | |
| ...lumns-2 > col-0 > container | alignItems | center | — | |
| ...lumns-2 > col-0 > container | backgroundColor | #ffffff | — | |
| ...lumns-2 > col-0 > container | borderColor | #e1e4e8 | — | |
| ...lumns-2 > col-0 > container | borderRadius | 8px | — | |
| ...lumns-2 > col-0 > container | borderStyle | solid | — | |
| ...lumns-2 > col-0 > container | borderWidth | 1px | — | |
| ...lumns-2 > col-0 > container | boxSizing | border-box | — | |
| ...lumns-2 > col-0 > container | display | flex | — | |
| ...lumns-2 > col-0 > container | flex | 1 | — | |
| ...lumns-2 > col-0 > container | flexDirection | column | — | |
| ...lumns-2 > col-0 > container | height | 100% | — | |
| ...lumns-2 > col-0 > container | marginBottom | 0 | — | |
| ...lumns-2 > col-0 > container | marginLeft | 0 | — | |
| ...lumns-2 > col-0 > container | marginRight | 0 | — | |
| ...lumns-2 > col-0 > container | marginTop | 0 | — | |
| ...lumns-2 > col-0 > container | maxWidth | 100% | — | |
| ...lumns-2 > col-0 > container | overflow | hidden | — | |
| ...lumns-2 > col-0 > container | paddingBottom | 32px | — | |
| ...lumns-2 > col-0 > container | paddingLeft | 32px | xs:16px | |
| ...lumns-2 > col-0 > container | paddingRight | 32px | xs:16px | |
| ...lumns-2 > col-0 > container | paddingTop | 32px | — | |
| ...lumns-2 > col-0 > container | textAlign | center | — | |
| ...lumns-2 > col-0 > container | width | 100% | — | |
| ...col-0 > container > heading | color | #1a1a1a | — | |
| ...col-0 > container > heading | display | block | — | |
| ...col-0 > container > heading | fontSize | 22px | — | |
| ...col-0 > container > heading | fontWeight | 600 | — | |
| ...col-0 > container > heading | lineHeight | 1.2 | — | |
| ...col-0 > container > heading | marginBottom | 0 | — | |
| ...col-0 > container > heading | marginLeft | 0 | — | |
| ...col-0 > container > heading | marginRight | 0 | — | |
| ...col-0 > container > heading | marginTop | 0 | — | |
| ...col-0 > container > heading | paddingBottom | 0 | — | |
| ...col-0 > container > heading | paddingLeft | 0 | — | |
| ...col-0 > container > heading | paddingRight | 0 | — | |
| ...col-0 > container > heading | paddingTop | 0 | — | |
| ...col-0 > container > heading | textAlign | center | — | |
| ...col-0 > container > heading | color | #1a1a1a | — | |
| ...col-0 > container > heading | display | block | — | |
| ...col-0 > container > heading | fontSize | 42px | xs:25px, sm:32px | |
| ...col-0 > container > heading | fontWeight | bold | — | |
| ...col-0 > container > heading | lineHeight | 1.2 | — | |
| ...col-0 > container > heading | marginBottom | 20px | — | |
| ...col-0 > container > heading | marginLeft | 0 | — | |
| ...col-0 > container > heading | marginRight | 0 | — | |
| ...col-0 > container > heading | marginTop | 16px | — | |
| ...col-0 > container > heading | paddingBottom | 20px | — | |
| ...col-0 > container > heading | paddingLeft | 0 | — | |
| ...col-0 > container > heading | paddingRight | 0 | — | |
| ...col-0 > container > heading | paddingTop | 16px | — | |
| ...col-0 > container > heading | textAlign | center | — | |
| ... > col-0 > container > text | color | #586069 | — | |
| ... > col-0 > container > text | display | block | — | |
| ... > col-0 > container > text | fontSize | 15px | — | |
| ... > col-0 > container > text | lineHeight | 2.2 | — | |
| ... > col-0 > container > text | marginBottom | 24px | — | |
| ... > col-0 > container > text | marginLeft | 0 | — | |
| ... > col-0 > container > text | marginRight | 0 | — | |
| ... > col-0 > container > text | marginTop | 0 | — | |
| ... > col-0 > container > text | paddingBottom | 24px | — | |
| ... > col-0 > container > text | paddingLeft | 0 | — | |
| ... > col-0 > container > text | paddingRight | 0 | — | |
| ... > col-0 > container > text | paddingTop | 0 | — | |
| ... > col-0 > container > text | textAlign | center | — | |
| ... col-0 > container > button | borderColor | #667eea | — | |
| ... col-0 > container > button | borderRadius | 6px | — | |
| ... col-0 > container > button | borderStyle | solid | — | |
| ... col-0 > container > button | borderWidth | 2px | — | |
| ... col-0 > container > button | color | #667eea | — | |
| ... col-0 > container > button | cursor | pointer | — | |
| ... col-0 > container > button | display | block | — | |
| ... col-0 > container > button | fontSize | 15px | — | |
| ... col-0 > container > button | fontWeight | 600 | — | |
| ... col-0 > container > button | marginBottom | 0 | — | |
| ... col-0 > container > button | marginLeft | 0 | — | |
| ... col-0 > container > button | marginRight | 0 | — | |
| ... col-0 > container > button | marginTop | auto | — | |
| ... col-0 > container > button | paddingBottom | 14px | — | |
| ... col-0 > container > button | paddingLeft | 32px | — | |
| ... col-0 > container > button | paddingRight | 32px | — | |
| ... col-0 > container > button | paddingTop | 14px | — | |
| ... col-0 > container > button | width | 100% | — | |
| ...lumns-2 > col-1 > container | alignItems | center | — | |
| ...lumns-2 > col-1 > container | backgroundColor | #f6f8fa | — | |
| ...lumns-2 > col-1 > container | borderColor | #667eea | — | |
| ...lumns-2 > col-1 > container | borderRadius | 8px | — | |
| ...lumns-2 > col-1 > container | borderStyle | solid | — | |
| ...lumns-2 > col-1 > container | borderWidth | 2px | — | |
| ...lumns-2 > col-1 > container | boxSizing | border-box | — | |
| ...lumns-2 > col-1 > container | display | flex | — | |
| ...lumns-2 > col-1 > container | flex | 1 | — | |
| ...lumns-2 > col-1 > container | flexDirection | column | — | |
| ...lumns-2 > col-1 > container | height | 100% | — | |
| ...lumns-2 > col-1 > container | marginBottom | 0 | — | |
| ...lumns-2 > col-1 > container | marginLeft | 0 | — | |
| ...lumns-2 > col-1 > container | marginRight | 0 | — | |
| ...lumns-2 > col-1 > container | marginTop | 0 | — | |
| ...lumns-2 > col-1 > container | maxWidth | 100% | — | |
| ...lumns-2 > col-1 > container | overflow | hidden | — | |
| ...lumns-2 > col-1 > container | paddingBottom | 32px | — | |
| ...lumns-2 > col-1 > container | paddingLeft | 32px | xs:16px | |
| ...lumns-2 > col-1 > container | paddingRight | 32px | xs:16px | |
| ...lumns-2 > col-1 > container | paddingTop | 32px | — | |
| ...lumns-2 > col-1 > container | textAlign | center | — | |
| ...lumns-2 > col-1 > container | width | 100% | — | |
| ...col-1 > container > heading | color | #667eea | — | |
| ...col-1 > container > heading | display | block | — | |
| ...col-1 > container > heading | fontSize | 22px | — | |
| ...col-1 > container > heading | fontWeight | 600 | — | |
| ...col-1 > container > heading | lineHeight | 1.2 | — | |
| ...col-1 > container > heading | marginBottom | 0 | — | |
| ...col-1 > container > heading | marginLeft | 0 | — | |
| ...col-1 > container > heading | marginRight | 0 | — | |
| ...col-1 > container > heading | marginTop | 0 | — | |
| ...col-1 > container > heading | paddingBottom | 0 | — | |
| ...col-1 > container > heading | paddingLeft | 0 | — | |
| ...col-1 > container > heading | paddingRight | 0 | — | |
| ...col-1 > container > heading | paddingTop | 0 | — | |
| ...col-1 > container > heading | textAlign | center | — | |
| ...col-1 > container > heading | color | #1a1a1a | — | |
| ...col-1 > container > heading | display | block | — | |
| ...col-1 > container > heading | fontSize | 42px | xs:25px, sm:32px | |
| ...col-1 > container > heading | fontWeight | bold | — | |
| ...col-1 > container > heading | lineHeight | 1.2 | — | |
| ...col-1 > container > heading | marginBottom | 20px | — | |
| ...col-1 > container > heading | marginLeft | 0 | — | |
| ...col-1 > container > heading | marginRight | 0 | — | |
| ...col-1 > container > heading | marginTop | 16px | — | |
| ...col-1 > container > heading | paddingBottom | 20px | — | |
| ...col-1 > container > heading | paddingLeft | 0 | — | |
| ...col-1 > container > heading | paddingRight | 0 | — | |
| ...col-1 > container > heading | paddingTop | 16px | — | |
| ...col-1 > container > heading | textAlign | center | — | |
| ... > col-1 > container > text | color | #586069 | — | |
| ... > col-1 > container > text | display | block | — | |
| ... > col-1 > container > text | fontSize | 15px | — | |
| ... > col-1 > container > text | lineHeight | 2.2 | — | |
| ... > col-1 > container > text | marginBottom | 24px | — | |
| ... > col-1 > container > text | marginLeft | 0 | — | |
| ... > col-1 > container > text | marginRight | 0 | — | |
| ... > col-1 > container > text | marginTop | 0 | — | |
| ... > col-1 > container > text | paddingBottom | 24px | — | |
| ... > col-1 > container > text | paddingLeft | 0 | — | |
| ... > col-1 > container > text | paddingRight | 0 | — | |
| ... > col-1 > container > text | paddingTop | 0 | — | |
| ... > col-1 > container > text | textAlign | center | — | |
| ... col-1 > container > button | backgroundColor | #667eea | — | |
| ... col-1 > container > button | borderRadius | 6px | — | |
| ... col-1 > container > button | borderStyle | none | — | |
| ... col-1 > container > button | borderWidth | 0px | — | |
| ... col-1 > container > button | color | #ffffff | — | |
| ... col-1 > container > button | cursor | pointer | — | |
| ... col-1 > container > button | display | block | — | |
| ... col-1 > container > button | fontSize | 15px | — | |
| ... col-1 > container > button | fontWeight | 600 | — | |
| ... col-1 > container > button | marginBottom | 0 | — | |
| ... col-1 > container > button | marginLeft | 0 | — | |
| ... col-1 > container > button | marginRight | 0 | — | |
| ... col-1 > container > button | marginTop | auto | — | |
| ... col-1 > container > button | paddingBottom | 14px | — | |
| ... col-1 > container > button | paddingLeft | 32px | — | |
| ... col-1 > container > button | paddingRight | 32px | — | |
| ... col-1 > container > button | paddingTop | 14px | — | |
| ... col-1 > container > button | width | 100% | — | |

---

## 3-Tier Pricing (`pricing-3tier`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| heading | text | Simple, Transparent Pricing | |
| heading | level | h2 | |
| heading | tag | h2 | |
| text | text | Choose the plan that fits your needs. Up... | |
| columns-3 | columns | 3 | |
| heading | text | Starter | |
| heading | level | h3 | |
| heading | tag | h3 | |
| heading | text | $9/mo | |
| heading | level | h2 | |
| heading | tag | h2 | |
| text | text | Perfect for individuals getting started | |
| text | text | 5 Projects
10GB Storage
Email Support | |
| button | text | Choose Starter | |
| button | href |  | |
| button | url |  | |
| heading | text | Professional | |
| heading | level | h3 | |
| heading | tag | h3 | |
| heading | text | $29/mo | |
| heading | level | h2 | |
| heading | tag | h2 | |
| text | text | Best for growing teams and businesses | |
| text | text | Unlimited Projects
100GB Storage
Priorit... | |
| button | text | Choose Professional | |
| button | href |  | |
| button | url |  | |
| heading | text | Enterprise | |
| heading | level | h3 | |
| heading | tag | h3 | |
| heading | text | $99/mo | |
| heading | level | h2 | |
| heading | tag | h2 | |
| text | text | For large organizations with custom need... | |
| text | text | Everything in Pro
Dedicated Support
Cust... | |
| button | text | Contact Sales | |
| button | href |  | |
| button | url |  | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | alignItems | center | — | |
| container | backgroundColor | #ffffff | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 60px | xs:30px, sm:42px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 60px | xs:30px, sm:42px | |
| container | width | 100% | — | |
| container > heading | color | #1a1a1a | — | |
| container > heading | display | block | — | |
| container > heading | fontSize | 36px | xs:22px, sm:27px | |
| container > heading | fontWeight | bold | — | |
| container > heading | lineHeight | 1.2 | — | |
| container > heading | marginBottom | 0 | — | |
| container > heading | marginLeft | 0 | — | |
| container > heading | marginRight | 0 | — | |
| container > heading | marginTop | 0 | — | |
| container > heading | paddingBottom | 0 | — | |
| container > heading | paddingLeft | 0 | — | |
| container > heading | paddingRight | 0 | — | |
| container > heading | paddingTop | 0 | — | |
| container > heading | textAlign | center | — | |
| container > text | color | #6a737d | — | |
| container > text | display | block | — | |
| container > text | fontSize | 16px | — | |
| container > text | lineHeight | 1.6 | — | |
| container > text | marginBottom | 10px | — | |
| container > text | marginLeft | 0 | — | |
| container > text | marginRight | 0 | — | |
| container > text | marginTop | 0 | — | |
| container > text | paddingBottom | 0 | — | |
| container > text | paddingLeft | 0 | — | |
| container > text | paddingRight | 0 | — | |
| container > text | paddingTop | 0 | — | |
| container > text | textAlign | center | — | |
| container > columns-3 | alignItems | stretch | — | |
| container > columns-3 | flexDirection | row | xs:column | |
| container > columns-3 | gap | 24px | — | |
| container > columns-3 | justifyContent | flex-start | — | |
| ...lumns-3 > col-0 > container | alignItems | center | — | |
| ...lumns-3 > col-0 > container | backgroundColor | #ffffff | — | |
| ...lumns-3 > col-0 > container | borderColor | #e1e4e8 | — | |
| ...lumns-3 > col-0 > container | borderRadius | 8px | — | |
| ...lumns-3 > col-0 > container | borderStyle | solid | — | |
| ...lumns-3 > col-0 > container | borderWidth | 1px | — | |
| ...lumns-3 > col-0 > container | boxSizing | border-box | — | |
| ...lumns-3 > col-0 > container | display | flex | — | |
| ...lumns-3 > col-0 > container | flex | 1 | — | |
| ...lumns-3 > col-0 > container | flexDirection | column | — | |
| ...lumns-3 > col-0 > container | height | 100% | — | |
| ...lumns-3 > col-0 > container | marginBottom | 0 | — | |
| ...lumns-3 > col-0 > container | marginLeft | 0 | — | |
| ...lumns-3 > col-0 > container | marginRight | 0 | — | |
| ...lumns-3 > col-0 > container | marginTop | 0 | — | |
| ...lumns-3 > col-0 > container | maxWidth | 100% | — | |
| ...lumns-3 > col-0 > container | overflow | hidden | — | |
| ...lumns-3 > col-0 > container | paddingBottom | 32px | — | |
| ...lumns-3 > col-0 > container | paddingLeft | 32px | xs:16px | |
| ...lumns-3 > col-0 > container | paddingRight | 32px | xs:16px | |
| ...lumns-3 > col-0 > container | paddingTop | 32px | — | |
| ...lumns-3 > col-0 > container | textAlign | center | — | |
| ...lumns-3 > col-0 > container | width | 100% | — | |
| ...col-0 > container > heading | color | #1a1a1a | — | |
| ...col-0 > container > heading | display | block | — | |
| ...col-0 > container > heading | fontSize | 20px | — | |
| ...col-0 > container > heading | fontWeight | 600 | — | |
| ...col-0 > container > heading | lineHeight | 1.2 | — | |
| ...col-0 > container > heading | marginBottom | 0 | — | |
| ...col-0 > container > heading | marginLeft | 0 | — | |
| ...col-0 > container > heading | marginRight | 0 | — | |
| ...col-0 > container > heading | marginTop | 0 | — | |
| ...col-0 > container > heading | paddingBottom | 0 | — | |
| ...col-0 > container > heading | paddingLeft | 0 | — | |
| ...col-0 > container > heading | paddingRight | 0 | — | |
| ...col-0 > container > heading | paddingTop | 0 | — | |
| ...col-0 > container > heading | textAlign | center | — | |
| ...col-0 > container > heading | color | #1a1a1a | — | |
| ...col-0 > container > heading | display | block | — | |
| ...col-0 > container > heading | fontSize | 36px | xs:22px, sm:27px | |
| ...col-0 > container > heading | fontWeight | bold | — | |
| ...col-0 > container > heading | lineHeight | 1.2 | — | |
| ...col-0 > container > heading | marginBottom | 16px | — | |
| ...col-0 > container > heading | marginLeft | 0 | — | |
| ...col-0 > container > heading | marginRight | 0 | — | |
| ...col-0 > container > heading | marginTop | 16px | — | |
| ...col-0 > container > heading | paddingBottom | 16px | — | |
| ...col-0 > container > heading | paddingLeft | 0 | — | |
| ...col-0 > container > heading | paddingRight | 0 | — | |
| ...col-0 > container > heading | paddingTop | 16px | — | |
| ...col-0 > container > heading | textAlign | center | — | |
| ... > col-0 > container > text | color | #6a737d | — | |
| ... > col-0 > container > text | display | block | — | |
| ... > col-0 > container > text | fontSize | 14px | — | |
| ... > col-0 > container > text | lineHeight | 1.6 | — | |
| ... > col-0 > container > text | marginBottom | 20px | — | |
| ... > col-0 > container > text | marginLeft | 0 | — | |
| ... > col-0 > container > text | marginRight | 0 | — | |
| ... > col-0 > container > text | marginTop | 0 | — | |
| ... > col-0 > container > text | paddingBottom | 20px | — | |
| ... > col-0 > container > text | paddingLeft | 0 | — | |
| ... > col-0 > container > text | paddingRight | 0 | — | |
| ... > col-0 > container > text | paddingTop | 0 | — | |
| ... > col-0 > container > text | textAlign | center | — | |
| ...col-0 > container > divider | borderColor | #667eea | — | |
| ...col-0 > container > divider | borderWidth | 1px | — | |
| ... > col-0 > container > text | color | #586069 | — | |
| ... > col-0 > container > text | display | block | — | |
| ... > col-0 > container > text | fontSize | 14px | — | |
| ... > col-0 > container > text | lineHeight | 2 | — | |
| ... > col-0 > container > text | marginBottom | 20px | — | |
| ... > col-0 > container > text | marginLeft | 0 | — | |
| ... > col-0 > container > text | marginRight | 0 | — | |
| ... > col-0 > container > text | marginTop | 20px | — | |
| ... > col-0 > container > text | paddingBottom | 20px | — | |
| ... > col-0 > container > text | paddingLeft | 0 | — | |
| ... > col-0 > container > text | paddingRight | 0 | — | |
| ... > col-0 > container > text | paddingTop | 20px | — | |
| ... > col-0 > container > text | textAlign | center | — | |
| ... col-0 > container > button | borderColor | #667eea | — | |
| ... col-0 > container > button | borderRadius | 6px | — | |
| ... col-0 > container > button | borderStyle | solid | — | |
| ... col-0 > container > button | borderWidth | 2px | — | |
| ... col-0 > container > button | color | #667eea | — | |
| ... col-0 > container > button | cursor | pointer | — | |
| ... col-0 > container > button | display | block | — | |
| ... col-0 > container > button | fontSize | 14px | — | |
| ... col-0 > container > button | fontWeight | 600 | — | |
| ... col-0 > container > button | marginBottom | 0 | — | |
| ... col-0 > container > button | marginLeft | 0 | — | |
| ... col-0 > container > button | marginRight | 0 | — | |
| ... col-0 > container > button | marginTop | auto | — | |
| ... col-0 > container > button | paddingBottom | 12px | — | |
| ... col-0 > container > button | paddingLeft | 24px | — | |
| ... col-0 > container > button | paddingRight | 24px | — | |
| ... col-0 > container > button | paddingTop | 12px | — | |
| ... col-0 > container > button | width | 100% | — | |
| ...lumns-3 > col-1 > container | alignItems | center | — | |
| ...lumns-3 > col-1 > container | backgroundColor | #f6f8fa | — | |
| ...lumns-3 > col-1 > container | borderColor | #667eea | — | |
| ...lumns-3 > col-1 > container | borderRadius | 8px | — | |
| ...lumns-3 > col-1 > container | borderStyle | solid | — | |
| ...lumns-3 > col-1 > container | borderWidth | 2px | — | |
| ...lumns-3 > col-1 > container | boxSizing | border-box | — | |
| ...lumns-3 > col-1 > container | display | flex | — | |
| ...lumns-3 > col-1 > container | flex | 1 | — | |
| ...lumns-3 > col-1 > container | flexDirection | column | — | |
| ...lumns-3 > col-1 > container | height | 100% | — | |
| ...lumns-3 > col-1 > container | marginBottom | 0 | — | |
| ...lumns-3 > col-1 > container | marginLeft | 0 | — | |
| ...lumns-3 > col-1 > container | marginRight | 0 | — | |
| ...lumns-3 > col-1 > container | marginTop | 0 | — | |
| ...lumns-3 > col-1 > container | maxWidth | 100% | — | |
| ...lumns-3 > col-1 > container | overflow | hidden | — | |
| ...lumns-3 > col-1 > container | paddingBottom | 32px | — | |
| ...lumns-3 > col-1 > container | paddingLeft | 32px | xs:16px | |
| ...lumns-3 > col-1 > container | paddingRight | 32px | xs:16px | |
| ...lumns-3 > col-1 > container | paddingTop | 32px | — | |
| ...lumns-3 > col-1 > container | textAlign | center | — | |
| ...lumns-3 > col-1 > container | width | 100% | — | |
| ...col-1 > container > heading | color | #667eea | — | |
| ...col-1 > container > heading | display | block | — | |
| ...col-1 > container > heading | fontSize | 20px | — | |
| ...col-1 > container > heading | fontWeight | 600 | — | |
| ...col-1 > container > heading | lineHeight | 1.2 | — | |
| ...col-1 > container > heading | marginBottom | 0 | — | |
| ...col-1 > container > heading | marginLeft | 0 | — | |
| ...col-1 > container > heading | marginRight | 0 | — | |
| ...col-1 > container > heading | marginTop | 0 | — | |
| ...col-1 > container > heading | paddingBottom | 0 | — | |
| ...col-1 > container > heading | paddingLeft | 0 | — | |
| ...col-1 > container > heading | paddingRight | 0 | — | |
| ...col-1 > container > heading | paddingTop | 0 | — | |
| ...col-1 > container > heading | textAlign | center | — | |
| ...col-1 > container > heading | color | #1a1a1a | — | |
| ...col-1 > container > heading | display | block | — | |
| ...col-1 > container > heading | fontSize | 36px | xs:22px, sm:27px | |
| ...col-1 > container > heading | fontWeight | bold | — | |
| ...col-1 > container > heading | lineHeight | 1.2 | — | |
| ...col-1 > container > heading | marginBottom | 16px | — | |
| ...col-1 > container > heading | marginLeft | 0 | — | |
| ...col-1 > container > heading | marginRight | 0 | — | |
| ...col-1 > container > heading | marginTop | 16px | — | |
| ...col-1 > container > heading | paddingBottom | 16px | — | |
| ...col-1 > container > heading | paddingLeft | 0 | — | |
| ...col-1 > container > heading | paddingRight | 0 | — | |
| ...col-1 > container > heading | paddingTop | 16px | — | |
| ...col-1 > container > heading | textAlign | center | — | |
| ... > col-1 > container > text | color | #6a737d | — | |
| ... > col-1 > container > text | display | block | — | |
| ... > col-1 > container > text | fontSize | 14px | — | |
| ... > col-1 > container > text | lineHeight | 1.6 | — | |
| ... > col-1 > container > text | marginBottom | 20px | — | |
| ... > col-1 > container > text | marginLeft | 0 | — | |
| ... > col-1 > container > text | marginRight | 0 | — | |
| ... > col-1 > container > text | marginTop | 0 | — | |
| ... > col-1 > container > text | paddingBottom | 20px | — | |
| ... > col-1 > container > text | paddingLeft | 0 | — | |
| ... > col-1 > container > text | paddingRight | 0 | — | |
| ... > col-1 > container > text | paddingTop | 0 | — | |
| ... > col-1 > container > text | textAlign | center | — | |
| ...col-1 > container > divider | borderColor | #667eea | — | |
| ...col-1 > container > divider | borderWidth | 1px | — | |
| ... > col-1 > container > text | color | #586069 | — | |
| ... > col-1 > container > text | display | block | — | |
| ... > col-1 > container > text | fontSize | 14px | — | |
| ... > col-1 > container > text | lineHeight | 2 | — | |
| ... > col-1 > container > text | marginBottom | 20px | — | |
| ... > col-1 > container > text | marginLeft | 0 | — | |
| ... > col-1 > container > text | marginRight | 0 | — | |
| ... > col-1 > container > text | marginTop | 20px | — | |
| ... > col-1 > container > text | paddingBottom | 20px | — | |
| ... > col-1 > container > text | paddingLeft | 0 | — | |
| ... > col-1 > container > text | paddingRight | 0 | — | |
| ... > col-1 > container > text | paddingTop | 20px | — | |
| ... > col-1 > container > text | textAlign | center | — | |
| ... col-1 > container > button | backgroundColor | #667eea | — | |
| ... col-1 > container > button | borderRadius | 6px | — | |
| ... col-1 > container > button | borderStyle | none | — | |
| ... col-1 > container > button | borderWidth | 0px | — | |
| ... col-1 > container > button | color | #ffffff | — | |
| ... col-1 > container > button | cursor | pointer | — | |
| ... col-1 > container > button | display | block | — | |
| ... col-1 > container > button | fontSize | 14px | — | |
| ... col-1 > container > button | fontWeight | 600 | — | |
| ... col-1 > container > button | marginBottom | 0 | — | |
| ... col-1 > container > button | marginLeft | 0 | — | |
| ... col-1 > container > button | marginRight | 0 | — | |
| ... col-1 > container > button | marginTop | auto | — | |
| ... col-1 > container > button | paddingBottom | 12px | — | |
| ... col-1 > container > button | paddingLeft | 24px | — | |
| ... col-1 > container > button | paddingRight | 24px | — | |
| ... col-1 > container > button | paddingTop | 12px | — | |
| ... col-1 > container > button | width | 100% | — | |
| ...lumns-3 > col-2 > container | alignItems | center | — | |
| ...lumns-3 > col-2 > container | backgroundColor | #ffffff | — | |
| ...lumns-3 > col-2 > container | borderColor | #e1e4e8 | — | |
| ...lumns-3 > col-2 > container | borderRadius | 8px | — | |
| ...lumns-3 > col-2 > container | borderStyle | solid | — | |
| ...lumns-3 > col-2 > container | borderWidth | 1px | — | |
| ...lumns-3 > col-2 > container | boxSizing | border-box | — | |
| ...lumns-3 > col-2 > container | display | flex | — | |
| ...lumns-3 > col-2 > container | flex | 1 | — | |
| ...lumns-3 > col-2 > container | flexDirection | column | — | |
| ...lumns-3 > col-2 > container | height | 100% | — | |
| ...lumns-3 > col-2 > container | marginBottom | 0 | — | |
| ...lumns-3 > col-2 > container | marginLeft | 0 | — | |
| ...lumns-3 > col-2 > container | marginRight | 0 | — | |
| ...lumns-3 > col-2 > container | marginTop | 0 | — | |
| ...lumns-3 > col-2 > container | maxWidth | 100% | — | |
| ...lumns-3 > col-2 > container | overflow | hidden | — | |
| ...lumns-3 > col-2 > container | paddingBottom | 32px | — | |
| ...lumns-3 > col-2 > container | paddingLeft | 32px | xs:16px | |
| ...lumns-3 > col-2 > container | paddingRight | 32px | xs:16px | |
| ...lumns-3 > col-2 > container | paddingTop | 32px | — | |
| ...lumns-3 > col-2 > container | textAlign | center | — | |
| ...lumns-3 > col-2 > container | width | 100% | — | |
| ...col-2 > container > heading | color | #1a1a1a | — | |
| ...col-2 > container > heading | display | block | — | |
| ...col-2 > container > heading | fontSize | 20px | — | |
| ...col-2 > container > heading | fontWeight | 600 | — | |
| ...col-2 > container > heading | lineHeight | 1.2 | — | |
| ...col-2 > container > heading | marginBottom | 0 | — | |
| ...col-2 > container > heading | marginLeft | 0 | — | |
| ...col-2 > container > heading | marginRight | 0 | — | |
| ...col-2 > container > heading | marginTop | 0 | — | |
| ...col-2 > container > heading | paddingBottom | 0 | — | |
| ...col-2 > container > heading | paddingLeft | 0 | — | |
| ...col-2 > container > heading | paddingRight | 0 | — | |
| ...col-2 > container > heading | paddingTop | 0 | — | |
| ...col-2 > container > heading | textAlign | center | — | |
| ...col-2 > container > heading | color | #1a1a1a | — | |
| ...col-2 > container > heading | display | block | — | |
| ...col-2 > container > heading | fontSize | 36px | xs:22px, sm:27px | |
| ...col-2 > container > heading | fontWeight | bold | — | |
| ...col-2 > container > heading | lineHeight | 1.2 | — | |
| ...col-2 > container > heading | marginBottom | 16px | — | |
| ...col-2 > container > heading | marginLeft | 0 | — | |
| ...col-2 > container > heading | marginRight | 0 | — | |
| ...col-2 > container > heading | marginTop | 16px | — | |
| ...col-2 > container > heading | paddingBottom | 16px | — | |
| ...col-2 > container > heading | paddingLeft | 0 | — | |
| ...col-2 > container > heading | paddingRight | 0 | — | |
| ...col-2 > container > heading | paddingTop | 16px | — | |
| ...col-2 > container > heading | textAlign | center | — | |
| ... > col-2 > container > text | color | #6a737d | — | |
| ... > col-2 > container > text | display | block | — | |
| ... > col-2 > container > text | fontSize | 14px | — | |
| ... > col-2 > container > text | lineHeight | 1.6 | — | |
| ... > col-2 > container > text | marginBottom | 20px | — | |
| ... > col-2 > container > text | marginLeft | 0 | — | |
| ... > col-2 > container > text | marginRight | 0 | — | |
| ... > col-2 > container > text | marginTop | 0 | — | |
| ... > col-2 > container > text | paddingBottom | 20px | — | |
| ... > col-2 > container > text | paddingLeft | 0 | — | |
| ... > col-2 > container > text | paddingRight | 0 | — | |
| ... > col-2 > container > text | paddingTop | 0 | — | |
| ... > col-2 > container > text | textAlign | center | — | |
| ...col-2 > container > divider | borderColor | #667eea | — | |
| ...col-2 > container > divider | borderWidth | 1px | — | |
| ... > col-2 > container > text | color | #586069 | — | |
| ... > col-2 > container > text | display | block | — | |
| ... > col-2 > container > text | fontSize | 14px | — | |
| ... > col-2 > container > text | lineHeight | 2 | — | |
| ... > col-2 > container > text | marginBottom | 20px | — | |
| ... > col-2 > container > text | marginLeft | 0 | — | |
| ... > col-2 > container > text | marginRight | 0 | — | |
| ... > col-2 > container > text | marginTop | 20px | — | |
| ... > col-2 > container > text | paddingBottom | 20px | — | |
| ... > col-2 > container > text | paddingLeft | 0 | — | |
| ... > col-2 > container > text | paddingRight | 0 | — | |
| ... > col-2 > container > text | paddingTop | 20px | — | |
| ... > col-2 > container > text | textAlign | center | — | |
| ... col-2 > container > button | borderColor | #667eea | — | |
| ... col-2 > container > button | borderRadius | 6px | — | |
| ... col-2 > container > button | borderStyle | solid | — | |
| ... col-2 > container > button | borderWidth | 2px | — | |
| ... col-2 > container > button | color | #667eea | — | |
| ... col-2 > container > button | cursor | pointer | — | |
| ... col-2 > container > button | display | block | — | |
| ... col-2 > container > button | fontSize | 14px | — | |
| ... col-2 > container > button | fontWeight | 600 | — | |
| ... col-2 > container > button | marginBottom | 0 | — | |
| ... col-2 > container > button | marginLeft | 0 | — | |
| ... col-2 > container > button | marginRight | 0 | — | |
| ... col-2 > container > button | marginTop | auto | — | |
| ... col-2 > container > button | paddingBottom | 12px | — | |
| ... col-2 > container > button | paddingLeft | 24px | — | |
| ... col-2 > container > button | paddingRight | 24px | — | |
| ... col-2 > container > button | paddingTop | 12px | — | |
| ... col-2 > container > button | width | 100% | — | |

---

## Product Card Grid (`product-card-grid`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| heading | text | Our Products | |
| heading | level | h2 | |
| heading | tag | h2 | |
| columns-3 | columns | 3 | |
| image | src | /images/placeholder.jpg | |
| image | alt | Product 1 | |
| heading | text | Product Name | |
| heading | level | h4 | |
| heading | tag | h4 | |
| text | text | $49.00 | |
| button | text | Add to Cart | |
| button | url |  | |
| image | src | /images/placeholder.jpg | |
| image | alt | Product 2 | |
| heading | text | Product Name | |
| heading | level | h4 | |
| heading | tag | h4 | |
| text | text | $59.00 | |
| button | text | Add to Cart | |
| button | url |  | |
| image | src | /images/placeholder.jpg | |
| image | alt | Product 3 | |
| heading | text | Product Name | |
| heading | level | h4 | |
| heading | tag | h4 | |
| text | text | $39.00 | |
| button | text | Add to Cart | |
| button | url |  | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | backgroundColor | #ffffff | — | |
| container > heading | color | #1a1a1a | — | |
| container > columns-3 | gap | 24px | — | |
| ...> columns-3 > col-0 > image | objectFit | cover | — | |
| ...columns-3 > col-0 > heading | color | #1a1a1a | — | |
| ... > columns-3 > col-0 > text | color | #586069 | — | |
| ... columns-3 > col-0 > button | backgroundColor | #1a1a1a | — | |
| ... columns-3 > col-0 > button | color | #ffffff | — | |
| ...> columns-3 > col-1 > image | objectFit | cover | — | |
| ...columns-3 > col-1 > heading | color | #1a1a1a | — | |
| ... > columns-3 > col-1 > text | color | #586069 | — | |
| ... columns-3 > col-1 > button | backgroundColor | #1a1a1a | — | |
| ... columns-3 > col-1 > button | color | #ffffff | — | |
| ...> columns-3 > col-2 > image | objectFit | cover | — | |
| ...columns-3 > col-2 > heading | color | #1a1a1a | — | |
| ... > columns-3 > col-2 > text | color | #586069 | — | |
| ... columns-3 > col-2 > button | backgroundColor | #1a1a1a | — | |
| ... columns-3 > col-2 > button | color | #ffffff | — | |

**Column Styles:**

| Element | Column | Property | Value | E/H |
|---------|--------|----------|-------|-----|
| columns-3 | 0 | alignItems | center | |
| columns-3 | 0 | borderRadius | 8px | |
| columns-3 | 0 | overflow | hidden | |
| columns-3 | 0 | backgroundColor | #ffffff | |
| columns-3 | 1 | alignItems | center | |
| columns-3 | 1 | borderRadius | 8px | |
| columns-3 | 1 | overflow | hidden | |
| columns-3 | 1 | backgroundColor | #ffffff | |
| columns-3 | 2 | alignItems | center | |
| columns-3 | 2 | borderRadius | 8px | |
| columns-3 | 2 | overflow | hidden | |
| columns-3 | 2 | backgroundColor | #ffffff | |

---

## Shipping & Guarantee Bar (`shipping-guarantee-bar`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| columns-4 | columns | 4 | |
| icon | src | /icons/star-o.svg | |
| icon | alt | Free Shipping | |
| icon | iconCategory | icons | |
| icon | uploadedFileName | star-o.svg | |
| icon | size | 28px | |
| heading | text | Free Shipping | |
| heading | level | h4 | |
| heading | tag | h4 | |
| text | text | On orders over $50 | |
| icon | src | /icons/star-o.svg | |
| icon | alt | Easy Returns | |
| icon | iconCategory | icons | |
| icon | uploadedFileName | star-o.svg | |
| icon | size | 28px | |
| heading | text | Easy Returns | |
| heading | level | h4 | |
| heading | tag | h4 | |
| text | text | 30-day money back | |
| icon | src | /icons/star-o.svg | |
| icon | alt | Secure Checkout | |
| icon | iconCategory | icons | |
| icon | uploadedFileName | star-o.svg | |
| icon | size | 28px | |
| heading | text | Secure Checkout | |
| heading | level | h4 | |
| heading | tag | h4 | |
| text | text | SSL encrypted payment | |
| icon | src | /icons/star-o.svg | |
| icon | alt | 24/7 Support | |
| icon | iconCategory | icons | |
| icon | uploadedFileName | star-o.svg | |
| icon | size | 28px | |
| heading | text | 24/7 Support | |
| heading | level | h4 | |
| heading | tag | h4 | |
| text | text | Chat with us anytime | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | backgroundColor | #fafbfc | — | |
| container | borderBottom | 1px solid #eee | — | |
| container | borderStyle | none | — | |
| container | borderTop | 1px solid #eee | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 24px | — | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 24px | — | |
| container | width | 100% | — | |
| container > columns-4 | alignItems | stretch | — | |
| container > columns-4 | flexDirection | row | — | |
| container > columns-4 | gap | 24px | — | |
| container > columns-4 | justifyContent | flex-start | — | |
| ... > columns-4 > col-0 > icon | display | inline-block | — | |
| ... > columns-4 > col-0 > icon | height | 28px | — | |
| ... > columns-4 > col-0 > icon | iconColor | #667eea | — | |
| ... > columns-4 > col-0 > icon | iconSize | 28px | — | |
| ... > columns-4 > col-0 > icon | marginBottom | 0 | — | |
| ... > columns-4 > col-0 > icon | marginLeft | auto | — | |
| ... > columns-4 > col-0 > icon | marginRight | auto | — | |
| ... > columns-4 > col-0 > icon | marginTop | 0 | — | |
| ... > columns-4 > col-0 > icon | width | 28px | — | |
| ...columns-4 > col-0 > heading | color | #1a1a1a | — | |
| ...columns-4 > col-0 > heading | display | block | — | |
| ...columns-4 > col-0 > heading | fontSize | 13px | — | |
| ...columns-4 > col-0 > heading | fontWeight | 600 | — | |
| ...columns-4 > col-0 > heading | lineHeight | 1.2 | — | |
| ...columns-4 > col-0 > heading | marginBottom | 0 | — | |
| ...columns-4 > col-0 > heading | marginLeft | 0 | — | |
| ...columns-4 > col-0 > heading | marginRight | 0 | — | |
| ...columns-4 > col-0 > heading | marginTop | 8px | — | |
| ...columns-4 > col-0 > heading | paddingBottom | 0 | — | |
| ...columns-4 > col-0 > heading | paddingLeft | 0 | — | |
| ...columns-4 > col-0 > heading | paddingRight | 0 | — | |
| ...columns-4 > col-0 > heading | paddingTop | 8px | — | |
| ...columns-4 > col-0 > heading | textAlign | center | — | |
| ... > columns-4 > col-0 > text | color | #6a737d | — | |
| ... > columns-4 > col-0 > text | display | block | — | |
| ... > columns-4 > col-0 > text | fontSize | 11px | — | |
| ... > columns-4 > col-0 > text | lineHeight | 1.3 | — | |
| ... > columns-4 > col-0 > text | marginBottom | 0 | — | |
| ... > columns-4 > col-0 > text | marginLeft | 0 | — | |
| ... > columns-4 > col-0 > text | marginRight | 0 | — | |
| ... > columns-4 > col-0 > text | marginTop | 4px | — | |
| ... > columns-4 > col-0 > text | paddingBottom | 0 | — | |
| ... > columns-4 > col-0 > text | paddingLeft | 0 | — | |
| ... > columns-4 > col-0 > text | paddingRight | 0 | — | |
| ... > columns-4 > col-0 > text | paddingTop | 4px | — | |
| ... > columns-4 > col-0 > text | textAlign | center | — | |
| ... > columns-4 > col-1 > icon | display | inline-block | — | |
| ... > columns-4 > col-1 > icon | height | 28px | — | |
| ... > columns-4 > col-1 > icon | iconColor | #667eea | — | |
| ... > columns-4 > col-1 > icon | iconSize | 28px | — | |
| ... > columns-4 > col-1 > icon | marginBottom | 0 | — | |
| ... > columns-4 > col-1 > icon | marginLeft | auto | — | |
| ... > columns-4 > col-1 > icon | marginRight | auto | — | |
| ... > columns-4 > col-1 > icon | marginTop | 0 | — | |
| ... > columns-4 > col-1 > icon | width | 28px | — | |
| ...columns-4 > col-1 > heading | color | #1a1a1a | — | |
| ...columns-4 > col-1 > heading | display | block | — | |
| ...columns-4 > col-1 > heading | fontSize | 13px | — | |
| ...columns-4 > col-1 > heading | fontWeight | 600 | — | |
| ...columns-4 > col-1 > heading | lineHeight | 1.2 | — | |
| ...columns-4 > col-1 > heading | marginBottom | 0 | — | |
| ...columns-4 > col-1 > heading | marginLeft | 0 | — | |
| ...columns-4 > col-1 > heading | marginRight | 0 | — | |
| ...columns-4 > col-1 > heading | marginTop | 8px | — | |
| ...columns-4 > col-1 > heading | paddingBottom | 0 | — | |
| ...columns-4 > col-1 > heading | paddingLeft | 0 | — | |
| ...columns-4 > col-1 > heading | paddingRight | 0 | — | |
| ...columns-4 > col-1 > heading | paddingTop | 8px | — | |
| ...columns-4 > col-1 > heading | textAlign | center | — | |
| ... > columns-4 > col-1 > text | color | #6a737d | — | |
| ... > columns-4 > col-1 > text | display | block | — | |
| ... > columns-4 > col-1 > text | fontSize | 11px | — | |
| ... > columns-4 > col-1 > text | lineHeight | 1.3 | — | |
| ... > columns-4 > col-1 > text | marginBottom | 0 | — | |
| ... > columns-4 > col-1 > text | marginLeft | 0 | — | |
| ... > columns-4 > col-1 > text | marginRight | 0 | — | |
| ... > columns-4 > col-1 > text | marginTop | 4px | — | |
| ... > columns-4 > col-1 > text | paddingBottom | 0 | — | |
| ... > columns-4 > col-1 > text | paddingLeft | 0 | — | |
| ... > columns-4 > col-1 > text | paddingRight | 0 | — | |
| ... > columns-4 > col-1 > text | paddingTop | 4px | — | |
| ... > columns-4 > col-1 > text | textAlign | center | — | |
| ... > columns-4 > col-2 > icon | display | inline-block | — | |
| ... > columns-4 > col-2 > icon | height | 28px | — | |
| ... > columns-4 > col-2 > icon | iconColor | #667eea | — | |
| ... > columns-4 > col-2 > icon | iconSize | 28px | — | |
| ... > columns-4 > col-2 > icon | marginBottom | 0 | — | |
| ... > columns-4 > col-2 > icon | marginLeft | auto | — | |
| ... > columns-4 > col-2 > icon | marginRight | auto | — | |
| ... > columns-4 > col-2 > icon | marginTop | 0 | — | |
| ... > columns-4 > col-2 > icon | width | 28px | — | |
| ...columns-4 > col-2 > heading | color | #1a1a1a | — | |
| ...columns-4 > col-2 > heading | display | block | — | |
| ...columns-4 > col-2 > heading | fontSize | 13px | — | |
| ...columns-4 > col-2 > heading | fontWeight | 600 | — | |
| ...columns-4 > col-2 > heading | lineHeight | 1.2 | — | |
| ...columns-4 > col-2 > heading | marginBottom | 0 | — | |
| ...columns-4 > col-2 > heading | marginLeft | 0 | — | |
| ...columns-4 > col-2 > heading | marginRight | 0 | — | |
| ...columns-4 > col-2 > heading | marginTop | 8px | — | |
| ...columns-4 > col-2 > heading | paddingBottom | 0 | — | |
| ...columns-4 > col-2 > heading | paddingLeft | 0 | — | |
| ...columns-4 > col-2 > heading | paddingRight | 0 | — | |
| ...columns-4 > col-2 > heading | paddingTop | 8px | — | |
| ...columns-4 > col-2 > heading | textAlign | center | — | |
| ... > columns-4 > col-2 > text | color | #6a737d | — | |
| ... > columns-4 > col-2 > text | display | block | — | |
| ... > columns-4 > col-2 > text | fontSize | 11px | — | |
| ... > columns-4 > col-2 > text | lineHeight | 1.3 | — | |
| ... > columns-4 > col-2 > text | marginBottom | 0 | — | |
| ... > columns-4 > col-2 > text | marginLeft | 0 | — | |
| ... > columns-4 > col-2 > text | marginRight | 0 | — | |
| ... > columns-4 > col-2 > text | marginTop | 4px | — | |
| ... > columns-4 > col-2 > text | paddingBottom | 0 | — | |
| ... > columns-4 > col-2 > text | paddingLeft | 0 | — | |
| ... > columns-4 > col-2 > text | paddingRight | 0 | — | |
| ... > columns-4 > col-2 > text | paddingTop | 4px | — | |
| ... > columns-4 > col-2 > text | textAlign | center | — | |
| ... > columns-4 > col-3 > icon | display | inline-block | — | |
| ... > columns-4 > col-3 > icon | height | 28px | — | |
| ... > columns-4 > col-3 > icon | iconColor | #667eea | — | |
| ... > columns-4 > col-3 > icon | iconSize | 28px | — | |
| ... > columns-4 > col-3 > icon | marginBottom | 0 | — | |
| ... > columns-4 > col-3 > icon | marginLeft | auto | — | |
| ... > columns-4 > col-3 > icon | marginRight | auto | — | |
| ... > columns-4 > col-3 > icon | marginTop | 0 | — | |
| ... > columns-4 > col-3 > icon | width | 28px | — | |
| ...columns-4 > col-3 > heading | color | #1a1a1a | — | |
| ...columns-4 > col-3 > heading | display | block | — | |
| ...columns-4 > col-3 > heading | fontSize | 13px | — | |
| ...columns-4 > col-3 > heading | fontWeight | 600 | — | |
| ...columns-4 > col-3 > heading | lineHeight | 1.2 | — | |
| ...columns-4 > col-3 > heading | marginBottom | 0 | — | |
| ...columns-4 > col-3 > heading | marginLeft | 0 | — | |
| ...columns-4 > col-3 > heading | marginRight | 0 | — | |
| ...columns-4 > col-3 > heading | marginTop | 8px | — | |
| ...columns-4 > col-3 > heading | paddingBottom | 0 | — | |
| ...columns-4 > col-3 > heading | paddingLeft | 0 | — | |
| ...columns-4 > col-3 > heading | paddingRight | 0 | — | |
| ...columns-4 > col-3 > heading | paddingTop | 8px | — | |
| ...columns-4 > col-3 > heading | textAlign | center | — | |
| ... > columns-4 > col-3 > text | color | #6a737d | — | |
| ... > columns-4 > col-3 > text | display | block | — | |
| ... > columns-4 > col-3 > text | fontSize | 11px | — | |
| ... > columns-4 > col-3 > text | lineHeight | 1.3 | — | |
| ... > columns-4 > col-3 > text | marginBottom | 0 | — | |
| ... > columns-4 > col-3 > text | marginLeft | 0 | — | |
| ... > columns-4 > col-3 > text | marginRight | 0 | — | |
| ... > columns-4 > col-3 > text | marginTop | 4px | — | |
| ... > columns-4 > col-3 > text | paddingBottom | 0 | — | |
| ... > columns-4 > col-3 > text | paddingLeft | 0 | — | |
| ... > columns-4 > col-3 > text | paddingRight | 0 | — | |
| ... > columns-4 > col-3 > text | paddingTop | 4px | — | |
| ... > columns-4 > col-3 > text | textAlign | center | — | |

**Column Styles:**

| Element | Column | Property | Value | E/H |
|---------|--------|----------|-------|-----|
| columns-4 | 0 | alignItems | center | |
| columns-4 | 1 | alignItems | center | |
| columns-4 | 2 | alignItems | center | |
| columns-4 | 3 | alignItems | center | |

---

## Quote Spotlight (`testimonial-spotlight`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| text | text | "This is the single best tool we have ev... | |
| text | text | Alex Turner | |
| text | text | VP of Engineering, GlobalTech | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | alignItems | center | — | |
| container | backgroundColor | #1a1a1a | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 80px | xs:40px, sm:56px | |
| container | paddingLeft | 40px | xs:16px | |
| container | paddingRight | 40px | xs:16px | |
| container | paddingTop | 80px | xs:40px, sm:56px | |
| container | textAlign | center | — | |
| container | width | 100% | — | |
| container > text | color | #e1e4e8 | — | |
| container > text | display | block | — | |
| container > text | fontSize | 24px | sm:20px, xs:19px | |
| container > text | fontStyle | italic | — | |
| container > text | lineHeight | 1.8 | — | |
| container > text | marginBottom | 0 | — | |
| container > text | marginLeft | 0 | — | |
| container > text | marginRight | 0 | — | |
| container > text | marginTop | 0 | — | |
| container > text | maxWidth | 700px | — | |
| container > text | paddingBottom | 0 | — | |
| container > text | paddingLeft | 0 | — | |
| container > text | paddingRight | 0 | — | |
| container > text | paddingTop | 0 | — | |
| container > text | color | #e1e4e8 | — | |
| container > text | display | block | — | |
| container > text | fontSize | 16px | — | |
| container > text | fontWeight | 600 | — | |
| container > text | lineHeight | 1 | — | |
| container > text | marginBottom | 0 | — | |
| container > text | marginLeft | 0 | — | |
| container > text | marginRight | 0 | — | |
| container > text | marginTop | 24px | — | |
| container > text | paddingBottom | 0 | — | |
| container > text | paddingLeft | 0 | — | |
| container > text | paddingRight | 0 | — | |
| container > text | paddingTop | 24px | — | |
| container > text | color | #e1e4e8 | — | |
| container > text | display | block | — | |
| container > text | fontSize | 13px | — | |
| container > text | lineHeight | 1 | — | |
| container > text | marginBottom | 0 | — | |
| container > text | marginLeft | 0 | — | |
| container > text | marginRight | 0 | — | |
| container > text | marginTop | 6px | — | |
| container > text | paddingBottom | 0 | — | |
| container > text | paddingLeft | 0 | — | |
| container > text | paddingRight | 0 | — | |
| container > text | paddingTop | 6px | — | |

---

## Testimonial Cards (`testimonials-cards`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| heading | text | What Our Customers Say | |
| heading | level | h2 | |
| heading | tag | h2 | |
| columns-3 | columns | 3 | |
| text | text | "This product completely transformed how... | |
| text | text | Sarah Johnson | |
| text | text | CEO, TechCorp | |
| text | text | "Incredible quality and attention to det... | |
| text | text | Mike Chen | |
| text | text | Founder, StartupXYZ | |
| text | text | "The best investment we've made this yea... | |
| text | text | Emily Roberts | |
| text | text | Director, MediaGroup | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | alignItems | center | — | |
| container | backgroundColor | #fafbfc | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 60px | xs:30px, sm:42px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 60px | xs:30px, sm:42px | |
| container | width | 100% | — | |
| container > heading | color | #1a1a1a | — | |
| container > heading | display | block | — | |
| container > heading | fontSize | 36px | xs:22px, sm:27px | |
| container > heading | fontWeight | bold | — | |
| container > heading | lineHeight | 1.2 | — | |
| container > heading | marginBottom | 10px | — | |
| container > heading | marginLeft | 0 | — | |
| container > heading | marginRight | 0 | — | |
| container > heading | marginTop | 0 | — | |
| container > heading | paddingBottom | 0 | — | |
| container > heading | paddingLeft | 0 | — | |
| container > heading | paddingRight | 0 | — | |
| container > heading | paddingTop | 0 | — | |
| container > heading | textAlign | center | — | |
| container > columns-3 | alignItems | stretch | — | |
| container > columns-3 | flexDirection | row | — | |
| container > columns-3 | gap | 24px | — | |
| container > columns-3 | justifyContent | flex-start | — | |
| ...lumns-3 > col-0 > container | alignItems | flex-start | — | |
| ...lumns-3 > col-0 > container | backgroundColor | #ffffff | — | |
| ...lumns-3 > col-0 > container | borderRadius | 8px | — | |
| ...lumns-3 > col-0 > container | borderStyle | none | — | |
| ...lumns-3 > col-0 > container | borderWidth | 0px | — | |
| ...lumns-3 > col-0 > container | boxSizing | border-box | — | |
| ...lumns-3 > col-0 > container | display | flex | — | |
| ...lumns-3 > col-0 > container | flex | 1 | — | |
| ...lumns-3 > col-0 > container | flexDirection | column | — | |
| ...lumns-3 > col-0 > container | height | 100% | — | |
| ...lumns-3 > col-0 > container | marginBottom | 0 | — | |
| ...lumns-3 > col-0 > container | marginLeft | 0 | — | |
| ...lumns-3 > col-0 > container | marginRight | 0 | — | |
| ...lumns-3 > col-0 > container | marginTop | 0 | — | |
| ...lumns-3 > col-0 > container | maxWidth | 100% | — | |
| ...lumns-3 > col-0 > container | overflow | hidden | — | |
| ...lumns-3 > col-0 > container | paddingBottom | 24px | — | |
| ...lumns-3 > col-0 > container | paddingLeft | 24px | xs:12px | |
| ...lumns-3 > col-0 > container | paddingRight | 24px | xs:12px | |
| ...lumns-3 > col-0 > container | paddingTop | 24px | — | |
| ...lumns-3 > col-0 > container | width | 100% | — | |
| ... > col-0 > container > text | color | #586069 | — | |
| ... > col-0 > container > text | display | block | — | |
| ... > col-0 > container > text | fontSize | 15px | — | |
| ... > col-0 > container > text | fontStyle | italic | — | |
| ... > col-0 > container > text | lineHeight | 1.6 | — | |
| ... > col-0 > container > text | marginBottom | 0 | — | |
| ... > col-0 > container > text | marginLeft | 0 | — | |
| ... > col-0 > container > text | marginRight | 0 | — | |
| ... > col-0 > container > text | marginTop | 0 | — | |
| ... > col-0 > container > text | paddingBottom | 0 | — | |
| ... > col-0 > container > text | paddingLeft | 0 | — | |
| ... > col-0 > container > text | paddingRight | 0 | — | |
| ... > col-0 > container > text | paddingTop | 0 | — | |
| ... > col-0 > container > text | color | #586069 | — | |
| ... > col-0 > container > text | display | block | — | |
| ... > col-0 > container > text | fontSize | 14px | — | |
| ... > col-0 > container > text | fontWeight | 600 | — | |
| ... > col-0 > container > text | lineHeight | 1 | — | |
| ... > col-0 > container > text | marginBottom | 0 | — | |
| ... > col-0 > container > text | marginLeft | 0 | — | |
| ... > col-0 > container > text | marginRight | 0 | — | |
| ... > col-0 > container > text | marginTop | 16px | — | |
| ... > col-0 > container > text | paddingBottom | 0 | — | |
| ... > col-0 > container > text | paddingLeft | 0 | — | |
| ... > col-0 > container > text | paddingRight | 0 | — | |
| ... > col-0 > container > text | paddingTop | 16px | — | |
| ... > col-0 > container > text | color | #6a737d | — | |
| ... > col-0 > container > text | display | block | — | |
| ... > col-0 > container > text | fontSize | 12px | — | |
| ... > col-0 > container > text | lineHeight | 1 | — | |
| ... > col-0 > container > text | marginBottom | 0 | — | |
| ... > col-0 > container > text | marginLeft | 0 | — | |
| ... > col-0 > container > text | marginRight | 0 | — | |
| ... > col-0 > container > text | marginTop | 4px | — | |
| ... > col-0 > container > text | paddingBottom | 0 | — | |
| ... > col-0 > container > text | paddingLeft | 0 | — | |
| ... > col-0 > container > text | paddingRight | 0 | — | |
| ... > col-0 > container > text | paddingTop | 4px | — | |
| ...lumns-3 > col-1 > container | alignItems | flex-start | — | |
| ...lumns-3 > col-1 > container | backgroundColor | #ffffff | — | |
| ...lumns-3 > col-1 > container | borderRadius | 8px | — | |
| ...lumns-3 > col-1 > container | borderStyle | none | — | |
| ...lumns-3 > col-1 > container | borderWidth | 0px | — | |
| ...lumns-3 > col-1 > container | boxSizing | border-box | — | |
| ...lumns-3 > col-1 > container | display | flex | — | |
| ...lumns-3 > col-1 > container | flex | 1 | — | |
| ...lumns-3 > col-1 > container | flexDirection | column | — | |
| ...lumns-3 > col-1 > container | height | 100% | — | |
| ...lumns-3 > col-1 > container | marginBottom | 0 | — | |
| ...lumns-3 > col-1 > container | marginLeft | 0 | — | |
| ...lumns-3 > col-1 > container | marginRight | 0 | — | |
| ...lumns-3 > col-1 > container | marginTop | 0 | — | |
| ...lumns-3 > col-1 > container | maxWidth | 100% | — | |
| ...lumns-3 > col-1 > container | overflow | hidden | — | |
| ...lumns-3 > col-1 > container | paddingBottom | 24px | — | |
| ...lumns-3 > col-1 > container | paddingLeft | 24px | xs:12px | |
| ...lumns-3 > col-1 > container | paddingRight | 24px | xs:12px | |
| ...lumns-3 > col-1 > container | paddingTop | 24px | — | |
| ...lumns-3 > col-1 > container | width | 100% | — | |
| ... > col-1 > container > text | color | #586069 | — | |
| ... > col-1 > container > text | display | block | — | |
| ... > col-1 > container > text | fontSize | 15px | — | |
| ... > col-1 > container > text | fontStyle | italic | — | |
| ... > col-1 > container > text | lineHeight | 1.6 | — | |
| ... > col-1 > container > text | marginBottom | 0 | — | |
| ... > col-1 > container > text | marginLeft | 0 | — | |
| ... > col-1 > container > text | marginRight | 0 | — | |
| ... > col-1 > container > text | marginTop | 0 | — | |
| ... > col-1 > container > text | paddingBottom | 0 | — | |
| ... > col-1 > container > text | paddingLeft | 0 | — | |
| ... > col-1 > container > text | paddingRight | 0 | — | |
| ... > col-1 > container > text | paddingTop | 0 | — | |
| ... > col-1 > container > text | color | #586069 | — | |
| ... > col-1 > container > text | display | block | — | |
| ... > col-1 > container > text | fontSize | 14px | — | |
| ... > col-1 > container > text | fontWeight | 600 | — | |
| ... > col-1 > container > text | lineHeight | 1 | — | |
| ... > col-1 > container > text | marginBottom | 0 | — | |
| ... > col-1 > container > text | marginLeft | 0 | — | |
| ... > col-1 > container > text | marginRight | 0 | — | |
| ... > col-1 > container > text | marginTop | 16px | — | |
| ... > col-1 > container > text | paddingBottom | 0 | — | |
| ... > col-1 > container > text | paddingLeft | 0 | — | |
| ... > col-1 > container > text | paddingRight | 0 | — | |
| ... > col-1 > container > text | paddingTop | 16px | — | |
| ... > col-1 > container > text | color | #6a737d | — | |
| ... > col-1 > container > text | display | block | — | |
| ... > col-1 > container > text | fontSize | 12px | — | |
| ... > col-1 > container > text | lineHeight | 1 | — | |
| ... > col-1 > container > text | marginBottom | 0 | — | |
| ... > col-1 > container > text | marginLeft | 0 | — | |
| ... > col-1 > container > text | marginRight | 0 | — | |
| ... > col-1 > container > text | marginTop | 4px | — | |
| ... > col-1 > container > text | paddingBottom | 0 | — | |
| ... > col-1 > container > text | paddingLeft | 0 | — | |
| ... > col-1 > container > text | paddingRight | 0 | — | |
| ... > col-1 > container > text | paddingTop | 4px | — | |
| ...lumns-3 > col-2 > container | alignItems | flex-start | — | |
| ...lumns-3 > col-2 > container | backgroundColor | #ffffff | — | |
| ...lumns-3 > col-2 > container | borderRadius | 8px | — | |
| ...lumns-3 > col-2 > container | borderStyle | none | — | |
| ...lumns-3 > col-2 > container | borderWidth | 0px | — | |
| ...lumns-3 > col-2 > container | boxSizing | border-box | — | |
| ...lumns-3 > col-2 > container | display | flex | — | |
| ...lumns-3 > col-2 > container | flex | 1 | — | |
| ...lumns-3 > col-2 > container | flexDirection | column | — | |
| ...lumns-3 > col-2 > container | height | 100% | — | |
| ...lumns-3 > col-2 > container | marginBottom | 0 | — | |
| ...lumns-3 > col-2 > container | marginLeft | 0 | — | |
| ...lumns-3 > col-2 > container | marginRight | 0 | — | |
| ...lumns-3 > col-2 > container | marginTop | 0 | — | |
| ...lumns-3 > col-2 > container | maxWidth | 100% | — | |
| ...lumns-3 > col-2 > container | overflow | hidden | — | |
| ...lumns-3 > col-2 > container | paddingBottom | 24px | — | |
| ...lumns-3 > col-2 > container | paddingLeft | 24px | xs:12px | |
| ...lumns-3 > col-2 > container | paddingRight | 24px | xs:12px | |
| ...lumns-3 > col-2 > container | paddingTop | 24px | — | |
| ...lumns-3 > col-2 > container | width | 100% | — | |
| ... > col-2 > container > text | color | #586069 | — | |
| ... > col-2 > container > text | display | block | — | |
| ... > col-2 > container > text | fontSize | 15px | — | |
| ... > col-2 > container > text | fontStyle | italic | — | |
| ... > col-2 > container > text | lineHeight | 1.6 | — | |
| ... > col-2 > container > text | marginBottom | 0 | — | |
| ... > col-2 > container > text | marginLeft | 0 | — | |
| ... > col-2 > container > text | marginRight | 0 | — | |
| ... > col-2 > container > text | marginTop | 0 | — | |
| ... > col-2 > container > text | paddingBottom | 0 | — | |
| ... > col-2 > container > text | paddingLeft | 0 | — | |
| ... > col-2 > container > text | paddingRight | 0 | — | |
| ... > col-2 > container > text | paddingTop | 0 | — | |
| ... > col-2 > container > text | color | #586069 | — | |
| ... > col-2 > container > text | display | block | — | |
| ... > col-2 > container > text | fontSize | 14px | — | |
| ... > col-2 > container > text | fontWeight | 600 | — | |
| ... > col-2 > container > text | lineHeight | 1 | — | |
| ... > col-2 > container > text | marginBottom | 0 | — | |
| ... > col-2 > container > text | marginLeft | 0 | — | |
| ... > col-2 > container > text | marginRight | 0 | — | |
| ... > col-2 > container > text | marginTop | 16px | — | |
| ... > col-2 > container > text | paddingBottom | 0 | — | |
| ... > col-2 > container > text | paddingLeft | 0 | — | |
| ... > col-2 > container > text | paddingRight | 0 | — | |
| ... > col-2 > container > text | paddingTop | 16px | — | |
| ... > col-2 > container > text | color | #6a737d | — | |
| ... > col-2 > container > text | display | block | — | |
| ... > col-2 > container > text | fontSize | 12px | — | |
| ... > col-2 > container > text | lineHeight | 1 | — | |
| ... > col-2 > container > text | marginBottom | 0 | — | |
| ... > col-2 > container > text | marginLeft | 0 | — | |
| ... > col-2 > container > text | marginRight | 0 | — | |
| ... > col-2 > container > text | marginTop | 4px | — | |
| ... > col-2 > container > text | paddingBottom | 0 | — | |
| ... > col-2 > container > text | paddingLeft | 0 | — | |
| ... > col-2 > container > text | paddingRight | 0 | — | |
| ... > col-2 > container > text | paddingTop | 4px | — | |

---

## Video Showcase (`video-showcase`)

**Content Props:**

| Element | Property | Value | E/H |
|---------|----------|-------|-----|
| heading | text | See It in Action | |
| heading | level | h2 | |
| heading | tag | h2 | |
| text | text | Watch how our product transforms the way... | |
| video | src | /videos/placeholder.mp4 | |
| video | alt |  | |
| video | settingId | video | |

**Style Props:**

| Element | Property | Base Value | Responsive | E/H |
|---------|----------|------------|------------|-----|
| container | alignItems | center | — | |
| container | backgroundColor | #1a1a1a | — | |
| container | borderStyle | none | — | |
| container | borderWidth | 0px | — | |
| container | boxSizing | border-box | — | |
| container | display | flex | — | |
| container | flex | 1 | — | |
| container | flexDirection | column | — | |
| container | height | 100% | — | |
| container | marginBottom | 0 | — | |
| container | marginLeft | 0 | — | |
| container | marginRight | 0 | — | |
| container | marginTop | 0 | — | |
| container | maxWidth | 100% | — | |
| container | overflow | hidden | — | |
| container | paddingBottom | 60px | xs:30px, sm:42px | |
| container | paddingLeft | 20px | — | |
| container | paddingRight | 20px | — | |
| container | paddingTop | 60px | xs:30px, sm:42px | |
| container | textAlign | center | — | |
| container | width | 100% | — | |
| container > heading | color | #ffffff | — | |
| container > heading | display | block | — | |
| container > heading | fontSize | 36px | xs:22px, sm:27px | |
| container > heading | fontWeight | bold | — | |
| container > heading | lineHeight | 1.2 | — | |
| container > heading | marginBottom | 0 | — | |
| container > heading | marginLeft | 0 | — | |
| container > heading | marginRight | 0 | — | |
| container > heading | marginTop | 0 | — | |
| container > heading | paddingBottom | 0 | — | |
| container > heading | paddingLeft | 0 | — | |
| container > heading | paddingRight | 0 | — | |
| container > heading | paddingTop | 0 | — | |
| container > heading | textAlign | center | — | |
| container > text | color | #e1e4e8 | — | |
| container > text | display | block | — | |
| container > text | fontSize | 16px | — | |
| container > text | lineHeight | 1.6 | — | |
| container > text | marginBottom | 10px | — | |
| container > text | marginLeft | 0 | — | |
| container > text | marginRight | 0 | — | |
| container > text | marginTop | 0 | — | |
| container > text | maxWidth | 500px | — | |
| container > text | paddingBottom | 32px | — | |
| container > text | paddingLeft | 0 | — | |
| container > text | paddingRight | 0 | — | |
| container > text | paddingTop | 0 | — | |
| container > video | borderRadius | 8px | — | |
| container > video | display | block | — | |
| container > video | height | auto | — | |
| container > video | marginBottom | 0 | — | |
| container > video | marginLeft | 0 | — | |
| container > video | marginRight | 0 | — | |
| container > video | marginTop | 0 | — | |
| container > video | maxWidth | 800px | — | |
| container > video | width | 100% | — | |

