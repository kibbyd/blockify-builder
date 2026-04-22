/**
 * Liquid Parser - Renders liquid server-side and creates editable elements
 */

/**
 * Parse rendered HTML into individual editable elements
 */
const parseRenderedHTML = (html, generateId) => {
  const elements = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Process body children as top-level elements
  const bodyChildren = Array.from(doc.body.children);

  bodyChildren.forEach((node) => {
    const element = parseHTMLNode(node, generateId);
    if (element) {
      elements.push(element);
    }
  });

  return elements;
};

/**
 * Parse a single HTML node into an editable element
 */
const parseHTMLNode = (node, generateId) => {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) return null;

  const tagName = node.tagName.toLowerCase();
  const id = generateId();

  // Extract inline styles
  const computedStyle = {};
  if (node.style && node.style.cssText) {
    const styleStr = node.style.cssText;
    styleStr.split(";").forEach((rule) => {
      const [key, value] = rule.split(":").map((s) => s.trim());
      if (key && value) {
        const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        computedStyle[camelKey] = value;
      }
    });
  }

  // Parse children recursively
  const children = [];
  Array.from(node.children).forEach((child) => {
    const childElement = parseHTMLNode(child, generateId);
    if (childElement) {
      children.push(childElement);
    }
  });

  // Map HTML elements to Blockify Builder element types
  switch (tagName) {
    case "div":
    case "section":
    case "article":
      // Treat as container
      return {
        id,
        type: "container",
        children,
        style: computedStyle,
        props: {
          className: node.className,
          htmlTag: tagName,
        },
      };

    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return {
        id,
        type: "heading",
        style: computedStyle,
        props: {
          level: tagName,
          text: node.textContent,
          className: node.className,
        },
      };

    case "p":
      return {
        id,
        type: "text",
        style: computedStyle,
        props: {
          text: node.textContent,
          className: node.className,
        },
      };

    case "img":
      return {
        id,
        type: "image",
        style: computedStyle,
        props: {
          src: node.getAttribute("src"),
          alt: node.getAttribute("alt"),
          className: node.className,
        },
      };

    case "a":
      // Check if it's a button-like element
      if (node.className.includes("button") || node.className.includes("btn")) {
        return {
          id,
          type: "button",
          style: computedStyle,
          props: {
            text: node.textContent,
            url: node.getAttribute("href"),
            className: node.className,
          },
        };
      } else {
        // Treat as text with link
        return {
          id,
          type: "text",
          style: computedStyle,
          props: {
            text: node.textContent,
            url: node.getAttribute("href"),
            className: node.className,
          },
        };
      }

    case "button":
      return {
        id,
        type: "button",
        style: computedStyle,
        props: {
          text: node.textContent,
          className: node.className,
        },
      };

    case "ul":
    case "ol":
      return {
        id,
        type: "container",
        children,
        style: computedStyle,
        props: {
          htmlTag: tagName,
          className: node.className,
        },
      };

    case "li":
      return {
        id,
        type: "text",
        style: computedStyle,
        props: {
          text: node.textContent,
          htmlTag: "li",
          className: node.className,
        },
      };

    default:
      // Generic container for unknown elements
      if (children.length > 0) {
        return {
          id,
          type: "container",
          children,
          style: computedStyle,
          props: {
            htmlTag: tagName,
            className: node.className,
          },
        };
      } else if (node.textContent.trim()) {
        return {
          id,
          type: "text",
          style: computedStyle,
          props: {
            text: node.textContent,
            htmlTag: tagName,
            className: node.className,
          },
        };
      }
      return null;
  }
};

export const parseLiquidToElements = async (liquidContent) => {
  const elements = [];
  let idCounter = 0;

  const generateId = () => `element_${Date.now()}_${idCounter++}`;

  // Extract schema first (preserve for export)
  const schemaMatch = liquidContent.match(
    /\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/,
  );
  const schema = schemaMatch ? schemaMatch[0] : null;

  // Render liquid server-side using the same endpoint as Block Viewer
  try {
    const response = await fetch("/api/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template: liquidContent, customData: {} }),
    });

    const data = await response.json();

    if (response.ok) {
      // Create a single liquid-section element with the rendered HTML
      // This keeps the rendered output intact and makes it selectable/styleable as a whole
      const sectionElement = {
        id: generateId(),
        type: "liquid-section",
        props: {
          renderedHtml: data.html,
          originalLiquid: liquidContent,
          isRendered: true,
        },
        style: {},
      };

      elements.push(sectionElement);
    } else {
      throw new Error(data.error || "Failed to render liquid");
    }
  } catch (error) {
    // Fallback: create element with error message
    const errorElement = {
      id: generateId(),
      type: "liquid-section",
      props: {
        renderedHtml: `<div style="color: red; padding: 20px; border: 2px solid red; border-radius: 4px;">
          <strong>Render Error:</strong><br/>
          ${error.message}
        </div>`,
        originalLiquid: liquidContent,
        isRendered: false,
        error: error.message,
      },
      style: {},
    };

    elements.push(errorElement);
  }

  return {
    elements,
    schema,
    styleBlock: null,
    scripts: [],
    originalLiquid: liquidContent,
  };
};

const parseHTMLStructure = (htmlContent, generateId) => {
  const elements = [];

  // For now, create a single "liquid-section" element that represents the entire section
  // This allows visual preview while preserving all liquid logic
  const sectionElement = {
    id: generateId(),
    type: "liquid-section",
    props: {
      liquidContent: htmlContent.trim(),
      isComplex: true,
      editableFields: extractEditableFields(htmlContent),
    },
    style: {},
  };

  elements.push(sectionElement);
  return elements;
};

const extractEditableFields = (htmlContent) => {
  const fields = [];

  // Extract static text that could be edited (simple h1-h6, p tags without liquid logic)
  const simpleHeadings = htmlContent.match(/<h[1-6][^>]*>([^<{]+)<\/h[1-6]>/g);
  if (simpleHeadings) {
    simpleHeadings.forEach((heading, index) => {
      const textMatch = heading.match(/>([^<]+)</);
      if (textMatch) {
        fields.push({
          type: "heading",
          index,
          originalTag: heading,
          text: textMatch[1].trim(),
        });
      }
    });
  }

  // Extract simple paragraphs
  const simpleParagraphs = htmlContent.match(/<p[^>]*>([^<{]+)<\/p>/g);
  if (simpleParagraphs) {
    simpleParagraphs.forEach((para, index) => {
      const textMatch = para.match(/>([^<]+)</);
      if (textMatch) {
        fields.push({
          type: "text",
          index,
          originalTag: para,
          text: textMatch[1].trim(),
        });
      }
    });
  }

  return fields;
};

/**
 * Convert Blockify Builder elements back to Liquid
 * Preserves all original liquid logic, styles, and scripts
 */
export const convertElementsToLiquid = (
  elements,
  metadata,
  responsiveStyles = {},
) => {
  let liquid = "";

  // If we have preserved blocks, reconstruct the original structure
  if (metadata && metadata.styleBlock) {
    liquid += metadata.styleBlock + "\n\n";
  }

  // Render the main content
  elements.forEach((element) => {
    if (element.type === "liquid-section") {
      // For complex liquid sections, preserve the original content
      // Apply any edits made to editable fields
      let content = element.props.liquidContent;

      if (element.props.editableFields) {
        element.props.editableFields.forEach((field) => {
          // Replace original text with edited text if changed
          if (field.editedText && field.editedText !== field.text) {
            content = content.replace(
              field.originalTag,
              field.originalTag.replace(field.text, field.editedText),
            );
          }
        });
      }

      liquid += content + "\n\n";
    } else {
      // Handle simple elements created in the builder
      liquid += renderSimpleElement(element, responsiveStyles);
    }
  });

  // Add scripts back
  if (metadata && metadata.scripts) {
    metadata.scripts.forEach((script) => {
      liquid += script + "\n\n";
    });
  }

  // Add schema back
  if (metadata && metadata.schema) {
    liquid += metadata.schema;
  }

  return liquid;
};

const renderSimpleElement = (element, responsiveStyles) => {
  const elementStyles = getComputedStyles(element, responsiveStyles);
  const styleStr = stylesToString(elementStyles);
  let html = "";

  switch (element.type) {
    case "container":
      html += `<div class="container"${styleStr ? ` style="${styleStr}"` : ""}>\n`;
      if (element.children) {
        element.children.forEach((child) => {
          html += renderSimpleElement(child, responsiveStyles);
        });
      }
      html += `</div>\n`;
      break;

    case "columns":
    case "columns-1":
    case "columns-2":
    case "columns-3":
    case "columns-4":
    case "columns-5":
    case "columns-6":
      const columnCount = element.type.includes("-")
        ? element.type.split("-")[1]
        : "2";
      html += `<div class="columns columns-${columnCount}"${styleStr ? ` style="${styleStr}"` : ""}>\n`;
      if (element.children) {
        element.children.forEach((child) => {
          html += renderSimpleElement(child, responsiveStyles);
        });
      }
      html += `</div>\n`;
      break;

    case "column":
      html += `<div class="column"${styleStr ? ` style="${styleStr}"` : ""}>\n`;
      if (element.children) {
        element.children.forEach((child) => {
          html += renderSimpleElement(child, responsiveStyles);
        });
      }
      html += `</div>\n`;
      break;

    case "heading":
      const level = element.props?.level || "h2";
      html += `<${level}${styleStr ? ` style="${styleStr}"` : ""}>${element.props?.text || "Heading"}</${level}>\n`;
      break;

    case "text":
      html += `<p${styleStr ? ` style="${styleStr}"` : ""}>${element.props?.text || "Text"}</p>\n`;
      break;

    case "image":
      html += `<img src="${element.props?.src || "https://via.placeholder.com/400x300"}" alt="${element.props?.alt || "Image"}"${styleStr ? ` style="${styleStr}"` : ""} />\n`;
      break;

    case "button":
      html += `<a href="${element.props?.url || "#"}" class="button"${styleStr ? ` style="${styleStr}"` : ""}>${element.props?.text || "Button"}</a>\n`;
      break;

    case "spacer":
      html += `<div class="spacer"${styleStr ? ` style="${styleStr}"` : ""}></div>\n`;
      break;

    default:
  }

  return html;
};

const getComputedStyles = (element, responsiveStyles) => {
  const baseStyle = element.style || {};
  const elementResponsiveStyles = responsiveStyles[element.id] || {};

  // Merge all breakpoint styles into inline style
  const mergedStyles = { ...baseStyle };

  // Merge responsive styles for all breakpoints
  Object.keys(elementResponsiveStyles).forEach((breakpoint) => {
    Object.assign(mergedStyles, elementResponsiveStyles[breakpoint]);
  });

  return mergedStyles;
};

const stylesToString = (styles) => {
  return Object.entries(styles)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${kebabKey}: ${value}`;
    })
    .join("; ");
};
