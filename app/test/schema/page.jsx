"use client";

import React, { useState, useCallback, useRef } from "react";
import { convertJSONToLiquid } from "@/app/_utils/jsonToLiquid";
import { buildPreviewDocument } from "@/app/_utils/liquidResolver";
import { elementDefinitions } from "@/app/_config/elementDefinitions";

// ─── Skip internal-only types ────────────────────────────────
const SKIP_TYPES = ["column"];

// ─── UID generator ───────────────────────────────────────────
const uid = (() => {
  let c = 0;
  return (prefix = "schema-test") => `${prefix}-${++c}`;
})();

// ─── Property-to-Element mapping ─────────────────────────────
// This is the source of truth: which properties SHOULD exist on which element.
// Derived from elementDefinitions.js — if a prop appears in styleProps or
// contentProps for that element, it belongs. Visibility props are universal.

const buildPropMap = () => {
  const map = {};
  for (const [type, def] of Object.entries(elementDefinitions)) {
    if (SKIP_TYPES.includes(type)) continue;
    const allProps = {};

    // Content props
    (def.contentProps || []).forEach((p) => {
      allProps[p.name] = {
        kind: "content",
        schemaType: p.schemaType,
        controlType: p.controlType,
        responsive: !!p.responsive,
        default: p.default,
        label: p.label,
        options: p.options,
      };
    });

    // Style props
    (def.styleProps || []).forEach((p) => {
      allProps[p.name] = {
        kind: "style",
        schemaType: p.schemaType,
        controlType: p.controlType,
        responsive: !!p.responsive,
        default: p.default,
        label: p.label,
        options: p.options,
      };
    });

    map[type] = {
      displayName: def.displayName || type,
      category: def.category || "unknown",
      props: allProps,
    };
  }
  return map;
};

const PROP_MAP = buildPropMap();

// ─── Element Fixtures with ALL toggles ON ────────────────────
// Reuses the same sensible defaults as /test/elements, but sets
// schemaToggles to enable EVERY property.

const makeElement = (type, props = {}, style = {}, extra = {}) => {
  // Build schemaToggles: every prop in the definition → true
  const schemaToggles = {};
  const def = elementDefinitions[type];
  if (def) {
    (def.contentProps || []).forEach((p) => { schemaToggles[p.name] = true; });
    (def.styleProps || []).forEach((p) => { schemaToggles[p.name] = true; });
  }

  return {
    id: uid(),
    type,
    props,
    style,
    schemaToggles,
    responsiveStyles: {},
    ...extra,
  };
};

const makeChildHeading = (text) => {
  const el = makeElement("heading", { text, tag: "h3" }, { fontSize: "20px", color: "#333333", textAlign: "center" });
  return el;
};

const makeChildText = (text) => {
  const el = makeElement("text", { text }, { fontSize: "14px", color: "#666666", textAlign: "center" });
  return el;
};

const buildFixture = (type) => {
  const now = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const targetDate = now.toISOString().split("T")[0] + "T00:00:00";

  switch (type) {
    case "container":
      return makeElement("container", { backgroundVideo: "https://example.com/video.mp4" }, { backgroundColor: "#f5f5f5", paddingTop: "40px", paddingBottom: "40px", paddingLeft: "20px", paddingRight: "20px", backgroundVideoOpacity: "0.5" }, {
        children: [makeChildHeading("Container Child"), makeChildText("Content inside container.")],
      });

    case "columns-1":
      return makeElement("columns-1", {}, { paddingTop: "20px", paddingBottom: "20px" }, {
        columns: [[makeChildHeading("Single Column"), makeChildText("Column content.")]],
      });
    case "columns-2":
      return makeElement("columns-2", {}, { paddingTop: "20px", paddingBottom: "20px" }, {
        columns: [
          [makeChildHeading("Column A"), makeChildText("Left content.")],
          [makeChildHeading("Column B"), makeChildText("Right content.")],
        ],
      });
    case "columns-3":
      return makeElement("columns-3", {}, { paddingTop: "20px", paddingBottom: "20px" }, {
        columns: [[makeChildHeading("C1")], [makeChildHeading("C2")], [makeChildHeading("C3")]],
      });
    case "columns-4":
      return makeElement("columns-4", {}, { paddingTop: "20px", paddingBottom: "20px" }, {
        columns: [[makeChildHeading("C1")], [makeChildHeading("C2")], [makeChildHeading("C3")], [makeChildHeading("C4")]],
      });
    case "columns-5":
      return makeElement("columns-5", {}, { paddingTop: "20px", paddingBottom: "20px" }, {
        columns: [[makeChildHeading("C1")], [makeChildHeading("C2")], [makeChildHeading("C3")], [makeChildHeading("C4")], [makeChildHeading("C5")]],
      });
    case "columns-6":
      return makeElement("columns-6", {}, { paddingTop: "20px", paddingBottom: "20px" }, {
        columns: [[makeChildHeading("C1")], [makeChildHeading("C2")], [makeChildHeading("C3")], [makeChildHeading("C4")], [makeChildHeading("C5")], [makeChildHeading("C6")]],
      });

    case "spacer":
      return makeElement("spacer", {}, { height: "40px" });

    case "image-background":
      return makeElement("image-background", { src: "/images/placeholder.svg" }, {
        height: "300px", backgroundSize: "cover", backgroundPosition: "center center",
        backgroundColor: "#2d3436", paddingTop: "60px", paddingBottom: "60px", paddingLeft: "20px", paddingRight: "20px",
      }, {
        children: [
          makeElement("heading", { text: "Overlay Heading", tag: "h2" }, { fontSize: "32px", color: "#ffffff", textAlign: "center" }),
          makeElement("text", { text: "Text on image background." }, { fontSize: "16px", color: "#eeeeee", textAlign: "center" }),
        ],
      });

    case "heading":
      return makeElement("heading", { text: "Sample Heading", tag: "h2" }, { fontSize: "32px", fontWeight: "700", color: "#111111", textAlign: "center" });
    case "text":
      return makeElement("text", { text: "Sample paragraph text for schema testing." }, { fontSize: "16px", color: "#333333", lineHeight: "1.6", textAlign: "left" });
    case "image":
      return makeElement("image", { src: "/images/placeholder.svg" }, { width: "100%", borderRadius: "8px", hoverAnimation: "grow" });
    case "video":
      return makeElement("video", { src: "" }, { width: "100%" });
    case "button":
      return makeElement("button", { text: "Click Me", url: "#" }, {
        fontSize: "16px", fontWeight: "600", color: "#ffffff", backgroundColor: "#2563eb",
        paddingTop: "12px", paddingBottom: "12px", paddingLeft: "32px", paddingRight: "32px", borderRadius: "6px",
        hoverAnimation: "grow",
      });
    case "icon":
      return makeElement("icon", { src: "/images/placeholder.svg" }, { iconSize: "48px" });
    case "divider":
      return makeElement("divider", {}, { borderStyle: "solid", borderColor: "#e0e0e0", borderWidth: "1px", width: "100%", marginTop: "20px", marginBottom: "20px" });

    case "list":
      return makeElement("list", { html: "<ol><li>First</li><li>Second</li><li>Third</li></ol>" }, { fontSize: "16px", color: "#333333" });
    case "unordered-list":
      return makeElement("unordered-list", { html: "<ul><li>Apple</li><li>Banana</li><li>Cherry</li></ul>" }, { fontSize: "16px", color: "#333333" });
    case "table":
      return makeElement("table", {
        html: "<table><thead><tr><th>Name</th><th>Price</th></tr></thead><tbody><tr><td>Widget</td><td>$9.99</td></tr></tbody></table>",
        cellPadding: "8px", borderWidth: "1px", borderColor: "#dddddd", headerColor: "#f5f5f5", headerTextColor: "#333333",
        stripedRows: true, hoverHighlight: true,
      }, { width: "100%" });
    case "map":
      return makeElement("map", { address: "New York, NY" }, { width: "100%", height: "300px" });

    case "product-card":
      return makeElement("product-card", { showImage: true, showTitle: true, showPrice: true, showButton: true, buttonText: "Add to Cart" }, {
        backgroundColor: "#ffffff", color: "#000000", buttonColor: "#ffffff", buttonBackgroundColor: "#000000",
        paddingTop: "16px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px",
      });
    case "product-grid":
      return makeElement("product-grid", { columns: "3", rows: "2", showPrice: true, showButton: true, buttonText: "Add to Cart" }, {
        gap: "20px", backgroundColor: "#ffffff", color: "#000000", buttonColor: "#ffffff", buttonBackgroundColor: "#000000",
        paddingTop: "12px", paddingBottom: "12px", paddingLeft: "12px", paddingRight: "12px",
      });
    case "collection-list":
      return makeElement("collection-list", { columns: "3", showImage: true, showTitle: true, showCount: true }, {
        gap: "20px", backgroundColor: "#ffffff", color: "#000000", borderRadius: "8px",
      });
    case "accordion":
      return makeElement("accordion", {
        itemCount: 3,
        panelTitle_1: "Question 1?", panelContent_1: "Answer 1.",
        panelTitle_2: "Question 2?", panelContent_2: "Answer 2.",
        panelTitle_3: "Question 3?", panelContent_3: "Answer 3.",
      }, {
        titleFontSize: "16px", titleFontWeight: "600", contentFontSize: "14px",
        titleColor: "#333333", contentBackgroundColor: "#ffffff", borderColor: "#dee2e6",
      });
    case "tabs":
      return makeElement("tabs", {
        tabCount: 3,
        tabLabel_1: "Tab 1", tabContent_1: "Content for tab 1.",
        tabLabel_2: "Tab 2", tabContent_2: "Content for tab 2.",
        tabLabel_3: "Tab 3", tabContent_3: "Content for tab 3.",
      }, {
        tabFontSize: "14px", contentFontSize: "14px",
        tabBackgroundColor: "#f0f0f0", tabActiveBackgroundColor: "#ffffff",
        tabColor: "#666666", tabActiveColor: "#333333", contentBackgroundColor: "#ffffff", borderColor: "#dee2e6",
      });
    case "countdown":
      return makeElement("countdown", {
        targetDate, expiredMessage: "Offer ended!",
        showDays: true, showHours: true, showMinutes: true, showSeconds: true,
      }, {
        digitColor: "#333333", labelColor: "#666666", digitFontSize: "36px", labelFontSize: "12px", separatorStyle: "colon",
      });
    case "slideshow":
      return makeElement("slideshow", {
        slideCount: 3, autoplay: true, autoplayInterval: 5000, showArrows: true, showDots: true,
        slideImage_1: "/images/placeholder.svg", slideHeading_1: "Slide 1", slideText_1: "First slide.",
        slideImage_2: "/images/placeholder.svg", slideHeading_2: "Slide 2", slideText_2: "Second slide.",
        slideImage_3: "/images/placeholder.svg", slideHeading_3: "Slide 3", slideText_3: "Third slide.",
      }, {
        headingFontSize: "32px", textFontSize: "16px", height: "400px",
      });

    case "form":
      return makeElement("form", {
        formAction: "", showName: true, showEmail: true, showPhone: true, showMessage: true,
        submitText: "Submit", namePlaceholder: "Name", emailPlaceholder: "Email", phonePlaceholder: "Phone", messagePlaceholder: "Message",
      }, {
        fontSize: "14px", color: "#333333", backgroundColor: "#ffffff", buttonColor: "#ffffff", buttonBackgroundColor: "#000000",
      });
    case "popup":
      return makeElement("popup", {
        triggerText: "Open Popup", popupTitle: "Special Offer!",
        popupContent: "Sign up and get 10% off.", showEmailField: true,
        emailPlaceholder: "Your email", submitText: "Subscribe",
      }, {
        fontSize: "14px", titleFontSize: "24px", buttonColor: "#ffffff", buttonBackgroundColor: "#000000",
      });

    case "social-icons":
      return makeElement("social-icons", {
        facebook: "https://facebook.com", instagram: "https://instagram.com", twitter: "https://x.com",
        youtube: "https://youtube.com", tiktok: "https://tiktok.com", linkedin: "https://linkedin.com", pinterest: "https://pinterest.com",
      }, {
        iconSize: "32px", iconColor: "#333333", gap: "12px",
      });
    case "image-gallery":
      return makeElement("image-gallery", {
        imageCount: 4, enableLightbox: true,
        image_1: "/images/placeholder.svg", image_2: "/images/placeholder.svg",
        image_3: "/images/placeholder.svg", image_4: "/images/placeholder.svg",
      }, { columns: "2", gap: "8px", borderRadius: "4px" });
    case "flip-card":
      return makeElement("flip-card", {
        frontTitle: "Front", frontContent: "Hover to flip", frontImage: "/images/placeholder.svg",
        backTitle: "Back", backContent: "Hidden content.", backButtonText: "Learn More", backButtonUrl: "#",
        flipDirection: "horizontal",
      }, {
        width: "300px", height: "250px", titleFontSize: "20px", buttonColor: "#ffffff", buttonBackgroundColor: "#000000",
      });
    case "progress-bar":
      return makeElement("progress-bar", {
        label: "Progress", percentage: 75, showPercentage: true, showLabel: true, animated: true,
      }, { fontSize: "14px", color: "#333333", barColor: "#000000" });
    case "before-after":
      return makeElement("before-after", {
        beforeImage: "/images/placeholder.svg", afterImage: "/images/placeholder.svg",
        beforeLabel: "Before", afterLabel: "After", startPosition: 50, labelColor: "#ffffff",
      }, { width: "100%", height: "300px", borderRadius: "8px" });
    case "marquee":
      return makeElement("marquee", {
        text: "Free shipping on orders over $50  |  New arrivals  |  Limited time  |  ",
        speed: 20, pauseOnHover: true, direction: "left",
      }, { fontSize: "16px", fontWeight: "600", color: "#ffffff", backgroundColor: "#000000", paddingTop: "12px", paddingBottom: "12px" });
    case "blog-post":
      return makeElement("blog-post", {
        postCount: 3, showImage: true, showExcerpt: true, showDate: true, showAuthor: true, showReadMore: true, readMoreText: "Read More",
      }, { columns: "3", gap: "20px", titleFontSize: "18px", fontSize: "14px" });
    default: {
      const def = elementDefinitions[type];
      if (!def) return null;
      const props = {};
      const style = {};
      (def.contentProps || []).forEach((p) => {
        if (p.default !== undefined && p.default !== null) props[p.name] = p.default;
      });
      (def.styleProps || []).forEach((p) => {
        if (p.default !== undefined && p.default !== null) style[p.name] = p.default;
      });
      return makeElement(type, props, style);
    }
  }
};

// ─── Schema Analysis ─────────────────────────────────────────
// Extracts schema settings from the generated Liquid code and
// cross-references against the property map.

const extractSchemaSettings = (liquidCode) => {
  const schemaMatch = liquidCode.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (!schemaMatch) return null;
  try {
    return JSON.parse(schemaMatch[1]);
  } catch {
    return null;
  }
};

const extractSettingRefsFromCode = (liquidCode) => {
  // Find all section.settings.xxx references in everything before {% schema %}
  // This includes both CSS (<style> blocks) and HTML
  const schemaStart = liquidCode.indexOf("{% schema %}");
  const codePart = schemaStart > -1 ? liquidCode.substring(0, schemaStart) : liquidCode;
  const refs = new Set();
  const re = /section\.settings\.([\w]+)/g;
  let m;
  while ((m = re.exec(codePart)) !== null) {
    refs.add(m[1]);
  }
  return refs;
};

// ─── Test Runner ─────────────────────────────────────────────

const runSchemaTest = (type) => {
  try {
    return _runSchemaTest(type);
  } catch (e) {
    return {
      type,
      displayName: PROP_MAP[type]?.displayName || type,
      category: PROP_MAP[type]?.category || "unknown",
      definedProps: [],
      totalProps: 0,
      liquidCode: "",
      schemaJSON: null,
      checks: [{ name: "Runtime error", pass: false, errors: [e.message + (e.stack ? "\n" + e.stack.split("\n")[1] : "")] }],
      passCount: 0,
      failCount: 1,
      warnCount: 0,
    };
  }
};

const _runSchemaTest = (type) => {
  const propInfo = PROP_MAP[type];
  if (!propInfo) return { type, error: `No definition for ${type}` };

  const result = {
    type,
    displayName: propInfo.displayName,
    category: propInfo.category,
    definedProps: Object.keys(propInfo.props),
    totalProps: Object.keys(propInfo.props).length,
    liquidCode: "",
    schemaJSON: null,
    checks: [],
    passCount: 0,
    failCount: 0,
    warnCount: 0,
  };

  // Build fixture with all toggles on
  const element = buildFixture(type);
  if (!element) {
    result.checks.push({ name: "Build fixture", pass: false, errors: ["Could not build fixture"] });
    result.failCount++;
    return result;
  }
  result.checks.push({ name: "Build fixture", pass: true, errors: [] });
  result.passCount++;

  // Export to Liquid
  try {
    const jsonData = { elements: [element], responsiveStyles: {} };
    result.liquidCode = convertJSONToLiquid(jsonData, `schema-test-${type}`);
  } catch (e) {
    result.checks.push({ name: "Liquid export", pass: false, errors: [e.message] });
    result.failCount++;
    return result;
  }
  result.checks.push({ name: "Liquid export", pass: true, errors: [] });
  result.passCount++;

  // Parse schema
  result.schemaJSON = extractSchemaSettings(result.liquidCode);
  if (!result.schemaJSON) {
    result.checks.push({ name: "Schema parse", pass: false, errors: ["Could not extract schema JSON"] });
    result.failCount++;
    return result;
  }
  result.checks.push({ name: "Schema parse", pass: true, errors: [] });
  result.passCount++;

  const schemaSettings = result.schemaJSON.settings || [];
  // Filter out "header" type entries — these are visual grouping labels in Shopify,
  // not actual settings. They intentionally have no .id field.
  const actualSettings = schemaSettings.filter((s) => s.type !== "header");
  const schemaSettingIds = new Set(actualSettings.map((s) => s.id));

  // Check: no malformed settings (undefined IDs) — headers already excluded
  const malformedSettings = actualSettings.filter((s) => !s.id || s.id === "undefined");
  if (malformedSettings.length > 0) {
    result.checks.push({
      name: "No malformed settings",
      pass: false,
      errors: malformedSettings.map((s) => `Setting with undefined ID (type: ${s.type}, label: ${s.label || "none"})`),
    });
    result.failCount++;
  } else {
    result.checks.push({ name: "No malformed settings", pass: true, errors: [] });
    result.passCount++;
  }

  // Check: every setting ref in HTML/CSS exists in schema
  const codeRefs = extractSettingRefsFromCode(result.liquidCode);
  const orphanRefs = [];
  codeRefs.forEach((ref) => {
    if (!schemaSettingIds.has(ref)) {
      orphanRefs.push(ref);
    }
  });
  if (orphanRefs.length > 0) {
    result.checks.push({
      name: "No orphan references",
      pass: false,
      errors: orphanRefs.map((r) => `HTML/CSS references section.settings.${r} but it's not in schema`),
    });
    result.failCount++;
  } else {
    result.checks.push({ name: "No orphan references", pass: true, errors: [] });
    result.passCount++;
  }

  // Check: every schema setting is actually referenced in HTML/CSS
  // Skip visibility props (hideOnMobile etc.) — they're consumed by Shopify, not our HTML
  const visibilitySettingSuffixes = ["hideOnMobile", "hideOnDesktop", "hideOnFullscreen"];
  const unusedSettings = [];
  actualSettings.forEach((s) => {
    if (!s.id || s.id === "undefined") return; // skip malformed
    // Skip visibility settings — consumed by Shopify, not our HTML/CSS
    const isVisibility = visibilitySettingSuffixes.some((v) => s.id.endsWith(v));
    if (isVisibility) return;
    if (!codeRefs.has(s.id)) {
      unusedSettings.push(s.id);
    }
  });
  if (unusedSettings.length > 0) {
    result.checks.push({
      name: "No unused schema settings",
      pass: false,
      errors: unusedSettings.map((id) => `Schema setting "${id}" exists but is never referenced in HTML/CSS`),
    });
    result.failCount++;
  } else {
    result.checks.push({ name: "No unused schema settings", pass: true, errors: [] });
    result.passCount++;
  }

  // Check: schema setting types match definition
  const typeMismatches = [];
  actualSettings.forEach((s) => {
    if (!s.id || typeof s.id !== "string") return;
    // Extract the prop name from the setting ID (format: s_timestamp_counter_propName[_breakpoint])
    // We check against the element's prop definitions
    const idParts = s.id.split("_");
    // Setting IDs: s_{timestamp}_{counter}_{prop}[_{breakpoint}]
    // We need to find which prop this setting corresponds to
    // The prop name starts after the 3rd underscore segment
    if (idParts.length >= 4) {
      // Reconstruct prop name — could be multi-segment like "slideHeading_1"
      // Breakpoints are: mobile, desktop, fullscreen
      const breakpoints = ["mobile", "desktop", "fullscreen"];
      let propName;
      const lastPart = idParts[idParts.length - 1];
      if (breakpoints.includes(lastPart)) {
        propName = idParts.slice(3, -1).join("_");
      } else {
        propName = idParts.slice(3).join("_");
      }

      const propDef = propInfo.props[propName];
      if (propDef && propDef.schemaType) {
        if (s.type !== propDef.schemaType) {
          // Special case: "range" can map to "number" in schema
          const compatible =
            (propDef.schemaType === "number" && s.type === "range") ||
            (propDef.schemaType === "range" && s.type === "number") ||
            (propDef.schemaType === "text" && s.type === "textarea") ||
            (propDef.schemaType === "textarea" && s.type === "text");
          if (!compatible) {
            typeMismatches.push(`${propName}: expected schema type "${propDef.schemaType}" but got "${s.type}"`);
          }
        }
      }
    }
  });
  if (typeMismatches.length > 0) {
    result.checks.push({
      name: "Schema type consistency",
      pass: false,
      errors: typeMismatches,
    });
    result.failCount++;
  } else {
    result.checks.push({ name: "Schema type consistency", pass: true, errors: [] });
    result.passCount++;
  }

  // Info: summary
  result.checks.push({
    name: "Summary",
    pass: true,
    info: `${actualSettings.length} schema settings (+ ${schemaSettings.length - actualSettings.length} headers), ${codeRefs.size} code references, ${result.totalProps} defined props`,
    errors: [],
  });
  result.passCount++;

  return result;
};

// ─── Preview Modal ───────────────────────────────────────────

function PreviewModal({ liquidCode, elementName, onClose }) {
  const iframeRef = useRef(null);
  const [viewWidth, setViewWidth] = useState("100%");

  const previewDoc = buildPreviewDocument(liquidCode);

  const writeToIframe = useCallback(
    (iframe) => {
      if (!iframe) return;
      iframeRef.current = iframe;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(previewDoc);
        doc.close();
      }
    },
    [previewDoc]
  );

  const viewports = [
    { label: "Mobile", width: "375px", name: "mobile" },
    { label: "Tablet", width: "768px", name: "tablet" },
    { label: "Desktop", width: "100%", name: "desktop" },
  ];

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.85)", zIndex: 9999,
        display: "flex", flexDirection: "column",
      }}
      data-id="schema-test--modal--preview"
    >
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 20px", backgroundColor: "#161b22", borderBottom: "1px solid #30363d",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#c9d1d9", fontWeight: "600", fontSize: "16px" }}>
            Schema Preview: {elementName}
          </span>
          <span style={{ color: "#8b949e", fontSize: "12px" }}>
            All properties toggled ON — resolved with schema defaults
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {viewports.map((vp) => (
            <button
              key={vp.name}
              onClick={() => setViewWidth(vp.width)}
              data-id={`schema-test--button--viewport-${vp.name}`}
              style={{
                padding: "4px 12px", fontSize: "12px",
                backgroundColor: viewWidth === vp.width ? "#238636" : "#21262d",
                color: "#c9d1d9", border: "1px solid #30363d", borderRadius: "4px", cursor: "pointer",
              }}
            >
              {vp.label}
            </button>
          ))}
          <button
            onClick={onClose}
            data-id="schema-test--button--close-preview"
            style={{
              padding: "4px 12px", fontSize: "14px", backgroundColor: "#da3633",
              color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginLeft: "12px",
            }}
          >
            Close
          </button>
        </div>
      </div>
      <div style={{
        flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start",
        padding: "20px", overflow: "auto", backgroundColor: "#1a1a2e",
      }}>
        <div style={{
          width: viewWidth, maxWidth: "100%", transition: "width 0.3s ease",
          backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        }}>
          <iframe
            ref={writeToIframe}
            style={{ width: "100%", minHeight: "400px", border: "none", display: "block" }}
            title={`Preview: ${elementName}`}
            sandbox="allow-same-origin"
            data-id="schema-test--iframe--preview"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────

const thStyle = {
  padding: "10px 12px", textAlign: "left", fontSize: "12px",
  fontWeight: "600", textTransform: "uppercase", color: "#8b949e",
  borderBottom: "1px solid #30363d",
};
const tdStyle = { padding: "10px 12px", fontSize: "13px", verticalAlign: "top" };
const actionBtnStyle = {
  padding: "3px 10px", fontSize: "11px", backgroundColor: "#21262d",
  color: "#c9d1d9", border: "1px solid #30363d", borderRadius: "4px", cursor: "pointer",
};

// ─── Main Page ───────────────────────────────────────────────

export default function SchemaTestPage() {
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [filter, setFilter] = useState("all");
  const [previewIndex, setPreviewIndex] = useState(null);
  const [expandedChecks, setExpandedChecks] = useState({});
  const [expandedProps, setExpandedProps] = useState({});

  const allTypes = Object.keys(elementDefinitions).filter((t) => !SKIP_TYPES.includes(t));

  const runTests = useCallback(() => {
    setRunning(true);
    setExpandedChecks({});
    setExpandedProps({});
    setPreviewIndex(null);
    setTimeout(() => {
      const testResults = allTypes.map(runSchemaTest);
      setResults(testResults);
      setRunning(false);
    }, 50);
  }, [allTypes]);

  const toggleChecks = (i) => setExpandedChecks((prev) => ({ ...prev, [i]: !prev[i] }));
  const toggleProps = (i) => setExpandedProps((prev) => ({ ...prev, [i]: !prev[i] }));

  const exportReport = useCallback(() => {
    if (!results) return;
    const lines = [];
    lines.push("SCHEMA VALIDATION REPORT");
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push("All properties toggled ON for each element type");
    lines.push("=".repeat(60) + "\n");

    for (const r of results) {
      if (r.failCount === 0) continue;
      lines.push(`FAIL: ${r.displayName} (${r.type})`);
      lines.push(`  Props: ${r.totalProps} | Checks: ${r.passCount} pass, ${r.failCount} fail`);
      for (const c of r.checks.filter((c) => !c.pass)) {
        lines.push(`  [${c.name}]`);
        for (const e of c.errors) lines.push(`    - ${e}`);
      }
      lines.push("");
    }

    const failCount = results.filter((r) => r.failCount > 0).length;
    lines.push("=".repeat(60));
    lines.push(`TOTAL: ${failCount} elements with issues out of ${results.length}`);

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schema-validation-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  const totalElements = results?.length || 0;
  const passElements = results?.filter((r) => r.failCount === 0).length || 0;
  const failElements = totalElements - passElements;
  const totalChecks = results?.reduce((s, r) => s + r.passCount + r.failCount, 0) || 0;
  const totalCheckFails = results?.reduce((s, r) => s + r.failCount, 0) || 0;

  const filtered = results
    ? filter === "all" ? results
    : filter === "fail" ? results.filter((r) => r.failCount > 0)
    : results.filter((r) => r.failCount === 0)
    : [];

  return (
    <div style={{
      fontFamily: "system-ui, sans-serif", padding: "40px", maxWidth: "1400px",
      margin: "0 auto", backgroundColor: "#0d1117", color: "#c9d1d9", minHeight: "100vh",
    }}>
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }} data-id="schema-test--heading--title">
        Schema Validation Test
      </h1>
      <p style={{ color: "#8b949e", marginBottom: "24px" }}>
        Tests all {allTypes.length} element types with ALL properties toggled ON.
        Validates schema output, setting references, type consistency, and WYSIWYG rendering.
      </p>

      <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
        <button
          onClick={runTests}
          disabled={running}
          data-id="schema-test--button--run"
          style={{
            padding: "12px 32px", fontSize: "16px", fontWeight: "600",
            backgroundColor: running ? "#333" : "#238636", color: "#fff",
            border: "none", borderRadius: "6px", cursor: running ? "wait" : "pointer",
          }}
        >
          {running ? "Running..." : "Run All Tests"}
        </button>
        {results && failElements > 0 && (
          <button
            onClick={exportReport}
            data-id="schema-test--button--export"
            style={{
              padding: "12px 32px", fontSize: "16px", fontWeight: "600",
              backgroundColor: "#da3633", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer",
            }}
          >
            Export Failures
          </button>
        )}
      </div>

      {results && (
        <>
          {/* Summary */}
          <div style={{
            display: "flex", gap: "24px", marginBottom: "24px", padding: "16px 20px",
            backgroundColor: "#161b22", borderRadius: "8px", border: "1px solid #30363d", flexWrap: "wrap",
          }}>
            <div>
              <span style={{ fontSize: "32px", fontWeight: "800", color: failElements === 0 ? "#3fb950" : "#f85149" }}>
                {failElements === 0 ? "ALL PASS" : `${failElements} FAIL`}
              </span>
            </div>
            <div style={{ borderLeft: "1px solid #30363d", paddingLeft: "24px" }}>
              <div style={{ color: "#3fb950", fontSize: "14px" }}>{passElements} elements pass</div>
              <div style={{ color: failElements > 0 ? "#f85149" : "#8b949e", fontSize: "14px" }}>{failElements} elements fail</div>
            </div>
            <div style={{ borderLeft: "1px solid #30363d", paddingLeft: "24px" }}>
              <div style={{ color: "#8b949e", fontSize: "14px" }}>{totalChecks} total checks</div>
              <div style={{ color: totalCheckFails > 0 ? "#f85149" : "#8b949e", fontSize: "14px" }}>{totalCheckFails} check failures</div>
            </div>
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {[
              { key: "all", label: `All (${totalElements})` },
              { key: "fail", label: `Failures (${failElements})` },
              { key: "pass", label: `Passing (${passElements})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                data-id={`schema-test--button--filter-${tab.key}`}
                style={{
                  padding: "6px 16px", fontSize: "13px",
                  backgroundColor: filter === tab.key ? "#21262d" : "transparent",
                  color: filter === tab.key ? "#c9d1d9" : "#8b949e",
                  border: `1px solid ${filter === tab.key ? "#30363d" : "transparent"}`,
                  borderRadius: "6px", cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Results table */}
          <table style={{
            width: "100%", borderCollapse: "collapse", backgroundColor: "#161b22",
            borderRadius: "8px", overflow: "hidden",
          }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #30363d" }}>
                <th style={thStyle}>Element</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Props Defined</th>
                <th style={thStyle}>Schema Settings</th>
                <th style={thStyle}>Checks</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const realIndex = results.indexOf(r);
                const hasFail = r.failCount > 0;
                const summaryCheck = r.checks.find((c) => c.name === "Summary");
                const settingCount = r.schemaJSON?.settings?.length || 0;

                return (
                  <React.Fragment key={realIndex}>
                    <tr style={{
                      borderBottom: "1px solid #21262d",
                      backgroundColor: hasFail ? "rgba(248,81,73,0.05)" : "transparent",
                    }}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: "600" }}>{r.displayName}</div>
                        <div style={{ fontSize: "11px", color: "#8b949e", fontFamily: "monospace" }}>{r.type}</div>
                      </td>
                      <td style={{ ...tdStyle, fontSize: "12px", color: "#8b949e" }}>{r.category}</td>
                      <td style={{ ...tdStyle, fontSize: "12px" }}>
                        <span style={{ color: "#c9d1d9" }}>{r.totalProps}</span>
                        <button
                          onClick={() => toggleProps(realIndex)}
                          style={{ ...actionBtnStyle, marginLeft: "8px", fontSize: "10px" }}
                          data-id={`schema-test--button--props-${realIndex}`}
                        >
                          {expandedProps[realIndex] ? "hide" : "show"}
                        </button>
                      </td>
                      <td style={{ ...tdStyle, fontSize: "12px", color: "#c9d1d9" }}>{settingCount}</td>
                      <td style={tdStyle}>
                        <span style={{ color: "#3fb950" }}>{r.passCount}</span>
                        {" / "}
                        <span style={{ color: r.failCount > 0 ? "#f85149" : "#8b949e" }}>{r.failCount}</span>
                        {r.failCount > 0 && (
                          <button
                            onClick={() => toggleChecks(realIndex)}
                            style={{ ...actionBtnStyle, marginLeft: "8px", fontSize: "10px" }}
                            data-id={`schema-test--button--checks-${realIndex}`}
                          >
                            {expandedChecks[realIndex] ? "hide" : "details"}
                          </button>
                        )}
                      </td>
                      <td style={tdStyle}>
                        {hasFail ? (
                          <span style={{ color: "#f85149", fontWeight: "600" }}>FAIL</span>
                        ) : (
                          <span style={{ color: "#3fb950", fontWeight: "600" }}>PASS</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        {r.liquidCode && (
                          <button
                            onClick={() => setPreviewIndex(realIndex)}
                            style={{ ...actionBtnStyle, backgroundColor: "#1f6feb", borderColor: "#388bfd" }}
                            data-id={`schema-test--button--preview-${realIndex}`}
                          >
                            Preview
                          </button>
                        )}
                      </td>
                    </tr>

                    {/* Expanded props list */}
                    {expandedProps[realIndex] && (
                      <tr>
                        <td colSpan={7} style={{ padding: "8px 12px 16px 24px", backgroundColor: "#0d1117" }}>
                          <div style={{ fontSize: "12px", color: "#8b949e", marginBottom: "8px", fontWeight: "600" }}>
                            Property Definitions ({r.totalProps})
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                            {r.definedProps.map((p) => {
                              const info = PROP_MAP[r.type]?.props[p];
                              return (
                                <span
                                  key={p}
                                  style={{
                                    padding: "2px 8px", fontSize: "11px", borderRadius: "4px",
                                    backgroundColor: info?.kind === "content" ? "#1f3a2a" : "#1a2332",
                                    color: info?.kind === "content" ? "#3fb950" : "#58a6ff",
                                    border: `1px solid ${info?.kind === "content" ? "#238636" : "#1f6feb"}`,
                                    fontFamily: "monospace",
                                  }}
                                  title={`${info?.kind} | schema: ${info?.schemaType} | responsive: ${info?.responsive}`}
                                >
                                  {p}
                                  {info?.responsive && <span style={{ opacity: 0.5 }}> (R)</span>}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Expanded check details */}
                    {expandedChecks[realIndex] && (
                      <tr>
                        <td colSpan={7} style={{ padding: "8px 12px 16px 24px", backgroundColor: "#0d1117" }}>
                          {r.checks.filter((c) => !c.pass).map((c, ci) => (
                            <div key={ci} style={{ marginBottom: "12px" }}>
                              <div style={{ fontSize: "12px", fontWeight: "600", color: "#f85149", marginBottom: "4px" }}>
                                {c.name}
                              </div>
                              {c.errors.map((e, ei) => (
                                <div key={ei} style={{ fontSize: "11px", color: "#f0883e", paddingLeft: "12px", fontFamily: "monospace" }}>
                                  - {e}
                                </div>
                              ))}
                            </div>
                          ))}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      {/* Preview Modal */}
      {previewIndex !== null && results?.[previewIndex]?.liquidCode && (
        <PreviewModal
          liquidCode={results[previewIndex].liquidCode}
          elementName={results[previewIndex].displayName}
          onClose={() => setPreviewIndex(null)}
        />
      )}
    </div>
  );
}
