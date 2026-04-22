"use client";

import React, { useState, useCallback, useRef } from "react";
import { convertJSONToLiquid } from "@/app/_utils/jsonToLiquid";
import { runAllValidations } from "@/app/_utils/liquidValidator";
import { buildPreviewDocument } from "@/app/_utils/liquidResolver";
import { elementDefinitions } from "@/app/_config/elementDefinitions";

// ─── Element Fixtures ────────────────────────────────────────
// Each fixture creates a minimal section with one instance of the element type.
// "column" is internal-only (used inside columns-N), so we skip it.

const SKIP_TYPES = ["column"];

const uid = (() => {
  let c = 0;
  return () => `el-test-${++c}`;
})();

const makeElement = (type, props = {}, style = {}, extra = {}) => ({
  id: uid(),
  type,
  props,
  style,
  schemaToggles: {},
  responsiveStyles: {},
  ...extra,
});

const makeChildHeading = (text) =>
  makeElement("heading", { text, tag: "h3" }, { fontSize: "20px", color: "#333333", textAlign: "center" });

const makeChildText = (text) =>
  makeElement("text", { text }, { fontSize: "14px", color: "#666666", textAlign: "center" });

/**
 * Build a sensible default element for each type.
 * Columns types get child elements so they render visibly.
 */
const buildElementFixture = (type) => {
  const now = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const targetDate = now.toISOString().split("T")[0] + "T00:00:00";

  switch (type) {
    // ── Layout ──
    case "container":
      return makeElement("container", {}, { backgroundColor: "#f5f5f5", paddingTop: "40px", paddingBottom: "40px", paddingLeft: "20px", paddingRight: "20px" }, {
        children: [makeChildHeading("Container Child"), makeChildText("Content inside a container element.")],
      });

    case "columns-1":
      return makeElement("columns-1", {}, { paddingTop: "20px", paddingBottom: "20px" }, {
        columns: [[makeChildHeading("Single Column"), makeChildText("Content in one column.")]],
      });

    case "columns-2":
      return makeElement("columns-2", {}, { paddingTop: "20px", paddingBottom: "20px" }, {
        columns: [
          [makeChildHeading("Column A"), makeChildText("Left column content.")],
          [makeChildHeading("Column B"), makeChildText("Right column content.")],
        ],
      });

    case "columns-3":
      return makeElement("columns-3", {}, { paddingTop: "20px", paddingBottom: "20px" }, {
        columns: [
          [makeChildHeading("Col 1")],
          [makeChildHeading("Col 2")],
          [makeChildHeading("Col 3")],
        ],
      });

    case "columns-4":
      return makeElement("columns-4", {}, { paddingTop: "20px", paddingBottom: "20px" }, {
        columns: [
          [makeChildHeading("C1")],
          [makeChildHeading("C2")],
          [makeChildHeading("C3")],
          [makeChildHeading("C4")],
        ],
      });

    case "columns-5":
      return makeElement("columns-5", {}, { paddingTop: "20px", paddingBottom: "20px" }, {
        columns: [
          [makeChildHeading("C1")],
          [makeChildHeading("C2")],
          [makeChildHeading("C3")],
          [makeChildHeading("C4")],
          [makeChildHeading("C5")],
        ],
      });

    case "columns-6":
      return makeElement("columns-6", {}, { paddingTop: "20px", paddingBottom: "20px" }, {
        columns: [
          [makeChildHeading("C1")],
          [makeChildHeading("C2")],
          [makeChildHeading("C3")],
          [makeChildHeading("C4")],
          [makeChildHeading("C5")],
          [makeChildHeading("C6")],
        ],
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

    // ── Basic ──
    case "heading":
      return makeElement("heading", { text: "Sample Heading", tag: "h2" }, { fontSize: "32px", fontWeight: "700", color: "#111111", textAlign: "center" });

    case "text":
      return makeElement("text", { text: "This is a sample paragraph of text to test the text element rendering through the export pipeline." }, { fontSize: "16px", color: "#333333", lineHeight: "1.6", textAlign: "left" });

    case "image":
      return makeElement("image", { src: "/images/placeholder.svg" }, { width: "100%", borderRadius: "8px" });

    case "video":
      return makeElement("video", { src: "" }, { width: "100%" });

    case "button":
      return makeElement("button", { text: "Click Me", url: "#" }, {
        fontSize: "16px", fontWeight: "600", color: "#ffffff", backgroundColor: "#2563eb",
        paddingTop: "12px", paddingBottom: "12px", paddingLeft: "32px", paddingRight: "32px",
        borderRadius: "6px",
      });

    case "icon":
      return makeElement("icon", { src: "/images/placeholder.svg" }, { iconSize: "48px" });

    case "divider":
      return makeElement("divider", {}, { borderStyle: "solid", borderColor: "#e0e0e0", borderWidth: "1px", width: "100%", marginTop: "20px", marginBottom: "20px" });

    // ── Lists & Tables ──
    case "list":
      return makeElement("list", { html: "<ol>\n  <li>First item</li>\n  <li>Second item</li>\n  <li>Third item</li>\n</ol>" }, { fontSize: "16px", color: "#333333" });

    case "unordered-list":
      return makeElement("unordered-list", { html: "<ul>\n  <li>Apple</li>\n  <li>Banana</li>\n  <li>Cherry</li>\n</ul>" }, { fontSize: "16px", color: "#333333" });

    case "table":
      return makeElement("table", {
        html: "<table>\n  <thead>\n    <tr><th>Name</th><th>Price</th><th>Stock</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Widget</td><td>$9.99</td><td>150</td></tr>\n    <tr><td>Gadget</td><td>$19.99</td><td>75</td></tr>\n  </tbody>\n</table>",
        cellPadding: "8px", borderWidth: "1px", borderColor: "#dddddd", headerColor: "#f5f5f5", headerTextColor: "#333333",
      }, { width: "100%" });

    case "map":
      return makeElement("map", { address: "New York, NY" }, { width: "100%", height: "300px" });

    // ── Shopify ──
    case "product-card":
      return makeElement("product-card", { showImage: true, showTitle: true, showPrice: true, showButton: true, buttonText: "Add to Cart" }, {
        backgroundColor: "#ffffff", color: "#000000", buttonColor: "#ffffff", buttonBackgroundColor: "#000000",
        paddingTop: "16px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px",
        border: "1px solid #e0e0e0", borderRadius: "8px",
      });

    case "product-grid":
      return makeElement("product-grid", { columns: "3", rows: "1", showPrice: true, showButton: true, buttonText: "Add to Cart" }, {
        gap: "20px", backgroundColor: "#ffffff", color: "#000000", buttonColor: "#ffffff", buttonBackgroundColor: "#000000",
        paddingTop: "12px", paddingBottom: "12px", paddingLeft: "12px", paddingRight: "12px",
        border: "1px solid #e0e0e0", borderRadius: "8px",
      });

    case "collection-list":
      return makeElement("collection-list", { columns: "3", showImage: true, showTitle: true, showCount: true }, {
        gap: "20px", backgroundColor: "#ffffff", color: "#000000",
        borderRadius: "8px",
      });

    // ── Interactive ──
    case "accordion":
      return makeElement("accordion", {
        itemCount: 3,
        panelTitle_1: "What is your return policy?",
        panelContent_1: "We offer a 30-day money-back guarantee on all products.",
        panelTitle_2: "How long does shipping take?",
        panelContent_2: "Standard shipping takes 5-7 business days.",
        panelTitle_3: "Do you offer gift wrapping?",
        panelContent_3: "Yes, gift wrapping is available at checkout for $5.",
      }, {
        titleFontSize: "16px", titleFontWeight: "600", contentFontSize: "14px",
        titleColor: "#333333", contentColor: "#666666", backgroundColor: "#ffffff", borderColor: "#dee2e6",
      });

    case "tabs":
      return makeElement("tabs", {
        tabCount: 3,
        tabLabel_1: "Description", tabContent_1: "A detailed product description goes here.",
        tabLabel_2: "Specifications", tabContent_2: "Size: 10x5x3 inches. Weight: 1.5 lbs.",
        tabLabel_3: "Reviews", tabContent_3: "Customers love this product! 4.8 stars average.",
      }, {
        tabFontSize: "14px", tabFontWeight: "500", contentFontSize: "14px",
        tabBackgroundColor: "#f0f0f0", tabActiveBackgroundColor: "#ffffff",
        tabColor: "#666666", tabActiveColor: "#333333", contentBackgroundColor: "#ffffff", borderColor: "#dee2e6",
      });

    case "countdown":
      return makeElement("countdown", {
        targetDate, expiredMessage: "Offer has ended!",
        showDays: true, showHours: true, showMinutes: true, showSeconds: true,
      }, {
        digitColor: "#333333", labelColor: "#666666", digitFontSize: "36px", labelFontSize: "12px", separatorStyle: "colon",
      });

    case "slideshow":
      return makeElement("slideshow", {
        slideCount: 3,
        slideImage_1: "/images/placeholder.svg", slideHeading_1: "Slide 1", slideText_1: "First slide description.",
        slideImage_2: "/images/placeholder.svg", slideHeading_2: "Slide 2", slideText_2: "Second slide description.",
        slideImage_3: "/images/placeholder.svg", slideHeading_3: "Slide 3", slideText_3: "Third slide description.",
        autoplay: true, autoplayInterval: 5,
      }, {});

    // ── Forms & Popups ──
    case "form":
      return makeElement("form", {
        formAction: "", showName: true, showEmail: true, showPhone: false, showMessage: true,
        submitText: "Submit", namePlaceholder: "Your name", emailPlaceholder: "Your email", messagePlaceholder: "Your message",
      }, {
        fontSize: "14px", color: "#333333", backgroundColor: "#ffffff",
        paddingTop: "20px", paddingBottom: "20px", paddingLeft: "20px", paddingRight: "20px",
      });

    case "popup":
      return makeElement("popup", {
        triggerText: "Open Popup", popupTitle: "Special Offer!",
        popupContent: "Sign up for our newsletter and get 10% off your first order.",
        showEmailField: true, emailPlaceholder: "Enter your email", submitText: "Subscribe",
      }, {
        fontSize: "14px", buttonColor: "#ffffff", buttonBackgroundColor: "#000000",
      });

    // ── Social & Media ──
    case "social-icons":
      return makeElement("social-icons", {
        facebook: "https://facebook.com", instagram: "https://instagram.com", twitter: "https://x.com",
      }, {
        iconSize: "32px", iconColor: "#333333",
      });

    case "image-gallery":
      return makeElement("image-gallery", {
        imageCount: 4,
        image_1: "/images/placeholder.svg", image_2: "/images/placeholder.svg",
        image_3: "/images/placeholder.svg", image_4: "/images/placeholder.svg",
        enableLightbox: true,
      }, {
        columns: "2", gap: "8px", borderRadius: "4px", aspectRatio: "1/1", objectFit: "cover",
      });

    case "flip-card":
      return makeElement("flip-card", {
        frontTitle: "Front Side", frontContent: "Hover to flip",
        backTitle: "Back Side", backContent: "Here is the hidden content.",
        backButtonText: "Learn More", backButtonUrl: "#", flipDirection: "horizontal",
      }, {
        width: "300px", height: "250px",
      });

    case "progress-bar":
      return makeElement("progress-bar", {
        label: "Progress", percentage: 75, showPercentage: true, showLabel: true, animated: true,
      }, {
        fontSize: "14px", color: "#333333", barColor: "#000000",
      });

    case "before-after":
      return makeElement("before-after", {
        beforeImage: "/images/placeholder.svg", afterImage: "/images/placeholder.svg",
        beforeLabel: "Before", afterLabel: "After", startPosition: 50,
      }, {
        width: "100%", height: "300px", borderRadius: "8px",
      });

    case "marquee":
      return makeElement("marquee", {
        text: "Free shipping on orders over $50  •  New arrivals just dropped  •  Limited time offer  •  ",
        speed: 20, pauseOnHover: true, direction: "left",
      }, {
        fontSize: "16px", fontWeight: "600", color: "#ffffff", backgroundColor: "#000000",
        paddingTop: "12px", paddingBottom: "12px",
      });

    case "blog-post":
      return makeElement("blog-post", {
        postCount: 3, showImage: true, showExcerpt: true, showDate: true, showAuthor: false,
      }, {});

    // ── Fallback: auto-build from definition ──
    default: {
      const def = elementDefinitions[type];
      if (!def) return null;
      const props = {};
      const style = {};
      (def.contentProps || []).forEach((p) => {
        if (p.default !== undefined && p.default !== null && p.default !== "") props[p.name] = p.default;
      });
      (def.styleProps || []).forEach((p) => {
        if (p.default !== undefined && p.default !== null && p.default !== "") style[p.name] = p.default;
      });
      return makeElement(type, props, style);
    }
  }
};

// ─── Test Runner ─────────────────────────────────────────────

const runElementTest = (type) => {
  const def = elementDefinitions[type];
  const result = {
    type,
    displayName: def?.displayName || type,
    category: def?.category || "unknown",
    contentPropCount: (def?.contentProps || []).length,
    stylePropCount: (def?.styleProps || []).length,
    liquidCode: "",
    exportError: null,
    validations: [],
    passCount: 0,
    failCount: 0,
    settingsCount: 0,
  };

  const element = buildElementFixture(type);
  if (!element) {
    result.exportError = `No fixture for type: ${type}`;
    return result;
  }

  try {
    const jsonData = { elements: [element], responsiveStyles: {} };
    result.liquidCode = convertJSONToLiquid(jsonData, `element-test-${type}`);
  } catch (e) {
    result.exportError = e.message;
    return result;
  }

  result.validations = runAllValidations(result.liquidCode, [element]);
  result.passCount = result.validations.filter((v) => v.pass).length;
  result.failCount = result.validations.filter((v) => !v.pass).length;

  const settingsCheck = result.validations.find((v) => v.name === "Settings count check");
  if (settingsCheck?.info) {
    const match = settingsCheck.info.match(/(\d+)/);
    if (match) result.settingsCount = parseInt(match[1]);
  }

  return result;
};

// ─── Preview Modal Component ─────────────────────────────────

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

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
      }}
      data-id="element-test--modal--preview"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          backgroundColor: "#161b22",
          borderBottom: "1px solid #30363d",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#c9d1d9", fontWeight: "600", fontSize: "16px" }}>
            Preview: {elementName}
          </span>
          <span style={{ color: "#8b949e", fontSize: "12px" }}>
            Resolved Liquid with schema defaults
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {[
            { label: "Mobile", width: "375px" },
            { label: "Tablet", width: "768px" },
            { label: "Desktop", width: "100%" },
          ].map((vp) => (
            <button
              key={vp.label}
              onClick={() => setViewWidth(vp.width)}
              data-id={`element-test--button--viewport-${vp.label.toLowerCase()}`}
              style={{
                padding: "4px 12px",
                fontSize: "12px",
                backgroundColor: viewWidth === vp.width ? "#238636" : "#21262d",
                color: "#c9d1d9",
                border: "1px solid #30363d",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {vp.label}
            </button>
          ))}

          <button
            onClick={onClose}
            data-id="element-test--button--close-preview"
            style={{
              padding: "4px 12px",
              fontSize: "14px",
              backgroundColor: "#da3633",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginLeft: "12px",
            }}
          >
            Close
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "20px",
          overflow: "auto",
          backgroundColor: "#1a1a2e",
        }}
      >
        <div
          style={{
            width: viewWidth,
            maxWidth: "100%",
            transition: "width 0.3s ease",
            backgroundColor: "#fff",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
          }}
        >
          <iframe
            ref={writeToIframe}
            style={{
              width: "100%",
              minHeight: "400px",
              border: "none",
              display: "block",
            }}
            title={`Preview: ${elementName}`}
            sandbox="allow-same-origin"
            data-id="element-test--iframe--preview"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────

export default function ElementTestPage() {
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [expandedLiquid, setExpandedLiquid] = useState({});
  const [expandedValidation, setExpandedValidation] = useState({});
  const [filter, setFilter] = useState("all");
  const [previewIndex, setPreviewIndex] = useState(null);

  const allTypes = Object.keys(elementDefinitions).filter((t) => !SKIP_TYPES.includes(t));

  const runTests = useCallback(() => {
    setRunning(true);
    setExpandedLiquid({});
    setExpandedValidation({});
    setPreviewIndex(null);

    setTimeout(() => {
      const testResults = allTypes.map(runElementTest);
      setResults(testResults);
      setRunning(false);
    }, 50);
  }, [allTypes]);

  const toggleLiquid = (i) => setExpandedLiquid((prev) => ({ ...prev, [i]: !prev[i] }));
  const toggleValidation = (i) => setExpandedValidation((prev) => ({ ...prev, [i]: !prev[i] }));

  const exportReport = useCallback(() => {
    if (!results) return;
    const lines = [];
    lines.push("ELEMENT E2E TEST REPORT");
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push("=".repeat(60) + "\n");

    for (const r of results) {
      const hasFail = r.failCount > 0 || r.exportError;
      if (!hasFail) continue;

      lines.push(`FAIL: ${r.displayName} (${r.type})`);
      lines.push("-".repeat(40));

      if (r.exportError) lines.push(`  [Export Error] ${r.exportError}`);
      for (const v of r.validations.filter((v) => !v.pass)) {
        lines.push(`  [${v.name}]`);
        for (const e of v.errors) lines.push(`    - ${e}`);
      }
      lines.push("");
    }

    lines.push("=".repeat(60));
    const failCount = results.filter((r) => r.failCount > 0 || r.exportError).length;
    lines.push(`TOTAL: ${failCount} elements with issues out of ${results.length}`);

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "element-e2e-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  const totalElements = results?.length || 0;
  const passElements = results?.filter((r) => r.failCount === 0 && !r.exportError).length || 0;
  const failElements = totalElements - passElements;
  const totalValidationFails = results?.reduce((s, r) => s + r.failCount, 0) || 0;

  const filtered = results
    ? filter === "all"
      ? results
      : filter === "fail"
        ? results.filter((r) => r.failCount > 0 || r.exportError)
        : results.filter((r) => r.failCount === 0 && !r.exportError)
    : [];

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: "40px",
        maxWidth: "1400px",
        margin: "0 auto",
        backgroundColor: "#0d1117",
        color: "#c9d1d9",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }} data-id="element-test--heading--title">
        Element E2E Test
      </h1>
      <p style={{ color: "#8b949e", marginBottom: "24px" }}>
        Tests all {allTypes.length} element types: build fixture → export to Liquid → validate → visual preview
      </p>

      <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
        <button
          onClick={runTests}
          disabled={running}
          data-id="element-test--button--run"
          style={{
            padding: "12px 32px",
            fontSize: "16px",
            fontWeight: "600",
            backgroundColor: running ? "#333" : "#238636",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: running ? "wait" : "pointer",
          }}
        >
          {running ? "Running..." : "Run All Tests"}
        </button>

        {results && failElements > 0 && (
          <button
            onClick={exportReport}
            data-id="element-test--button--export"
            style={{
              padding: "12px 32px",
              fontSize: "16px",
              fontWeight: "600",
              backgroundColor: "#da3633",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Export Failures
          </button>
        )}
      </div>

      {results && (
        <>
          {/* Summary Bar */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              marginBottom: "24px",
              padding: "16px 20px",
              backgroundColor: "#161b22",
              borderRadius: "8px",
              border: "1px solid #30363d",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: failElements === 0 ? "#3fb950" : "#f85149",
                }}
              >
                {failElements === 0 ? "ALL PASS" : `${failElements} FAIL`}
              </span>
            </div>
            <div style={{ borderLeft: "1px solid #30363d", paddingLeft: "24px" }}>
              <div style={{ color: "#3fb950", fontSize: "14px" }}>{passElements} elements pass</div>
              <div style={{ color: failElements > 0 ? "#f85149" : "#8b949e", fontSize: "14px" }}>
                {failElements} elements fail
              </div>
            </div>
            <div style={{ borderLeft: "1px solid #30363d", paddingLeft: "24px" }}>
              <div style={{ color: totalValidationFails > 0 ? "#f85149" : "#8b949e", fontSize: "14px" }}>
                {totalValidationFails} validation fails
              </div>
              <div style={{ color: "#8b949e", fontSize: "14px" }}>{totalElements} element types tested</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {[
              { key: "all", label: `All (${totalElements})` },
              { key: "fail", label: `Failures (${failElements})` },
              { key: "pass", label: `Passing (${passElements})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                data-id={`element-test--button--filter-${tab.key}`}
                style={{
                  padding: "6px 16px",
                  fontSize: "13px",
                  backgroundColor: filter === tab.key ? "#21262d" : "transparent",
                  color: filter === tab.key ? "#c9d1d9" : "#8b949e",
                  border: `1px solid ${filter === tab.key ? "#30363d" : "transparent"}`,
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Results Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#161b22",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #30363d" }}>
                <th style={thStyle}>Element</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Props</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Settings</th>
                <th style={thStyle}>Validation</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const realIndex = results.indexOf(r);
                const hasFail = r.failCount > 0 || r.exportError;

                return (
                  <React.Fragment key={realIndex}>
                    <tr
                      style={{
                        borderBottom: "1px solid #21262d",
                        backgroundColor: hasFail ? "rgba(248,81,73,0.05)" : "transparent",
                      }}
                    >
                      <td style={tdStyle}>
                        <div style={{ fontWeight: "600" }}>{r.displayName}</div>
                        <div style={{ fontSize: "11px", color: "#8b949e", fontFamily: "monospace" }}>
                          {r.type}
                        </div>
                      </td>
                      <td style={{ ...tdStyle, fontSize: "12px", color: "#8b949e" }}>{r.category}</td>
                      <td style={{ ...tdStyle, fontSize: "12px", color: "#8b949e" }}>
                        {r.contentPropCount}c / {r.stylePropCount}s
                      </td>
                      <td style={tdStyle}>
                        {r.exportError ? (
                          <span style={{ color: "#f85149", fontWeight: "600" }}>EXPORT ERR</span>
                        ) : hasFail ? (
                          <span style={{ color: "#f85149", fontWeight: "600" }}>FAIL</span>
                        ) : (
                          <span style={{ color: "#3fb950", fontWeight: "600" }}>PASS</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <span style={{ color: "#8b949e" }}>{r.settingsCount}</span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ color: "#3fb950" }}>{r.passCount}</span>
                        {" / "}
                        <span style={{ color: r.failCount > 0 ? "#f85149" : "#8b949e" }}>{r.failCount}</span>
                      </td>
                      <td style={tdStyle}>
                        {r.liquidCode && (
                          <button
                            onClick={() => setPreviewIndex(realIndex)}
                            style={{ ...actionBtnStyle, backgroundColor: "#1f6feb", borderColor: "#388bfd" }}
                            data-id={`element-test--button--preview-${realIndex}`}
                          >
                            Preview
                          </button>
                        )}
                        {r.validations.filter((v) => !v.pass).length > 0 && (
                          <button
                            onClick={() => toggleValidation(realIndex)}
                            style={{ ...actionBtnStyle, marginLeft: "8px" }}
                            data-id={`element-test--button--details-${realIndex}`}
                          >
                            {expandedValidation[realIndex] ? "Hide" : "Details"}
                          </button>
                        )}
                        {r.liquidCode && (
                          <button
                            onClick={() => toggleLiquid(realIndex)}
                            style={{ ...actionBtnStyle, marginLeft: "8px" }}
                            data-id={`element-test--button--liquid-${realIndex}`}
                          >
                            {expandedLiquid[realIndex] ? "Hide Liquid" : "Liquid"}
                          </button>
                        )}
                      </td>
                    </tr>

                    {/* Expanded Validation Failures */}
                    {expandedValidation[realIndex] && (
                      <tr>
                        <td colSpan={7} style={{ padding: "0 16px 16px" }}>
                          <div
                            style={{
                              backgroundColor: "#0d1117",
                              border: "1px solid #30363d",
                              borderRadius: "6px",
                              padding: "16px",
                            }}
                          >
                            {r.exportError && (
                              <div style={{ color: "#f85149", marginBottom: "12px" }}>
                                <strong>Export Error:</strong> {r.exportError}
                              </div>
                            )}
                            {r.validations
                              .filter((v) => !v.pass)
                              .map((v, vi) => (
                                <div key={vi} style={{ marginBottom: "8px" }}>
                                  <div style={{ color: "#f0883e", fontSize: "12px", fontWeight: "600" }}>
                                    {v.name}
                                  </div>
                                  {v.errors.map((e, ei) => (
                                    <div
                                      key={ei}
                                      style={{
                                        color: "#c9d1d9",
                                        paddingLeft: "12px",
                                        fontSize: "11px",
                                        fontFamily: "monospace",
                                      }}
                                    >
                                      {e}
                                    </div>
                                  ))}
                                </div>
                              ))}
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Liquid Preview */}
                    {expandedLiquid[realIndex] && (
                      <tr>
                        <td colSpan={7} style={{ padding: "0 16px 16px" }}>
                          <pre
                            style={{
                              backgroundColor: "#0d1117",
                              border: "1px solid #30363d",
                              borderRadius: "6px",
                              padding: "12px 16px",
                              fontSize: "11px",
                              fontFamily: "monospace",
                              color: "#c9d1d9",
                              maxHeight: "400px",
                              overflow: "auto",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-all",
                            }}
                          >
                            {r.liquidCode}
                          </pre>
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

const thStyle = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: "12px",
  fontWeight: "600",
  color: "#8b949e",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const tdStyle = {
  padding: "10px 16px",
  fontSize: "14px",
};

const actionBtnStyle = {
  padding: "4px 10px",
  fontSize: "12px",
  backgroundColor: "#21262d",
  color: "#c9d1d9",
  border: "1px solid #30363d",
  borderRadius: "4px",
  cursor: "pointer",
};
