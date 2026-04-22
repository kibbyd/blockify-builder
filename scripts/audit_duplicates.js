// Quick script to output duplicates list cleanly
// Run via: npx jest __tests__/unit/elemDefDefaultsAudit.test.js
// This file is just for reference - the actual logic is in the test

// Duplicates to remove from elementDefinitions (already in route 2):
const duplicates = [
  // container (style)
  "container | width",
  "container | display",
  "container | flexDirection",
  "container | overflow",
  // heading (content)
  "heading | text",
  "heading | tag",
  // text (content)
  "text | text",
  // image (content)
  "image | alt",
  "image | overlayText",
  "image | textPosition",
  "image | textColor",
  "image | textBackground",
  "image | showOverlay",
  // video (content + style)
  "video | alt",
  "video | controls",
  "video | autoplay",
  "video | muted",
  "video | loop",
  "video | width",
  "video | height",
  // button (content + style)
  "button | text",
  "button | url",
  "button | color",
  "button | backgroundColor",
  "button | paddingTop",
  "button | paddingBottom",
  "button | paddingLeft",
  "button | paddingRight",
  "button | borderWidth",
  "button | borderStyle",
  "button | borderRadius",
  // icon (content + style)
  "icon | alt",
  "icon | iconSize",
  "icon | width",
  "icon | height",
  // spacer (style)
  "spacer | height",
  "spacer | width",
  // image-background (content + style)
  "image-background | alt",
  "image-background | backgroundSize",
  "image-background | backgroundPosition",
  "image-background | backgroundRepeat",
  "image-background | paddingTop",
  "image-background | paddingBottom",
  "image-background | paddingLeft",
  "image-background | paddingRight",
  "image-background | minHeight",
  "image-background | alignItems",
  "image-background | justifyContent",
  // list (content)
  "list | html",
  // unordered-list (content)
  "unordered-list | html",
  // table (content)
  "table | html",
  "table | tableCellPadding",
  "table | tableBorderWidth",
  "table | tableBorderColor",
  "table | headerColor",
  "table | headerTextColor",
  "table | stripedRows",
  "table | hoverHighlight",
  // product-grid (style)
  "product-grid | gap",
  // collection-list (style)
  "collection-list | gap",
  // image-gallery (content)
  "image-gallery | imageCount",
  "image-gallery | enableLightbox",
  // flip-card (content)
  "flip-card | frontImage (as empty string)",
  // before-after (content)
  "before-after | beforeImage",
  "before-after | afterImage",
  // countdown (style)
  "countdown | backgroundColor (as #ffffff via getDefaultStyle)",
];

console.log("Total duplicates:", duplicates.length);
