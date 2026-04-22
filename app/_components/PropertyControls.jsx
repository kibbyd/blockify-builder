/**
 * Property Controls - Reusable control components for PropertyPanel
 *
 * Each control type corresponds to controlType in element definitions
 */

"use client";
import React, { useState } from "react";

/**
 * Text input with CSS validation
 */
export function TextInput({ value, onChange, property }) {
  const [error, setError] = useState(null);

  const isValidCSSValue = (val) => {
    if (!val) return true; // Empty is valid

    // Common CSS units and patterns
    const unitlessNumber = /^-?\d+\.?\d*$/; // Unitless numbers (for line-height, z-index, etc.)
    const validUnits = /^-?\d+\.?\d*(px|rem|em|%|vh|vw|fr|vmin|vmax|ch|ex)$/i;
    const calcPattern = /^calc\(.+\)$/i;
    const clampPattern = /^clamp\(.+\)$/i;
    const minMaxPattern = /^(min|max)\(.+\)$/i;
    const varPattern = /^var\(--[\w-]+\)$/i;
    const autoInherit = /^(auto|inherit|initial|unset|normal|none)$/i;
    const borderPattern =
      /^(\d+\.?\d*(px|rem|em|%)?\s+)?(solid|dashed|dotted|double|groove|ridge|inset|outset|none)\s*(#[0-9a-f]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)|[a-z]+)?$/i;
    const multiValue = /^[\w\-#().%,\s]+$/; // Allow multiple space-separated values

    return (
      unitlessNumber.test(val) ||
      validUnits.test(val) ||
      calcPattern.test(val) ||
      clampPattern.test(val) ||
      minMaxPattern.test(val) ||
      varPattern.test(val) ||
      autoInherit.test(val) ||
      borderPattern.test(val) ||
      multiValue.test(val)
    );
  };

  const isUrlProperty =
    property?.schemaType === "url" ||
    /url|href|action/i.test(property?.name);
  const isContentProp = !property?.category;

  const handleChange = (e) => {
    const newValue = e.target.value;

    if (!isUrlProperty && !isContentProp && newValue && !isValidCSSValue(newValue)) {
      setError("Invalid CSS value");
    } else {
      setError(null);
    }

    onChange(newValue);
  };

  return (
    <div>
      <input
        type="text"
        value={value || ""}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "8px",
          border: error ? "1px solid #f44336" : "1px solid #ddd",
          borderRadius: "4px",
          fontSize: "13px",
        }}
      />
      {error && (
        <span
          style={{
            color: "#f44336",
            fontSize: "11px",
            marginTop: "4px",
            display: "block",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

/**
 * Color picker - Hex code only with apply button
 */
export function ColorPicker({ value, onChange }) {
  const [inputValue, setInputValue] = React.useState(value || "");

  // Update local input when value prop changes
  React.useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleApply = () => {
    let finalValue = inputValue.trim();

    // If value is not empty and doesn't start with #, add it
    if (finalValue && !finalValue.startsWith("#")) {
      finalValue = "#" + finalValue;
    }

    onChange(finalValue);
  };

  const handleKeyDown = (e) => {
    // Apply on Enter key
    if (e.key === "Enter") {
      handleApply();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder="#FFFFFF"
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          fontSize: "13px",
          fontFamily: "monospace",
          boxSizing: "border-box",
        }}
      />
      <button
        type="button"
        onClick={handleApply}
        style={{
          width: "100%",
          padding: "8px 16px",
          backgroundColor: "#0066cc",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "600",
        }}
      >
        Apply
      </button>
    </div>
  );
}

/**
 * Select dropdown
 */
export function SelectControl({ value, onChange, property }) {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "8px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "13px",
        backgroundColor: "white",
        cursor: "pointer",
      }}
    >
      <option value="">-- Select --</option>
      {property.options?.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

/**
 * Toggle switch
 */
export function ToggleControl({ value, onChange }) {
  const isChecked = value === true || value === "true";

  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ marginRight: "8px" }}
      />
      <span style={{ fontSize: "13px" }}>{isChecked ? "On" : "Off"}</span>
    </label>
  );
}

/**
 * Range slider with linked number input
 */
export function SliderControl({ value, onChange, property }) {
  const min = property.min || 0;
  const max = property.max || 100;
  const step = property.step || 1;

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value || min}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          flex: 1,
          cursor: "pointer",
        }}
      />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value || ""}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: "60px",
          padding: "6px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          fontSize: "13px",
          textAlign: "center",
        }}
      />
    </div>
  );
}

/**
 * Textarea
 */
export function TextareaControl({ value, onChange, property }) {
  return (
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      rows={property.rows || 3}
      style={{
        width: "100%",
        padding: "8px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "13px",
        fontFamily: "inherit",
        resize: "vertical",
      }}
    />
  );
}

/**
 * Button group (visual button selector)
 */
export function ButtonGroupControl({ value, onChange, property, element }) {
  const getIcon = (option) => {
    // Check if this is a vertical alignment control
    const isVertical =
      property?.name === "marginVertical" ||
      property?.label?.toLowerCase().includes("vertical");

    // Font weight labels (use full names instead of icons)
    if (property?.name === "fontWeight") {
      const fontWeightLabels = {
        normal: "Regular",
        bold: "Bold",
        100: "Thin",
        200: "Extra Light",
        300: "Light",
        400: "Regular",
        500: "Medium",
        600: "Semi Bold",
        700: "Bold",
        800: "Extra Bold",
        900: "Black",
      };
      return fontWeightLabels[option] || option;
    }

    // Text transform labels
    if (property?.name === "textTransform") {
      const textTransformLabels = {
        uppercase: "UPPERCASE",
        lowercase: "lowercase",
        capitalize: "Capitalize",
      };
      return textTransformLabels[option] || option;
    }

    // Text decoration labels
    if (
      property?.name === "textDecoration" ||
      property?.name === "hoverTextDecoration"
    ) {
      const textDecorationLabels = {
        underline: "Underline",
        overline: "Overline",
        "line-through": "Strikethrough",
      };
      return textDecorationLabels[option] || option;
    }

    // Hover animation labels
    if (property?.name === "hoverAnimation" || property?.name === "buttonHoverAnimation") {
      const hoverAnimationLabels = {
        grow: "Grow",
        shrink: "Shrink",
        shake: "Shake",
        pulse: "Pulse",
        bounce: "Bounce",
        rotate: "Rotate",
      };
      return hoverAnimationLabels[option] || option;
    }

    // Background repeat labels
    if (property?.name === "backgroundRepeat") {
      const backgroundRepeatLabels = {
        "no-repeat": "None",
        repeat: "Repeat",
        "repeat-x": "X",
        "repeat-y": "Y",
      };
      return backgroundRepeatLabels[option] || option;
    }

    // Background size labels
    if (property?.name === "backgroundSize") {
      const backgroundSizeLabels = {
        cover: "Cover",
        contain: "Contain",
        auto: "Auto",
      };
      return backgroundSizeLabels[option] || option;
    }

    // Background position labels
    if (property?.name === "backgroundPosition") {
      const backgroundPositionLabels = {
        "top left": "↖",
        "top center": "↑",
        "top right": "↗",
        "center left": "←",
        "center center": "●",
        "center right": "→",
        "bottom left": "↙",
        "bottom center": "↓",
        "bottom right": "↘",
      };
      return backgroundPositionLabels[option] || option;
    }

    // Object fit labels
    if (property?.name === "objectFit") {
      const objectFitLabels = {
        fill: "Fill",
        contain: "Contain",
        cover: "Cover",
        none: "None",
        "scale-down": "Scale Down",
      };
      return objectFitLabels[option] || option;
    }

    // Overflow labels
    if (property?.name === "overflow") {
      const overflowLabels = {
        visible: "Visible",
        hidden: "Hidden",
        scroll: "Scroll",
        auto: "Auto",
      };
      return overflowLabels[option] || option;
    }

    // Icon size - show full pixel value
    if (property?.name === "iconSize") {
      return option;
    }

    // Heading tag - show uppercase tag (H2, H3, H4, H5, H6)
    if (property?.name === "tag") {
      return option.toUpperCase(); // Return 'H2', 'H3', etc.
    }

    // Icons for common button group options
    const icons = {
      left: "⬅️",
      center: "⬛",
      right: "➡️",
      justify: "▬",
      // Keep consistent: left/right for horizontal, up/down for vertical
      "flex-start": isVertical ? "⬆️" : "⬅️",
      "flex-end": isVertical ? "⬇️" : "➡️",
      "space-between": "↔️",
      "space-around": "⟷",
      "space-evenly": "≡",
      stretch: "⬍⬍",
      baseline: "━",
      row: "→",
      column: "↓",
      "row-reverse": "←",
      "column-reverse": "↑",
      block: "▭",
      flex: "▦",
      grid: "⊞",
      "inline-block": "▢",
      nowrap: "→→",
      wrap: "⤵",
      "wrap-reverse": "⤴",
      start: "⬅️",
      end: "➡️",
    };

    return icons[option] || option.charAt(0).toUpperCase() + option.slice(1);
  };

  // Use fewer columns for properties with full text labels to prevent text cutoff
  const columnCount =
    property?.name === "hoverAnimation" || property?.name === "buttonHoverAnimation"
      ? 3
      : property?.name === "backgroundSize"
        ? 1
        : property?.name === "backgroundPosition"
          ? 3
          : property?.name === "objectFit" || property?.name === "overflow" || property?.name === "borderStyle"
            ? 2
            : property?.name === "iconSize"
              ? 3
              : property?.name === "cardAspectRatio"
                ? 2
                : Math.min(property.options?.length || 3, 4);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: "6px",
      }}
    >
      {property.options?.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          title={option}
          style={{
            padding: "10px 8px",
            border: value === option ? "2px solid #0066cc" : "1px solid #ddd",
            backgroundColor: value === option ? "#e3f2fd" : "white",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: value === option ? "bold" : "normal",
            fontSize: "16px",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {getIcon(option)}
        </button>
      ))}
    </div>
  );
}

/**
 * Dropdown select control
 */
export function DropdownControl({ value, onChange, property }) {
  const getLabel = (option) => {
    // Font weight labels
    if (property?.name === "fontWeight") {
      const labels = {
        normal: "Regular",
        bold: "Bold",
        100: "Thin",
        200: "Extra Light",
        300: "Light",
        400: "Regular",
        500: "Medium",
        600: "Semi Bold",
        700: "Bold",
        800: "Extra Bold",
        900: "Black",
      };
      return labels[option] || option;
    }

    // Text transform labels
    if (property?.name === "textTransform") {
      const labels = {
        uppercase: "UPPERCASE",
        lowercase: "lowercase",
        capitalize: "Capitalize",
      };
      return labels[option] || option;
    }

    // Text decoration labels
    if (
      property?.name === "textDecoration" ||
      property?.name === "hoverTextDecoration"
    ) {
      const labels = {
        underline: "Underline",
        "line-through": "Strikethrough",
      };
      return labels[option] || option;
    }

    // Default: capitalize first letter
    return option.charAt(0).toUpperCase() + option.slice(1);
  };

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "8px 12px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "14px",
        backgroundColor: "white",
        cursor: "pointer",
      }}
    >
      <option value="">Select...</option>
      {property.options?.map((option) => (
        <option key={option} value={option}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}

/**
 * File upload with filename tracking
 */
export function FileControl({ value, onChange, onFileInfo, accept = "image/*" }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      // Pass the data URL along with file info in a single call
      // to avoid race conditions with separate onFileInfo callback
      onChange(event.target.result, {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          fontSize: "13px",
          cursor: "pointer",
        }}
      />
      {value && value.startsWith("data:image") && (
        <div style={{ marginTop: "10px" }}>
          <img
            src={value}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "150px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Number input with +/- buttons
 */
export function NumberControl({ value, onChange, property }) {
  const min = property.min;
  const max = property.max;
  const step = property.step || 1;

  const increment = () => {
    const newValue = (parseFloat(value) || 0) + step;
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  };

  const decrement = () => {
    const newValue = (parseFloat(value) || 0) - step;
    if (min === undefined || newValue >= min) {
      onChange(newValue);
    }
  };

  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      <button
        type="button"
        onClick={decrement}
        style={{
          width: "32px",
          height: "32px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        −
      </button>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value || ""}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          flex: 1,
          padding: "8px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          fontSize: "13px",
          textAlign: "center",
        }}
      />
      <button
        type="button"
        onClick={increment}
        style={{
          width: "32px",
          height: "32px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        +
      </button>
    </div>
  );
}

/**
 * Size input with px only (for letter-spacing, etc.)
 */
export function SizePxControl({ value, onChange, property }) {
  // Parse current value to extract number
  const parseValue = (val) => {
    if (!val) return "";
    const match = String(val).match(/^(-?\d+\.?\d*)/);
    return match ? match[1] : "";
  };

  const number = parseValue(value);

  const handleNumberChange = (e) => {
    const newNumber = e.target.value;
    if (newNumber === "" || newNumber === "-") {
      onChange("");
    } else {
      onChange(`${newNumber}px`);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <input
        type="number"
        value={number}
        onChange={handleNumberChange}
        step="0.1"
        style={{
          flex: 1,
          padding: "8px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          fontSize: "13px",
          textAlign: "center",
        }}
      />
      <span
        style={{
          fontSize: "13px",
          color: "#666",
          fontWeight: "500",
          minWidth: "20px",
        }}
      >
        px
      </span>
    </div>
  );
}

/**
 * Size input with unit selector (px/%)
 */
export function SizeControl({ value, onChange, property }) {
  // Parse current value to extract number and unit
  const parseValue = (val) => {
    if (!val) return { number: "", unit: "px" };
    const match = String(val).match(/^(-?\d+\.?\d*)(.*)$/);
    if (match) {
      return {
        number: match[1],
        unit: match[2] || "px",
      };
    }
    return { number: "", unit: "px" };
  };

  const { number, unit } = parseValue(value);
  const [selectedUnit, setSelectedUnit] = useState(unit);

  const handleSliderChange = (e) => {
    const newNumber = e.target.value;
    onChange(`${newNumber}${selectedUnit}`);
  };

  const handleNumberChange = (e) => {
    const newNumber = e.target.value;
    if (newNumber === "" || newNumber === "-") {
      onChange("");
    } else {
      onChange(`${newNumber}${selectedUnit}`);
    }
  };

  const handleUnitChange = (newUnit) => {
    setSelectedUnit(newUnit);
    if (number) {
      onChange(`${number}${newUnit}`);
    }
  };

  // Set slider max based on unit
  const sliderMax = selectedUnit === "%" ? 100 : 500;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "100%",
      }}
    >
      {/* Slider - same width as everything else */}
      <input
        type="range"
        min="0"
        max={sliderMax}
        value={number || 0}
        onChange={handleSliderChange}
        style={{
          width: "100%",
          cursor: "pointer",
          margin: 0,
          padding: 0,
        }}
      />

      {/* Input box below slider */}
      <input
        type="number"
        value={number}
        onChange={handleNumberChange}
        step="1"
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          fontSize: "13px",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      />

      {/* Unit buttons below input - side by side, same total width */}
      <div style={{ display: "flex", gap: "8px", width: "100%" }}>
        <button
          type="button"
          onClick={() => handleUnitChange("px")}
          style={{
            flex: 1,
            padding: "8px",
            border:
              selectedUnit === "px" ? "2px solid #0066cc" : "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: selectedUnit === "px" ? "#e3f2fd" : "white",
            color: "#333",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: selectedUnit === "px" ? "bold" : "normal",
            transition: "all 0.2s",
            boxSizing: "border-box",
          }}
        >
          px
        </button>
        <button
          type="button"
          onClick={() => handleUnitChange("%")}
          style={{
            flex: 1,
            padding: "8px",
            border:
              selectedUnit === "%" ? "2px solid #0066cc" : "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: selectedUnit === "%" ? "#e3f2fd" : "white",
            color: "#333",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: selectedUnit === "%" ? "bold" : "normal",
            transition: "all 0.2s",
            boxSizing: "border-box",
          }}
        >
          %
        </button>
      </div>
    </div>
  );
}

/**
 * Position slider control - align elements within containers
 */
export function PositionSliderControl({ value, onChange }) {
  // For now, just use a simple select control - we'll fix sliders later
  const alignOptions = ["flex-start", "center", "flex-end"];

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <select
      value={value || "center"}
      onChange={handleChange}
      style={{
        width: "100%",
        padding: "8px",
        fontSize: "13px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        backgroundColor: "white",
        cursor: "pointer",
      }}
    >
      <option value="flex-start">Start</option>
      <option value="center">Center</option>
      <option value="flex-end">End</option>
    </select>
  );
}

/**
 * Main PropertyControl component - routes to correct control type
 */
export function PropertyControl({
  property,
  value,
  onChange,
  onFileInfo,
  element,
}) {
  switch (property.controlType) {
    case "text":
      return (
        <TextInput value={value} onChange={onChange} property={property} />
      );

    case "size":
      return (
        <SizeControl value={value} onChange={onChange} property={property} />
      );

    case "size-px":
      return (
        <SizePxControl value={value} onChange={onChange} property={property} />
      );

    case "color":
      return <ColorPicker value={value} onChange={onChange} />;

    case "select":
      return (
        <SelectControl value={value} onChange={onChange} property={property} />
      );

    case "toggle":
      return <ToggleControl value={value} onChange={onChange} />;

    case "slider":
      return (
        <SliderControl value={value} onChange={onChange} property={property} />
      );

    case "textarea":
      return (
        <TextareaControl
          value={value}
          onChange={onChange}
          property={property}
        />
      );

    case "button-group":
      return (
        <ButtonGroupControl
          value={value}
          onChange={onChange}
          property={property}
          element={element}
        />
      );

    case "dropdown":
      return (
        <DropdownControl
          value={value}
          onChange={onChange}
          property={property}
        />
      );

    case "position-slider":
      return <PositionSliderControl value={value} onChange={onChange} />;

    case "file":
      return (
        <FileControl
          value={value}
          onChange={onChange}
          onFileInfo={onFileInfo}
          accept={element?.type === 'video' ? 'video/*' : 'image/*'}
        />
      );

    case "number":
      return (
        <NumberControl value={value} onChange={onChange} property={property} />
      );

    default:
      // Fallback to text input
      return (
        <TextInput value={value} onChange={onChange} property={property} />
      );
  }
}
