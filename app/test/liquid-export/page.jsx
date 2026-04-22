"use client";

import React, { useState, useCallback } from "react";
import { convertJSONToLiquid } from "@/app/_utils/jsonToLiquid";
import { runAllValidations } from "@/app/_utils/liquidValidator";
import { getAllFixtures } from "@/app/_utils/testFixtures";

export default function LiquidExportTestPage() {
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [expandedErrors, setExpandedErrors] = useState({});
  const [expandedLiquid, setExpandedLiquid] = useState({});

  const runTests = useCallback(() => {
    setRunning(true);
    setExpandedErrors({});
    setExpandedLiquid({});

    // Use setTimeout to let the UI update before blocking
    setTimeout(() => {
      const fixtures = getAllFixtures();
      const testResults = [];

      // Test each element individually
      for (const fixture of fixtures) {
        const { name, element } = fixture;
        const jsonData = { elements: [element], responsiveStyles: {} };

        let liquidCode = "";
        let exportError = null;

        try {
          liquidCode = convertJSONToLiquid(jsonData, `test-${element.type}`);
        } catch (e) {
          exportError = e.message;
        }

        if (exportError) {
          testResults.push({
            name,
            type: element.type,
            liquidCode: "",
            exportError,
            validations: [],
            passCount: 0,
            failCount: 1,
            totalCount: 1,
          });
          continue;
        }

        const validations = runAllValidations(liquidCode, [element]);
        const passCount = validations.filter((v) => v.pass).length;
        const failCount = validations.filter((v) => !v.pass).length;

        testResults.push({
          name,
          type: element.type,
          liquidCode,
          exportError: null,
          validations,
          passCount,
          failCount,
          totalCount: validations.length,
        });
      }

      // Also test combined (all elements on one page)
      const allElements = fixtures.map((f) => f.element);
      let combinedLiquid = "";
      let combinedError = null;
      try {
        combinedLiquid = convertJSONToLiquid(
          { elements: allElements, responsiveStyles: {} },
          "combined-test"
        );
      } catch (e) {
        combinedError = e.message;
      }

      let combinedValidations = [];
      if (!combinedError) {
        combinedValidations = runAllValidations(combinedLiquid, allElements);
      }

      const combinedPassCount = combinedValidations.filter((v) => v.pass).length;
      const combinedFailCount = combinedValidations.filter((v) => !v.pass).length;

      testResults.push({
        name: "COMBINED (all elements)",
        type: "all",
        liquidCode: combinedLiquid,
        exportError: combinedError,
        validations: combinedValidations,
        passCount: combinedPassCount,
        failCount: combinedError ? 1 : combinedFailCount,
        totalCount: combinedError ? 1 : combinedValidations.length,
      });

      setResults(testResults);
      setRunning(false);
    }, 50);
  }, []);

  const toggleErrors = (index) => {
    setExpandedErrors((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleLiquid = (index) => {
    setExpandedLiquid((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const exportErrors = useCallback(() => {
    if (!results) return;
    const lines = [];
    lines.push(`LIQUID EXPORT VALIDATION REPORT`);
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push(`${'='.repeat(60)}\n`);

    let totalErrors = 0;
    for (const r of results) {
      const failures = r.exportError
        ? [{ name: 'Export Error', errors: [r.exportError] }]
        : r.validations.filter(v => !v.pass);
      if (failures.length === 0) continue;

      lines.push(`FAIL: ${r.name} (${r.type})`);
      lines.push(`${'-'.repeat(40)}`);
      for (const f of failures) {
        lines.push(`  [${f.name}]`);
        for (const e of f.errors) {
          lines.push(`    - ${e}`);
          totalErrors++;
        }
      }
      lines.push('');
    }

    lines.push(`${'='.repeat(60)}`);
    lines.push(`TOTAL: ${totalErrors} errors across ${results.filter(r => r.failCount > 0 || r.exportError).length} elements`);

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'liquid-export-errors.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  const totalPass = results
    ? results.reduce((sum, r) => sum + r.passCount, 0)
    : 0;
  const totalFail = results
    ? results.reduce((sum, r) => sum + r.failCount, 0)
    : 0;
  const totalExportErrors = results
    ? results.filter((r) => r.exportError).length
    : 0;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "40px", maxWidth: "1200px", margin: "0 auto", backgroundColor: "#0d1117", color: "#c9d1d9", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
        Liquid Export Validator
      </h1>
      <p style={{ color: "#8b949e", marginBottom: "24px" }}>
        Tests every element type against 10 validation rules
      </p>

      <button
        onClick={runTests}
        disabled={running}
        data-id="test--button--run"
        style={{
          padding: "12px 32px",
          fontSize: "16px",
          fontWeight: "600",
          backgroundColor: running ? "#333" : "#238636",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: running ? "wait" : "pointer",
          marginBottom: "32px",
        }}
      >
        {running ? "Running..." : "Run All Tests"}
      </button>

      {results && results.some(r => r.failCount > 0 || r.exportError) && (
        <button
          onClick={exportErrors}
          data-id="test--button--export-errors"
          style={{
            padding: "12px 32px",
            fontSize: "16px",
            fontWeight: "600",
            backgroundColor: "#da3633",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "32px",
            marginLeft: "12px",
          }}
        >
          Export All Errors
        </button>
      )}

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
            }}
          >
            <div>
              <span style={{ fontSize: "32px", fontWeight: "800", color: totalFail === 0 && totalExportErrors === 0 ? "#3fb950" : "#f85149" }}>
                {totalFail === 0 && totalExportErrors === 0 ? "PASS" : "FAIL"}
              </span>
            </div>
            <div style={{ borderLeft: "1px solid #30363d", paddingLeft: "24px" }}>
              <div style={{ color: "#3fb950", fontSize: "14px" }}>
                {totalPass} passed
              </div>
              <div style={{ color: totalFail > 0 ? "#f85149" : "#8b949e", fontSize: "14px" }}>
                {totalFail} failed
              </div>
              {totalExportErrors > 0 && (
                <div style={{ color: "#f85149", fontSize: "14px" }}>
                  {totalExportErrors} export crashes
                </div>
              )}
            </div>
            <div style={{ borderLeft: "1px solid #30363d", paddingLeft: "24px" }}>
              <div style={{ color: "#8b949e", fontSize: "14px" }}>
                {results.length} element types tested
              </div>
              <div style={{ color: "#8b949e", fontSize: "14px" }}>
                10 validators per element
              </div>
            </div>
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
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Pass</th>
                <th style={thStyle}>Fail</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <React.Fragment key={i}>
                  <tr
                    style={{
                      borderBottom: "1px solid #21262d",
                      backgroundColor: r.failCount > 0 || r.exportError ? "rgba(248,81,73,0.05)" : "transparent",
                    }}
                  >
                    <td style={tdStyle}>{r.name}</td>
                    <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "12px", color: "#8b949e" }}>
                      {r.type}
                    </td>
                    <td style={tdStyle}>
                      {r.exportError ? (
                        <span style={{ color: "#f85149", fontWeight: "600" }}>CRASH</span>
                      ) : r.failCount === 0 ? (
                        <span style={{ color: "#3fb950", fontWeight: "600" }}>PASS</span>
                      ) : (
                        <span style={{ color: "#f85149", fontWeight: "600" }}>FAIL</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, color: "#3fb950" }}>{r.passCount}</td>
                    <td style={{ ...tdStyle, color: r.failCount > 0 ? "#f85149" : "#8b949e" }}>
                      {r.failCount}
                    </td>
                    <td style={tdStyle}>
                      {(r.failCount > 0 || r.exportError) && (
                        <button
                          onClick={() => toggleErrors(i)}
                          style={actionBtnStyle}
                          data-id={`test--button--errors-${i}`}
                        >
                          {expandedErrors[i] ? "Hide Errors" : "Show Errors"}
                        </button>
                      )}
                      {r.liquidCode && (
                        <button
                          onClick={() => toggleLiquid(i)}
                          style={{ ...actionBtnStyle, marginLeft: "8px" }}
                          data-id={`test--button--liquid-${i}`}
                        >
                          {expandedLiquid[i] ? "Hide Liquid" : "View Liquid"}
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Error Details */}
                  {expandedErrors[i] && (
                    <tr>
                      <td colSpan={6} style={{ padding: "0 16px 16px" }}>
                        <div style={{ backgroundColor: "#1c1210", border: "1px solid #f8514933", borderRadius: "6px", padding: "12px 16px", fontSize: "13px" }}>
                          {r.exportError && (
                            <div style={{ color: "#f85149", marginBottom: "8px" }}>
                              Export Error: {r.exportError}
                            </div>
                          )}
                          {r.validations
                            .filter((v) => !v.pass)
                            .map((v, vi) => (
                              <div key={vi} style={{ marginBottom: "12px" }}>
                                <div style={{ color: "#f85149", fontWeight: "600", marginBottom: "4px" }}>
                                  {v.name}
                                </div>
                                {v.errors.map((e, ei) => (
                                  <div key={ei} style={{ color: "#c9d1d9", paddingLeft: "12px", fontSize: "12px", fontFamily: "monospace", marginBottom: "2px" }}>
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
                  {expandedLiquid[i] && (
                    <tr>
                      <td colSpan={6} style={{ padding: "0 16px 16px" }}>
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
              ))}
            </tbody>
          </table>
        </>
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
