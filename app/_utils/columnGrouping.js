/**
 * Column Auto-Grouping Utilities
 *
 * Handles automatic wrapping/unwrapping of column children
 * when alignment properties are set/cleared
 */

/**
 * Find which column (if any) contains a given element
 * @param {string} elementId - ID of the element to find
 * @param {Array} elements - Root elements array
 * @returns {Object|null} { parentElementId, columnIndex } or null
 */
export const findParentColumn = (elementId, elements) => {
  const searchRecursive = (els, parentId = null, colIndex = null) => {
    for (const el of els) {
      // Check if this element has columns
      if (el.columns && el.columns.length > 0) {
        for (let i = 0; i < el.columns.length; i++) {
          const column = el.columns[i];
          if (Array.isArray(column)) {
            // Check if element is directly in this column
            const found = column.find(child => child.id === elementId);
            if (found) {
              return { parentElementId: el.id, columnIndex: i };
            }

            // Check if element is nested inside a container in this column
            for (const child of column) {
              if (child.children && child.children.length > 0) {
                const nestedSearch = searchRecursive([child]);
                if (nestedSearch) {
                  // Element is nested, but we still want the top-level column
                  return { parentElementId: el.id, columnIndex: i };
                }
              }
            }
          }
        }
      }

      // Recursively search children
      if (el.children && el.children.length > 0) {
        const result = searchRecursive(el.children);
        if (result) return result;
      }
    }
    return null;
  };

  return searchRecursive(elements);
};

/**
 * Get alignment state for an element
 * @param {Object} element - The element to check
 * @param {Object} responsiveStyles - Global responsive styles
 * @param {string} breakpoint - Current breakpoint (xs, sm, md, lg, xl)
 * @returns {Object} { alignItems, justifyContent }
 */
export const getAlignmentState = (element, responsiveStyles, breakpoint) => {
  if (!element) return { alignItems: null, justifyContent: null };

  // Check responsive styles first
  const elementResponsiveStyles = responsiveStyles?.[element.id]?.[breakpoint] || {};
  const alignItems = elementResponsiveStyles.alignItems || element.style?.alignItems || null;
  const justifyContent = elementResponsiveStyles.justifyContent || element.style?.justifyContent || null;

  return { alignItems, justifyContent };
};

/**
 * Check if alignment is cleared (both are empty/null/undefined)
 * @param {string} alignItems - Align items value
 * @param {string} justifyContent - Justify content value
 * @returns {boolean} True if both are cleared
 */
export const isAlignmentCleared = (alignItems, justifyContent) => {
  const isEmpty = (value) => !value || value === '' || value === 'null' || value === 'undefined';
  return isEmpty(alignItems) && isEmpty(justifyContent);
};

/**
 * Check if a column should be wrapped based on alignment
 * @param {Object} element - The element to check
 * @param {Object} responsiveStyles - Global responsive styles
 * @param {string} breakpoint - Current breakpoint
 * @returns {boolean} True if column should be wrapped
 */
export const shouldWrapColumn = (element, responsiveStyles, breakpoint) => {
  if (!element) return false;

  const { alignItems, justifyContent } = getAlignmentState(element, responsiveStyles, breakpoint);
  return !isAlignmentCleared(alignItems, justifyContent);
};

/**
 * Check if a column is already wrapped (has a single container child wrapping all items)
 * @param {Object} element - The column element (from columns array)
 * @param {number} columnIndex - Index of the column to check
 * @returns {boolean} True if already wrapped
 */
export const isColumnWrapped = (element, columnIndex) => {
  if (!element || !element.columns || !element.columns[columnIndex]) {
    return false;
  }

  const columnChildren = element.columns[columnIndex];

  // Wrapped if:
  // 1. Column has exactly 1 child
  // 2. That child is a container
  // 3. Container has the auto-wrap marker (we'll add this)
  if (columnChildren.length === 1 && columnChildren[0].type === 'container') {
    // Check if this container was auto-created for grouping
    // We'll mark auto-created containers with a special prop
    return columnChildren[0].props?.autoGrouped === true;
  }

  return false;
};

/**
 * Get the wrapper container from a column (if it exists)
 * @param {Object} element - The parent element
 * @param {number} columnIndex - Index of the column
 * @returns {Object|null} The wrapper container or null
 */
export const getWrapperContainer = (element, columnIndex) => {
  if (!isColumnWrapped(element, columnIndex)) {
    return null;
  }
  return element.columns[columnIndex][0];
};

/**
 * Wrap column children in a container for positioning
 * @param {Array} elements - The elements array
 * @param {string} parentElementId - ID of the parent columns element
 * @param {number} columnIndex - Index of the column to wrap
 * @param {Function} generateId - Function to generate unique IDs (e.g., uuidv4)
 * @returns {Array} Updated elements array
 */
export const wrapColumnChildren = (elements, parentElementId, columnIndex, generateId) => {
  const wrapRecursive = (els) => {
    return els.map(el => {
      // Found the parent element
      if (el.id === parentElementId && el.columns && el.columns[columnIndex]) {
        const columnChildren = el.columns[columnIndex];

        // Don't wrap if already wrapped
        if (columnChildren.length === 1 && columnChildren[0].type === 'container' && columnChildren[0].props?.autoGrouped) {
          return el;
        }

        // Don't wrap empty columns
        if (columnChildren.length === 0) {
          return el;
        }

        // Create auto-grouped container
        const container = {
          id: generateId(),
          type: 'container',
          props: {
            autoGrouped: true // Mark as auto-created
          },
          style: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: '0',
            boxSizing: 'border-box',
            overflow: 'hidden'
          },
          children: columnChildren
        };

        // Replace column contents with the container
        const newColumns = [...el.columns];
        newColumns[columnIndex] = [container];

        return { ...el, columns: newColumns };
      }

      // Recursively process children
      if (el.children && el.children.length > 0) {
        return { ...el, children: wrapRecursive(el.children) };
      }

      // Recursively process columns
      if (el.columns && el.columns.length > 0) {
        const newColumns = el.columns.map(column =>
          column ? wrapRecursive(column) : column
        );
        return { ...el, columns: newColumns };
      }

      return el;
    });
  };

  return wrapRecursive(elements);
};

/**
 * Unwrap column children (extract from container)
 * @param {Array} elements - The elements array
 * @param {string} parentElementId - ID of the parent columns element
 * @param {number} columnIndex - Index of the column to unwrap
 * @returns {Array} Updated elements array
 */
export const unwrapColumnChildren = (elements, parentElementId, columnIndex) => {
  const unwrapRecursive = (els) => {
    return els.map(el => {
      // Found the parent element
      if (el.id === parentElementId && el.columns && el.columns[columnIndex]) {
        const columnChildren = el.columns[columnIndex];

        // Check if wrapped
        if (columnChildren.length === 1 &&
            columnChildren[0].type === 'container' &&
            columnChildren[0].props?.autoGrouped === true) {
          // Extract children from container
          const newColumns = [...el.columns];
          newColumns[columnIndex] = columnChildren[0].children || [];

          return { ...el, columns: newColumns };
        }

        return el;
      }

      // Recursively process children
      if (el.children && el.children.length > 0) {
        return { ...el, children: unwrapRecursive(el.children) };
      }

      // Recursively process columns
      if (el.columns && el.columns.length > 0) {
        const newColumns = el.columns.map(column =>
          column ? unwrapRecursive(column) : column
        );
        return { ...el, columns: newColumns };
      }

      return el;
    });
  };

  return unwrapRecursive(elements);
};
