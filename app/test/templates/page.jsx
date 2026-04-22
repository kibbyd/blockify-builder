"use client";

import React, { useState, useCallback, useRef } from "react";
import { sectionTemplates } from "@/app/_config/templates";
import { instantiateTemplate } from "@/app/_utils/templateUtils";
import { convertJSONToLiquid } from "@/app/_utils/jsonToLiquid";
import { runAllValidations } from "@/app/_utils/liquidValidator";
import { buildPreviewDocument } from "@/app/_utils/liquidResolver";
import { elementDefinitions } from "@/app/_config/elementDefinitions";

// ─── Helpers ──────────────────────────────────────────────────

const walkElements = (elements, fn) => {
  for (const el of elements) {
    fn(el);
    if (el.children?.length) walkElements(el.children, fn);
    if (el.columns?.length) {
      for (const col of el.columns) {
        if (Array.isArray(col)) walkElements(col, fn);
      }
    }
  }
};

const checkElement = (element) => {
  const def = elementDefinitions[element.type];
  if (!def) return { id: element.id, type: element.type, issues: [`Unknown element type: ${element.type}`], info: [] };

  const issues = [];
  const info = [];
  const toggles = element.schemaToggles || {};

  (def.contentProps || []).forEach((prop) => {
    if (!prop.canBeSchemaEditable) return;
    if (toggles[prop.name]) {
      const val = element.props?.[prop.name];
      if (val === undefined || val === null || val === "") {
        issues.push(`Content prop "${prop.name}" toggled but no value set`);
      } else {
        info.push(`✓ ${prop.name} = "${String(val).substring(0, 40)}"`);
      }
    } else {
      info.push(`○ ${prop.name} not toggled (will hardcode)`);
    }
  });

  (def.styleProps || []).forEach((prop) => {
    if (!prop.canBeSchemaEditable) return;
    if (!toggles[prop.name]) return;
    const val = element.style?.[prop.name];
    if (val === undefined || val === null || val === "") {
      const hasResponsive = element.responsiveStyles?.[prop.name] ||
        Object.values(element.responsiveStyles || {}).some(
          vp => typeof vp === 'object' && vp[prop.name]
        );
      if (!hasResponsive) {
        issues.push(`Style prop "${prop.name}" toggled but no value in style or responsiveStyles`);
      }
    }
  });

  if (["text", "heading", "subheading"].includes(element.type)) {
    const textAlign = element.style?.textAlign;
    if (!textAlign || textAlign === "left") {
      info.push(`⚠ textAlign is "${textAlign || 'unset'}" (consider center)`);
    }
  }

  const toggledCount = Object.values(toggles).filter(Boolean).length;
  info.push(`${toggledCount} props toggled for schema`);

  return { id: element.id, type: element.type, issues, info };
};

// ─── Main Test Runner ────────────────────────────────────────

const runTemplateTest = (template) => {
  const result = {
    name: template.name,
    id: template.id,
    category: template.subcategory || template.category,
    elementChecks: [],
    toggleIssues: 0,
    instantiated: false,
    instantiateError: null,
    liquidCode: "",
    exportError: null,
    validations: [],
    passCount: 0,
    failCount: 0,
    settingsCount: 0,
  };

  walkElements(template.elements, (el) => {
    const check = checkElement(el);
    result.elementChecks.push(check);
    result.toggleIssues += check.issues.length;
  });

  let elements;
  try {
    elements = instantiateTemplate(template);
    result.instantiated = true;
  } catch (e) {
    result.instantiateError = e.message;
    return result;
  }

  try {
    const jsonData = { elements, responsiveStyles: {} };
    result.liquidCode = convertJSONToLiquid(jsonData, template.name);
  } catch (e) {
    result.exportError = e.message;
    return result;
  }

  // Liquid validator checks
  result.validations = runAllValidations(result.liquidCode, elements);

  result.passCount = result.validations.filter((v) => v.pass).length;
  result.failCount = result.validations.filter((v) => !v.pass).length;

  const settingsCheck = result.validations.find(v => v.name === "Settings count check");
  if (settingsCheck?.info) {
    const match = settingsCheck.info.match(/(\d+)/);
    if (match) result.settingsCount = parseInt(match[1]);
  }

  return result;
};

// ─── Preview Modal Component ─────────────────────────────────

function PreviewModal({ liquidCode, templateName, onClose }) {
  const iframeRef = useRef(null);
  const [viewWidth, setViewWidth] = useState("100%");

  const previewDoc = buildPreviewDocument(liquidCode);

  const writeToIframe = useCallback((iframe) => {
    if (!iframe) return;
    iframeRef.current = iframe;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(previewDoc);
      doc.close();
    }
  }, [previewDoc]);

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
      data-id="template-test--modal--preview"
    >
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        backgroundColor: "#161b22",
        borderBottom: "1px solid #30363d",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#c9d1d9", fontWeight: "600", fontSize: "16px" }}>
            Preview: {templateName}
          </span>
          <span style={{ color: "#8b949e", fontSize: "12px" }}>
            Resolved Liquid with schema defaults
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Viewport buttons */}
          {[
            { label: "Mobile", width: "375px" },
            { label: "Tablet", width: "768px" },
            { label: "Desktop", width: "100%" },
          ].map((vp) => (
            <button
              key={vp.label}
              onClick={() => setViewWidth(vp.width)}
              data-id={`template-test--button--viewport-${vp.label.toLowerCase()}`}
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
            data-id="template-test--button--close-preview"
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

      {/* Preview Area */}
      <div style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "20px",
        overflow: "auto",
        backgroundColor: "#1a1a2e",
      }}>
        <div style={{
          width: viewWidth,
          maxWidth: "100%",
          transition: "width 0.3s ease",
          backgroundColor: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        }}>
          <iframe
            ref={writeToIframe}
            style={{
              width: "100%",
              minHeight: "600px",
              border: "none",
              display: "block",
            }}
            title={`Preview: ${templateName}`}
            sandbox="allow-same-origin"
            data-id="template-test--iframe--preview"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────

export default function TemplateTestPage() {
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [expandedLiquid, setExpandedLiquid] = useState({});
  const [filter, setFilter] = useState("all");
  const [previewIndex, setPreviewIndex] = useState(null);

  const runTests = useCallback(() => {
    setRunning(true);
    setExpanded({});
    setExpandedLiquid({});
    setPreviewIndex(null);

    setTimeout(() => {
      const testResults = sectionTemplates.map((t) => runTemplateTest(t));
      setResults(testResults);
      setRunning(false);
    }, 50);
  }, []);

  const toggle = (i) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
  const toggleLiquid = (i) => setExpandedLiquid((prev) => ({ ...prev, [i]: !prev[i] }));

  const exportReport = useCallback(() => {
    if (!results) return;
    const lines = [];
    lines.push("TEMPLATE E2E TEST REPORT");
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push("=".repeat(60) + "\n");

    for (const r of results) {
      const hasFail = isFail(r);
      if (!hasFail) continue;

      lines.push(`FAIL: ${r.name} (${r.id})`);
      lines.push("-".repeat(40));

      if (r.instantiateError) lines.push(`  [Instantiate Error] ${r.instantiateError}`);
      if (r.exportError) lines.push(`  [Export Error] ${r.exportError}`);
      if (r.toggleIssues > 0) {
        lines.push(`  [Toggle Issues: ${r.toggleIssues}]`);
        for (const ec of r.elementChecks) {
          if (ec.issues.length === 0) continue;
          lines.push(`    ${ec.type} (${ec.id}):`);
          for (const issue of ec.issues) lines.push(`      - ${issue}`);
        }
      }
      for (const v of r.validations.filter((v) => !v.pass)) {
        lines.push(`  [${v.name}]`);
        for (const e of v.errors) lines.push(`    - ${e}`);
      }
      lines.push("");
    }

    lines.push("=".repeat(60));
    const failCount = results.filter(r => isFail(r)).length;
    lines.push(`TOTAL: ${failCount} templates with issues out of ${results.length}`);

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template-e2e-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  const totalTemplates = results?.length || 0;
  const isFail = (r) => r.failCount > 0 || r.toggleIssues > 0 || r.exportError || r.instantiateError;
  const passTemplates = results?.filter(r => !isFail(r)).length || 0;
  const failTemplates = totalTemplates - passTemplates;
  const totalToggleIssues = results?.reduce((s, r) => s + r.toggleIssues, 0) || 0;
  const totalValidationFails = results?.reduce((s, r) => s + r.failCount, 0) || 0;
  const maxSettings = results ? Math.max(...results.map(r => r.settingsCount)) : 0;

  const filtered = results
    ? filter === "all"
      ? results
      : filter === "fail"
        ? results.filter(r => isFail(r))
        : results.filter(r => !isFail(r))
    : [];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "40px", maxWidth: "1400px", margin: "0 auto", backgroundColor: "#0d1117", color: "#c9d1d9", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }} data-id="template-test--heading--title">
        Template E2E Test
      </h1>
      <p style={{ color: "#8b949e", marginBottom: "24px" }}>
        Tests all {sectionTemplates.length} templates: schema toggles → instantiate → export → validate → visual preview.
      </p>

      <div style={{ display: "flex", gap: "12px", marginBottom: "32px", alignItems: "center" }}>
        <button
          onClick={runTests}
          disabled={running}
          data-id="template-test--button--run"
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

        {results && failTemplates > 0 && (
          <button
            onClick={exportReport}
            data-id="template-test--button--export"
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
          <div style={{
            display: "flex",
            gap: "24px",
            marginBottom: "24px",
            padding: "16px 20px",
            backgroundColor: "#161b22",
            borderRadius: "8px",
            border: "1px solid #30363d",
            flexWrap: "wrap",
          }}>
            <div>
              <span style={{ fontSize: "32px", fontWeight: "800", color: failTemplates === 0 ? "#3fb950" : "#f85149" }}>
                {failTemplates === 0 ? "ALL PASS" : `${failTemplates} FAIL`}
              </span>
            </div>
            <div style={{ borderLeft: "1px solid #30363d", paddingLeft: "24px" }}>
              <div style={{ color: "#3fb950", fontSize: "14px" }}>{passTemplates} templates pass</div>
              <div style={{ color: failTemplates > 0 ? "#f85149" : "#8b949e", fontSize: "14px" }}>{failTemplates} templates fail</div>
            </div>
            <div style={{ borderLeft: "1px solid #30363d", paddingLeft: "24px" }}>
              <div style={{ color: totalToggleIssues > 0 ? "#f0883e" : "#8b949e", fontSize: "14px" }}>{totalToggleIssues} toggle issues</div>
              <div style={{ color: totalValidationFails > 0 ? "#f85149" : "#8b949e", fontSize: "14px" }}>{totalValidationFails} validation fails</div>
            </div>
            <div style={{ borderLeft: "1px solid #30363d", paddingLeft: "24px" }}>
              <div style={{ color: maxSettings > 250 ? "#f85149" : maxSettings > 200 ? "#f0883e" : "#8b949e", fontSize: "14px" }}>
                Max settings: {maxSettings} / 250
              </div>
              <div style={{ color: "#8b949e", fontSize: "14px" }}>{totalTemplates} templates tested</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {[
              { key: "all", label: `All (${totalTemplates})` },
              { key: "fail", label: `Failures (${failTemplates})` },
              { key: "pass", label: `Passing (${passTemplates})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                data-id={`template-test--button--filter-${tab.key}`}
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
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#161b22", borderRadius: "8px", overflow: "hidden" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #30363d" }}>
                <th style={thStyle}>Template</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Settings</th>
                <th style={thStyle}>Toggles</th>
                <th style={thStyle}>Validation</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const realIndex = results.indexOf(r);
                const hasFail = r.failCount > 0 || r.toggleIssues > 0 || r.exportError || r.instantiateError || r.schemaChecks.some(c => !c.pass);

                return (
                  <React.Fragment key={realIndex}>
                    <tr style={{
                      borderBottom: "1px solid #21262d",
                      backgroundColor: hasFail ? "rgba(248,81,73,0.05)" : "transparent",
                    }}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: "600" }}>{r.name}</div>
                        <div style={{ fontSize: "11px", color: "#8b949e", fontFamily: "monospace" }}>{r.id}</div>
                      </td>
                      <td style={{ ...tdStyle, fontSize: "12px", color: "#8b949e" }}>{r.category}</td>
                      <td style={tdStyle}>
                        {r.instantiateError ? (
                          <span style={{ color: "#f85149", fontWeight: "600" }}>CRASH</span>
                        ) : r.exportError ? (
                          <span style={{ color: "#f85149", fontWeight: "600" }}>EXPORT ERR</span>
                        ) : hasFail ? (
                          <span style={{ color: "#f85149", fontWeight: "600" }}>FAIL</span>
                        ) : (
                          <span style={{ color: "#3fb950", fontWeight: "600" }}>PASS</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          color: r.settingsCount > 250 ? "#f85149" : r.settingsCount > 200 ? "#f0883e" : "#8b949e",
                          fontWeight: r.settingsCount > 200 ? "600" : "400",
                        }}>
                          {r.settingsCount}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ color: r.toggleIssues > 0 ? "#f0883e" : "#3fb950" }}>
                          {r.toggleIssues === 0 ? "OK" : `${r.toggleIssues} issues`}
                        </span>
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
                            data-id={`template-test--button--preview-${realIndex}`}
                          >
                            Preview
                          </button>
                        )}
                        <button
                          onClick={() => toggle(realIndex)}
                          style={{ ...actionBtnStyle, marginLeft: "8px" }}
                          data-id={`template-test--button--details-${realIndex}`}
                        >
                          {expanded[realIndex] ? "Hide" : "Details"}
                        </button>
                        {r.liquidCode && (
                          <button
                            onClick={() => toggleLiquid(realIndex)}
                            style={{ ...actionBtnStyle, marginLeft: "8px" }}
                            data-id={`template-test--button--liquid-${realIndex}`}
                          >
                            {expandedLiquid[realIndex] ? "Hide Liquid" : "Liquid"}
                          </button>
                        )}
                      </td>
                    </tr>

                    {/* Expanded Details */}
                    {expanded[realIndex] && (
                      <tr>
                        <td colSpan={7} style={{ padding: "0 16px 16px" }}>
                          <div style={{ backgroundColor: "#0d1117", border: "1px solid #30363d", borderRadius: "6px", padding: "16px" }}>
                            {r.instantiateError && (
                              <div style={{ color: "#f85149", marginBottom: "12px" }}>
                                <strong>Instantiate Error:</strong> {r.instantiateError}
                              </div>
                            )}
                            {r.exportError && (
                              <div style={{ color: "#f85149", marginBottom: "12px" }}>
                                <strong>Export Error:</strong> {r.exportError}
                              </div>
                            )}
                            {r.validations.filter(v => !v.pass).length > 0 && (
                              <div style={{ marginBottom: "16px" }}>
                                <div style={{ color: "#f85149", fontWeight: "600", marginBottom: "8px", fontSize: "13px" }}>
                                  Validation Failures
                                </div>
                                {r.validations.filter(v => !v.pass).map((v, vi) => (
                                  <div key={vi} style={{ marginBottom: "8px" }}>
                                    <div style={{ color: "#f0883e", fontSize: "12px", fontWeight: "600" }}>{v.name}</div>
                                    {v.errors.map((e, ei) => (
                                      <div key={ei} style={{ color: "#c9d1d9", paddingLeft: "12px", fontSize: "11px", fontFamily: "monospace" }}>
                                        {e}
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            )}
                            <div>
                              <div style={{ color: "#8b949e", fontWeight: "600", marginBottom: "8px", fontSize: "13px" }}>
                                Element Schema Toggles ({r.elementChecks.length} elements)
                              </div>
                              {r.elementChecks.map((ec, ei) => (
                                <div key={ei} style={{
                                  marginBottom: "8px",
                                  padding: "8px 12px",
                                  backgroundColor: ec.issues.length > 0 ? "rgba(240,136,62,0.08)" : "rgba(63,185,80,0.05)",
                                  borderRadius: "4px",
                                  borderLeft: `3px solid ${ec.issues.length > 0 ? "#f0883e" : "#3fb950"}`,
                                }}>
                                  <div style={{ fontSize: "12px", fontWeight: "600", color: "#c9d1d9", marginBottom: "4px" }}>
                                    {ec.type}
                                    <span style={{ color: "#8b949e", fontWeight: "400", marginLeft: "8px", fontFamily: "monospace", fontSize: "10px" }}>
                                      {ec.id}
                                    </span>
                                  </div>
                                  {ec.issues.map((issue, ii) => (
                                    <div key={ii} style={{ color: "#f0883e", fontSize: "11px", paddingLeft: "8px" }}>
                                      ✗ {issue}
                                    </div>
                                  ))}
                                  {ec.info.map((info, ii) => (
                                    <div key={ii} style={{ color: "#8b949e", fontSize: "11px", paddingLeft: "8px" }}>
                                      {info}
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Liquid Preview */}
                    {expandedLiquid[realIndex] && (
                      <tr>
                        <td colSpan={7} style={{ padding: "0 16px 16px" }}>
                          <pre style={{
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
                          }}>
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
          templateName={results[previewIndex].name}
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
