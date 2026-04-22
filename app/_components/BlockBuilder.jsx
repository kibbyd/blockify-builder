"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import ComponentPalette from "@/app/_components/ComponentPalette";
import TemplatePanel from "@/app/_components/TemplatePanel";
import Canvas from "@/app/_components/Canvas";
import PropertyPanel from "@/app/_components/PropertyPanel";
import Toolbar from "@/app/_components/Toolbar";
import Navigator from "@/app/_components/Navigator";
import ErrorBoundary from "@/app/_components/ErrorBoundary";
import PaymentWall from "@/app/_components/PaymentWall";
import { X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import {
  parseLiquidToElements,
  convertElementsToLiquid,
} from "@/app/_utils/liquidParser";
import { convertJSONToLiquid, validateExportData } from "@/app/_utils/jsonToLiquid";
import useSubscription from "@/app/_hooks/useSubscription";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Helper function to get column count based on element type
const getColumnCount = (type) => {
  switch (type) {
    case "columns-1":
      return 1;
    case "columns-2":
    case "columns":
      return 2;
    case "columns-3":
      return 3;
    case "columns-4":
      return 4;
    default:
      return 2;
  }
};

const BlockBuilder = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const subscription = useSubscription();
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const selectedElementRef = useRef(null);
  const [viewport, setViewport] = useState("desktop");
  const [breakpoint, setBreakpoint] = useState("md"); // Current breakpoint being edited (xs, sm, md, lg, xl)
  const [responsiveStyles, setResponsiveStyles] = useState({}); // Store responsive styles: { elementId: { xs: {}, sm: {}, ... } }
  const [liquidMetadata, setLiquidMetadata] = useState(null); // Store preserved liquid blocks (schema, styleBlock, scripts, etc.)
  const [showNavigator, setShowNavigator] = useState(false); // Navigator modal visibility
  const [showLiquidModal, setShowLiquidModal] = useState(false); // Liquid code viewer modal
  const [liquidCodePreview, setLiquidCodePreview] = useState(""); // Generated Liquid code
  const [liquidExportName, setLiquidExportName] = useState(""); // Section name for ZIP download
  const [rightSidebarTab, setRightSidebarTab] = useState('properties');

  // Undo/Redo history
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const isUndoRedoRef = useRef(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login');
    }
  }, [sessionStatus, router]);

  // Load saved progress
  useEffect(() => {
    loadProgress();
  }, []);

  // Auto-save progress whenever elements or responsiveStyles change
  useEffect(() => {
    if (elements.length > 0) {
      saveProgress();
    }
  }, [elements, responsiveStyles]);

  // Push state snapshots to history for undo/redo
  useEffect(() => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }
    const snapshot = JSON.stringify({ elements, responsiveStyles });
    const history = historyRef.current;
    const currentIndex = historyIndexRef.current;

    // Don't push if identical to current snapshot
    if (currentIndex >= 0 && history[currentIndex] === snapshot) return;

    // Truncate any forward history
    historyRef.current = history.slice(0, currentIndex + 1);
    historyRef.current.push(snapshot);

    // Cap at 50 entries
    if (historyRef.current.length > 50) {
      historyRef.current = historyRef.current.slice(-50);
    }
    historyIndexRef.current = historyRef.current.length - 1;
  }, [elements, responsiveStyles]);

  // Keep selectedElement ref in sync for keyboard handler
  useEffect(() => {
    selectedElementRef.current = selectedElement;
  }, [selectedElement]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }

      // Delete selected element
      if (e.key === 'Delete' && selectedElementRef.current) {
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
        e.preventDefault();
        deleteElement(selectedElementRef.current);
        setSelectedElement(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const undo = useCallback(() => {
    const index = historyIndexRef.current;
    if (index <= 0) return;
    const newIndex = index - 1;
    historyIndexRef.current = newIndex;
    isUndoRedoRef.current = true;
    const snapshot = JSON.parse(historyRef.current[newIndex]);
    setElements(snapshot.elements);
    setResponsiveStyles(snapshot.responsiveStyles);
  }, []);

  const redo = useCallback(() => {
    const history = historyRef.current;
    const index = historyIndexRef.current;
    if (index >= history.length - 1) return;
    const newIndex = index + 1;
    historyIndexRef.current = newIndex;
    isUndoRedoRef.current = true;
    const snapshot = JSON.parse(historyRef.current[newIndex]);
    setElements(snapshot.elements);
    setResponsiveStyles(snapshot.responsiveStyles);
  }, []);

  // Expose test helpers for automated testing
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.blockifyTestHelpers = {
        // Get current state
        getElements: () => elements,
        getResponsiveStyles: () => responsiveStyles,
        getSelectedElement: () => selectedElement,

        // Add elements programmatically (bypassing drag-and-drop)
        addElement: (type, options = {}) => {
          const { dropIndex = -1 } = options;
          addElement(type, null, dropIndex, {});
          return new Promise((resolve) => setTimeout(resolve, 100));
        },

        addChildElement: (parentId, type, options = {}) => {
          const { columnIndex = null } = options;
          addChildElement(parentId, type, {}, columnIndex);
          return new Promise((resolve) => setTimeout(resolve, 100));
        },

        // Helper to add Container + Columns setup
        setupContainerWithColumns: async (columnCount = 2) => {
          // Add container
          addElement("container");
          await new Promise((resolve) => setTimeout(resolve, 200));

          // Get the container ID
          const currentElements = window.blockifyTestHelpers.getElements();
          const container = currentElements[currentElements.length - 1];

          // Add columns to container
          addChildElement(container.id, `columns-${columnCount}`, {}, null);
          await new Promise((resolve) => setTimeout(resolve, 200));

          return {
            containerId: container.id,
            elements: window.blockifyTestHelpers.getElements(),
          };
        },

        // Utility to clear canvas
        clearCanvas: () => {
          clearCanvas();
          return new Promise((resolve) => setTimeout(resolve, 100));
        },

        // Export to Liquid without prompts (for testing)
        exportToLiquidForTesting: (sectionName = "test-section") => {
          const exportData = {
            elements: window.blockifyTestHelpers.getElements(),
            responsiveStyles: window.blockifyTestHelpers.getResponsiveStyles(),
          };

          // Import the converter
          return import("@/app/_utils/jsonToLiquid.js").then((module) => {
            const liquidCode = module.convertJSONToLiquid(
              exportData,
              sectionName,
            );
            return {
              liquidCode,
              sectionName,
              elementCount: exportData.elements.length,
            };
          });
        },
      };

      console.log("✅ Blockify Builder test helpers loaded");
      console.log("   Available: window.blockifyTestHelpers");
    }

    return () => {
      if (typeof window !== "undefined") {
        delete window.blockifyTestHelpers;
      }
    };
  }, [elements, responsiveStyles, selectedElement]);

  // Skip auth in test environment
  const isTestEnv = typeof window !== 'undefined' && (
    window.location.search.includes("skipLicense=true") ||
    window.navigator.webdriver ||
    window.Cypress
  );

  const saveProgress = () => {
    try {
      const progressData = {
        elements,
        responsiveStyles,
        liquidMetadata,
        viewport,
        breakpoint,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("blockify_progress", JSON.stringify(progressData));
    } catch (error) {}
  };

  const loadProgress = () => {
    try {
      const saved = localStorage.getItem("blockify_progress");
      if (saved) {
        const progressData = JSON.parse(saved);

        // Migrate old elements to include schemaToggles and responsiveStyles
        const migratedElements = migrateElements(progressData.elements || []);

        setElements(migratedElements);
        setResponsiveStyles(progressData.responsiveStyles || {});
        setLiquidMetadata(progressData.liquidMetadata || null);
        setViewport(progressData.viewport || "desktop");
        setBreakpoint(progressData.breakpoint || "md");
      }
    } catch (error) {}
  };

  // Migrate old elements to include new properties
  const migrateElements = (elements) => {
    return elements.map((element) => {
      const migrated = {
        ...element,
        responsiveStyles: element.responsiveStyles || {},
        schemaToggles: element.schemaToggles || {},
      };

      // Fix missing uploadedFileName for elements with data URLs
      if (
        migrated.props?.src &&
        migrated.props.src.startsWith("data:") &&
        !migrated.props.uploadedFileName
      ) {
        // Generate a filename based on the data URL type
        const mimeMatch = migrated.props.src.match(/data:([^;]+)/);
        let extension = "bin";
        if (mimeMatch) {
          const mimeType = mimeMatch[1];
          if (mimeType.includes("png")) extension = "png";
          else if (mimeType.includes("jpeg") || mimeType.includes("jpg"))
            extension = "jpg";
          else if (mimeType.includes("gif")) extension = "gif";
          else if (mimeType.includes("svg")) extension = "svg";
          else if (mimeType.includes("webp")) extension = "webp";
          else if (mimeType.includes("mp4")) extension = "mp4";
          else if (mimeType.includes("webm")) extension = "webm";
        }
        migrated.props.uploadedFileName = `${migrated.type}_${migrated.id.substring(0, 8)}.${extension}`;
        if (!migrated.props.alt) {
          migrated.props.alt = migrated.props.uploadedFileName.replace(
            /\.[^/.]+$/,
            "",
          );
        }
        console.log(
          "Fixed missing uploadedFileName for element:",
          migrated.id,
          migrated.props.uploadedFileName,
        );
      }

      // Migration: Auto-enable text schema toggle for text-based elements
      // This ensures existing elements created before default schema toggles have proper text editing
      if (
        (migrated.type === "heading" ||
          migrated.type === "text" ||
          migrated.type === "button") &&
        migrated.props?.text &&
        !migrated.schemaToggles?.text
      ) {
        migrated.schemaToggles = migrated.schemaToggles || {};
        migrated.schemaToggles.text = true;
        console.log(
          `Migration: Enabled text schema toggle for ${migrated.type} element:`,
          migrated.id,
        );
      }

      // Migration: Auto-enable fontSize for headings if missing
      if (migrated.type === "heading" && !migrated.schemaToggles?.fontSize) {
        migrated.schemaToggles = migrated.schemaToggles || {};
        migrated.schemaToggles.fontSize = true;
        console.log(
          "Migration: Enabled fontSize schema toggle for heading:",
          migrated.id,
        );
      }

      // Migration: Auto-enable src for images if missing
      if (
        migrated.type === "image" &&
        migrated.props?.src &&
        !migrated.schemaToggles?.src
      ) {
        migrated.schemaToggles = migrated.schemaToggles || {};
        migrated.schemaToggles.src = true;
        console.log(
          "Migration: Enabled src schema toggle for image:",
          migrated.id,
        );
      }

      // Recursively migrate children
      if (migrated.children && migrated.children.length > 0) {
        migrated.children = migrateElements(migrated.children);
      }

      // Recursively migrate columns
      if (migrated.columns && migrated.columns.length > 0) {
        migrated.columns = migrated.columns.map((column) =>
          column ? migrateElements(column) : column,
        );
      }

      return migrated;
    });
  };

  const exportPageState = () => {
    try {
      const exportData = {
        version: "1.0.0",
        elements,
        responsiveStyles,
        liquidMetadata,
        viewport,
        breakpoint,
        exportedAt: new Date().toISOString(),
        description: `Blockify Builder page export`,
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `blockify-builder-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert("Page exported successfully!");
    } catch (error) {
      alert("Error exporting page: " + error.message);
    }
  };

  const exportToLiquid = async () => {
    try {
      const sectionName = prompt("Enter section name:", "custom-section");
      if (!sectionName) return;

      const exportData = {
        elements,
        responsiveStyles,
      };

      // Validate before export — check schema count limit
      const validation = validateExportData(exportData);
      if (validation.info.schemaCount > 250) {
        alert(`Export blocked: ${validation.info.schemaCount} schema settings exceeds Shopify's 250 setting limit.\n\nReduce the number of schema-editable properties or split into multiple sections.`);
        return;
      }
      if (validation.warnings.length > 0) {
        console.warn('[Export Validation]', validation.warnings);
      }
      console.log('[Export Validation]', validation.info);

      // Convert JSON structure to Liquid
      const liquidCode = convertJSONToLiquid(exportData, sectionName);

      // Strip base64 data URLs before measuring size — they're builder preview
      // media that gets replaced by asset_url references in the final package
      const codeForSizeCheck = liquidCode.replace(/data:(image|video)\/[^"'\s)]+/g, 'ASSET_PLACEHOLDER');
      const sizeBytes = new Blob([codeForSizeCheck]).size;
      const sizeKB = (sizeBytes / 1024).toFixed(1);

      if (sizeBytes > 256 * 1024) {
        alert(`Export blocked: Generated code is ${sizeKB} KB, which exceeds Shopify's 256 KB section file limit.\n\nRemove some sections or split your page into multiple sections to reduce the file size.`);
        return;
      }

      const exportName = sectionName.toLowerCase().replace(/\s+/g, "-");

      // Show code in modal (with download option in footer)
      setLiquidExportName(exportName);
      setLiquidCodePreview(liquidCode);
      setShowLiquidModal(true);
    } catch (error) {
      alert("Error exporting to Liquid: " + error.message);
    }
  };

  const importPageState = () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";

      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importData = JSON.parse(event.target.result);

            // Validate the import data
            if (!importData.version || !importData.elements) {
              throw new Error("Invalid Blockify Builder export file");
            }

            // Load the imported data (with migration for old elements)
            const migratedElements = migrateElements(importData.elements || []);
            setElements(migratedElements);
            setResponsiveStyles(importData.responsiveStyles || {});
            setLiquidMetadata(importData.liquidMetadata || null);
            setViewport(importData.viewport || "desktop");
            setBreakpoint(importData.breakpoint || "md");

            // Also save to localStorage
            saveProgress();

            alert(
              `Page imported successfully!\nOriginal: ${importData.description}\nExported: ${importData.exportedAt}`,
            );
          } catch (error) {
            alert("Error importing page: " + error.message);
          }
        };

        reader.readAsText(file);
      };

      input.click();
    } catch (error) {
      alert("Error importing page: " + error.message);
    }
  };

  const addElement = useCallback(
    (componentType, columnConfig = null, dropIndex = -1, draggedItem = {}) => {
      try {
        // Handle uploaded media
        const customProps = {};
        if (draggedItem.isUploadedMedia && componentType === "image") {
          customProps.src = draggedItem.src; // For visual preview only
          customProps.uploadedFileName = draggedItem.alt; // Store original filename for alt text
          customProps.alt = draggedItem.alt || "";
        }

        const defaultProps = getDefaultProps(componentType);
        const mergedProps = { ...defaultProps, ...customProps };

        const newElement = {
          id: uuidv4(),
          type: componentType,
          props: mergedProps,
          style: getDefaultStyle(componentType),
          responsiveStyles: {},
          schemaToggles: getDefaultSchemaToggles(componentType),
          children: [],
          columns: componentType.startsWith("columns-") ? [] : undefined,
        };

        // Assign unique setting ID for images
        if (componentType === "image") {
          const existingImages = countImagesInElements(elements);
          newElement.props.settingId =
            existingImages === 0 ? "image" : `image_${existingImages + 1}`;
        }

        setElements((prev) => {
          const newElements = [...prev];
          if (dropIndex >= 0 && dropIndex <= prev.length) {
            newElements.splice(dropIndex, 0, newElement);
          } else {
            newElements.push(newElement);
          }
          return newElements;
        });

        setSelectedElement(newElement.id);
      } catch (error) {}
    },
    [elements],
  );

  const addChildElement = useCallback(
    (parentId, componentType, item, columnIndex = null) => {
      // Check if we're moving an existing element
      if (!componentType && item?.elementId) {
        // Prevent moving an element into itself
        if (item.elementId === parentId) {
          return;
        }

        // Moving existing element from canvas into container/column
        setElements((prev) => {
          const elementToMove = findElementById(prev, item.elementId);
          if (!elementToMove) {
            return prev;
          }

          // Prevent moving an element into its own descendants
          const isDescendant = (element, ancestorId) => {
            if (element.id === ancestorId) return true;
            if (element.children) {
              for (const child of element.children) {
                if (isDescendant(child, ancestorId)) return true;
              }
            }
            if (element.columns) {
              for (const column of element.columns) {
                for (const child of column) {
                  if (isDescendant(child, ancestorId)) return true;
                }
              }
            }
            return false;
          };

          if (isDescendant(elementToMove, parentId)) {
            return prev;
          }

          // Remove element from wherever it is (top-level, nested containers, or columns)
          const removeElementRecursive = (items) => {
            return items.filter((el) => {
              if (el.id === item.elementId) {
                return false; // Remove this element
              }

              // Recursively remove from children
              if (el.children && el.children.length > 0) {
                el.children = removeElementRecursive(el.children);
              }

              // Recursively remove from columns
              if (el.columns && el.columns.length > 0) {
                el.columns = el.columns.map((column) =>
                  column ? removeElementRecursive(column) : column,
                );
              }

              return true; // Keep this element
            });
          };

          const withoutElement = removeElementRecursive(prev);

          // Add to parent container/column
          const addToParent = (items) => {
            return items.map((el) => {
              if (el.id === parentId) {
                if (
                  (el.type?.startsWith("columns-") || el.type === "columns") &&
                  columnIndex !== null
                ) {
                  // Add to specific column
                  const newColumns = [...(el.columns || [])];
                  if (!newColumns[columnIndex]) newColumns[columnIndex] = [];
                  newColumns[columnIndex] = [
                    ...newColumns[columnIndex],
                    elementToMove,
                  ];
                  return { ...el, columns: newColumns };
                } else {
                  // Add to container children
                  return {
                    ...el,
                    children: [...(el.children || []), elementToMove],
                  };
                }
              }

              // Recursively search in children
              if (el.children && el.children.length > 0) {
                const updatedChildren = addToParent(el.children);
                if (updatedChildren !== el.children) {
                  return { ...el, children: updatedChildren };
                }
              }

              // Recursively search in columns
              if (el.columns && el.columns.length > 0) {
                const updatedColumns = el.columns.map((column) =>
                  addToParent(column),
                );
                if (updatedColumns.some((col, i) => col !== el.columns[i])) {
                  return { ...el, columns: updatedColumns };
                }
              }

              return el;
            });
          };

          return addToParent(withoutElement);
        });

        setSelectedElement(item.elementId);
        return;
      }

      // Handle uploaded media
      const customProps = {};
      if (item && item.isUploadedMedia && componentType === "image") {
        customProps.src = item.src; // For visual preview only
        customProps.uploadedFileName = item.alt; // Store original filename for alt text
        customProps.alt = item.alt || "";
      }

      const defaultProps = getDefaultProps(componentType);
      const mergedProps = { ...defaultProps, ...customProps };

      const newElement = {
        id: uuidv4(),
        type: componentType,
        props: mergedProps,
        style: getDefaultStyle(componentType),
        responsiveStyles: {},
        schemaToggles: getDefaultSchemaToggles(componentType),
        children: [],
        columns:
          componentType?.startsWith("columns-") || componentType === "columns"
            ? Array.from({ length: getColumnCount(componentType) }, () => [])
            : undefined,
      };

      // Assign unique setting ID for images
      if (componentType === "image") {
        const existingImages = countImagesInElements(elements);
        newElement.props.settingId =
          existingImages === 0 ? "image" : `image_${existingImages + 1}`;
      }

      setElements((prev) => {
        const updateElement = (elements) => {
          return elements.map((el) => {
            if (el.id === parentId) {
              if (
                (el.type.startsWith("columns-") || el.type === "columns") &&
                columnIndex !== null
              ) {
                // Handle adding to specific column
                const columnCount = getColumnCount(el.type);
                const columns =
                  el.columns || Array.from({ length: columnCount }, () => []);
                const updatedColumns = [...columns];
                if (!updatedColumns[columnIndex]) {
                  updatedColumns[columnIndex] = [];
                }
                updatedColumns[columnIndex] = [
                  ...updatedColumns[columnIndex],
                  newElement,
                ];

                return {
                  ...el,
                  columns: updatedColumns,
                };
              } else {
                // Handle adding to regular container
                return {
                  ...el,
                  children: [...(el.children || []), newElement],
                };
              }
            }

            // Recursively search in children
            if (el.children && el.children.length > 0) {
              const updatedChildren = updateElement(el.children);
              if (updatedChildren !== el.children) {
                return { ...el, children: updatedChildren };
              }
            }

            // Recursively search in columns
            if (el.columns && el.columns.length > 0) {
              const updatedColumns = el.columns.map((column) =>
                updateElement(column),
              );
              if (updatedColumns.some((col, i) => col !== el.columns[i])) {
                return { ...el, columns: updatedColumns };
              }
            }

            return el;
          });
        };

        return updateElement(prev);
      });

      setSelectedElement(newElement.id);
    },
    [],
  );

  const moveElement = useCallback((dragIndex, dropIndex) => {
    setElements((prev) => {
      const newElements = [...prev];
      const draggedElement = newElements[dragIndex];
      newElements.splice(dragIndex, 1);
      newElements.splice(dropIndex, 0, draggedElement);
      return newElements;
    });
  }, []);

  // Move element in navigator (reorder in hierarchy)
  const moveElementInNavigator = useCallback(
    (
      draggedElementId,
      targetElementId,
      position = "before",
      columnIndex = null,
    ) => {
      setElements((prev) => {
        // Find and remove the dragged element from wherever it is
        let draggedElement = null;

        const removeElement = (items) => {
          return items.filter((el) => {
            if (el.id === draggedElementId) {
              draggedElement = el;
              return false;
            }

            if (el.children) {
              el.children = removeElement(el.children);
            }

            if (el.columns) {
              el.columns = el.columns.map((column) =>
                column ? removeElement(column) : column,
              );
            }

            return true;
          });
        };

        const withoutDragged = removeElement(prev);

        if (!draggedElement) return prev;

        // Handle dropping into a column
        if (position === "into-column" && columnIndex !== null) {
          const insertIntoColumn = (items) => {
            return items.map((el) => {
              if (el.id === targetElementId) {
                // Add to specific column
                const newColumns = [...(el.columns || [])];
                if (!newColumns[columnIndex]) newColumns[columnIndex] = [];
                newColumns[columnIndex] = [
                  ...newColumns[columnIndex],
                  draggedElement,
                ];
                return { ...el, columns: newColumns };
              }

              // Recursively search in children
              if (el.children && el.children.length > 0) {
                const updatedChildren = insertIntoColumn(el.children);
                if (updatedChildren !== el.children) {
                  return { ...el, children: updatedChildren };
                }
              }

              // Recursively search in columns
              if (el.columns && el.columns.length > 0) {
                const updatedColumns = el.columns.map((column) =>
                  column ? insertIntoColumn(column) : column,
                );
                if (updatedColumns.some((col, i) => col !== el.columns[i])) {
                  return { ...el, columns: updatedColumns };
                }
              }

              return el;
            });
          };

          return insertIntoColumn(withoutDragged);
        }

        // Insert the dragged element before/after the target element
        const insertElement = (items) => {
          const newItems = [];

          for (const el of items) {
            if (el.id === targetElementId) {
              if (position === "before") {
                newItems.push(draggedElement);
                newItems.push(el);
              } else {
                newItems.push(el);
                newItems.push(draggedElement);
              }
            } else {
              newItems.push(el);

              // Recursively check children
              if (el.children) {
                el.children = insertElement(el.children);
              }

              // Recursively check columns
              if (el.columns) {
                el.columns = el.columns.map((column) =>
                  column ? insertElement(column) : column,
                );
              }
            }
          }

          return newItems;
        };

        return insertElement(withoutDragged);
      });
    },
    [],
  );

  const updateElement = useCallback((elementId, updates) => {
    // Handle column updates (ID pattern: parentId-col-columnIndex)
    if (elementId.includes("-col-")) {
      const parts = elementId.split("-col-");
      const parentElementId = parts[0];
      const columnIndex = parseInt(parts[1]);

      setElements((prev) => {
        const updateColumnSchemaRecursive = (elements) => {
          return elements.map((el) => {
            if (el.id === parentElementId) {
              let updatedEl = { ...el };

              // Store column schemaToggles on parent element using namespaced keys
              if (updates.schemaToggles) {
                const columnSchemaToggles = { ...el.schemaToggles };
                Object.keys(updates.schemaToggles).forEach((key) => {
                  const namespacedKey = `col-${columnIndex}-${key}`;
                  columnSchemaToggles[namespacedKey] =
                    updates.schemaToggles[key];
                });
                updatedEl.schemaToggles = columnSchemaToggles;
              }

              // Store column styles on parent element using namespaced keys
              if (updates.style !== undefined) {
                const columnStyles = { ...el.columnStyles };
                if (!columnStyles[columnIndex]) {
                  columnStyles[columnIndex] = {};
                }

                console.log("[BlockBuilder] Updating column styles:", {
                  columnIndex,
                  parentElementId,
                  oldColumnStyles: columnStyles[columnIndex],
                  newStyle: updates.style,
                });

                // Merge the updates with existing column styles
                // This will replace the entire style object for the column
                columnStyles[columnIndex] = { ...updates.style };

                console.log(
                  "[BlockBuilder] Updated column styles:",
                  columnStyles[columnIndex],
                );

                updatedEl.columnStyles = columnStyles;
              }

              return updatedEl;
            }

            // Check children
            if (el.children && el.children.length > 0) {
              const updatedChildren = updateColumnSchemaRecursive(el.children);
              if (updatedChildren !== el.children) {
                return { ...el, children: updatedChildren };
              }
            }

            // Check columns
            if (el.columns && el.columns.length > 0) {
              const updatedColumns = el.columns.map((column) =>
                column ? updateColumnSchemaRecursive(column) : column,
              );
              if (updatedColumns.some((col, i) => col !== el.columns[i])) {
                return { ...el, columns: updatedColumns };
              }
            }

            return el;
          });
        };

        return updateColumnSchemaRecursive(prev);
      });
      return;
    }

    // Regular element update
    setElements((prev) => {
      const updateElementRecursive = (elements) => {
        return elements.map((el) => {
          if (el.id === elementId) {
            const updated = { ...el, ...updates };
            return updated;
          }

          // Check children
          if (el.children && el.children.length > 0) {
            return {
              ...el,
              children: updateElementRecursive(el.children),
            };
          }

          // Check columns
          if (el.columns && el.columns.length > 0) {
            return {
              ...el,
              columns: el.columns.map((column) =>
                column ? updateElementRecursive(column) : column,
              ),
            };
          }

          return el;
        });
      };

      const result = updateElementRecursive(prev);
      return result;
    });
  }, []);

  // Update responsive styles for an element at current breakpoint
  const updateResponsiveStyle = useCallback(
    (elementId, styleName, value) => {
      console.log("[BlockBuilder] updateResponsiveStyle called:", {
        elementId,
        styleName,
        value,
        breakpoint,
      });

      // Handle column responsive styles (ID pattern: parentId-col-columnIndex)
      if (elementId.includes("-col-")) {
        const parts = elementId.split("-col-");
        const parentElementId = parts[0];
        const columnIndex = parseInt(parts[1]);

        // Use namespaced key for column responsive styles
        const namespacedKey = `col-${columnIndex}-${styleName}`;

        setResponsiveStyles((prev) => {
          const elementStyles = prev[parentElementId] || {
            xs: {},
            sm: {},
            md: {},
            lg: {},
            xl: {},
          };
          const breakpointStyles = elementStyles[breakpoint] || {};

          const updated = {
            ...prev,
            [parentElementId]: {
              ...elementStyles,
              [breakpoint]: {
                ...breakpointStyles,
                [namespacedKey]: value,
              },
            },
          };

          console.log(
            "[BlockBuilder] Updated column responsiveStyles:",
            updated[parentElementId],
          );
          return updated;
        });
      } else {
        // Regular element responsive styles
        setResponsiveStyles((prev) => {
          const elementStyles = prev[elementId] || {
            xs: {},
            sm: {},
            md: {},
            lg: {},
            xl: {},
          };
          const breakpointStyles = elementStyles[breakpoint] || {};

          const updated = {
            ...prev,
            [elementId]: {
              ...elementStyles,
              [breakpoint]: {
                ...breakpointStyles,
                [styleName]: value,
              },
            },
          };

          console.log(
            "[BlockBuilder] Updated responsiveStyles:",
            updated[elementId],
          );
          return updated;
        });
      }
    },
    [breakpoint],
  );

  // Sync current breakpoint's styles to all other breakpoints for selected element
  const syncStylesAcrossBreakpoints = useCallback(() => {
    if (!selectedElement) {
      alert("Please select an element first");
      return;
    }

    // Get current breakpoint's styles for the selected element
    const elementStyles = responsiveStyles[selectedElement];
    if (
      !elementStyles ||
      !elementStyles[breakpoint] ||
      Object.keys(elementStyles[breakpoint]).length === 0
    ) {
      alert(
        `No styles found for the current breakpoint (${breakpoint.toUpperCase()})`,
      );
      return;
    }

    const currentStyles = elementStyles[breakpoint];
    const styleCount = Object.keys(currentStyles).length;

    if (
      confirm(
        `Sync ${styleCount} style(s) from ${breakpoint.toUpperCase()} to all other breakpoints?\n\nThis will overwrite existing styles at other breakpoints for this element.`,
      )
    ) {
      setResponsiveStyles((prev) => {
        return {
          ...prev,
          [selectedElement]: {
            xs: { ...currentStyles },
            sm: { ...currentStyles },
            md: { ...currentStyles },
            lg: { ...currentStyles },
            xl: { ...currentStyles },
          },
        };
      });

      alert(
        `✅ Styles synced successfully!\n\n${styleCount} style(s) copied to all breakpoints (XS, SM, MD, LG, XL)`,
      );
    }
  }, [selectedElement, breakpoint, responsiveStyles]);

  const deleteElement = useCallback(
    (elementId) => {
      // Check if deleting an individual column (ID pattern: elementId-col-columnIndex)
      if (elementId.includes("-col-")) {
        const parts = elementId.split("-col-");
        const parentElementId = parts[0];
        const columnIndex = parseInt(parts[1]);

        setElements((prev) => {
          const deleteColumnRecursive = (elements) => {
            return elements.map((el) => {
              if (
                el.id === parentElementId &&
                el.columns &&
                el.columns[columnIndex]
              ) {
                // Clear the column's contents but keep the column structure
                const newColumns = [...el.columns];
                newColumns[columnIndex] = [];
                return { ...el, columns: newColumns };
              }

              // Process children
              if (el.children && el.children.length > 0) {
                return { ...el, children: deleteColumnRecursive(el.children) };
              }

              // Process columns recursively
              if (el.columns && el.columns.length > 0) {
                const newColumns = el.columns.map((column) =>
                  column ? deleteColumnRecursive(column) : column,
                );
                return { ...el, columns: newColumns };
              }

              return el;
            });
          };

          return deleteColumnRecursive(prev);
        });

        if (selectedElement === elementId) {
          setSelectedElement(null);
        }
        return;
      }

      // Regular element deletion
      setElements((prev) => {
        const deleteElementRecursive = (elements) => {
          return elements.filter((el) => {
            if (el.id === elementId) {
              return false;
            }

            // Update children
            if (el.children && el.children.length > 0) {
              el.children = deleteElementRecursive(el.children);
            }

            // Update columns
            if (el.columns && el.columns.length > 0) {
              el.columns = el.columns.map((column) =>
                column ? deleteElementRecursive(column) : column,
              );
            }

            return true;
          });
        };

        return deleteElementRecursive(prev);
      });

      if (selectedElement === elementId) {
        setSelectedElement(null);
      }
    },
    [selectedElement],
  );

  const insertTemplateElements = useCallback((newElements) => {
    // Extract responsive styles from all template elements into global state
    const extracted = {};
    const extractStyles = (el) => {
      if (el.responsiveStyles && Object.keys(el.responsiveStyles).length > 0) {
        extracted[el.id] = el.responsiveStyles;
      }
      if (el.children) el.children.forEach(extractStyles);
      if (el.columns) el.columns.forEach((col) => col.forEach(extractStyles));
    };
    newElements.forEach(extractStyles);

    if (Object.keys(extracted).length > 0) {
      setResponsiveStyles((prev) => ({ ...prev, ...extracted }));
    }

    setElements((prev) => [...prev, ...newElements]);
  }, []);

  const clearCanvas = useCallback(() => {
    setElements([]);
    setSelectedElement(null);
  }, []);



  const countImagesInElements = (elements) => {
    let count = 0;
    const processElement = (element) => {
      if (element.type === "image") count++;
      if (element.children) element.children.forEach(processElement);
      if (element.columns) {
        element.columns.forEach((column) => {
          if (column) column.forEach(processElement);
        });
      }
    };
    elements.forEach(processElement);
    return count;
  };


  // Show loading while checking session/subscription
  if (!isTestEnv && (sessionStatus === 'loading' || subscription.loading)) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div style={{ color: "white", fontSize: "24px" }}>
          Loading...
        </div>
      </div>
    );
  }

  // Show payment wall if subscription is not active (and not test env)
  if (!isTestEnv && !subscription.isActive) {
    return <PaymentWall subscription={subscription} />;
  }

  // Show the builder if licensed
  return (
    <div className="block-builder">
      <Toolbar
        viewport={viewport}
        setViewport={setViewport}
        breakpoint={breakpoint}
        setBreakpoint={setBreakpoint}
        onSyncStyles={syncStylesAcrossBreakpoints}
        selectedElement={selectedElement}
        onUndo={undo}
        onRedo={redo}
        onNavigatorToggle={() => setShowNavigator(!showNavigator)}
        onClearCanvas={clearCanvas}
        onImportPage={importPageState}
        onExportJSON={exportPageState}
        onExportLiquid={exportToLiquid}
      />

      <div className="builder-main">
        <div className="left-sidebar">
          <ComponentPalette onAddElement={addElement} />
          <TemplatePanel onInsertElements={insertTemplateElements} />
        </div>

        <ErrorBoundary>
          <Canvas
            elements={elements}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            onMoveElement={moveElement}
            onAddElement={addElement}
            onAddChildElement={addChildElement}
            onUpdateElement={updateElement}
            viewport={viewport}
            breakpoint={breakpoint}
            responsiveStyles={responsiveStyles}
          />
        </ErrorBoundary>

        <div className="right-sidebar">

          {rightSidebarTab === 'properties' && (
          <PropertyPanel
          selectedElement={
            selectedElement
              ? (() => {
                  // Check if selected element is a column (ID pattern: elementId-col-columnIndex)
                  if (selectedElement.includes("-col-")) {
                    const parts = selectedElement.split("-col-");
                    const parentElementId = parts[0];
                    const columnIndex = parseInt(parts[1]);
                    const parentElement = findElementById(
                      elements,
                      parentElementId,
                    );

                    if (parentElement) {
                      // Extract column-specific schemaToggles from parent element
                      const columnSchemaToggles = {};
                      const namespacePrefix = `col-${columnIndex}-`;
                      if (parentElement.schemaToggles) {
                        Object.keys(parentElement.schemaToggles).forEach(
                          (key) => {
                            if (key.startsWith(namespacePrefix)) {
                              const propName = key.substring(
                                namespacePrefix.length,
                              );
                              columnSchemaToggles[propName] =
                                parentElement.schemaToggles[key];
                            }
                          },
                        );
                      }

                      // Create a special column object
                      return {
                        id: selectedElement,
                        type: "column",
                        fromTemplate: parentElement.fromTemplate,
                        parentId: parentElementId,
                        columnIndex: columnIndex,
                        parentElement: parentElement,
                        style: parentElement.columnStyles?.[columnIndex] || {}, // Get column styles from parent element
                        props: {},
                        schemaToggles: columnSchemaToggles,
                      };
                    }
                  }
                  // Regular element
                  return findElementById(elements, selectedElement);
                })()
              : null
          }
          onUpdateElement={updateElement}
          onDeleteElement={deleteElement}
          breakpoint={breakpoint}
          responsiveStyles={responsiveStyles}
          onUpdateResponsiveStyle={updateResponsiveStyle}
          elements={elements}
          liquidMetadata={liquidMetadata}
          onConvertLiquidToHTML={(elementId) => {
            const element = findElementById(elements, elementId);
            if (
              element &&
              element.type === "liquid-section" &&
              element.props.renderedHtml
            ) {
              const parser = new DOMParser();
              const doc = parser.parseFromString(
                element.props.renderedHtml,
                "text/html",
              );
              let idCounter = 0;
              const generateId = () => `element_${Date.now()}_${idCounter++}`;

              // Extract CSS from <style> tags and create a stylesheet
              const styleTags = doc.querySelectorAll("style");
              const cssRules = {};

              styleTags.forEach((styleTag) => {
                const cssText = styleTag.textContent;
                // Parse CSS rules
                const ruleMatches = cssText.matchAll(/([^{]+)\{([^}]+)\}/g);
                for (const match of ruleMatches) {
                  const selector = match[1].trim();
                  const styles = match[2].trim();

                  // Convert CSS to style object
                  const styleObj = {};
                  styles.split(";").forEach((rule) => {
                    const [key, value] = rule.split(":").map((s) => s.trim());
                    if (key && value) {
                      const camelKey = key.replace(/-([a-z])/g, (g) =>
                        g[1].toUpperCase(),
                      );
                      styleObj[camelKey] = value;
                    }
                  });

                  cssRules[selector] = styleObj;
                }

                // Remove style tag from DOM so it doesn't appear in canvas
                styleTag.remove();
              });

              // Also remove script tags
              doc
                .querySelectorAll("script")
                .forEach((script) => script.remove());

              // Helper to get styles for an element based on class/id
              const getStylesForElement = (node) => {
                const styles = {};
                const classList = Array.from(node.classList || []);
                const id = node.id;

                // Apply class styles
                classList.forEach((className) => {
                  if (cssRules[`.${className}`]) {
                    Object.assign(styles, cssRules[`.${className}`]);
                  }
                });

                // Apply ID styles
                if (id && cssRules[`#${id}`]) {
                  Object.assign(styles, cssRules[`#${id}`]);
                }

                // Apply element styles
                if (cssRules[node.tagName.toLowerCase()]) {
                  Object.assign(styles, cssRules[node.tagName.toLowerCase()]);
                }

                return styles;
              };

              // Flatten all elements - no nesting
              const newElements = [];

              const extractElements = (node) => {
                if (!node || node.nodeType !== Node.ELEMENT_NODE) return;

                const tagName = node.tagName.toLowerCase();
                const id = generateId();

                // Extract inline styles + CSS styles
                const computedStyle = getStylesForElement(node);

                if (node.style && node.style.cssText) {
                  const styleStr = node.style.cssText;
                  styleStr.split(";").forEach((rule) => {
                    const [key, value] = rule.split(":").map((s) => s.trim());
                    if (key && value) {
                      const camelKey = key.replace(/-([a-z])/g, (g) =>
                        g[1].toUpperCase(),
                      );
                      computedStyle[camelKey] = value;
                    }
                  });
                }

                // Create element based on tag type
                let element = null;

                switch (tagName) {
                  case "h1":
                  case "h2":
                  case "h3":
                  case "h4":
                  case "h5":
                  case "h6":
                    element = {
                      id,
                      type: "heading",
                      style: computedStyle,
                      props: {
                        level: tagName,
                        text: node.textContent,
                        className: node.className,
                      },
                    };
                    newElements.push(element);
                    break;

                  case "p":
                    element = {
                      id,
                      type: "text",
                      style: computedStyle,
                      props: {
                        text: node.textContent,
                        className: node.className,
                      },
                    };
                    newElements.push(element);
                    break;

                  case "img":
                    element = {
                      id,
                      type: "image",
                      style: computedStyle,
                      props: {
                        src: node.getAttribute("src"),
                        alt: node.getAttribute("alt"),
                        className: node.className,
                      },
                    };
                    newElements.push(element);
                    break;

                  case "a":
                    if (
                      node.className.includes("button") ||
                      node.className.includes("btn")
                    ) {
                      element = {
                        id,
                        type: "button",
                        style: computedStyle,
                        props: {
                          text: node.textContent,
                          url: node.getAttribute("href"),
                          className: node.className,
                        },
                      };
                      newElements.push(element);
                    }
                    break;

                  case "button":
                    element = {
                      id,
                      type: "button",
                      style: computedStyle,
                      props: {
                        text: node.textContent,
                        className: node.className,
                      },
                    };
                    newElements.push(element);
                    break;

                  case "div":
                  case "section":
                  case "article":
                  case "header":
                  case "footer":
                  case "nav":
                  case "main":
                    // Only add containers if they have direct text content (no children elements)
                    if (node.children.length === 0 && node.textContent.trim()) {
                      element = {
                        id,
                        type: "text",
                        style: computedStyle,
                        props: {
                          text: node.textContent,
                          htmlTag: tagName,
                          className: node.className,
                        },
                      };
                      newElements.push(element);
                    }
                    break;
                }

                // Recursively process all children
                Array.from(node.children).forEach((child) => {
                  extractElements(child);
                });
              };

              // Extract all elements from body
              Array.from(doc.body.children).forEach((node) => {
                extractElements(node);
              });

              // Store extracted CSS in liquidMetadata for reference
              const extractedCSS = Object.entries(cssRules)
                .map(([selector, styles]) => {
                  const styleStr = Object.entries(styles)
                    .map(([key, value]) => {
                      const kebabKey = key
                        .replace(/([A-Z])/g, "-$1")
                        .toLowerCase();
                      return `  ${kebabKey}: ${value};`;
                    })
                    .join("\n");
                  return `${selector} {\n${styleStr}\n}`;
                })
                .join("\n\n");

              setLiquidMetadata((prev) => ({
                ...prev,
                extractedCSS,
              }));

              // Replace the liquid-section with parsed elements
              setElements((prevElements) => {
                const replaceElement = (items) => {
                  return items
                    .map((item) => {
                      if (item.id === elementId) {
                        return newElements;
                      }
                      if (item.children) {
                        return {
                          ...item,
                          children: replaceElement(item.children),
                        };
                      }
                      return item;
                    })
                    .flat();
                };
                return replaceElement(prevElements);
              });

              setSelectedElement(null);
              alert(
                `✅ Converted to ${newElements.length} editable elements!\n\nExtracted CSS saved to Properties panel.`,
              );
            }
          }}
        />
          )}


        </div>
      </div>

      {/* Navigator Modal */}
      <Navigator
        elements={elements}
        selectedElement={selectedElement}
        onSelectElement={setSelectedElement}
        onMoveElement={moveElementInNavigator}
        show={showNavigator}
        onClose={() => setShowNavigator(false)}
      />

      {/* Liquid Code Preview Modal */}
      {showLiquidModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
          onClick={() => setShowLiquidModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "1200px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "20px",
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
                💧 Exported Liquid Code
              </h2>
              <button
                onClick={() => setShowLiquidModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0 8px",
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div
              style={{
                padding: "20px",
                overflowY: "auto",
                flex: 1,
              }}
            >
              <pre
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "16px",
                  borderRadius: "4px",
                  overflow: "auto",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  margin: 0,
                  fontFamily: "Consolas, Monaco, 'Courier New', monospace",
                }}
              >
                {liquidCodePreview}
              </pre>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                data-id="liquid-modal--button--copy"
                onClick={() => {
                  navigator.clipboard.writeText(liquidCodePreview);
                  alert("Code copied to clipboard!");
                }}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#5c3a9e",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Copy to Clipboard
              </button>
              <button
                data-id="liquid-modal--button--download-zip"
                onClick={async () => {
                  try {
                    const { downloadWithAssets } = await import(
                      "@/app/_utils/downloadWithAssets.js"
                    );
                    const result = await downloadWithAssets(
                      liquidCodePreview,
                      elements,
                      liquidExportName,
                    );
                    if (result.success) {
                      alert(
                        `Package created!\n\n${result.message}\n\nThe ZIP file contains:\n- Liquid section file\n- ${result.assetCount} media asset(s)\n- Installation instructions`,
                      );
                    } else {
                      throw new Error(result.error);
                    }
                  } catch (err) {
                    alert("Error creating ZIP: " + err.message);
                  }
                }}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#2d7d46",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Download ZIP
              </button>
              <button
                data-id="liquid-modal--button--close"
                onClick={() => setShowLiquidModal(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f0f0f0",
                  color: "#333",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getDefaultProps = (type, columnConfig = null) => {
  switch (type) {
    case "heading":
      return { text: "New Heading", tag: "h2" };
    case "text":
      return { text: "Add your text here..." };
    case "image":
      return {
        src: "",
        alt: "",
      };
    case "video":
      return {
        src: "",
        alt: "",
        controls: true,
        autoplay: false,
        muted: false,
        loop: false,
      };
    case "icon":
      return {
        src: "",
        alt: "",
      };
    case "image-background":
      return {
        src: "/images/placeholder.svg",
        alt: "",
      };
    case "button":
      return { text: "Button Text", url: "" };
    case "container":
      return {};
    case "columns-1":
    case "columns-2":
    case "columns-3":
    case "columns-4":
    case "grid-2x2":
      return { columns: getColumnCount(type) };
    case "table":
      return {
        html: "<table>\n  <thead>\n    <tr>\n      <th>Header 1</th>\n      <th>Header 2</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Row 1 Cell 1</td>\n      <td>Row 1 Cell 2</td>\n    </tr>\n    <tr>\n      <td>Row 2 Cell 1</td>\n      <td>Row 2 Cell 2</td>\n    </tr>\n  </tbody>\n</table>",
        tableCellPadding: "8px",
        tableBorderWidth: "1px",
        tableBorderColor: "#dddddd",
        headerColor: "#f5f5f5",
        headerTextColor: "#333333",
        stripedRows: false,
        hoverHighlight: false,
      };
    case "unordered-list":
      return {
        html: "<ul>\n  <li>First item</li>\n  <li>Second item</li>\n  <li>Third item</li>\n</ul>",
      };
    case "ordered-list":
    case "list":
      return {
        html: "<ol>\n  <li>First item</li>\n  <li>Second item</li>\n  <li>Third item</li>\n</ol>",
      };
    case "flip-card":
      return {
        frontImage: "",
        frontTitle: "Front Side",
        frontContent: "Hover to flip",
        backTitle: "Back Side",
        backContent: "Hidden content",
        backButtonText: "Button",
        backButtonUrl: "",
        flipDirection: "horizontal",
      };
    case "before-after":
      return {
        beforeImage: "",
        afterImage: "",
        beforeLabel: "",
        afterLabel: "",
        startPosition: "50",
      };
    case "marquee":
      return {
        text: "🔥  Free shipping on orders over $50 • New arrivals • Limited time •",
        speed: "10",
        pauseOnHover: false,
        direction: "left",
      };
    case "blog-post":
      return {
        postCount: "3",
        showImage: true,
        showExcerpt: true,
        showDate: true,
        showAuthor: false,
        showReadMore: true,
        readMoreText: "Read more",
      };
    case "image-gallery":
      return {
        imageCount: 2,
        image_1: "/images/placeholder.svg",
        image_2: "/images/placeholder.svg",
        image_3: "/images/placeholder.svg",
        image_4: "/images/placeholder.svg",
        image_5: "/images/placeholder.svg",
        image_6: "/images/placeholder.svg",
        image_7: "/images/placeholder.svg",
        image_8: "/images/placeholder.svg",
        image_9: "/images/placeholder.svg",
        image_10: "/images/placeholder.svg",
        image_11: "/images/placeholder.svg",
        image_12: "/images/placeholder.svg",
      };
    case "popup":
      return {
        triggerText: "Open Popup",
        popupTitle: "Special Offer!",
        popupContent: "Sign up for our newsletter and get 10% off your first order.",
        showEmailField: true,
        emailPlaceholder: "Enter your email",
        submitText: "Subscribe",
      };
    case "form":
      return {
        formAction: "#",
        showName: true,
        showEmail: true,
        showPhone: true,
        showMessage: true,
        submitText: "Submit",
        namePlaceholder: "Name",
        emailPlaceholder: "Email",
        phonePlaceholder: "Phone",
        messagePlaceholder: "Message",
      };
    case "slideshow":
      return {
        slideCount: 3,
        slideImage_1: "",
        slideHeading_1: "Heading 1",
        slideText_1: "Description 1",
        slideImage_2: "",
        slideHeading_2: "Heading 2",
        slideText_2: "Description 2",
        slideImage_3: "",
        slideHeading_3: "Heading 3",
        slideText_3: "Description 3",
        slideImage_4: "",
        slideImage_5: "",
        slideImage_6: "",
        showArrows: true,
        showDots: true,
      };
    case "countdown": {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 14);
      return {
        targetDate: futureDate.toISOString().split('.')[0],
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
      };
    }
    case "accordion":
      return {
        itemCount: 3,
        panelTitle_1: "Question 1",
        panelContent_1: "Answer 1",
        panelTitle_2: "Question 2",
        panelContent_2: "Answer 2",
        panelTitle_3: "Question 3",
        panelContent_3: "Answer 3",
      };
    case "tabs":
      return {
        tabCount: 3,
        tabLabel_1: "Tab 1",
        tabContent_1: "Content for Tab 1",
        tabLabel_2: "Tab 2",
        tabContent_2: "Content for Tab 2",
        tabLabel_3: "Tab 3",
        tabContent_3: "Content for Tab 3",
      };
    case "product-card":
      return {
        showImage: true,
        showTitle: true,
        showPrice: true,
        showButton: true,
        buttonText: "Add to Cart",
      };
    case "product-grid":
      return {
        columns: "3",
        rows: "2",
        showPrice: true,
        showButton: true,
        buttonText: "Add to Cart",
      };
    case "collection-list":
      return {
        columns: "3",
        showImage: true,
        showTitle: true,
        showCount: false,
      };
    case "spacer":
      return {}; // Spacer doesn't have content props, only style props
    default:
      return {};
  }
};

const getDefaultStyle = (type) => {
  switch (type) {
    case "heading":
      return {
        fontFamily: "inherit",
        fontSize: "25px",
        fontWeight: "700",
        textAlign: "center",
        color: "#000000",
        letterSpacing: "0",
        marginTop: "0",
        marginBottom: "0",
        marginLeft: "0",
        marginRight: "0",
        paddingTop: "0",
        paddingBottom: "0",
        paddingLeft: "0",
        paddingRight: "0",
        lineHeight: "1.2",
      };
    case "text":
      return { fontSize: "16px", textAlign: "center", color: "#000000", marginTop: "0", marginBottom: "0", marginLeft: "0", marginRight: "0", paddingTop: "0", paddingBottom: "0", paddingLeft: "0", paddingRight: "0", lineHeight: "1", fontFamily: "inherit", letterSpacing: "0" };
    case "image":
      return { width: "100%", height: "100%", marginTop: "0", marginBottom: "0", marginLeft: "0", marginRight: "0" };
    case "video":
      return { width: "100%", height: "100%", marginTop: "0", marginBottom: "0", marginLeft: "0", marginRight: "0" };
    case "icon":
      return {
        iconSize: "48px",
        marginTop: "0",
        marginBottom: "0",
        marginLeft: "0",
        marginRight: "0",
      };
    case "image-background":
      return {
        paddingTop: "0",
        paddingBottom: "0",
        paddingLeft: "0",
        paddingRight: "0",
        height: "400px",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        alignItems: "center",
        justifyContent: "center",
      };
    case "button":
      return {
        fontFamily: "inherit",
        fontSize: "14px",
        paddingTop: "12px",
        paddingBottom: "12px",
        paddingLeft: "24px",
        paddingRight: "24px",
        backgroundColor: "#0066cc",
        color: "#ffffff",
        borderWidth: "0px",
        borderRadius: "4px",
        marginTop: "0",
        marginBottom: "0",
        marginLeft: "0",
        marginRight: "0",
      };
    case "container":
      return {
        marginTop: "0",
        marginBottom: "0",
        marginLeft: "0",
        marginRight: "0",
        paddingTop: "0",
        paddingBottom: "0",
        paddingLeft: "0",
        paddingRight: "0",
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        flexDirection: "column",
      };
    case "spacer":
      return {
        height: "40px",
        width: "100%",
      };
    case "flip-card":
      return {
        cardAspectRatio: "1/1",
        fontFamily: "inherit",
        titleFontSize: "20px",
        fontSize: "16px",
        frontBackgroundColor: "#ffffff",
        frontColor: "#000000",
        backBackgroundColor: "#000000",
        backColor: "#ffffff",
        buttonBackgroundColor: "#ffffff",
        buttonColor: "#000000",
        borderRadius: "12px",
        marginTop: "10px",
        marginBottom: "10px",
        marginLeft: "10px",
        marginRight: "10px",
      };
    case "before-after":
      return {
        height: "400px",
        sliderColor: "#d3d3d3",
        marginTop: "0",
        marginBottom: "0",
        marginLeft: "0",
        marginRight: "0",
      };
    case "marquee":
      return {
        fontFamily: "inherit",
        fontSize: "22px",
        color: "#ffffff",
        backgroundColor: "#000000",
        marginTop: "0",
        marginBottom: "0",
      };
    case "blog-post":
      return {
        columns: "3",
        fontFamily: "inherit",
        titleFontSize: "20px",
        fontSize: "16px",
        color: "#000000",
        backgroundColor: "#ffffff",
        linkColor: "#000000",
        borderRadius: "10px",
        paddingTop: "20px",
        paddingBottom: "20px",
        paddingLeft: "20px",
        paddingRight: "20px",
        gap: "24px",
      };
    case "product-card":
      return {
        backgroundColor: "#ffffff",
        color: "#000000",
        buttonColor: "#ffffff",
        buttonBackgroundColor: "#000000",
        titleTextAlign: "center",
        priceTextAlign: "center",
        width: "100%",
        maxWidth: "100%",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingLeft: "10px",
        paddingRight: "10px",
        buttonBorderRadius: "4px",
      };
    case "product-grid":
      return {
        gap: "20px",
        backgroundColor: "#ffffff",
        color: "#000000",
        titleTextAlign: "center",
        priceTextAlign: "center",
        buttonColor: "#ffffff",
        buttonBackgroundColor: "#000000",
        paddingTop: "12px",
        paddingBottom: "12px",
        paddingLeft: "12px",
        paddingRight: "12px",
      };
    case "collection-list":
      return {
        gap: "20px",
        backgroundColor: "#ffffff",
        color: "#000000",
        paddingTop: "12px",
        paddingBottom: "12px",
        paddingLeft: "12px",
        paddingRight: "12px",
      };
    case "image-gallery":
      return {
        columns: "3",
        gap: "8px",
        aspectRatio: "auto",
      };
    case "list":
    case "unordered-list":
      return {
        fontSize: "14px",
        color: "#000000",
        lineHeight: "1.5",
        marginTop: "0",
        marginBottom: "0",
        marginLeft: "0",
        marginRight: "0",
      };
    case "table":
      return {
        fontFamily: "inherit",
        fontSize: "14px",
        textAlign: "center",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#d3d3d3",
        tableCellPadding: "8px",
        tableBorderWidth: "1px",
        tableBorderColor: "#dddddd",
        headerColor: "#f5f5f5",
        headerTextColor: "#333333",
      };
    case "popup":
      return {
        fontFamily: "inherit",
        fontSize: "16px",
        titleFontSize: "25px",
        triggerButtonColor: "#ffffff",
        triggerButtonBg: "#000000",
        buttonBackgroundColor: "#000000",
        buttonColor: "#ffffff",
        color: "#191919",
        backgroundColor: "#ffffff",
        overlayColor: "#d3d3d3",
        borderRadius: "12px",
        width: "480px",
        paddingTop: "32px",
        paddingBottom: "32px",
        paddingLeft: "32px",
        paddingRight: "32px",
      };
    case "form":
      return {
        fontFamily: "inherit",
        fontSize: "16px",
        color: "#454545",
        buttonColor: "#ffffff",
        buttonBackgroundColor: "#000000",
        buttonBorderRadius: "4px",
        buttonBorderColor: "#000000",
        buttonHoverBorderColor: "#000000",
        gap: "15px",
        marginTop: "0",
        marginBottom: "0",
        marginLeft: "0",
        marginRight: "0",
        paddingTop: "0",
        paddingBottom: "0",
        paddingLeft: "20px",
        paddingRight: "20px",
      };
    case "slideshow":
      return {
        height: "400px",
        slideBackgroundColor: "#f0f0f0",
        arrowColor: "#ffffff",
        dotColor: "#FFF8E1",
        dotActiveColor: "#ffffff",
        headingFontFamily: "inherit",
        headingFontSize: "30px",
        headingFontWeight: "700",
        textFontFamily: "inherit",
        textFontSize: "16px",
      };
    case "tabs":
      return {
        tabFontFamily: "inherit",
        tabFontSize: "16px",
        tabFontWeight: "500",
        contentFontSize: "15px",
        tabBackgroundColor: "#f1eff2",
        tabActiveBackgroundColor: "#ffffff",
        tabColor: "#454545",
        tabActiveColor: "#454545",
        contentBackgroundColor: "#ffffff",
        borderColor: "#d3d3d3",
      };
    case "accordion":
      return {
        titleFontFamily: "inherit",
        titleFontSize: "16px",
        titleFontWeight: "600",
        contentFontSize: "15px",
        titleColor: "#454545",
        titleBackgroundColor: "#f8f9fb",
        contentBackgroundColor: "#ffffff",
        gap: "10px",
        borderColor: "#d3d3d3",
        borderRadius: "10px",
        paddingTop: "0",
        paddingBottom: "0",
        paddingLeft: "10px",
        paddingRight: "10px",
      };
    case "divider":
      return {
        borderWidth: "1px",
        borderColor: "#e0e0e0",
        width: "100%",
        marginTop: "20px",
        marginBottom: "20px",
        marginLeft: "0",
        marginRight: "0",
      };
    case "map":
      return {
        height: "400px",
      };
    case "countdown":
      return {
        backgroundColor: "#ffffff",
        digitFontFamily: "inherit",
        digitColor: "#000000",
        labelColor: "#000000",
        digitFontSize: "40px",
        labelFontSize: "12px",
        separatorStyle: "colon",
      };
    default:
      return {};
  }
};

const getDefaultSchemaToggles = (type) => {
  // REVOLUTIONARY APPROACH: Maximum flexibility for merchants
  // Build it perfect in Blockify Builder, tweak it easy in Shopify - NO DEVELOPERS NEEDED!
  // These properties will be pre-ticked in PropertyPanel AND exported to schema
  const defaults = {
    image: {
      // Content
      src: true,
      alt: true,
      // Sizing
      width: true,
      height: true,
      // Spacing
      marginTop: true,
      marginBottom: true,
      marginLeft: true,
      marginRight: true,
    },
    icon: {
      // Content
      src: true,
      alt: true,
      // Sizing
      iconSize: true,
      // Spacing
      marginTop: true,
      marginBottom: true,
      marginLeft: true,
      marginRight: true,
    },
    "image-background": {
      src: true,
      alt: true,
      backgroundSize: true,
      backgroundPosition: true,
      backgroundRepeat: true,
      paddingTop: true,
      paddingBottom: true,
      paddingLeft: true,
      paddingRight: true,
      height: true,
      alignItems: true,
      justifyContent: true,
    },
    heading: {
      // Content
      text: true,
      tag: true,
      // Typography
      fontFamily: true,
      fontSize: true,
      fontWeight: true,
      textAlign: true,
      color: true,
      lineHeight: true,
      letterSpacing: true,
      // Spacing
      marginTop: true,
      marginBottom: true,
      marginLeft: true,
      marginRight: true,
      paddingTop: true,
      paddingBottom: true,
      paddingLeft: true,
      paddingRight: true,
    },
    text: {
      // Content
      text: true,
      // Typography
      fontSize: true,
      fontWeight: true,
      textAlign: true,
      color: true,
      lineHeight: true,
      fontFamily: true,
      letterSpacing: true,
      // Spacing
      marginTop: true,
      marginBottom: true,
      marginLeft: true,
      marginRight: true,
      paddingTop: true,
      paddingBottom: true,
      paddingLeft: true,
      paddingRight: true,
    },
    button: {
      // Content
      text: true,
      url: true,
      // Colors
      backgroundColor: true,
      color: true,
      // Typography
      fontWeight: true,
      // Sizing & spacing
      paddingTop: true,
      paddingBottom: true,
      paddingLeft: true,
      paddingRight: true,
      marginTop: true,
      marginBottom: true,
      marginLeft: true,
      marginRight: true,
      fontFamily: true,
      fontSize: true,
      // Visual
      borderWidth: true,
      borderRadius: true,
    },
    container: {
      // Spacing
      paddingTop: true,
      paddingBottom: true,
      paddingLeft: true,
      paddingRight: true,
      marginTop: true,
      marginBottom: true,
      marginLeft: true,
      marginRight: true,
      // Layout
      height: true,
      width: true,
      maxWidth: true,
      flexDirection: true,
    },
    column: {
      flexDirection: true,
      alignItems: true,
      justifyContent: true,
    },
    "columns-1": {
    },
    "columns-2": {
    },
    "columns-3": {
    },
    "columns-4": {
    },
    "columns-5": {
    },
    "columns-6": {
    },
    "grid-2x2": {
      flexDirection: true,
      gap: true,
      alignItems: true,
      justifyContent: true,
    },
    "product-card": {
      showImage: true,
      showTitle: true,
      showPrice: true,
      showButton: true,
      buttonText: true,
      backgroundColor: true,
      color: true,
      buttonColor: true,
      buttonBackgroundColor: true,
      titleTextAlign: true,
      priceTextAlign: true,
      width: true,
      maxWidth: true,
      paddingTop: true,
      paddingBottom: true,
      paddingLeft: true,
      paddingRight: true,
      buttonBorderRadius: true,
    },
    "product-grid": {
      columns: true,
      rows: true,
      showPrice: true,
      showButton: true,
      buttonText: true,
      gap: true,
      backgroundColor: true,
      color: true,
      titleTextAlign: true,
      priceTextAlign: true,
      buttonColor: true,
      buttonBackgroundColor: true,
      paddingTop: true,
      paddingBottom: true,
      paddingLeft: true,
      paddingRight: true,
    },
    "collection-list": {
      columns: true,
      showImage: true,
      showTitle: true,
      showCount: true,
      gap: true,
      backgroundColor: true,
      color: true,
      paddingTop: true,
      paddingBottom: true,
      paddingLeft: true,
      paddingRight: true,
    },
    divider: {
      borderWidth: true,
      borderColor: true,
      width: true,
      marginTop: true,
      marginBottom: true,
      marginLeft: true,
      marginRight: true,
    },
    accordion: {
      itemCount: true,
      panelTitle_1: true,
      panelContent_1: true,
      panelTitle_2: true,
      panelContent_2: true,
      panelTitle_3: true,
      panelContent_3: true,
      titleFontFamily: true,
      titleFontSize: true,
      titleFontWeight: true,
      contentFontSize: true,
      titleColor: true,
      titleBackgroundColor: true,
      contentBackgroundColor: true,
      gap: true,
      borderColor: true,
      borderRadius: true,
      paddingTop: true,
      paddingBottom: true,
      paddingLeft: true,
      paddingRight: true,
    },
    tabs: {
      tabCount: true,
      tabLabel_1: true,
      tabContent_1: true,
      tabLabel_2: true,
      tabContent_2: true,
      tabLabel_3: true,
      tabContent_3: true,
      tabFontFamily: true,
      tabFontSize: true,
      tabFontWeight: true,
      contentFontSize: true,
      tabBackgroundColor: true,
      tabActiveBackgroundColor: true,
      tabColor: true,
      tabActiveColor: true,
      contentBackgroundColor: true,
      borderColor: true,
    },
    countdown: {
      targetDate: true,
      showDays: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      backgroundColor: true,
      digitFontFamily: true,
      digitColor: true,
      labelColor: true,
      digitFontSize: true,
      labelFontSize: true,
      separatorStyle: true,
    },
    slideshow: {
      slideCount: true,
      slideImage_1: true,
      slideHeading_1: true,
      slideText_1: true,
      slideImage_2: true,
      slideHeading_2: true,
      slideText_2: true,
      slideImage_3: true,
      slideHeading_3: true,
      slideText_3: true,
      slideImage_4: true,
      slideImage_5: true,
      slideImage_6: true,
      showArrows: true,
      showDots: true,
      height: true,
      slideBackgroundColor: true,
      arrowColor: true,
      dotColor: true,
      dotActiveColor: true,
      headingFontFamily: true,
      headingFontSize: true,
      headingFontWeight: true,
      textFontFamily: true,
      textFontSize: true,
    },
    spacer: {
      height: true,
      width: true,
    },
    "image-gallery": {
      imageCount: true,
      image_1: true,
      image_2: true,
      columns: true,
      gap: true,
      aspectRatio: true,
    },
    form: {
      formAction: true,
      showName: true,
      showEmail: true,
      showPhone: true,
      showMessage: true,
      submitText: true,
      namePlaceholder: true,
      emailPlaceholder: true,
      phonePlaceholder: true,
      messagePlaceholder: true,
      fontFamily: true,
      fontSize: true,
      color: true,
      buttonColor: true,
      buttonBackgroundColor: true,
      buttonBorderRadius: true,
      buttonBorderColor: true,
      buttonHoverBorderColor: true,
      gap: true,
      marginTop: true,
      marginBottom: true,
      marginLeft: true,
      marginRight: true,
      paddingTop: true,
      paddingBottom: true,
      paddingLeft: true,
      paddingRight: true,
    },
    popup: {
      triggerText: true,
      popupTitle: true,
      popupContent: true,
      showEmailField: true,
      emailPlaceholder: true,
      submitText: true,
      fontFamily: true,
      fontSize: true,
      titleFontSize: true,
      triggerButtonColor: true,
      triggerButtonBg: true,
      buttonBackgroundColor: true,
      buttonColor: true,
      color: true,
      backgroundColor: true,
      overlayColor: true,
      borderRadius: true,
      width: true,
      paddingTop: true,
      paddingBottom: true,
      paddingLeft: true,
      paddingRight: true,
    },
    "flip-card": {
      frontImage: true,
      frontTitle: true,
      frontContent: true,
      backTitle: true,
      backContent: true,
      backButtonText: true,
      backButtonUrl: true,
      flipDirection: true,
      cardAspectRatio: true,
      fontFamily: true,
      titleFontSize: true,
      fontSize: true,
      frontBackgroundColor: true,
      frontColor: true,
      backBackgroundColor: true,
      backColor: true,
      buttonBackgroundColor: true,
      buttonColor: true,
      borderRadius: true,
      marginTop: true,
      marginBottom: true,
      marginLeft: true,
      marginRight: true,
    },
    "before-after": {
      beforeImage: true,
      afterImage: true,
      beforeLabel: true,
      afterLabel: true,
      startPosition: true,
      height: true,
      sliderColor: true,
      marginTop: true,
      marginBottom: true,
      marginLeft: true,
      marginRight: true,
    },
    table: {
      html: true,
      tableCellPadding: true,
      tableBorderWidth: true,
      tableBorderColor: true,
      headerColor: true,
      headerTextColor: true,
      stripedRows: true,
      hoverHighlight: true,
      fontFamily: true,
      fontSize: true,
      textAlign: true,
      borderWidth: true,
      borderStyle: true,
      borderColor: true,
    },
    map: {
      height: true,
    },
    marquee: {
      text: true,
      speed: true,
      pauseOnHover: true,
      direction: true,
      fontFamily: true,
      fontSize: true,
      color: true,
      backgroundColor: true,
      marginTop: true,
      marginBottom: true,
    },
    "blog-post": {
      postCount: true,
      showImage: true,
      showExcerpt: true,
      showDate: true,
      showAuthor: true,
      showReadMore: true,
      readMoreText: true,
      columns: true,
      fontFamily: true,
      titleFontSize: true,
      fontSize: true,
      color: true,
      backgroundColor: true,
      linkColor: true,
      borderRadius: true,
      gap: true,
      paddingTop: true,
      paddingBottom: true,
      paddingLeft: true,
      paddingRight: true,
    },
    video: {
      src: true,
      alt: true,
      controls: true,
      autoplay: true,
      muted: true,
      loop: true,
      width: true,
      height: true,
      marginTop: true,
      marginBottom: true,
      marginLeft: true,
      marginRight: true,
    },
    list: {
      html: true,
      fontSize: true,
      color: true,
      lineHeight: true,
      marginTop: true,
      marginBottom: true,
      marginLeft: true,
      marginRight: true,
    },
    "unordered-list": {
      html: true,
      fontSize: true,
      color: true,
      lineHeight: true,
      marginTop: true,
      marginBottom: true,
      marginLeft: true,
      marginRight: true,
    },
  };

  return defaults[type] || {};
};

// Helper function to find element by ID in nested structure
const findElementById = (elements, id) => {
  for (const element of elements) {
    if (element.id === id) {
      return element;
    }

    // Check children
    if (element.children && element.children.length > 0) {
      const found = findElementById(element.children, id);
      if (found) return found;
    }

    // Check columns
    if (element.columns && element.columns.length > 0) {
      for (const column of element.columns) {
        if (column) {
          const found = findElementById(column, id);
          if (found) return found;
        }
      }
    }
  }
  return null;
};

export { getDefaultStyle, getDefaultProps, getDefaultSchemaToggles };
export default BlockBuilder;
