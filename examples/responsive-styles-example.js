// Example usage of the Responsive Styles System
// This demonstrates how to use the API to set responsive styles for elements

const baseUrl = 'http://localhost:3000';

// Example 1: Set responsive styles for a container element
async function setContainerStyles() {
  const elementId = 'test2-container';

  const styles = {
    xs: {
      padding: '10px',
      maxWidth: '100%'
    },
    sm: {
      padding: '15px',
      maxWidth: '100%'
    },
    md: {
      padding: '20px',
      maxWidth: '720px'
    },
    lg: {
      padding: '30px',
      maxWidth: '960px'
    },
    xl: {
      padding: '40px',
      maxWidth: '1200px'
    }
  };

  const response = await fetch(`${baseUrl}/api/responsive-styles/set`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ elementId, styles })
  });

  return response.json();
}

// Example 2: Set responsive styles for column layout
async function setColumnStyles() {
  const elementId = 'test2-columns';

  const styles = {
    xs: {
      display: 'flex',
      flexDirection: 'column',  // Stack on mobile
      gap: '10px'
    },
    sm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    md: {
      display: 'flex',
      flexDirection: 'row',     // Row on tablet and up
      gap: '20px'
    },
    lg: {
      display: 'flex',
      flexDirection: 'row',
      gap: '25px'
    },
    xl: {
      display: 'flex',
      flexDirection: 'row',
      gap: '30px'
    }
  };

  const response = await fetch(`${baseUrl}/api/responsive-styles/set`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ elementId, styles })
  });

  return response.json();
}

// Example 3: Set styles for individual columns
async function setIndividualColumnStyles() {
  const columnStyles = {
    xs: {
      flex: '1',
      padding: '10px',
      width: '100%'
    },
    sm: {
      flex: '1',
      padding: '15px',
      width: '100%'
    },
    md: {
      flex: '1',
      padding: '20px',
      width: 'auto'
    },
    lg: {
      flex: '1',
      padding: '25px',
      width: 'auto'
    },
    xl: {
      flex: '1',
      padding: '30px',
      width: 'auto'
    }
  };

  // Set for all three columns
  const columns = ['test2-column-1', 'test2-column-2', 'test2-column-3'];

  for (const elementId of columns) {
    await fetch(`${baseUrl}/api/responsive-styles/set`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ elementId, styles: columnStyles })
    });
  }

  return { success: true, columns };
}

// Example 4: Update only one breakpoint
async function updateSingleBreakpoint() {
  const elementId = 'test2-container';
  const breakpoint = 'xs';
  const styles = {
    padding: '5px',
    backgroundColor: '#f0f0f0'
  };

  const response = await fetch(`${baseUrl}/api/responsive-styles/update-breakpoint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ elementId, breakpoint, styles })
  });

  return response.json();
}

// Example 5: Get all registered styles
async function getAllStyles() {
  const response = await fetch(`${baseUrl}/api/responsive-styles/all`);
  return response.json();
}

// Example 6: Preview CSS for an element
async function previewElementCSS(elementId) {
  const response = await fetch(`${baseUrl}/api/responsive-styles/preview-css/${elementId}`);
  return response.text();
}

// Example 7: Generate all CSS
async function generateAllCSS() {
  const response = await fetch(`${baseUrl}/api/responsive-styles/generate-all-css`);
  return response.text();
}

// Example 8: Export styles to JSON (for backup or transfer)
async function exportStyles() {
  const response = await fetch(`${baseUrl}/api/responsive-styles/export`);
  return response.json();
}

// Example 9: Import styles from JSON
async function importStyles(stylesData) {
  const response = await fetch(`${baseUrl}/api/responsive-styles/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ styles: stylesData })
  });

  return response.json();
}

// Run all setup examples
async function setupAllStyles() {
  console.log('Setting up responsive styles...');

  await setContainerStyles();
  console.log('✓ Container styles set');

  await setColumnStyles();
  console.log('✓ Column layout styles set');

  await setIndividualColumnStyles();
  console.log('✓ Individual column styles set');

  const allStyles = await getAllStyles();
  console.log('✓ All styles registered:', allStyles);

  const css = await generateAllCSS();
  console.log('✓ Generated CSS:\n', css);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setContainerStyles,
    setColumnStyles,
    setIndividualColumnStyles,
    updateSingleBreakpoint,
    getAllStyles,
    previewElementCSS,
    generateAllCSS,
    exportStyles,
    importStyles,
    setupAllStyles
  };
}