/**
 * ID Generator for Shopify Liquid Settings
 *
 * Generates short, unique setting IDs using timestamp + counter pattern
 * Similar to main branch but optimized for our schema toggle system
 */

// Session variables for ID generation
let idCounter = 0;
let sessionTimestamp = '';
let idMap = {}; // Store mapping of element IDs to setting IDs

/**
 * Initialize or reset the ID generator for a new conversion
 */
export const resetIdGenerator = () => {
  idCounter = 0;
  sessionTimestamp = Date.now().toString(36); // Base36 for shorter string
  idMap = {};
};

/**
 * Generate a unique setting ID for an element property
 *
 * @param {string} elementId - The element's UUID
 * @param {string} propertyName - The property name (e.g., 'text', 'fontSize', 'src')
 * @param {string} breakpoint - Optional breakpoint ('mobile', 'desktop', 'fullscreen')
 * @returns {string} A short, unique setting ID
 */
export const generateSettingId = (elementId, propertyName, breakpoint = null) => {
  // Create a unique key for this combination
  const key = `${elementId}_${propertyName}${breakpoint ? `_${breakpoint}` : ''}`;

  // Check if we've already created an ID for this combination
  if (idMap[key]) {
    return idMap[key];
  }

  // Create a new ID using timestamp and counter
  const counter = (idCounter++).toString(36).padStart(2, '0');

  // Build the suffix based on property and breakpoint
  let suffix = propertyName;
  if (breakpoint) {
    suffix = `${propertyName}_${breakpoint}`;
  }

  // Create the setting ID
  const settingId = `s_${sessionTimestamp}_${counter}_${suffix}`;

  // Store in map for reuse
  idMap[key] = settingId;

  return settingId;
};

/**
 * Get a setting ID if it already exists, without creating a new one
 */
export const getExistingSettingId = (elementId, propertyName, breakpoint = null) => {
  const key = `${elementId}_${propertyName}${breakpoint ? `_${breakpoint}` : ''}`;
  return idMap[key] || null;
};

/**
 * Initialize on module load
 */
resetIdGenerator();