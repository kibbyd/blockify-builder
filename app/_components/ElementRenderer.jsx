"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDrop, useDrag } from "react-dnd";
import IconPicker from "@/app/_components/IconPicker";
import { Copy, Trash2, Settings, ChevronDown as ChevronDownIcon, Star, Download } from "lucide-react";
import {
  getLockedProps,
  getDefaultProps,
  getDefaultStyle,
} from "@/app/_config/elementDefinitions";

const ElementRenderer = ({
  element,
  isSelected,
  onAddChildElement,
  onUpdateElement,
  onSelectElement,
  selectedElement,
  breakpoint,
  responsiveStyles,
  nestingDepth = 0,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const editRef = useRef(null);

  // Add error boundary to catch rendering issues
  if (!element) {
    return (
      <div style={{ padding: "20px", color: "red", border: "1px solid red" }}>
        Error: Element is null
      </div>
    );
  }

  if (!element.type) {
    return (
      <div style={{ padding: "20px", color: "red", border: "1px solid red" }}>
        Error: Element type is missing
      </div>
    );
  }

  // Apply responsive styles for current breakpoint
  const elementResponsiveStyles =
    responsiveStyles?.[element.id]?.[breakpoint] || {};

  // Filter out empty string values (disabled properties)
  const filteredResponsiveStyles = Object.entries(
    elementResponsiveStyles,
  ).reduce((acc, [key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});

  // Get locked properties for this element type
  const lockedProps = getLockedProps(element.type);

  // Merge: base styles, responsive styles (filtered), locked props (locked props have highest priority)
  const mergedStyle = {
    ...element.style,
    ...filteredResponsiveStyles,
    ...lockedProps,
  };

  // Assemble textShadow from individual sub-properties (not valid as individual CSS)
  if (mergedStyle.textShadowOffsetX || mergedStyle.textShadowOffsetY || mergedStyle.textShadowBlur || mergedStyle.textShadowColor) {
    mergedStyle.textShadow = `${mergedStyle.textShadowOffsetX} ${mergedStyle.textShadowOffsetY} ${mergedStyle.textShadowBlur} ${mergedStyle.textShadowColor}`;
    delete mergedStyle.textShadowOffsetX;
    delete mergedStyle.textShadowOffsetY;
    delete mergedStyle.textShadowBlur;
    delete mergedStyle.textShadowColor;
  }

  // Assemble boxShadow from individual sub-properties (not valid as individual CSS)
  if (mergedStyle.boxShadowOffsetX || mergedStyle.boxShadowOffsetY || mergedStyle.boxShadowBlur || mergedStyle.boxShadowSpread || mergedStyle.boxShadowColor) {
    mergedStyle.boxShadow = `${mergedStyle.boxShadowOffsetX} ${mergedStyle.boxShadowOffsetY} ${mergedStyle.boxShadowBlur} ${mergedStyle.boxShadowSpread} ${mergedStyle.boxShadowColor}`;
    delete mergedStyle.boxShadowOffsetX;
    delete mergedStyle.boxShadowOffsetY;
    delete mergedStyle.boxShadowBlur;
    delete mergedStyle.boxShadowSpread;
    delete mergedStyle.boxShadowColor;
  }

  const handleTextEdit = (e) => {
    if (e.detail === 2) {
      // Double click
      setIsEditing(true);
    }
  };

  // Focus and set cursor position when entering edit mode
  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      // Set cursor to end of text
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [isEditing]);

  const handleTextSave = () => {
    // Update element text - use innerHTML to preserve HTML tags like <strong>, <em>, <u>
    if (onUpdateElement && editRef.current) {
      const newText = editRef.current.innerHTML;
      if (newText !== element.props.text) {
        onUpdateElement(element.id, {
          props: { ...element.props, text: newText },
        });
      }
    }
    setIsEditing(false);
  };

  const renderElement = () => {
    try {
      const { type, props, style } = element;

      if (!props) {
        return (
          <div
            style={{ padding: "20px", color: "red", border: "1px solid red" }}
          >
            Error: Element props missing
          </div>
        );
      }

      if (!style) {
        return (
          <div
            style={{ padding: "20px", color: "red", border: "1px solid red" }}
          >
            Error: Element style missing
          </div>
        );
      }

      const commonStyle = {
        ...mergedStyle,
        ...(props.color && { color: props.color }),
        // Don't apply bold/italic/underline as CSS - they're handled by HTML tags in the text
        outline: isSelected ? "2px solid #0066cc" : "none",
        outlineOffset: isSelected ? "2px" : "0",
      };

      switch (type) {
        case "liquid-section":
          return (
            <LiquidSectionElement
              element={element}
              style={commonStyle}
              onUpdateElement={onUpdateElement}
            />
          );

        case "heading":
          const HeadingTag = props.tag;

          const headingStyle = {
            ...commonStyle,
            fontSize: commonStyle.fontSize,
            width: "100%",
          };

          return (
            <HeadingTag
              key={`${element.id}-${props.text}`}
              data-element-id={element.id}
              ref={isEditing ? editRef : null}
              style={headingStyle}
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={handleTextSave}
              onClick={handleTextEdit}
              dangerouslySetInnerHTML={{ __html: props.text }}
            />
          );

        case "text":
          // Build hover styles if any hover properties exist
          const hasHoverStyles =
            mergedStyle.hoverColor ||
            mergedStyle.hoverBackgroundColor ||
            mergedStyle.hoverTextDecoration ||
            mergedStyle.hoverBorderWidth ||
            mergedStyle.hoverBorderStyle ||
            mergedStyle.hoverBorderColor ||
            mergedStyle.hoverOpacity;

          const hoverStyleTag = hasHoverStyles ? (
            <style key={`${element.id}-hover-styles`}>
              {`[data-element-id="${element.id}"]:hover {
              ${mergedStyle.hoverColor ? `color: ${mergedStyle.hoverColor} !important;` : ""}
              ${mergedStyle.hoverBackgroundColor ? `background-color: ${mergedStyle.hoverBackgroundColor} !important;` : ""}
              ${mergedStyle.hoverTextDecoration ? `text-decoration: ${mergedStyle.hoverTextDecoration} !important;` : ""}
              ${mergedStyle.hoverBorderWidth ? `border-width: ${mergedStyle.hoverBorderWidth} !important;` : ""}
              ${mergedStyle.hoverBorderStyle ? `border-style: ${mergedStyle.hoverBorderStyle} !important;` : ""}
              ${mergedStyle.hoverBorderColor ? `border-color: ${mergedStyle.hoverBorderColor} !important;` : ""}
              ${mergedStyle.hoverOpacity ? `opacity: ${mergedStyle.hoverOpacity} !important;` : ""}
            }`}
            </style>
          ) : null;

          // Filter out hover properties from inline styles (they don't work inline)
          const textInlineStyle = Object.keys(commonStyle).reduce(
            (acc, key) => {
              if (!key.startsWith("hover")) {
                acc[key] = commonStyle[key];
              }
              return acc;
            },
            { width: "100%" },
          );

          return (
            <>
              {hoverStyleTag}
              <p
                key={`${element.id}-${props.text}`}
                data-element-id={element.id}
                ref={isEditing ? editRef : null}
                style={textInlineStyle}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={handleTextSave}
                onClick={handleTextEdit}
                dangerouslySetInnerHTML={{
                  __html: props.text,
                }}
              />
            </>
          );

        case "image":
          return (
            <ImageElement
              element={element}
              style={commonStyle}
              onUpdateElement={onUpdateElement}
            />
          );

        case "video":
          return (
            <VideoElement
              element={element}
              style={commonStyle}
              onUpdateElement={onUpdateElement}
            />
          );

        case "icon":
          return (
            <IconElement
              element={element}
              style={commonStyle}
              onUpdateElement={onUpdateElement}
            />
          );

        case "button":
          // Build hover styles and animations
          const hasButtonHoverStyles =
            mergedStyle.hoverColor ||
            mergedStyle.hoverBackgroundColor ||
            mergedStyle.hoverBorderColor;
          const hoverAnimation = mergedStyle.hoverAnimation;

          // Animation keyframes
          const animationKeyframes = hoverAnimation
            ? `
          @keyframes button-grow-${element.id} {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes button-shrink-${element.id} {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.95); }
          }
          @keyframes button-shake-${element.id} {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          @keyframes button-pulse-${element.id} {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.03); opacity: 0.9; }
          }
          @keyframes button-bounce-${element.id} {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          @keyframes button-rotate-${element.id} {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(-2deg); }
            75% { transform: rotate(2deg); }
            100% { transform: rotate(0deg); }
          }
        `
            : "";

          const buttonHoverStyleTag =
            hasButtonHoverStyles || hoverAnimation ? (
              <style key={`${element.id}-hover-styles`}>
                {animationKeyframes}
                {`[data-element-id="${element.id}"] {
              transition: all 0.3s ease;
            }
            [data-element-id="${element.id}"]:hover {
              ${mergedStyle.hoverColor ? `color: ${mergedStyle.hoverColor} !important;` : ""}
              ${mergedStyle.hoverBackgroundColor ? `background-color: ${mergedStyle.hoverBackgroundColor} !important;` : ""}
              ${mergedStyle.hoverBorderColor ? `border-color: ${mergedStyle.hoverBorderColor} !important;` : ""}
              ${hoverAnimation === "grow" ? `animation: button-grow-${element.id} 0.3s ease;` : ""}
              ${hoverAnimation === "shrink" ? `animation: button-shrink-${element.id} 0.3s ease;` : ""}
              ${hoverAnimation === "shake" ? `animation: button-shake-${element.id} 0.3s ease;` : ""}
              ${hoverAnimation === "pulse" ? `animation: button-pulse-${element.id} 0.6s ease;` : ""}
              ${hoverAnimation === "bounce" ? `animation: button-bounce-${element.id} 0.4s ease;` : ""}
              ${hoverAnimation === "rotate" ? `animation: button-rotate-${element.id} 0.4s ease;` : ""}
            }`}
              </style>
            ) : null;

          // Filter out hover properties from inline styles (they don't work inline)
          const buttonInlineStyle = Object.keys(commonStyle).reduce(
            (acc, key) => {
              if (!key.startsWith("hover")) {
                acc[key] = commonStyle[key];
              }
              return acc;
            },
            {},
          );

          return (
            <>
              {buttonHoverStyleTag}
              <button
                data-element-id={element.id}
                style={buttonInlineStyle}
                type="button"
              >
                {props.text}
              </button>
            </>
          );

        case "list":
          const listId = `list-${element.id}`;
          const orderedListStyles = `
          <style>
            .${listId} ol {
              list-style-type: decimal;
              list-style-position: inside;
              padding-left: 0;
              margin: 0;
            }
            .${listId} li {
              padding: 5px 0;
              margin-left: 0;
            }
          </style>
        `;
          return (
            <div
              data-element-id={element.id}
              className={listId}
              style={commonStyle}
              dangerouslySetInnerHTML={{
                __html:
                  orderedListStyles +
                  (props.html ||
                    "<ol><li>Item 1</li><li>Item 2</li><li>Item 3</li></ol>"),
              }}
            />
          );

        case "unordered-list":
          const unorderedListId = `list-${element.id}`;
          const unorderedListStyles = `
          <style>
            .${unorderedListId} ul {
              list-style-type: disc;
              list-style-position: inside;
              padding-left: 0;
              margin: 0;
            }
            .${unorderedListId} li {
              padding: 5px 0;
              margin-left: 0;
            }
          </style>
        `;
          return (
            <div
              data-element-id={element.id}
              className={unorderedListId}
              style={commonStyle}
              dangerouslySetInnerHTML={{
                __html:
                  unorderedListStyles +
                  (props.html ||
                    "<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>"),
              }}
            />
          );

        case "table":
          return (
            <TableElement
              element={element}
              style={commonStyle}
              onUpdateElement={onUpdateElement}
            />
          );

        case "map":
          return (
            <div style={commonStyle}>
              {props.embedUrl ? (
                <iframe
                  src={props.embedUrl}
                  width="100%"
                  height={mergedStyle.height}
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: mergedStyle.height,
                    backgroundColor: "#f0f0f0",
                    border: "2px dashed #ddd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                    textAlign: "center",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div style={{ fontSize: "48px" }}>🗺️</div>
                  <div>Enter an address in the properties panel</div>
                </div>
              )}
            </div>
          );

        case "container":
          return (
            <ContainerElement
              element={element}
              style={commonStyle}
              onAddChildElement={onAddChildElement}
              onUpdateElement={onUpdateElement}
              onSelectElement={onSelectElement}
              selectedElement={selectedElement}
              breakpoint={breakpoint}
              responsiveStyles={responsiveStyles}

            />
          );

        case "image-background":
          return (
            <ImageBackgroundElement
              element={element}
              style={commonStyle}
              onAddChildElement={onAddChildElement}
              onUpdateElement={onUpdateElement}
              onSelectElement={onSelectElement}
              selectedElement={selectedElement}
              breakpoint={breakpoint}
              responsiveStyles={responsiveStyles}

            />
          );

        case "columns":
        case "columns-1":
        case "columns-2":
        case "columns-3":
        case "columns-4":
        case "columns-5":
        case "columns-6":
          return (
            <ColumnsElement
              element={element}
              style={commonStyle}
              onAddChildElement={onAddChildElement}
              onUpdateElement={onUpdateElement}
              onSelectElement={onSelectElement}
              selectedElement={selectedElement}
              breakpoint={breakpoint}
              responsiveStyles={responsiveStyles}
              nestingDepth={nestingDepth}

            />
          );

        case "product-card": {
          const pcCardStyle = {
            ...commonStyle,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#e0e0e0",
          };

          // Build button hover styles and animations
          const hasPcBtnHoverStyles =
            mergedStyle.buttonHoverColor ||
            mergedStyle.buttonHoverBackgroundColor ||
            mergedStyle.buttonHoverBorderColor;
          const pcBtnHoverAnimation = mergedStyle.buttonHoverAnimation;

          const pcBtnAnimKeyframes = pcBtnHoverAnimation
            ? `
          @keyframes pc-btn-grow-${element.id} {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes pc-btn-shrink-${element.id} {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.95); }
          }
          @keyframes pc-btn-shake-${element.id} {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          @keyframes pc-btn-pulse-${element.id} {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.03); opacity: 0.9; }
          }
          @keyframes pc-btn-bounce-${element.id} {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          @keyframes pc-btn-rotate-${element.id} {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(-2deg); }
            75% { transform: rotate(2deg); }
            100% { transform: rotate(0deg); }
          }
        `
            : "";

          const pcBtnHoverStyleTag =
            hasPcBtnHoverStyles || pcBtnHoverAnimation ? (
              <style key={`${element.id}-pc-btn-hover`}>
                {pcBtnAnimKeyframes}
                {`[data-element-id="${element.id}"] button {
              transition: all 0.3s ease;
            }
            [data-element-id="${element.id}"] button:hover {
              ${mergedStyle.buttonHoverColor ? `color: ${mergedStyle.buttonHoverColor} !important;` : ""}
              ${mergedStyle.buttonHoverBackgroundColor ? `background-color: ${mergedStyle.buttonHoverBackgroundColor} !important;` : ""}
              ${mergedStyle.buttonHoverBorderColor ? `border-color: ${mergedStyle.buttonHoverBorderColor} !important;` : ""}
              ${pcBtnHoverAnimation === "grow" ? `animation: pc-btn-grow-${element.id} 0.3s ease;` : ""}
              ${pcBtnHoverAnimation === "shrink" ? `animation: pc-btn-shrink-${element.id} 0.3s ease;` : ""}
              ${pcBtnHoverAnimation === "shake" ? `animation: pc-btn-shake-${element.id} 0.3s ease;` : ""}
              ${pcBtnHoverAnimation === "pulse" ? `animation: pc-btn-pulse-${element.id} 0.6s ease;` : ""}
              ${pcBtnHoverAnimation === "bounce" ? `animation: pc-btn-bounce-${element.id} 0.4s ease;` : ""}
              ${pcBtnHoverAnimation === "rotate" ? `animation: pc-btn-rotate-${element.id} 0.4s ease;` : ""}
            }`}
              </style>
            ) : null;

          return (
            <>
              {pcBtnHoverStyleTag}
              <div data-element-id={element.id} style={pcCardStyle}>
              {props.showImage !== false && (
                props.imageSrc ? (
                  <img src={props.imageSrc} alt="Product" style={{ width: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <div style={{ width: "100%", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: "14px", minHeight: "200px" }}>
                    Product Image
                  </div>
                )
              )}
              <div style={{ padding: commonStyle.paddingTop ? undefined : "12px" }}>
                {props.showTitle !== false && (
                  <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "600", color: commonStyle.color, textAlign: mergedStyle.titleTextAlign }}>Product Title</h3>
                )}
                {props.showPrice !== false && (
                  <p style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: "bold", color: commonStyle.color, textAlign: mergedStyle.priceTextAlign }}>$29.99</p>
                )}
                {props.showButton !== false && (
                  <button type="button" style={{ width: "100%", padding: "10px", backgroundColor: mergedStyle.buttonBackgroundColor, color: mergedStyle.buttonColor, borderRadius: mergedStyle.buttonBorderRadius, cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>
                    {props.buttonText}
                  </button>
                )}
              </div>
            </div>
            </>
          );
        }

        case "product-grid": {
          const pgCols = parseInt(props.columns);
          const pgRows = parseInt(props.rows);
          const pgTotal = pgCols * pgRows;
          const pgItems = Array.from({ length: pgTotal }, (_, i) => i);

          // Build button hover styles and animations
          const hasPgBtnHoverStyles =
            mergedStyle.buttonHoverColor ||
            mergedStyle.buttonHoverBackgroundColor ||
            mergedStyle.buttonHoverBorderColor;
          const pgBtnHoverAnimation = mergedStyle.buttonHoverAnimation;

          const pgBtnAnimKeyframes = pgBtnHoverAnimation
            ? `
          @keyframes pg-btn-grow-${element.id} {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes pg-btn-shrink-${element.id} {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.95); }
          }
          @keyframes pg-btn-shake-${element.id} {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          @keyframes pg-btn-pulse-${element.id} {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.03); opacity: 0.9; }
          }
          @keyframes pg-btn-bounce-${element.id} {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          @keyframes pg-btn-rotate-${element.id} {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(-2deg); }
            75% { transform: rotate(2deg); }
            100% { transform: rotate(0deg); }
          }
        `
            : "";

          const pgBtnHoverStyleTag =
            hasPgBtnHoverStyles || pgBtnHoverAnimation ? (
              <style key={`${element.id}-pg-btn-hover`}>
                {pgBtnAnimKeyframes}
                {`[data-element-id="${element.id}"] button {
              transition: all 0.3s ease;
            }
            [data-element-id="${element.id}"] button:hover {
              ${mergedStyle.buttonHoverColor ? `color: ${mergedStyle.buttonHoverColor} !important;` : ""}
              ${mergedStyle.buttonHoverBackgroundColor ? `background-color: ${mergedStyle.buttonHoverBackgroundColor} !important;` : ""}
              ${mergedStyle.buttonHoverBorderColor ? `border-color: ${mergedStyle.buttonHoverBorderColor} !important;` : ""}
              ${pgBtnHoverAnimation === "grow" ? `animation: pg-btn-grow-${element.id} 0.3s ease;` : ""}
              ${pgBtnHoverAnimation === "shrink" ? `animation: pg-btn-shrink-${element.id} 0.3s ease;` : ""}
              ${pgBtnHoverAnimation === "shake" ? `animation: pg-btn-shake-${element.id} 0.3s ease;` : ""}
              ${pgBtnHoverAnimation === "pulse" ? `animation: pg-btn-pulse-${element.id} 0.6s ease;` : ""}
              ${pgBtnHoverAnimation === "bounce" ? `animation: pg-btn-bounce-${element.id} 0.4s ease;` : ""}
              ${pgBtnHoverAnimation === "rotate" ? `animation: pg-btn-rotate-${element.id} 0.4s ease;` : ""}
            }`}
              </style>
            ) : null;

          return (
            <>
            {pgBtnHoverStyleTag}
            <div data-element-id={element.id} style={{ ...commonStyle, display: "grid", gridTemplateColumns: `repeat(${pgCols}, 1fr)`, width: "100%" }}>
              {pgItems.map((i) => (
                <div key={i} style={{ backgroundColor: commonStyle.backgroundColor, borderWidth: commonStyle.borderWidth, borderStyle: commonStyle.borderStyle, borderColor: commonStyle.borderColor, borderRadius: commonStyle.borderRadius, overflow: "hidden" }}>
                  {props.imageSrc ? (
                    <img src={props.imageSrc} alt={`Product ${i + 1}`} style={{ width: "100%", objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ width: "100%", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: "12px", minHeight: "150px" }}>
                      Product {i + 1}
                    </div>
                  )}
                  <div style={{ padding: commonStyle.paddingTop }}>
                    <h4 style={{ margin: "0 0 4px", fontSize: "14px", color: commonStyle.color, textAlign: mergedStyle.titleTextAlign }}>Product Title</h4>
                    {props.showPrice !== false && (
                      <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: "bold", color: commonStyle.color, textAlign: mergedStyle.priceTextAlign }}>$29.99</p>
                    )}
                    {props.showButton !== false && (
                      <button type="button" style={{ width: "100%", padding: "8px", backgroundColor: mergedStyle.buttonBackgroundColor, color: mergedStyle.buttonColor, borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>
                        {props.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            </>
          );
        }

        case "collection-list": {
          const clCols = parseInt(props.columns);
          const clItems = Array.from({ length: clCols }, (_, i) => i);
          return (
            <div data-element-id={element.id} style={{ ...commonStyle, display: "grid", gridTemplateColumns: `repeat(${clCols}, 1fr)`, width: "100%" }}>
              {clItems.map((i) => (
                <div key={i} style={{ backgroundColor: commonStyle.backgroundColor, borderWidth: commonStyle.borderWidth, borderStyle: commonStyle.borderStyle, borderColor: commonStyle.borderColor, borderRadius: commonStyle.borderRadius, overflow: "hidden", textAlign: "center" }}>
                  {props.showImage !== false && (
                    props.imageSrc ? (
                      <img src={props.imageSrc} alt={`Collection ${i + 1}`} style={{ width: "100%", objectFit: "cover", display: "block" }} />
                    ) : (
                      <div style={{ width: "100%", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: "12px", minHeight: "150px" }}>
                        Collection {i + 1}
                      </div>
                    )
                  )}
                  <div style={{ padding: commonStyle.paddingTop }}>
                    {props.showTitle !== false && (
                      <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "600", color: commonStyle.color }}>Collection Name</h4>
                    )}
                    {props.showCount !== false && (
                      <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>12 products</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        }


        case "spacer":
          return (
            <div
              data-element-id={element.id}
              style={{
                ...commonStyle,
                height: commonStyle.height,
                backgroundColor: isSelected
                  ? "rgba(0, 102, 204, 0.1)"
                  : "transparent",
                border: isSelected ? "1px dashed #0066cc" : "none",
                display: "block",
                width: "100%",
              }}
            />
          );

        case "divider":
          return (
            <hr
              data-element-id={element.id}
              data-id="divider--hr--display"
              style={{
                border: "none",
                borderTop: `${mergedStyle.borderWidth} solid ${mergedStyle.borderColor}`,
                width: mergedStyle.width,
                marginTop: mergedStyle.marginTop,
                marginBottom: mergedStyle.marginBottom,
                marginLeft: mergedStyle.marginLeft,
                marginRight: mergedStyle.marginRight,
                alignSelf: mergedStyle.alignSelf,
              }}
            />
          );

        case "accordion": {
          const [accOpenPanels, setAccOpenPanels] = React.useState({});
          const accItemCount = element.props?.itemCount;
          return (
            <div data-element-id={element.id} data-id="accordion--container--wrapper" style={{ display: "flex", flexDirection: "column", gap: mergedStyle.gap, width: "100%" }}>
              {Array.from({ length: accItemCount }, (_, i) => {
                const idx = i + 1;
                const title = element.props?.[`panelTitle_${idx}`] || `Question ${idx}`;
                const content = element.props?.[`panelContent_${idx}`] || `Answer ${idx}`;
                const isOpen = accOpenPanels[idx];
                return (
                  <div key={idx} data-id={`accordion--item--panel-${idx}`} style={{ borderWidth: "1px", borderStyle: "solid", borderColor: mergedStyle.borderColor, borderRadius: mergedStyle.borderRadius, overflow: "hidden" }}>
                    <div
                      data-id={`accordion--title--panel-${idx}`}
                      onClick={() => setAccOpenPanels(prev => ({ ...prev, [idx]: !prev[idx] }))}
                      style={{ padding: "12px 16px", background: mergedStyle.titleBackgroundColor, color: mergedStyle.titleColor, fontFamily: mergedStyle.titleFontFamily, fontSize: mergedStyle.titleFontSize, fontWeight: mergedStyle.titleFontWeight, cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      {title}
                      <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", display: "inline-flex" }}><ChevronDownIcon size={16} /></span>
                    </div>
                    {isOpen && (
                      <div data-id={`accordion--content--panel-${idx}`} style={{ padding: "12px 16px", background: mergedStyle.contentBackgroundColor, fontSize: mergedStyle.contentFontSize }}>
                        {content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        }

        case "tabs": {
          const [activeTab, setActiveTab] = React.useState(1);
          const tabCount = element.props?.tabCount;
          return (
            <div data-element-id={element.id} data-id="tabs--container--wrapper" style={{ width: "100%" }}>
              <div data-id="tabs--nav--bar" style={{ display: "flex", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: mergedStyle.borderColor }}>
                {Array.from({ length: tabCount }, (_, i) => {
                  const idx = i + 1;
                  const label = element.props?.[`tabLabel_${idx}`] || `Tab ${idx}`;
                  const isActive = activeTab === idx;
                  return (
                    <button
                      key={idx}
                      data-id={`tabs--button--tab-${idx}`}
                      onClick={() => setActiveTab(idx)}
                      style={{ padding: "10px 20px", border: "none", background: isActive ? mergedStyle.tabActiveBackgroundColor : mergedStyle.tabBackgroundColor, color: isActive ? mergedStyle.tabActiveColor : mergedStyle.tabColor, fontFamily: mergedStyle.tabFontFamily, fontSize: mergedStyle.tabFontSize, fontWeight: mergedStyle.tabFontWeight, cursor: "pointer", borderBottom: isActive ? `2px solid ${mergedStyle.tabActiveColor}` : "2px solid transparent" }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <div data-id="tabs--panel--content" style={{ padding: "16px", background: mergedStyle.contentBackgroundColor, fontSize: mergedStyle.contentFontSize }}>
                {element.props?.[`tabContent_${activeTab}`] || `Content for tab ${activeTab}`}
              </div>
            </div>
          );
        }

        case "countdown": {
          const sepStyle = mergedStyle.separatorStyle;
          const sepChar = sepStyle === "colon" ? ":" : "";
          const units = [];
          if (element.props?.showDays !== false) units.push({ label: "Days", value: "00" });
          if (element.props?.showHours !== false) units.push({ label: "Hours", value: "12" });
          if (element.props?.showMinutes !== false) units.push({ label: "Min", value: "34" });
          if (element.props?.showSeconds !== false) units.push({ label: "Sec", value: "56" });
          return (
            <div data-element-id={element.id} data-id="countdown--container--wrapper" style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: "8px", padding: "16px", backgroundColor: mergedStyle.backgroundColor }}>
              {units.map((unit, i) => (
                <React.Fragment key={unit.label}>
                  {i > 0 && sepChar && (
                    <span data-id={`countdown--separator--${i}`} style={{ fontSize: mergedStyle.digitFontSize, fontWeight: 700, color: mergedStyle.digitColor, alignSelf: "flex-start", lineHeight: 1 }}>{sepChar}</span>
                  )}
                  <div data-id={`countdown--unit--${unit.label.toLowerCase()}`} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ fontFamily: mergedStyle.digitFontFamily, fontSize: mergedStyle.digitFontSize, fontWeight: 700, color: mergedStyle.digitColor, lineHeight: 1 }}>{unit.value}</span>
                    <span style={{ fontSize: mergedStyle.labelFontSize, color: mergedStyle.labelColor, textTransform: "uppercase" }}>{unit.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          );
        }

        case "slideshow": {
          const [activeSlide, setActiveSlide] = React.useState(1);
          const slideCount = element.props?.slideCount;
          const showArrows = element.props?.showArrows !== false;
          const showDots = element.props?.showDots !== false;
          return (
            <div data-element-id={element.id} data-id="slideshow--container--wrapper" style={{ position: "relative", width: "100%", height: mergedStyle.height, overflow: "hidden", background: mergedStyle.slideBackgroundColor }}>
              {Array.from({ length: slideCount }, (_, i) => {
                const idx = i + 1;
                if (idx !== activeSlide) return null;
                const heading = element.props?.[`slideHeading_${idx}`] || `Slide ${idx} Heading`;
                const text = element.props?.[`slideText_${idx}`] || `Description for slide ${idx}`;
                const imgSrc = element.props?.[`slideImage_${idx}`] || '';
                return (
                  <div key={idx} data-id={`slideshow--slide--${idx}`} style={{ width: "100%", height: "100%", position: "relative" }}>
                    {imgSrc && <img src={imgSrc} alt={heading} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    <div style={{ position: "absolute", bottom: "20%", left: "5%", color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                      <h2 style={{ margin: 0, fontFamily: mergedStyle.headingFontFamily, fontSize: mergedStyle.headingFontSize, fontWeight: mergedStyle.headingFontWeight }}>{heading}</h2>
                      <p style={{ margin: "8px 0 0", fontSize: mergedStyle.textFontSize }}>{text}</p>
                    </div>
                  </div>
                );
              })}
              {showArrows && (
                <>
                  <button data-id="slideshow--arrow--prev" onClick={() => setActiveSlide(prev => prev <= 1 ? slideCount : prev - 1)} style={{ position: "absolute", top: "50%", left: "8px", transform: "translateY(-50%)", background: "none", color: mergedStyle.arrowColor, border: "none", padding: "16px 12px", cursor: "pointer", fontSize: "20px", zIndex: 2 }}>&#10094;</button>
                  <button data-id="slideshow--arrow--next" onClick={() => setActiveSlide(prev => prev >= slideCount ? 1 : prev + 1)} style={{ position: "absolute", top: "50%", right: "8px", transform: "translateY(-50%)", background: "none", color: mergedStyle.arrowColor, border: "none", padding: "16px 12px", cursor: "pointer", fontSize: "20px", zIndex: 2 }}>&#10095;</button>
                </>
              )}
              {showDots && (
                <div data-id="slideshow--dots--nav" style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 2 }}>
                  {Array.from({ length: slideCount }, (_, i) => (
                    <button key={i} data-id={`slideshow--dot--${i + 1}`} onClick={() => setActiveSlide(i + 1)} style={{ width: "10px", height: "10px", borderRadius: "50%", border: "none", background: activeSlide === i + 1 ? mergedStyle.dotActiveColor : mergedStyle.dotColor, cursor: "pointer" }} />
                  ))}
                </div>
              )}
            </div>
          );
        }

        case "form": {
          const showName = props.showName !== false;
          const showEmail = props.showEmail !== false;
          const showPhone = props.showPhone;
          const showMessage = props.showMessage !== false;
          const inputStyle = { width: "100%", padding: "10px 12px", fontSize: commonStyle.fontSize, fontFamily: commonStyle.fontFamily, borderWidth: "1px", borderStyle: "solid", borderColor: "#d3d3d3", borderRadius: "4px", backgroundColor: commonStyle.backgroundColor, color: commonStyle.color, boxSizing: "border-box" };
          const labelStyle = { display: "block", marginBottom: "4px", fontWeight: "600", fontSize: commonStyle.fontSize, color: commonStyle.color };

          // Form button hover styles
          const hasFormBtnHover =
            mergedStyle.buttonHoverColor ||
            mergedStyle.buttonHoverBackgroundColor ||
            mergedStyle.buttonHoverBorderColor;
          const formBtnHoverAnim = mergedStyle.buttonHoverAnimation;

          const formBtnAnimKeyframes = formBtnHoverAnim
            ? `
          @keyframes frm-btn-grow-${element.id} { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
          @keyframes frm-btn-shrink-${element.id} { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.95); } }
          @keyframes frm-btn-shake-${element.id} { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
          @keyframes frm-btn-pulse-${element.id} { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.03); opacity: 0.9; } }
          @keyframes frm-btn-bounce-${element.id} { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
          @keyframes frm-btn-rotate-${element.id} { 0% { transform: rotate(0deg); } 25% { transform: rotate(-2deg); } 75% { transform: rotate(2deg); } 100% { transform: rotate(0deg); } }
          `
            : "";

          const formBtnHoverStyleTag = (
            <style key={`${element.id}-form-btn-hover`}>
              {formBtnAnimKeyframes}
              {`[data-element-id="${element.id}"] [data-id="form--button--submit"] {
              transition: all 0.3s ease;
            }
            [data-element-id="${element.id}"] [data-id="form--button--submit"]:hover {
              border-width: 1px;
              border-style: solid;
              ${mergedStyle.buttonHoverColor ? `color: ${mergedStyle.buttonHoverColor} !important;` : ""}
              ${mergedStyle.buttonHoverBackgroundColor ? `background-color: ${mergedStyle.buttonHoverBackgroundColor} !important;` : ""}
              ${mergedStyle.buttonHoverBorderColor ? `border-color: ${mergedStyle.buttonHoverBorderColor} !important;` : ""}
              ${formBtnHoverAnim === "grow" ? `animation: frm-btn-grow-${element.id} 0.3s ease;` : ""}
              ${formBtnHoverAnim === "shrink" ? `animation: frm-btn-shrink-${element.id} 0.3s ease;` : ""}
              ${formBtnHoverAnim === "shake" ? `animation: frm-btn-shake-${element.id} 0.3s ease;` : ""}
              ${formBtnHoverAnim === "pulse" ? `animation: frm-btn-pulse-${element.id} 0.6s ease;` : ""}
              ${formBtnHoverAnim === "bounce" ? `animation: frm-btn-bounce-${element.id} 0.4s ease;` : ""}
              ${formBtnHoverAnim === "rotate" ? `animation: frm-btn-rotate-${element.id} 0.4s ease;` : ""}
            }`}
            </style>
          );

          return (
            <div data-element-id={element.id} data-id="form--container--wrapper" style={{ ...commonStyle, display: "flex", flexDirection: "column", gap: mergedStyle.gap }}>
              {formBtnHoverStyleTag}
              {showName && (
                <div data-id="form--field--name">
                  <label style={labelStyle}>Name</label>
                  <input type="text" placeholder={props.namePlaceholder} style={inputStyle} readOnly />
                </div>
              )}
              {showEmail && (
                <div data-id="form--field--email">
                  <label style={labelStyle}>Email</label>
                  <input type="email" placeholder={props.emailPlaceholder} style={inputStyle} readOnly />
                </div>
              )}
              {showPhone && (
                <div data-id="form--field--phone">
                  <label style={labelStyle}>Phone</label>
                  <input type="tel" placeholder={props.phonePlaceholder} style={inputStyle} readOnly />
                </div>
              )}
              {showMessage && (
                <div data-id="form--field--message">
                  <label style={labelStyle}>Message</label>
                  <textarea placeholder={props.messagePlaceholder} rows={4} style={{ ...inputStyle, resize: "vertical" }} readOnly />
                </div>
              )}
              <button type="button" data-id="form--button--submit" style={{ padding: "12px 24px", fontSize: commonStyle.fontSize, fontFamily: commonStyle.fontFamily, fontWeight: "600", backgroundColor: mergedStyle.buttonBackgroundColor, color: mergedStyle.buttonColor, borderWidth: "1px", borderStyle: "solid", borderColor: mergedStyle.buttonBorderColor, borderRadius: mergedStyle.buttonBorderRadius, cursor: "pointer", width: "100%" }}>
                {props.submitText}
              </button>
            </div>
          );
        }

        case "popup": {
          const [popupOpen, setPopupOpen] = React.useState(false);
          return (
            <>
              <div data-element-id={element.id} data-id="popup--container--wrapper" style={{ display: "inline-block" }}>
                <button type="button" data-id="popup--button--trigger" onClick={() => setPopupOpen(true)} style={{ padding: "12px 24px", fontSize: commonStyle.fontSize, fontFamily: commonStyle.fontFamily, fontWeight: "600", backgroundColor: mergedStyle.triggerButtonBg, color: mergedStyle.triggerButtonColor, border: "none", borderRadius: commonStyle.borderRadius, cursor: "pointer" }}>
                  {props.triggerText}
                </button>
              </div>
              {popupOpen && (
                <div data-id="popup--overlay--backdrop" onClick={() => setPopupOpen(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: mergedStyle.overlayColor, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
                  <div data-id="popup--modal--content" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: mergedStyle.backgroundColor, borderRadius: commonStyle.borderRadius, boxShadow: commonStyle.boxShadow, width: commonStyle.width, maxWidth: "90vw", padding: `${commonStyle.paddingTop} ${commonStyle.paddingRight} ${commonStyle.paddingBottom} ${commonStyle.paddingLeft}`, position: "relative", fontFamily: commonStyle.fontFamily }}>
                    <button type="button" data-id="popup--button--close" onClick={() => setPopupOpen(false)} style={{ position: "absolute", top: "12px", right: "12px", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#999", lineHeight: 1 }}>&times;</button>
                    <h3 data-id="popup--title--heading" style={{ margin: "0 0 12px 0", fontSize: mergedStyle.titleFontSize, color: commonStyle.color }}>{props.popupTitle}</h3>
                    <p data-id="popup--text--content" style={{ margin: "0 0 20px 0", fontSize: commonStyle.fontSize, color: commonStyle.color, lineHeight: "1.6" }}>{props.popupContent}</p>
                    {props.showEmailField !== false && (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input type="email" data-id="popup--input--email" placeholder={props.emailPlaceholder} style={{ flex: 1, padding: "10px 12px", fontSize: "14px", border: "1px solid #dee2e6", borderRadius: "4px" }} readOnly />
                        <button type="button" data-id="popup--button--submit" style={{ padding: "10px 20px", fontSize: "14px", fontWeight: "600", backgroundColor: mergedStyle.buttonBackgroundColor, color: mergedStyle.buttonColor, border: "none", borderRadius: "4px", cursor: "pointer", whiteSpace: "nowrap" }}>{props.submitText}</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          );
        }

        case "image-gallery": {
          const [lightboxIdx, setLightboxIdx] = React.useState(null);
          const imgCount = props.imageCount;
          const cols = mergedStyle.columns;
          const enableLb = props.enableLightbox !== false;
          const images = Array.from({ length: imgCount }, (_, i) => props[`image_${i + 1}`]).filter(Boolean);
          const placeholders = images.length > 0 ? images : Array.from({ length: imgCount }, (_, i) => null);
          return (
            <>
              <div data-element-id={element.id} data-id="image-gallery--grid--wrapper" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: mergedStyle.gap, width: "100%", marginTop: commonStyle.marginTop, marginBottom: commonStyle.marginBottom }}>
                {placeholders.map((src, idx) => (
                  <div key={idx} data-id={`image-gallery--item--${idx}`} onClick={() => enableLb && src && setLightboxIdx(idx)} style={{ aspectRatio: mergedStyle.aspectRatio, height: mergedStyle.aspectRatio === "auto" ? "229.06px" : undefined, borderRadius: mergedStyle.borderRadius, overflow: "hidden", cursor: enableLb && src ? "zoom-in" : "default", backgroundColor: "#f0f0f0" }}>
                    {src ? (
                      <img src={src} alt={`Gallery image ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: "12px" }}>{idx + 1}</div>
                    )}
                  </div>
                ))}
              </div>
              {lightboxIdx !== null && (
                <div data-id="image-gallery--lightbox--overlay" onClick={() => setLightboxIdx(null)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
                  <button type="button" onClick={() => setLightboxIdx(null)} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "#fff", fontSize: "32px", cursor: "pointer" }}>&times;</button>
                  {lightboxIdx > 0 && <button type="button" onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx - 1); }} style={{ position: "absolute", left: "20px", background: "none", border: "none", color: "#fff", fontSize: "40px", cursor: "pointer" }}>&lsaquo;</button>}
                  <img src={placeholders[lightboxIdx]} alt="" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: "4px" }} />
                  {lightboxIdx < placeholders.length - 1 && <button type="button" onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx + 1); }} style={{ position: "absolute", right: "20px", background: "none", border: "none", color: "#fff", fontSize: "40px", cursor: "pointer" }}>&rsaquo;</button>}
                </div>
              )}
            </>
          );
        }

        case "flip-card": {
          const flipDir = props.flipDirection;
          const flipTransform = flipDir === "horizontal" ? "rotateY(180deg)" : "rotateX(180deg)";
          const cardId = element.id.replace(/[^a-zA-Z0-9]/g, '_');
          const faceBase = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backfaceVisibility: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", boxSizing: "border-box", borderRadius: commonStyle.borderRadius, fontFamily: commonStyle.fontFamily };
          return (
            <>
              <style>{`[data-element-id="${element.id}"] .flip-inner { transition: transform 0.6s ease; transform-style: preserve-3d; } [data-element-id="${element.id}"]:hover .flip-inner { transform: ${flipTransform}; }`}</style>
              <div data-element-id={element.id} data-id="flip-card--container--wrapper" style={{ width: mergedStyle.cardAspectRatio === "9/16" ? "143px" : "200px", height: "200px", perspective: "1000px", marginTop: commonStyle.marginTop, marginBottom: commonStyle.marginBottom, cursor: "pointer" }}>
                <div className="flip-inner" style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d" }}>
                  <div data-id="flip-card--face--front" style={{ ...faceBase, backgroundColor: mergedStyle.frontBackgroundColor, color: mergedStyle.frontColor, boxShadow: commonStyle.boxShadow }}>
                    {props.frontImage && <img src={props.frontImage} alt="" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "50%", marginBottom: "12px" }} />}
                    <h4 style={{ margin: "0 0 8px 0", fontSize: mergedStyle.titleFontSize }}>{props.frontTitle}</h4>
                    <p style={{ margin: 0, fontSize: commonStyle.fontSize, textAlign: "center" }}>{props.frontContent}</p>
                  </div>
                  <div data-id="flip-card--face--back" style={{ ...faceBase, backgroundColor: mergedStyle.backBackgroundColor, color: mergedStyle.backColor, transform: flipTransform, boxShadow: commonStyle.boxShadow }}>
                    <h4 style={{ margin: "0 0 8px 0", fontSize: mergedStyle.titleFontSize }}>{props.backTitle}</h4>
                    <p style={{ margin: "0 0 16px 0", fontSize: commonStyle.fontSize, textAlign: "center" }}>{props.backContent}</p>
                    {props.backButtonText && (
                      <a href={props.backButtonUrl} data-id="flip-card--button--back-cta" style={{ padding: "8px 20px", backgroundColor: mergedStyle.buttonBackgroundColor, color: mergedStyle.buttonColor, textDecoration: "none", borderRadius: "4px", fontSize: "13px", fontWeight: "600" }}>{props.backButtonText}</a>
                    )}
                  </div>
                </div>
              </div>
            </>
          );
        }

        case "marquee": {
          const mqSpeed = props.speed;
          const mqDir = props.direction;
          const mqText = props.text;
          const mqAnimDir = mqDir === "right" ? "marquee-right" : "marquee-left";
          const pauseHover = props.pauseOnHover !== false;
          return (
            <>
              <style>{`
                @keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                @keyframes marquee-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
                ${pauseHover ? `[data-element-id="${element.id}"]:hover .marquee-track { animation-play-state: paused; }` : ""}
              `}</style>
              <div data-element-id={element.id} data-id="marquee--container--wrapper" style={{ overflow: "hidden", width: "100%", backgroundColor: commonStyle.backgroundColor, paddingTop: '12px', paddingBottom: '12px', marginTop: commonStyle.marginTop, marginBottom: commonStyle.marginBottom }}>
                <div className="marquee-track" style={{ display: "flex", whiteSpace: "nowrap", animation: `${mqAnimDir} ${mqSpeed}s linear infinite`, width: "max-content" }}>
                  <span style={{ color: commonStyle.color, fontSize: commonStyle.fontSize, fontFamily: commonStyle.fontFamily, fontWeight: commonStyle.fontWeight, paddingRight: "40px" }}>{mqText}</span>
                  <span style={{ color: commonStyle.color, fontSize: commonStyle.fontSize, fontFamily: commonStyle.fontFamily, fontWeight: commonStyle.fontWeight, paddingRight: "40px" }}>{mqText}</span>
                </div>
              </div>
            </>
          );
        }

        case "before-after": {
          const [baPos, setBaPos] = React.useState(props.startPosition);
          const baRef = React.useRef(null);
          const handleBaMove = (e) => {
            if (!baRef.current) return;
            const rect = baRef.current.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            setBaPos((x / rect.width) * 100);
          };
          const handleBaStart = (e) => {
            e.stopPropagation();
            e.preventDefault();
            const onMove = (e) => handleBaMove(e);
            const onEnd = () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onEnd); document.removeEventListener("touchmove", onMove); document.removeEventListener("touchend", onEnd); };
            document.addEventListener("mousemove", onMove);
            document.addEventListener("mouseup", onEnd);
            document.addEventListener("touchmove", onMove);
            document.addEventListener("touchend", onEnd);
          };
          const sliderCol = mergedStyle.sliderColor;
          const placeholderStyle = { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#e0e0e0", color: "#999", fontSize: "14px" };
          return (
            <div ref={baRef} data-element-id={element.id} data-id="before-after--container--wrapper" style={{ position: "relative", width: "100%", height: commonStyle.height, overflow: "hidden", borderRadius: commonStyle.borderRadius, marginTop: commonStyle.marginTop, marginBottom: commonStyle.marginBottom, cursor: "ew-resize", userSelect: "none" }}>
              <div data-id="before-after--image--after" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                {props.afterImage ? <img src={props.afterImage} alt="After" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={placeholderStyle}>After</div>}
              </div>
              <div data-id="before-after--image--before" style={{ position: "absolute", top: 0, left: 0, width: `${baPos}%`, height: "100%", overflow: "hidden" }}>
                <div style={{ width: baRef.current ? `${baRef.current.offsetWidth}px` : "100vw", height: "100%" }}>
                  {props.beforeImage ? <img src={props.beforeImage} alt="Before" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={placeholderStyle}>Before</div>}
                </div>
              </div>
              <div data-id="before-after--slider--handle" onMouseDown={handleBaStart} onTouchStart={handleBaStart} style={{ position: "absolute", top: 0, left: `${baPos}%`, transform: "translateX(-50%)", width: "4px", height: "100%", backgroundColor: sliderCol, cursor: "ew-resize", zIndex: 2 }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "36px", height: "36px", borderRadius: "50%", backgroundColor: sliderCol, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style={{ width: "16px", height: "16px", fill: "#333" }}><path d="M470.6 374.6l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l41.4 41.4-357.5 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-41.4-41.4 357.5 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"/></svg></div>
              </div>
            </div>
          );
        }

        case "blog-post": {
          const bpCount = props.postCount;
          const bpCols = mergedStyle.columns;
          const showImg = props.showImage !== false;
          const showExc = props.showExcerpt !== false;
          const showDt = props.showDate !== false;
          const showAuth = props.showAuthor;
          const showRm = props.showReadMore !== false;
          return (
            <div data-element-id={element.id} data-id="blog-post--grid--wrapper" style={{ display: "grid", gridTemplateColumns: `repeat(${bpCols}, 1fr)`, gap: mergedStyle.gap, width: "100%", boxSizing: "border-box", fontFamily: commonStyle.fontFamily, paddingTop: commonStyle.paddingTop, paddingBottom: commonStyle.paddingBottom, paddingLeft: commonStyle.paddingLeft, paddingRight: commonStyle.paddingRight }}>
              {Array.from({ length: bpCount }, (_, i) => (
                <div key={i} data-id={`blog-post--card--${i}`} style={{ backgroundColor: commonStyle.backgroundColor, borderWidth: "1px", borderStyle: "solid", borderColor: "#e0e0e0", borderRadius: commonStyle.borderRadius, overflow: "hidden" }}>
                  {showImg && <div style={{ width: "100%", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: "12px", minHeight: "150px" }}>Blog Image {i + 1}</div>}
                  <div style={{ padding: "16px" }}>
                    {showDt && <div style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>Jan {10 + i}, 2025</div>}
                    {showAuth && <div style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}>By Author</div>}
                    <h4 style={{ margin: "0 0 8px 0", fontSize: mergedStyle.titleFontSize, color: commonStyle.color }}>Blog Post Title {i + 1}</h4>
                    {showExc && <p style={{ margin: "0 0 12px 0", fontSize: commonStyle.fontSize, color: "#666", lineHeight: "1.5" }}>A brief excerpt from the blog post that gives readers a preview of the content...</p>}
                    {showRm && <a href="#" style={{ fontSize: commonStyle.fontSize, color: mergedStyle.linkColor, textDecoration: "none", fontWeight: "600" }}>{props.readMoreText}</a>}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        default:
          return (
            <div style={commonStyle}>
              <div
                style={{ padding: "20px", textAlign: "center", color: "#999" }}
              >
                Unknown element type: {type}
              </div>
            </div>
          );
      }
    } catch (error) {
      return (
        <div style={{ padding: "20px", color: "red", border: "1px solid red" }}>
          Error rendering element: {error.message}
        </div>
      );
    }
  };

  // Containers and columns need display:block to fill width
  // Other elements (image, icon, etc.) use inline-block for better positioning
  const isBlockElement =
    element.type === "container" ||
    element.type === "heading" ||
    element.type === "text" ||
    element.type.startsWith("columns-") ||
    element.type === "grid-2x2" ||
    element.type === "map" ||
    element.type === "accordion" ||
    element.type === "tabs" ||
    element.type === "slideshow" ||
    element.type === "countdown" ||
    element.type === "table" ||
    element.type === "list" ||
    element.type === "unordered-list" ||
    element.type === "divider" ||
    element.type === "image-background" ||
    element.type === "product-grid" ||
    element.type === "collection-list" ||
    element.type === "variant-selector" ||
    element.type === "form" ||
    element.type === "image-gallery" ||
    element.type === "marquee" ||
    element.type === "before-after" ||
    element.type === "blog-post";

  // Check if element is hidden at current canvas breakpoint
  const hideMap = {
    xs: 'hideOnMobile', sm: 'hideOnMobile',
    lg: 'hideOnDesktop',
    xl: 'hideOnFullscreen',
  };
  const hideProp = hideMap[breakpoint];
  const isHiddenAtBreakpoint = hideProp && (mergedStyle[hideProp] === true || mergedStyle[hideProp] === 'true');

  if (isHiddenAtBreakpoint) {
    return (
      <div
        className="element-wrapper"
        data-id="element--wrapper--hidden-indicator"
        style={{
          margin: "0",
          padding: "0",
          display: "block",
          opacity: 0.3,
          position: "relative",
          pointerEvents: isSelected ? "auto" : "auto",
        }}
      >
        <div style={{
          position: "absolute",
          top: "4px",
          right: "4px",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          fontSize: "10px",
          padding: "2px 6px",
          borderRadius: "4px",
          zIndex: 5,
          pointerEvents: "none",
        }}>
          Hidden on this viewport
        </div>
        {renderElement()}
      </div>
    );
  }

  return (
    <div
      className="element-wrapper"
      style={{
        margin: "0",
        padding: "0",
        display: isBlockElement ? "block" : "inline-block",
      }}
    >
      {renderElement()}
    </div>
  );
};

// Sortable children list with drag-drop reordering
const SortableChildrenList = ({
  children,
  parentId,
  selectedElement,
  onSelectElement,
  onAddChildElement,
  onUpdateElement,
  breakpoint,
  responsiveStyles
}) => {
  const handleReorder = (dragIndex, dropIndex) => {
    if (dragIndex === dropIndex) return;

    const reorderedChildren = [...children];
    const [removed] = reorderedChildren.splice(dragIndex, 1);
    reorderedChildren.splice(dropIndex, 0, removed);

    // Update parent element with reordered children
    onUpdateElement(parentId, { children: reorderedChildren });
  };

  return (
    <>
      {children.map((child, index) => (
        <SortableChild
          key={child.id}
          child={child}
          index={index}
          selectedElement={selectedElement}
          onSelectElement={onSelectElement}
          onAddChildElement={onAddChildElement}
          onUpdateElement={onUpdateElement}
          onReorder={handleReorder}
          breakpoint={breakpoint}
          responsiveStyles={responsiveStyles}

        />
      ))}
    </>
  );
};

const SortableChild = ({
  child,
  index,
  selectedElement,
  onSelectElement,
  onAddChildElement,
  onUpdateElement,
  onReorder,
  breakpoint,
  responsiveStyles
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "child-element",
    item: { childId: child.id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "child-element",
    drop: (item) => {
      if (item.childId !== child.id) {
        onReorder(item.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  });

  // Get child responsive styles for current breakpoint
  const childResponsiveStyles =
    responsiveStyles?.[child.id]?.[breakpoint] || {};

  // Filter out empty string values (disabled properties)
  const filteredChildResponsiveStyles = Object.entries(
    childResponsiveStyles,
  ).reduce((acc, [key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});

  const childStyle = { ...child.style, ...filteredChildResponsiveStyles };

  // Convert marginVertical to margin auto for vertical positioning
  let verticalMarginTop = childStyle.marginTop;
  let verticalMarginBottom = childStyle.marginBottom;

  if (childStyle.marginVertical) {
    if (childStyle.marginVertical === "flex-start") {
      verticalMarginBottom = "auto";
    } else if (childStyle.marginVertical === "center") {
      verticalMarginTop = "auto";
      verticalMarginBottom = "auto";
    } else if (childStyle.marginVertical === "flex-end") {
      verticalMarginTop = "auto";
    }
  }

  // Extract grid alignment properties to apply to wrapper
  const wrapperGridStyles = {
    justifySelf: childStyle.justifySelf,
    alignSelf: childStyle.alignSelf,
    marginLeft: childStyle.marginLeft,
    marginRight: childStyle.marginRight,
    marginTop: verticalMarginTop,
    marginBottom: verticalMarginBottom,
    margin: childStyle.margin,
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      onClick={(e) => {
        e.stopPropagation();
        onSelectElement && onSelectElement(child.id);
      }}
      className={selectedElement === child.id ? "selected-child" : ""}
      style={{
        opacity: isDragging ? 0.5 : 1,
        borderTop: isOver ? "2px solid #0066cc" : "none",
        position: "relative",
        cursor: isDragging ? "grabbing" : "grab",
        margin: "0",
        padding: "0",
        ...wrapperGridStyles,
      }}
    >
      <ElementRenderer
        element={child}
        isSelected={selectedElement === child.id}
        onAddChildElement={onAddChildElement}
        onUpdateElement={onUpdateElement}
        onSelectElement={onSelectElement}
        selectedElement={selectedElement}
        breakpoint={breakpoint}
        responsiveStyles={responsiveStyles}

      />
    </div>
  );
};

const ContainerElement = ({
  element,
  style,
  onAddChildElement,
  onUpdateElement,
  onSelectElement,
  selectedElement,
  breakpoint,
  responsiveStyles
}) => {
  const [{ isOver, draggedItem, canDrop }, drop] = useDrop({
    accept: ["component", "element"],
    canDrop: (item) => {
      // Block image-background elements from being dropped into containers
      if (item.type === "image-background") {
        return false;
      }
      return true;
    },
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        if (onAddChildElement) {
          if (item.type) {
            // Adding new component from palette
            onAddChildElement(element.id, item.type, item);
          } else if (item.elementId) {
            // Moving existing element from canvas into container
            onAddChildElement(element.id, null, item);
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
      draggedItem: monitor.getItem(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  // Check if dragging image-background
  const isDraggingImageBackground = draggedItem?.type === "image-background";

  return (
    <div
      ref={drop}
      data-element-id={element.id}
      className="responsive-container"
      style={{
        ...style,
        border:
          isOver && !canDrop
            ? "3px dashed #f44336"
            : isOver && canDrop
              ? "2px dashed #0066cc"
              : "2px dashed #4a90e2",
        backgroundColor:
          isOver && !canDrop
            ? "#ffebee"
            : isOver && canDrop
              ? "rgba(0, 102, 204, 0.05)"
              : style.backgroundColor,
        ...(style.gradientType && style.gradientType !== 'none' ? {
          background: style.gradientType === 'linear'
            ? `linear-gradient(${style.gradientAngle}deg, ${style.gradientColor1}, ${style.gradientColor2}${style.gradientColor3 ? `, ${style.gradientColor3}` : ''}${style.gradientColor4 ? `, ${style.gradientColor4}` : ''}${style.gradientColor5 ? `, ${style.gradientColor5}` : ''})`
            : `radial-gradient(circle, ${style.gradientColor1}, ${style.gradientColor2}${style.gradientColor3 ? `, ${style.gradientColor3}` : ''}${style.gradientColor4 ? `, ${style.gradientColor4}` : ''}${style.gradientColor5 ? `, ${style.gradientColor5}` : ''})`
        } : {}),
        minHeight: style.minHeight,
        width: style.width,
        maxWidth: style.maxWidth,
        boxSizing: "border-box",
        position: "relative",
        display: "flex",
        flexDirection: style.flexDirection,
        gap: "10px",
        padding: "30px",
      }}
    >
      {/* Video background preview */}
      {element.props?.backgroundVideo && (
        <video
          src={element.props.backgroundVideo}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: style.backgroundVideoOpacity ?? 1,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      )}
      {/* Container label */}
      <div
        style={{
          position: "absolute",
          top: "5px",
          left: "5px",
          fontSize: "10px",
          fontWeight: "bold",
          color: "#4a90e2",
          backgroundColor: "white",
          padding: "2px 6px",
          borderRadius: "3px",
          border: "1px solid #4a90e2",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        CONTAINER
      </div>
      {/* Warning when trying to drop image-background */}
      {isOver && isDraggingImageBackground && !canDrop && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff3cd",
            border: "2px solid #ffc107",
            borderRadius: "8px",
            padding: "20px",
            zIndex: 1000,
            pointerEvents: "none",
            textAlign: "center",
            maxWidth: "300px",
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "10px" }}>⚠️</div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Image Backgrounds Cannot Be Nested
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            Drop image background elements directly on the canvas instead
          </div>
        </div>
      )}
      {element.children?.length > 0 ? (
        <SortableChildrenList
          children={element.children}
          parentId={element.id}
          selectedElement={selectedElement}
          onSelectElement={onSelectElement}
          onAddChildElement={onAddChildElement}
          onUpdateElement={onUpdateElement}
          breakpoint={breakpoint}
          responsiveStyles={responsiveStyles}

        />
      ) : (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: isOver ? "#0066cc" : "#999",
            fontWeight: isOver ? "bold" : "normal",
            position: "relative",
            zIndex: 1,
          }}
        >
          {isOver ? "Drop element here" : "Container - Drop elements here"}
        </div>
      )}
    </div>
  );
};

const ElementToolbar = ({ element, onDeleteElement }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDeleteElement) {
      onDeleteElement(element.id);
    }
  };

  const handleDuplicate = (e) => {
    e.stopPropagation();
    // TODO: Implement duplicate functionality
  };

  return (
    <div
      className="element-toolbar"
      style={{
        position: "absolute",
        top: "-35px",
        left: "0",
        display: "flex",
        gap: "5px",
        backgroundColor: "white",
        border: "1px solid #ddd",
        borderRadius: "4px",
        padding: "4px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 1000,
      }}
    >
      <button
        className="toolbar-btn"
        style={{
          padding: "4px 8px",
          border: "none",
          background: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
        title="Duplicate"
        onClick={handleDuplicate}
      >
        <Copy size={14} />
      </button>
      <button
        className="toolbar-btn"
        style={{
          padding: "4px 8px",
          border: "none",
          background: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
        title="Delete"
        onClick={handleDelete}
      >
        <Trash2 size={14} />
      </button>
      <button
        className="toolbar-btn"
        style={{
          padding: "4px 8px",
          border: "none",
          background: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
        title="Settings"
      >
        <Settings size={14} />
      </button>
    </div>
  );
};

const ColumnsElement = ({
  element,
  style,
  onAddChildElement,
  onUpdateElement,
  onSelectElement,
  selectedElement,
  breakpoint,
  responsiveStyles,
  nestingDepth = 0
}) => {
  // Determine column count based on type
  let columnCount = 2;
  let columnClass = "columns-2";

  switch (element.type) {
    case "columns-1":
      columnCount = 1;
      columnClass = "columns-1";
      break;
    case "columns-2":
    case "columns":
      columnCount = 2;
      columnClass = "columns-2";
      break;
    case "columns-3":
      columnCount = 3;
      columnClass = "columns-3";
      break;
    case "columns-4":
      columnCount = 4;
      columnClass = "columns-4";
      break;
    case "columns-5":
      columnCount = 5;
      columnClass = "columns-5";
      break;
    case "columns-6":
      columnCount = 6;
      columnClass = "columns-6";
      break;
  }

  // Initialize columns array if it doesn't exist
  const columns =
    element.columns || Array.from({ length: columnCount }, () => []);

  const isSelected = selectedElement === element.id;

  const handleParentClick = (e) => {
    e.stopPropagation();
    onSelectElement(element.id);
  };

  return (
    <div
      className={`responsive-columns ${columnClass}`}
      style={{
        ...style,
        position: "relative",
      }}
    >
      {/* Parent columns label - clickable to select parent */}
      <div
        className="columns-label"
        onClick={handleParentClick}
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          fontSize: "10px",
          fontWeight: "bold",
          color: "#0066cc",
          backgroundColor: "white",
          padding: "3px 10px",
          borderRadius: "3px",
          border: isSelected ? "2px solid #0066cc" : "1px solid #0066cc",
          zIndex: 15,
          cursor: "pointer",
          pointerEvents: "auto",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
        title="Click to select parent columns element (for stack/side-by-side controls)"
      >
        📋 COLUMNS ({columnCount})
      </div>

      {Array.from({ length: columnCount }, (_, i) => (
        <DropColumn
          key={i}
          columnIndex={i}
          elementId={element.id}
          parentElement={element}
          children={columns[i] || []}
          onAddChildElement={onAddChildElement}
          onUpdateElement={onUpdateElement}
          onSelectElement={onSelectElement}
          selectedElement={selectedElement}
          breakpoint={breakpoint}
          responsiveStyles={responsiveStyles}
          nestingDepth={nestingDepth}

        />
      ))}
    </div>
  );
};

// Draggable child component for column elements
const DraggableColumnChild = ({
  child,
  childIndex,
  elementId,
  columnIndex,
  selectedElement,
  onSelectElement,
  onAddChildElement,
  onUpdateElement,
  breakpoint,
  responsiveStyles,
  nestingDepth = 0
}) => {
  // Get child responsive styles for current breakpoint
  const childResponsiveStyles =
    responsiveStyles?.[child.id]?.[breakpoint] || {};

  // Filter out empty string values (disabled properties)
  const filteredChildResponsiveStyles = Object.entries(
    childResponsiveStyles,
  ).reduce((acc, [key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});

  const childStyle = { ...child.style, ...filteredChildResponsiveStyles };

  // Convert marginVertical to margin auto for vertical positioning
  let verticalMarginTop = childStyle.marginTop;
  let verticalMarginBottom = childStyle.marginBottom;

  if (childStyle.marginVertical) {
    if (childStyle.marginVertical === "flex-start") {
      verticalMarginBottom = "auto";
    } else if (childStyle.marginVertical === "center") {
      verticalMarginTop = "auto";
      verticalMarginBottom = "auto";
    } else if (childStyle.marginVertical === "flex-end") {
      verticalMarginTop = "auto";
    }
  }

  // Extract grid alignment properties to apply to wrapper
  const wrapperGridStyles = {
    justifySelf: childStyle.justifySelf,
    alignSelf: childStyle.alignSelf,
    marginLeft: childStyle.marginLeft,
    marginRight: childStyle.marginRight,
    marginTop: verticalMarginTop,
    marginBottom: verticalMarginBottom,
    margin: childStyle.margin,
  };

  // Set up drag functionality
  const [{ isDragging }, drag] = useDrag({
    type: "element",
    item: () => {
      return {
        elementId: child.id,
        index: childIndex,
        type: child.type,
        parentId: elementId,
        columnIndex: columnIndex,
      };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      key={child.id}
      onClick={(e) => {
        e.stopPropagation();
        onSelectElement && onSelectElement(child.id);
      }}
      className={selectedElement === child.id ? "selected-child" : ""}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        position: "relative",
        opacity: isDragging ? 0.5 : 1,
        margin: "0",
        padding: "0",
        flex: "1",
        display: "flex",
        flexDirection: "column",
        ...wrapperGridStyles,
      }}
    >
      <ElementRenderer
        element={child}
        isSelected={selectedElement === child.id}
        onAddChildElement={onAddChildElement}
        onUpdateElement={onUpdateElement}
        onSelectElement={onSelectElement}
        selectedElement={selectedElement}
        breakpoint={breakpoint}
        responsiveStyles={responsiveStyles}
        nestingDepth={nestingDepth + 1}

      />
    </div>
  );
};

const DropColumn = ({
  columnIndex,
  elementId,
  parentElement,
  children,
  onAddChildElement,
  onUpdateElement,
  onSelectElement,
  selectedElement,
  breakpoint,
  responsiveStyles,
  nestingDepth = 0
}) => {
  // Create a unique identifier for this drop zone
  const dropZoneId = `${elementId}-col-${columnIndex}`;

  const [{ isOver, canDrop, draggedItem }, drop] = useDrop({
    accept: ["component", "element"],
    canDrop: (item) => {
      // Block image-background elements from being dropped into columns
      if (item.type === "image-background") {
        return false;
      }
      // Block containers from being dropped into columns
      if (item.type === "container") {
        return false;
      }
      // Allow columns at level 0 (in containers), but block at level 1+ (already nested)
      if (
        item.type &&
        (item.type === "columns" || item.type.startsWith("columns-"))
      ) {
        return nestingDepth === 0; // Allow only at first level
      }
      return true;
    },
    drop: (item, monitor) => {
      // Only process if the mouse is directly over this drop zone (not a child)
      if (!monitor.isOver({ shallow: true })) {
        return;
      }

      // Check if a deeper nested zone already handled this drop
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }

      if (item.elementId) {
        // Moving existing element from canvas into column
        if (onAddChildElement) {
          onAddChildElement(elementId, null, item, columnIndex);
        }
        return { dropped: true, columnIndex, elementId, dropZoneId };
      } else if (item.type) {
        // Adding new component from palette to specific column
        if (onAddChildElement) {
          onAddChildElement(elementId, item.type, item, columnIndex);
        }
        return { dropped: true, columnIndex, elementId, dropZoneId };
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
      canDrop: !!monitor.canDrop(),
      draggedItem: monitor.getItem(),
    }),
  });

  // Check if dragging image-background
  const isDraggingImageBackground = draggedItem?.type === "image-background";

  // Check if dragging container
  const isDraggingContainer = draggedItem?.type === "container";

  // Check if dragging column layouts
  const isDraggingColumns =
    draggedItem?.type &&
    (draggedItem.type === "columns" || draggedItem.type.startsWith("columns-"));

  // Create a unique column ID for selection/styling
  const columnId = `${elementId}-col-${columnIndex}`;
  const isSelected = selectedElement === columnId;

  // Get column-specific styles from parent element's columnStyles
  const columnBaseStyles = parentElement?.columnStyles?.[columnIndex] || {};

  // Get namespaced responsive styles from parent element
  const parentResponsiveStyles =
    responsiveStyles?.[elementId]?.[breakpoint] || {};
  const columnResponsiveStyles = {};

  // Extract namespaced column styles
  const namespacePrefix = `col-${columnIndex}-`;
  Object.keys(parentResponsiveStyles).forEach((key) => {
    if (key.startsWith(namespacePrefix)) {
      const propName = key.substring(namespacePrefix.length);
      columnResponsiveStyles[propName] = parentResponsiveStyles[key];
    }
  });

  // Merge base styles and responsive styles
  const mergedColumnStyles = { ...columnBaseStyles, ...columnResponsiveStyles };

  // Filter out empty string values (disabled properties)
  const filteredColumnStyles = Object.entries(mergedColumnStyles).reduce(
    (acc, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    },
    {},
  );

  const handleColumnClick = (e) => {
    // Only select if clicking directly on the column (not on child elements)
    if (
      e.target === e.currentTarget ||
      e.target.classList.contains("column-click-area")
    ) {
      e.stopPropagation();
      onSelectElement(columnId);
    }
  };

  const handleLabelClick = (e) => {
    e.stopPropagation();
    onSelectElement(columnId);
  };

  // Always use flex for columns
  const columnDisplayStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  };

  return (
    <div
      ref={drop}
      className={`responsive-column ${isSelected ? "selected" : ""}`}
      onClick={handleColumnClick}
      style={{
        border: isSelected
          ? "3px solid #9b59b6"
          : isOver && !canDrop
            ? "3px dashed #f44336"
            : isOver && canDrop
              ? "2px dashed #0066cc"
              : "2px dashed #9b59b6",
        backgroundColor:
          isOver && !canDrop
            ? "#ffebee"
            : isOver && canDrop
              ? "rgba(0, 102, 204, 0.05)"
              : "rgba(155, 89, 182, 0.02)",
        minHeight: children && children.length > 0 ? "auto" : "200px",
        position: "relative",
        padding: "10px",
        ...columnDisplayStyles,
        cursor: "pointer",
        // Apply column styles (both base and responsive)
        ...filteredColumnStyles,
      }}
    >
      {/* Column label - clickable to select column */}
      <div
        className="column-label"
        onClick={handleLabelClick}
        style={{
          position: "absolute",
          top: "5px",
          left: "5px",
          fontSize: "10px",
          fontWeight: "bold",
          color: "#9b59b6",
          backgroundColor: "white",
          padding: "2px 6px",
          borderRadius: "3px",
          border: "1px solid #9b59b6",
          zIndex: 10,
          cursor: "pointer",
          pointerEvents: "auto",
        }}
        title="Click to select column"
      >
        COL {columnIndex + 1}
      </div>
      {/* Warning when trying to drop image-background */}
      {isOver && isDraggingImageBackground && !canDrop && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff3cd",
            border: "2px solid #ffc107",
            borderRadius: "8px",
            padding: "15px",
            zIndex: 1000,
            pointerEvents: "none",
            textAlign: "center",
            maxWidth: "250px",
            fontSize: "11px",
          }}
        >
          <div style={{ fontSize: "20px", marginBottom: "5px" }}>⚠️</div>
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "3px",
              fontSize: "12px",
            }}
          >
            Cannot Nest Here
          </div>
          <div style={{ color: "#666" }}>
            Image backgrounds go on canvas only
          </div>
        </div>
      )}
      {/* Warning when trying to drop container */}
      {isOver && isDraggingContainer && !canDrop && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff3cd",
            border: "2px solid #ffc107",
            borderRadius: "8px",
            padding: "15px",
            zIndex: 1000,
            pointerEvents: "none",
            textAlign: "center",
            maxWidth: "250px",
            fontSize: "11px",
          }}
        >
          <div style={{ fontSize: "20px", marginBottom: "5px" }}>🚫</div>
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "3px",
              fontSize: "12px",
            }}
          >
            Containers Not Allowed in Columns
          </div>
          <div style={{ color: "#666" }}>
            Use Container → Columns → Elements hierarchy
          </div>
        </div>
      )}
      {/* Warning when trying to drop columns into columns */}
      {isOver && isDraggingColumns && !canDrop && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff3cd",
            border: "2px solid #ffc107",
            borderRadius: "8px",
            padding: "15px",
            zIndex: 1000,
            pointerEvents: "none",
            textAlign: "center",
            maxWidth: "250px",
            fontSize: "11px",
          }}
        >
          <div style={{ fontSize: "20px", marginBottom: "5px" }}>🚫</div>
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "3px",
              fontSize: "12px",
            }}
          >
            Maximum Nesting Depth Reached
          </div>
          <div style={{ color: "#666" }}>
            Columns can only be nested 1 level deep (Container → Column →
            Column)
          </div>
        </div>
      )}
      {children && children.length > 0 ? (
        children.map((child, childIndex) => (
          <DraggableColumnChild
            key={child.id}
            child={child}
            childIndex={childIndex}
            elementId={elementId}
            columnIndex={columnIndex}
            selectedElement={selectedElement}
            onSelectElement={onSelectElement}
            onAddChildElement={onAddChildElement}
            onUpdateElement={onUpdateElement}
            breakpoint={breakpoint}
            responsiveStyles={responsiveStyles}
            nestingDepth={nestingDepth}
  
          />
        ))
      ) : (
        <div
          style={{
            textAlign: "center",
            color: isOver ? "#0066cc" : "#999",
            fontWeight: isOver ? "bold" : "normal",
          }}
        >
          {isOver ? "Drop element here" : `Column ${columnIndex + 1}`}
        </div>
      )}
    </div>
  );
};

const ImageBackgroundElement = ({
  element,
  style,
  onAddChildElement,
  onUpdateElement,
  onSelectElement,
  selectedElement,
  breakpoint,
  responsiveStyles
}) => {
  const [{ isOver, draggedItem, canDrop }, drop] = useDrop({
    accept: ["component", "element"],
    canDrop: () => false,
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        // Check if it's an uploaded image being dropped onto the background
        if (item.type === "image" && item.isUploadedMedia && onUpdateElement) {
          onUpdateElement(element.id, {
            props: {
              ...element.props,
              src: item.src,
              alt: item.alt || "",
              uploadedFileName: item.alt,
            },
          });
        } else if (onAddChildElement) {
          if (item.type) {
            // Adding new component from palette (overlay elements)
            onAddChildElement(element.id, item.type, item);
          } else if (item.elementId) {
            // Moving existing element - this should be handled differently
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
      draggedItem: monitor.getItem(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  // Check if dragging an image to replace background
  const isDraggingImage =
    draggedItem?.type === "image" && draggedItem?.isUploadedMedia;

  // Check if dragging invalid element types (containers, columns)
  const isDraggingInvalidType =
    draggedItem &&
    (draggedItem.type === "container" ||
      draggedItem.type === "columns" ||
      draggedItem.type?.startsWith("columns-") ||
      draggedItem.type === "grid-2x2");

  const backgroundStyle = {
    ...style,
    backgroundImage: element.props.src ? `url(${element.props.src})` : "none",
    border:
      isOver && !canDrop
        ? "3px dashed #f44336"
        : isOver && isDraggingImage
          ? "3px dashed #2196f3"
          : isOver && canDrop
            ? "2px dashed #0066cc"
            : element.children?.length > 0
              ? "2px dashed #ccc"
              : `${style.borderWidth} ${style.borderStyle} ${style.borderColor}`,
    backgroundColor:
      isOver && !canDrop
        ? "#ffebee"
        : isOver && isDraggingImage
          ? "#e3f2fd"
          : isOver && canDrop
            ? "rgba(0, 102, 204, 0.05)"
            : !element.props.src
              ? "#f5f5f5"
              : "transparent",
    position: "relative",
    minHeight: element.props.minHeight,
    backgroundSize: style.backgroundSize,
    backgroundPosition: style.backgroundPosition,
    backgroundRepeat: style.backgroundRepeat,
    backgroundAttachment: style.backgroundAttachment,
  };

  return (
    <div
      ref={drop}
      style={{
        ...backgroundStyle,
        display: "flex",
        flexDirection: "column",
        justifyContent: element.props.verticalAlign,
        alignItems: element.props.horizontalAlign,
      }}
    >
      {!element.props.src &&
        !isDraggingImage &&
        element.children?.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#999",
              pointerEvents: "none",
            }}
          >
            Background Image Container
            <br />
            <small>Drag image from Media tab or set URL in properties</small>
          </div>
        )}

      {!element.props.src && isDraggingImage && isOver && (
        <div
          style={{
            textAlign: "center",
            color: "#1976d2",
            fontWeight: "bold",
            fontSize: "18px",
            pointerEvents: "none",
          }}
        >
          📥 Drop to set background image
        </div>
      )}

      {/* Warning when trying to drop invalid elements */}
      {isOver && isDraggingInvalidType && !canDrop && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff3cd",
            border: "2px solid #ffc107",
            borderRadius: "8px",
            padding: "20px",
            zIndex: 1000,
            pointerEvents: "none",
            textAlign: "center",
            maxWidth: "300px",
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "10px" }}>⚠️</div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Containers & Columns Not Allowed
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            Image backgrounds only accept overlay elements like text, headings,
            and buttons
          </div>
        </div>
      )}

      {element.children?.length > 0
        ? element.children.map((child) => (
            <div
              key={child.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectElement && onSelectElement(child.id);
              }}
              className={selectedElement === child.id ? "selected-child" : ""}
              style={{
                width: "100%",
                position: "relative",
                zIndex: 10,
              }}
            >
              <ElementRenderer
                element={child}
                isSelected={selectedElement === child.id}
                onAddChildElement={onAddChildElement}
                onUpdateElement={onUpdateElement}
                onSelectElement={onSelectElement}
                selectedElement={selectedElement}
                breakpoint={breakpoint}
                responsiveStyles={responsiveStyles}
  
              />
            </div>
          ))
        : !element.props.src &&
          !isDraggingImage && (
            <div
              style={{
                textAlign: "center",
                color: isOver ? "#0066cc" : "#999",
                fontWeight: isOver ? "bold" : "normal",
                padding: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "8px",
                pointerEvents: "none",
              }}
            >
              {isOver
                ? "Drop element here"
                : "Drag elements here to overlay on background"}
            </div>
          )}
    </div>
  );
};

const ImageElement = ({ element, style, onUpdateElement }) => {
  // Drop zone for dragged images (from Media tab)
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "component",
    canDrop: (item) => {
      // Accept image and icon drops
      return (
        (item.type === "image" || item.mediaType === "icon") &&
        item.isUploadedMedia
      );
    },
    drop: (item, monitor) => {
      if (!monitor.didDrop() && item.isUploadedMedia) {
        // Replace placeholder with actual image
        onUpdateElement(element.id, {
          props: {
            ...element.props,
            src: item.src,
            alt: item.alt || "",
            uploadedFileName: item.alt,
          },
        });
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,.svg";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onUpdateElement(element.id, {
            props: {
              ...element.props,
              src: e.target.result,
              alt: file.name,
              uploadedFileName: file.name,
            },
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const placeholderStyle = {
    width: "100%",
    height: "300px",
    backgroundColor: isOver ? "#e3f2fd" : "#f0f0f0",
    border: canDrop ? "3px dashed #2196f3" : "2px dashed #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: isOver ? "#1976d2" : "#999",
    cursor: "pointer",
    transition: "all 0.2s ease",
    flexDirection: "column",
    gap: "10px",
    fontWeight: isOver ? "bold" : "normal",
  };

  // Clean image style - remove height, always auto
  const imageStyle = { ...style };
  delete imageStyle.height; // Images always use height: auto

  // Extract layout properties that should be on wrapper, not img
  const { alignSelf, ...imgOnlyStyle } = imageStyle;

  // Filter out hover properties from inline styles (they don't work inline)
  const imgCleanStyle = Object.keys(imgOnlyStyle).reduce((acc, key) => {
    if (!key.startsWith("hover")) {
      acc[key] = imgOnlyStyle[key];
    }
    return acc;
  }, {});

  // Wrapper div style - includes alignSelf for flex positioning
  const wrapperStyle = {
    position: "relative",
    display: "inline-block",
    maxWidth: "100%",
    ...(alignSelf && { alignSelf }), // Apply alignSelf to wrapper for flex positioning
  };

  // Build hover styles and animations for image
  const imgHoverAnimation = style.hoverAnimation;
  const hasImageHoverStyles =
    style.hoverOpacity != null || style.hoverBoxShadowOffsetX || style.hoverBoxShadowOffsetY || style.hoverBoxShadowBlur || style.hoverBoxShadowSpread || style.hoverBoxShadowColor;

  const imgAnimationKeyframes = imgHoverAnimation
    ? `
    @keyframes img-grow-${element.id} {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes img-shrink-${element.id} {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(0.95); }
    }
    @keyframes img-shake-${element.id} {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    @keyframes img-pulse-${element.id} {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.03); opacity: 0.9; }
    }
    @keyframes img-bounce-${element.id} {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    @keyframes img-rotate-${element.id} {
      0% { transform: rotate(0deg); }
      25% { transform: rotate(-2deg); }
      75% { transform: rotate(2deg); }
      100% { transform: rotate(0deg); }
    }
    `
    : "";

  const imageHoverStyleTag =
    hasImageHoverStyles || imgHoverAnimation ? (
      <style key={`${element.id}-hover-styles`}>
        {imgAnimationKeyframes}
        {`[data-element-id="${element.id}"] {
          transition: all 0.3s ease;
        }
        [data-element-id="${element.id}"]:hover {
          ${style.hoverOpacity != null ? `opacity: ${style.hoverOpacity} !important;` : ""}
          ${(style.hoverBoxShadowOffsetX || style.hoverBoxShadowOffsetY || style.hoverBoxShadowBlur || style.hoverBoxShadowSpread || style.hoverBoxShadowColor) ? `box-shadow: ${style.hoverBoxShadowOffsetX} ${style.hoverBoxShadowOffsetY} ${style.hoverBoxShadowBlur} ${style.hoverBoxShadowSpread} ${style.hoverBoxShadowColor} !important;` : ""}
          ${imgHoverAnimation === "grow" ? `animation: img-grow-${element.id} 0.3s ease;` : ""}
          ${imgHoverAnimation === "shrink" ? `animation: img-shrink-${element.id} 0.3s ease;` : ""}
          ${imgHoverAnimation === "shake" ? `animation: img-shake-${element.id} 0.3s ease;` : ""}
          ${imgHoverAnimation === "pulse" ? `animation: img-pulse-${element.id} 0.6s ease;` : ""}
          ${imgHoverAnimation === "bounce" ? `animation: img-bounce-${element.id} 0.4s ease;` : ""}
          ${imgHoverAnimation === "rotate" ? `animation: img-rotate-${element.id} 0.4s ease;` : ""}
        }`}
      </style>
    ) : null;

  return (
    <>
      {imageHoverStyleTag}
      {element.props.src ? (
        <div ref={drop} data-element-id={element.id} style={wrapperStyle}>
          {/* Actual image */}
          {element.props.src.startsWith("data:video") ? (
            <video
              src={element.props.src}
              controls
              style={{
                ...imgCleanStyle,
                height: "auto",
                display: "block",
                maxWidth: "100%",
              }}
            />
          ) : (
            <img
              src={element.props.src}
              alt={element.props.alt || ""}
              style={{
                ...imgCleanStyle,
                height: "auto",
                display: "block",
                maxWidth: "100%",
              }}
            />
          )}
        </div>
      ) : (
        /* Placeholder with drop zone */
        <div
          ref={drop}
          data-element-id={element.id}
          style={placeholderStyle}
          onClick={handleFileUpload}
        >
          <span style={{ fontSize: "48px" }}>{isOver ? "📥" : "🖼️"}</span>
          <div style={{ textAlign: "center" }}>
            {isOver ? (
              <>Drop image here to replace</>
            ) : (
              <>
                <div>Drag image from Media tab</div>
                <div style={{ fontSize: "12px", marginTop: "5px" }}>
                  or click to upload
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const VideoElement = ({ element, style, onUpdateElement }) => {
  // Drop zone for dragged videos (from Media tab)
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "component",
    canDrop: (item) => {
      // Only accept video drops
      return item.type === "video" && item.isUploadedMedia;
    },
    drop: (item, monitor) => {
      if (!monitor.didDrop() && item.isUploadedMedia) {
        // Replace placeholder with actual video
        onUpdateElement(element.id, {
          props: {
            ...element.props,
            src: item.src,
            alt: item.alt || "",
            uploadedFileName: item.alt,
          },
        });
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("video/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onUpdateElement(element.id, {
            props: {
              ...element.props,
              src: e.target.result,
              alt: file.name,
              uploadedFileName: file.name,
            },
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const placeholderStyle = {
    width: "100%",
    height: "300px",
    backgroundColor: isOver ? "#e3f2fd" : "#f0f0f0",
    border: canDrop ? "3px dashed #2196f3" : "2px dashed #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: isOver ? "#1976d2" : "#999",
    cursor: "pointer",
    transition: "all 0.2s ease",
    flexDirection: "column",
    gap: "10px",
    fontWeight: isOver ? "bold" : "normal",
  };

  return (
    <div
      ref={drop}
      style={{
        ...style,
        position: "relative",
        display: "inline-block",
        width: "100%",
      }}
    >
      {element.props.src ? (
        <video
          src={element.props.src}
          controls
          style={{
            width: "100%",
            height: "auto",
            maxWidth: "100%",
            display: "block",
          }}
          title={element.props.alt || "Video"}
        />
      ) : (
        /* Placeholder with drop zone */
        <div style={placeholderStyle} onClick={handleFileUpload}>
          <span style={{ fontSize: "48px" }}>{isOver ? "📥" : "🎥"}</span>
          <div style={{ textAlign: "center" }}>
            {isOver ? (
              <>Drop video here to replace</>
            ) : (
              <>
                <div>Drag video from Media tab</div>
                <div style={{ fontSize: "12px", marginTop: "5px" }}>
                  or click to upload
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const IconElement = ({ element, style, onUpdateElement }) => {
  const iconSize = style.iconSize;
  const iconColor = style.iconColor;
  const [svgContent, setSvgContent] = React.useState(null);
  const [isLoadingSvg, setIsLoadingSvg] = React.useState(false);

  // Check if this is a library icon (has iconCategory property)
  const isLibraryIcon = element.props?.iconCategory;

  // Fetch SVG content for library icons
  React.useEffect(() => {
    if (
      isLibraryIcon &&
      element.props.src &&
      element.props.src.startsWith("/icons/")
    ) {
      setIsLoadingSvg(true);
      fetch(element.props.src)
        .then((response) => response.text())
        .then((svg) => {
          setSvgContent(svg);
          setIsLoadingSvg(false);
        })
        .catch((error) => {
          console.error("Error loading SVG:", error);
          setIsLoadingSvg(false);
        });
    } else {
      setSvgContent(null);
    }
  }, [element.props.src, isLibraryIcon]);

  // Drop zone for dragged icons (from Media tab)
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "component",
    canDrop: (item) => {
      // Only accept icon drops (SVG files)
      return (
        item.type === "image" &&
        item.mediaType === "icon" &&
        item.isUploadedMedia
      );
    },
    drop: (item, monitor) => {
      if (!monitor.didDrop() && item.isUploadedMedia) {
        // Replace placeholder with actual icon
        onUpdateElement(element.id, {
          props: {
            ...element.props,
            src: item.src,
            alt: item.alt || "",
            uploadedFileName: item.alt,
          },
        });
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  // Convert hex color to CSS filter (for uploaded icons)
  const hexToFilter = (hex) => {
    if (!hex) return "";

    // Remove # if present
    hex = hex.replace("#", "");

    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Calculate brightness and saturation adjustments
    const brightness = (r + g + b) / 3;
    const saturation = 1 + (brightness - 0.5);

    return `brightness(0) saturate(100%) invert(${Math.round(brightness * 100)}%) sepia(100%) saturate(${Math.round(saturation * 100)}%) hue-rotate(${getHueRotation(r, g, b)}deg)`;
  };

  const getHueRotation = (r, g, b) => {
    // Simple hue calculation
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    if (delta === 0) return 0;

    let hue;
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }

    return Math.round(hue * 60);
  };

  const placeholderStyle = {
    width: iconSize,
    height: iconSize,
    backgroundColor: isOver ? "#e3f2fd" : "#f0f0f0",
    border: canDrop ? "2px dashed #2196f3" : "1px dashed #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: isOver ? "#1976d2" : "#999",
    cursor: "default",
    transition: "all 0.2s ease",
    flexDirection: "column",
    gap: "4px",
    fontWeight: isOver ? "bold" : "normal",
    borderRadius: "4px",
  };

  return (
    <div
      ref={drop}
      style={{
        ...style,
        display: "inline-block",
        width: iconSize,
        height: iconSize,
        position: "relative",
      }}
    >
      {element.props.src ? (
        <>
          {isLibraryIcon && svgContent ? (
            /* Library icon - render inline SVG with color control */
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              dangerouslySetInnerHTML={{
                __html: svgContent.replace(
                  /<svg/,
                  `<svg style="width: 100%; height: 100%; ${iconColor ? `fill: ${iconColor};` : ""}"`,
                ),
              }}
            />
          ) : (
            /* Uploaded icon - use CSS filter to tint color */
            <img
              src={element.props.src}
              alt={element.props.alt || "Icon"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter: iconColor ? hexToFilter(iconColor) : "none",
              }}
              title={element.props.alt || "Icon"}
            />
          )}
        </>
      ) : (
        /* Placeholder with drop zone */
        <div style={placeholderStyle}>
          {isOver ? <Download size={20} /> : <Star size={20} />}
        </div>
      )}
    </div>
  );
};

const LiquidSectionElement = ({ element, style, onUpdateElement }) => {
  const props = element.props || {};
  const renderedHtml = props.renderedHtml || "";

  return (
    <div
      style={{
        ...style,
        position: "relative",
      }}
    >
      {/* Small indicator badge */}
      <div
        style={{
          position: "absolute",
          top: "-10px",
          right: "-10px",
          backgroundColor: "#4caf50",
          color: "#fff",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "10px",
          fontWeight: "bold",
          zIndex: 100,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        LIQUID
      </div>

      {/* Render the server-rendered HTML */}
      <div
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
        style={{
          width: "100%",
          minHeight: "100px",
        }}
      />
    </div>
  );
};

const TableElement = ({ element, style, onUpdateElement }) => {
  const props = element.props || {};

  // Default HTML table if none provided
  const defaultTableHTML = `<table>
    <thead>
      <tr>
        <th>Header 1</th>
        <th>Header 2</th>
        <th>Header 3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Cell 1-1</td>
        <td>Cell 1-2</td>
        <td>Cell 1-3</td>
      </tr>
      <tr>
        <td>Cell 2-1</td>
        <td>Cell 2-2</td>
        <td>Cell 2-3</td>
      </tr>
    </tbody>
  </table>`;

  // Get styling props
  const tableBorderWidth = props.tableBorderWidth;
  const tableBorderColor = props.tableBorderColor;
  const cellPadding = props.tableCellPadding;
  const headerColor = props.headerColor;
  const headerTextColor = props.headerTextColor;
  const stripedRows = props.stripedRows;
  const hoverHighlight = props.hoverHighlight;

  // Generate dynamic CSS for this specific table
  const tableId = `table-${element.id}`;
  const dynamicStyles = `
    <style>
      .${tableId} table {
        width: ${style.width};
        border-collapse: collapse;
        font-size: ${style.fontSize};
        background-color: ${style.backgroundColor};
      }
      .${tableId} table th,
      .${tableId} table td {
        border: ${tableBorderWidth} solid ${tableBorderColor};
        padding: ${cellPadding};
        text-align: ${style.textAlign};
      }
      .${tableId} table thead {
        background-color: ${headerColor};
        color: ${headerTextColor};
      }
      .${tableId} table th {
        font-weight: bold;
      }
      ${stripedRows ? `.${tableId} table tbody tr:nth-child(even) { background-color: #f9f9f9; }` : ""}
      ${hoverHighlight ? `.${tableId} table tbody tr:hover { background-color: #f0f0f0; }` : ""}
    </style>
  `;

  // Combine styles and HTML
  const finalHTML = dynamicStyles + (props.html || defaultTableHTML);

  return (
    <div
      data-element-id={element.id}
      className={tableId}
      style={{
        ...style,
        borderWidth: "0px", // Remove default border from wrapper
        borderStyle: "none",
        padding: 0,
      }}
      dangerouslySetInnerHTML={{ __html: finalHTML }}
    />
  );
};

export default ElementRenderer;
