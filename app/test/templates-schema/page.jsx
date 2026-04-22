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

// ─── All-ON toggle helper ────────────────────────────────────
// Deep clones template elements and sets ALL schemaToggles to true

const enableAllToggles = (elements) => {
  const cloned = JSON.parse(JSON.stringify(elements));
  const walk = (el) => {
    const def = elementDefinitions[el.type];
    if (def) {
      el.schemaToggles = el.schemaToggles || {};
      (def.contentProps || []).forEach((p) => { el.schemaToggles[p.name] = true; });
      (def.styleProps || []).forEach((p) => { el.schemaToggles[p.name] = true; });
    }
    if (el.children?.length) el.children.forEach(walk);
    if (el.columns?.length) el.columns.forEach(col => {
      if (Array.isArray(col)) col.forEach(walk);
    });
  };
  cloned.forEach(walk);
  return cloned;
};

// ─── Schema-specific checks ─────────────────────────────────

const extractSchemaSettings = (liquidCode) => {
  const schemaMatch = liquidCode.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (!schemaMatch) return null;
  try { return JSON.parse(schemaMatch[1]); } catch { return null; }
};

const extractSettingRefsFromCode = (liquidCode) => {
  const schemaStart = liquidCode.indexOf("{% schema %}");
  const codePart = schemaStart > -1 ? liquidCode.substring(0, schemaStart) : liquidCode;
  const refs = new Set();
  const re = /section\.settings\.([\w]+)/g;
  let m;
  while ((m = re.exec(codePart)) !== null) refs.add(m[1]);
  return refs;
};

const runSchemaChecks = (liquidCode, elements) => {
  const checks = [];
  const schema = extractSchemaSettings(liquidCode);
  if (!schema) {
    checks.push({ name: "Schema parse", pass: false, errors: ["Could not extract schema JSON"] });
    return checks;
  }

  const schemaSettings = schema.settings || [];
  const actualSettings = schemaSettings.filter((s) => s.type !== "header");
  const schemaSettingIds = new Set(actualSettings.map((s) => s.id));

  // Malformed settings (undefined IDs, headers excluded)
  const malformed = actualSettings.filter((s) => !s.id || s.id === "undefined");
  checks.push({
    name: "No malformed settings",
    pass: malformed.length === 0,
    errors: malformed.map((s) => `Setting with undefined ID (type: ${s.type}, label: ${s.label || "none"})`),
  });

  // Orphan references (code refs a setting not in schema)
  const codeRefs = extractSettingRefsFromCode(liquidCode);
  const orphanRefs = [];
  codeRefs.forEach((ref) => { if (!schemaSettingIds.has(ref)) orphanRefs.push(ref); });
  checks.push({
    name: "No orphan references",
    pass: orphanRefs.length === 0,
    errors: orphanRefs.map((r) => `HTML/CSS references section.settings.${r} but not in schema`),
  });

  // Unused settings (schema setting never referenced, skip visibility)
  const visSuffixes = ["hideOnMobile", "hideOnDesktop", "hideOnFullscreen"];
  const unused = [];
  actualSettings.forEach((s) => {
    if (!s.id || s.id === "undefined") return;
    if (visSuffixes.some((v) => s.id.endsWith(v))) return;
    if (!codeRefs.has(s.id)) unused.push(s.id);
  });
  checks.push({
    name: "No unused schema settings",
    pass: unused.length === 0,
    errors: unused.map((id) => `Schema setting "${id}" exists but never referenced in HTML/CSS`),
  });

  // Type consistency
  const typeMismatches = [];
  const propMapByElement = {};
  walkElements(elements, (el) => { propMapByElement[el.id] = el; });

  actualSettings.forEach((s) => {
    if (!s.id || typeof s.id !== "string") return;
    const idParts = s.id.split("_");
    if (idParts.length < 4) return;
    const breakpoints = ["mobile", "desktop", "fullscreen"];
    const lastPart = idParts[idParts.length - 1];
    const propName = breakpoints.includes(lastPart) ? idParts.slice(3, -1).join("_") : idParts.slice(3).join("_");

    // Find which element this setting belongs to by matching ID prefix
    for (const el of Object.values(propMapByElement)) {
      const def = elementDefinitions[el.type];
      if (!def) continue;
      const allProps = [...(def.contentProps || []), ...(def.styleProps || [])];
      const propDef = allProps.find((p) => p.name === propName);
      if (propDef && propDef.schemaType && s.type !== propDef.schemaType) {
        const compatible =
          (propDef.schemaType === "number" && s.type === "range") ||
          (propDef.schemaType === "range" && s.type === "number") ||
          (propDef.schemaType === "text" && s.type === "textarea") ||
          (propDef.schemaType === "textarea" && s.type === "text");
        if (!compatible) {
          typeMismatches.push(`${propName}: expected "${propDef.schemaType}" but got "${s.type}"`);
        }
        break;
      }
    }
  });
  checks.push({
    name: "Schema type consistency",
    pass: typeMismatches.length === 0,
    errors: typeMismatches,
  });

  return checks;
};

// ─── Main Test Runner ────────────────────────────────────────

const runTemplateTest = (template) => {
  const result = {
    name: template.name,
    id: template.id,
    category: template.subcategory || template.category,
    instantiated: false,
    instantiateError: null,
    liquidCode: "",
    exportError: null,
    validations: [],
    schemaChecks: [],
    passCount: 0,
    failCount: 0,
    settingsCount: 0,
  };

  let elements;
  try {
    elements = instantiateTemplate(template);
    elements = enableAllToggles(elements);
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

  // Schema-specific checks
  try {
    result.schemaChecks = runSchemaChecks(result.liquidCode, elements);
  } catch (e) {
    result.schemaChecks = [{ name: "Schema check error", pass: false, errors: [e.message] }];
  }

  // Downgrade settings count failure to warning — All Toggles ON will always exceed 250
  const settingsCheckIdx = result.validations.findIndex(v => v.name === "Settings count check");
  if (settingsCheckIdx !== -1 && !result.validations[settingsCheckIdx].pass) {
    result.validations[settingsCheckIdx].warning = true;
    result.validations[settingsCheckIdx].pass = true;
    result.validations[settingsCheckIdx].info = (result.validations[settingsCheckIdx].info || "") +
      " (warning only — All Toggles ON mode)";
  }

  const allChecks = [...result.validations, ...result.schemaChecks];
  result.passCount = allChecks.filter((v) => v.pass).length;
  result.failCount = allChecks.filter((v) => !v.pass).length;

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
      data-id="templates-schema--modal--preview"
    >
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
            All Toggles ON — Resolved Liquid with schema defaults
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
              data-id={`templates-schema--button--viewport-${vp.label.toLowerCase()}`}
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
            data-id="templates-schema--button--close-preview"
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
            data-id="templates-schema--iframe--preview"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────

export default function TemplatesSchemaTestPage() {
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

  const isFail = (r) => r.failCount > 0 || r.exportError || r.instantiateError || r.schemaChecks.some(c => !c.pass);

  const exportReport = useCallback(() => {
    if (!results) return;
    const lines = [];
    lines.push("TEMPLATE SCHEMA VALIDATION REPORT (All Toggles ON)");
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push("=".repeat(60) + "\n");

    for (const r of results) {
      if (!isFail(r)) continue;

      lines.push(`FAIL: ${r.name} (${r.id})`);
      lines.push("-".repeat(40));

      if (r.instantiateError) lines.push(`  [Instantiate Error] ${r.instantiateError}`);
      if (r.exportError) lines.push(`  [Export Error] ${r.exportError}`);
      for (const v of r.validations.filter((v) => !v.pass)) {
        lines.push(`  [${v.name}]`);
        for (const e of v.errors) lines.push(`    - ${e}`);
      }
      for (const c of r.schemaChecks.filter((c) => !c.pass)) {
        lines.push(`  [Schema: ${c.name}]`);
        for (const e of c.errors) lines.push(`    - ${e}`);
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
    a.download = "template-schema-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  const totalTemplates = results?.length || 0;
  const passTemplates = results?.filter(r => !isFail(r)).length || 0;
  const failTemplates = totalTemplates - passTemplates;
  const totalValidationFails = results?.reduce((s, r) => s + r.failCount, 0) || 0;
  const totalSchemaFails = results?.reduce((s, r) => s + r.schemaChecks.filter(c => !c.pass).length, 0) || 0;
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
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }} data-id="templates-schema--heading--title">
        Template Schema Validation
      </h1>
      <p style={{ color: "#8b949e", marginBottom: "24px" }}>
        Tests all {sectionTemplates.length} templates with ALL schema toggles enabled.
        Validates every property generates correct Liquid vars, schema settings, and references.
        Settings count &gt; 250 is shown as a warning (expected in all-on mode).
      </p>

      <div style={{ display: "flex", gap: "12px", marginBottom: "32px", alignItems: "center" }}>
        <button
          onClick={runTests}
          disabled={running}
          data-id="templates-schema--button--run"
          style={{
            padding: "12px 32px",
            fontSize: "16px",
            fontWeight: "600",
            backgroundColor: running ? "#333" : "#1f6feb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: running ? "wait" : "pointer",
          }}
        >
          {running ? "Running..." : "Run All Schema Tests"}
        </button>

        {results && failTemplates > 0 && (
          <button
            onClick={exportReport}
            data-id="templates-schema--button--export"
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
              <div style={{ color: totalValidationFails > 0 ? "#f85149" : "#8b949e", fontSize: "14px" }}>{totalValidationFails} validation fails</div>
              <div style={{ color: totalSchemaFails > 0 ? "#f85149" : "#8b949e", fontSize: "14px" }}>{totalSchemaFails} schema check fails</div>
            </div>
            <div style={{ borderLeft: "1px solid #30363d", paddingLeft: "24px" }}>
              <div style={{ color: maxSettings > 250 ? "#f0883e" : "#8b949e", fontSize: "14px" }}>
                Max settings: {maxSettings} (warning only)
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
                data-id={`templates-schema--button--filter-${tab.key}`}
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
                <th style={thStyle}>Validation</th>
                <th style={thStyle}>Schema</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const realIndex = results.indexOf(r);
                const hasFail = isFail(r);

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
                          color: r.settingsCount > 250 ? "#f0883e" : r.settingsCount > 200 ? "#f0883e" : "#8b949e",
                          fontWeight: r.settingsCount > 200 ? "600" : "400",
                        }}>
                          {r.settingsCount}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ color: "#3fb950" }}>{r.passCount}</span>
                        {" / "}
                        <span style={{ color: r.failCount > 0 ? "#f85149" : "#8b949e" }}>{r.failCount}</span>
                      </td>
                      <td style={tdStyle}>
                        {(() => {
                          const schemaFails = r.schemaChecks.filter(c => !c.pass);
                          const schemaPass = r.schemaChecks.filter(c => c.pass).length;
                          return schemaFails.length === 0 ? (
                            <span style={{ color: "#3fb950" }}>{schemaPass}/{r.schemaChecks.length}</span>
                          ) : (
                            <span style={{ color: "#f85149" }}>{schemaFails.length} fail</span>
                          );
                        })()}
                      </td>
                      <td style={tdStyle}>
                        {r.liquidCode && (
                          <button
                            onClick={() => setPreviewIndex(realIndex)}
                            style={{ ...actionBtnStyle, backgroundColor: "#1f6feb", borderColor: "#388bfd" }}
                            data-id={`templates-schema--button--preview-${realIndex}`}
                          >
                            Preview
                          </button>
                        )}
                        <button
                          onClick={() => toggle(realIndex)}
                          style={{ ...actionBtnStyle, marginLeft: "8px" }}
                          data-id={`templates-schema--button--details-${realIndex}`}
                        >
                          {expanded[realIndex] ? "Hide" : "Details"}
                        </button>
                        {r.liquidCode && (
                          <button
                            onClick={() => toggleLiquid(realIndex)}
                            style={{ ...actionBtnStyle, marginLeft: "8px" }}
                            data-id={`templates-schema--button--liquid-${realIndex}`}
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
                            {r.schemaChecks.filter(c => !c.pass).length > 0 && (
                              <div style={{ marginBottom: "16px" }}>
                                <div style={{ color: "#f85149", fontWeight: "600", marginBottom: "8px", fontSize: "13px" }}>
                                  Schema Check Failures
                                </div>
                                {r.schemaChecks.filter(c => !c.pass).map((c, ci) => (
                                  <div key={ci} style={{ marginBottom: "8px" }}>
                                    <div style={{ color: "#f0883e", fontSize: "12px", fontWeight: "600" }}>{c.name}</div>
                                    {c.errors.map((e, ei) => (
                                      <div key={ei} style={{ color: "#c9d1d9", paddingLeft: "12px", fontSize: "11px", fontFamily: "monospace" }}>
                                        - {e}
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Validation warnings (settings count) */}
                            {r.validations.filter(v => v.warning).length > 0 && (
                              <div style={{ marginBottom: "16px" }}>
                                <div style={{ color: "#f0883e", fontWeight: "600", marginBottom: "8px", fontSize: "13px" }}>
                                  Warnings
                                </div>
                                {r.validations.filter(v => v.warning).map((v, vi) => (
                                  <div key={vi} style={{ marginBottom: "4px" }}>
                                    <div style={{ color: "#f0883e", fontSize: "12px" }}>{v.name}: {v.info}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* All passing checks */}
                            <div>
                              <div style={{ color: "#3fb950", fontWeight: "600", marginBottom: "8px", fontSize: "13px" }}>
                                Passing Checks ({[...r.validations, ...r.schemaChecks].filter(c => c.pass).length})
                              </div>
                              {[...r.validations, ...r.schemaChecks].filter(c => c.pass).map((c, ci) => (
                                <div key={ci} style={{ color: "#8b949e", fontSize: "11px", paddingLeft: "8px" }}>
                                  {c.name} {c.warning ? "(warning)" : ""}
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
