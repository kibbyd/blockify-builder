/**
 * PropertyPanel - New Version (Element Definitions Driven)
 *
 * Uses element definitions as single source of truth
 * Implements toggle system for schema control
 */

"use client";
import React, { useState } from 'react';
import { elementDefinitions, getElementDef, getPropertyDef } from '@/app/_config/elementDefinitions';
import { PropertyControl } from '@/app/_components/PropertyControls';
import { ToggleableProperty, PropertyGroup } from '@/app/_components/ToggleableProperty';
import { Trash2, Smartphone, Monitor, Maximize2 } from 'lucide-react';
import IconPicker from '@/app/_components/IconPicker';

const PropertyPanel = ({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  breakpoint = 'md',
  responsiveStyles = {},
  onUpdateResponsiveStyle,
  onToggleColumnGrouping,
  elements = [],
  onConvertLiquidToHTML,
  liquidMetadata
}) => {
  // State for icon picker modal (must be at top level, not in loops)
  const [showIconPicker, setShowIconPicker] = useState(false);

  if (!selectedElement) {
    return (
      <div className="property-panel">
        <div className="no-selection">
          <p>Select an element to edit properties</p>
        </div>
      </div>
    );
  }

  // Get element definition
  const elementDef = getElementDef(selectedElement.type, selectedElement.fromTemplate);

  if (!elementDef) {
    return (
      <div className="property-panel">
        <div style={{ padding: '20px', color: '#f44336' }}>
          <p>Unknown element type: {selectedElement.type}</p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            This element type is not defined in elementDefinitions.js
          </p>
        </div>
      </div>
    );
  }

  // Map schema breakpoints to builder breakpoints for display
  const getSchemaBreakpoint = (builderBreakpoint) => {
    switch (builderBreakpoint) {
      case 'xs':
      case 'sm':
        return 'mobile';
      case 'xl':
        return 'fullscreen';
      default:
        return 'desktop';
    }
  };

  const schemaBreakpoint = getSchemaBreakpoint(breakpoint);

  // Note: breakpoint from parent is the builder breakpoint (xs, sm, md, lg, xl)
  // We use this directly for updating global responsiveStyles

  // Update content prop
  const updateProp = (propName, value) => {
    const updates = {
      props: { ...selectedElement.props, [propName]: value }
    };

    // Auto-enable/disable schema toggles for gallery image slots when imageCount changes
    if (propName === 'imageCount' && selectedElement.type === 'image-gallery') {
      const count = parseInt(value) || 4;
      const maxImages = 12;
      const newToggles = { ...selectedElement.schemaToggles };
      for (let i = 1; i <= maxImages; i++) {
        newToggles[`image_${i}`] = i <= count;
      }
      updates.schemaToggles = newToggles;
    }

    // Auto-enable/disable schema toggles for accordion panel slots when itemCount changes
    if (propName === 'itemCount' && selectedElement.type === 'accordion') {
      const count = parseInt(value) || 3;
      const maxItems = 15;
      const newToggles = { ...selectedElement.schemaToggles };
      for (let i = 1; i <= maxItems; i++) {
        newToggles[`panelTitle_${i}`] = i <= count;
        newToggles[`panelContent_${i}`] = i <= count;
      }
      updates.schemaToggles = newToggles;
    }

    // Auto-enable/disable schema toggles for tab slots when tabCount changes
    if (propName === 'tabCount' && selectedElement.type === 'tabs') {
      const count = parseInt(value) || 3;
      const maxTabs = 10;
      const newToggles = { ...selectedElement.schemaToggles };
      for (let i = 1; i <= maxTabs; i++) {
        newToggles[`tabLabel_${i}`] = i <= count;
        newToggles[`tabContent_${i}`] = i <= count;
      }
      updates.schemaToggles = newToggles;
    }

    // Auto-enable/disable schema toggles for slideshow slots when slideCount changes
    if (propName === 'slideCount' && selectedElement.type === 'slideshow') {
      const count = parseInt(value) || 3;
      const maxSlides = 6;
      const newToggles = { ...selectedElement.schemaToggles };
      for (let i = 1; i <= maxSlides; i++) {
        newToggles[`slideImage_${i}`] = i <= count;
        newToggles[`slideHeading_${i}`] = i <= count;
        newToggles[`slideText_${i}`] = i <= count;
      }
      updates.schemaToggles = newToggles;
    }

    onUpdateElement(selectedElement.id, updates);
  };

  // Update style prop
  const updateStyle = (styleName, value) => {
    // Update in element.style for non-responsive or base value
    onUpdateElement(selectedElement.id, {
      style: { ...selectedElement.style, [styleName]: value }
    });
  };

  // Update responsive style using global responsiveStyles state
  const updateResponsiveStyle = (styleName, value) => {
    // Use the onUpdateResponsiveStyle callback to update global responsiveStyles
    // This updates: responsiveStyles[elementId][breakpoint][styleName] = value
    console.log('[PropertyPanel] updateResponsiveStyle called:', {
      elementId: selectedElement.id,
      elementType: selectedElement.type,
      styleName,
      value,
      breakpoint
    });
    if (onUpdateResponsiveStyle) {
      onUpdateResponsiveStyle(selectedElement.id, styleName, value);
    }
  };

  // Toggle property on/off
  const handlePropertyToggle = (property, enabled) => {
    // Check if this is a column element
    const isColumnElement = selectedElement.id?.includes('-col-');

    if (enabled) {
      // Enable property - add to style or responsiveStyles
      if (property.responsive) {
        // Add to global responsiveStyles at current breakpoint
        // Use a sensible default if property.default is null
        let defaultValue = property.default;
        if (defaultValue === null || defaultValue === undefined) {
          // Provide sensible defaults based on property type
          if (property.name === 'fontSize') defaultValue = '16px';
          else if (property.name === 'lineHeight') defaultValue = '1.5';
          else if (property.name.startsWith('padding') || property.name.startsWith('margin')) defaultValue = '0px';
          else if (property.name === 'gap') defaultValue = '0px';
          else if (property.name === 'alignSelf') defaultValue = 'center';
          else if (property.name === 'marginVertical') defaultValue = 'center';
          else if (property.name === 'width') defaultValue = '25%';
          else if (property.controlType === 'color') defaultValue = '';
          else defaultValue = '0';
        }
        // Special case: Width should always default to 25% when toggled on (prevents squashing)
        else if (property.name === 'width') {
          defaultValue = '25%';
        }
        updateResponsiveStyle(property.name, defaultValue);

        // Automatically enable schema toggle for responsive properties
        if (property.canBeSchemaEditable && !selectedElement.schemaToggles?.[property.name]) {
          handleSchemaToggle(property.name, true);
        }
      } else {
        // For columns, we need to handle the update differently
        if (isColumnElement) {
          // Set a default value for backgroundColor if it's null
          let defaultValue = property.default;
          if (property.name === 'backgroundColor' && (defaultValue === null || defaultValue === undefined)) {
            defaultValue = '#f0f0f0'; // Light gray default for visibility
          }

          // Update column style
          const updates = {
            style: { ...selectedElement.style, [property.name]: defaultValue || '' }
          };

          // Auto-enable schema for columns
          if (property.canBeSchemaEditable && !selectedElement.schemaToggles?.[property.name]) {
            updates.schemaToggles = {
              ...selectedElement.schemaToggles,
              [property.name]: true
            };
          }

          // Cascade: enabling entranceAnimation also enables entranceDelay and entranceDuration
          if (property.name === 'entranceAnimation') {
            updates.style = {
              ...updates.style,
              entranceDelay: '0ms',
              entranceDuration: '0.5s',
            };
            updates.schemaToggles = {
              ...(updates.schemaToggles || selectedElement.schemaToggles),
              entranceDelay: true,
              entranceDuration: true,
            };
          }

          onUpdateElement(selectedElement.id, updates);
        } else {
          // Regular element update
          const updates = {
            style: { ...selectedElement.style, [property.name]: property.default || '' }
          };

          // Automatically enable schema toggle when property is enabled (if it can be schema-editable)
          if (property.canBeSchemaEditable && !selectedElement.schemaToggles?.[property.name]) {
            updates.schemaToggles = {
              ...selectedElement.schemaToggles,
              [property.name]: true
            };
          }

          // Cascade: enabling entranceAnimation also enables entranceDelay and entranceDuration
          if (property.name === 'entranceAnimation') {
            updates.style = {
              ...updates.style,
              entranceDelay: '0ms',
              entranceDuration: '0.5s',
            };
            updates.schemaToggles = {
              ...(updates.schemaToggles || selectedElement.schemaToggles),
              entranceDelay: true,
              entranceDuration: true,
            };
          }

          onUpdateElement(selectedElement.id, updates);
        }
      }
    } else {
      // Disable property - remove from style or responsiveStyles
      if (property.responsive) {
        // Clear from global responsiveStyles by setting to empty string
        // This effectively removes it from the current breakpoint
        if (onUpdateResponsiveStyle) {
          onUpdateResponsiveStyle(selectedElement.id, property.name, '');
        }

        // Clean up element.style and schema toggle in a single update
        const updates = {};
        if (selectedElement.style?.[property.name] !== undefined) {
          const { [property.name]: removed, ...restStyle } = selectedElement.style;
          updates.style = restStyle;
        }
        if (selectedElement.schemaToggles?.[property.name]) {
          updates.schemaToggles = {
            ...selectedElement.schemaToggles,
            [property.name]: false
          };
        }
        if (Object.keys(updates).length > 0) {
          onUpdateElement(selectedElement.id, updates);
        }
      } else {
        // For columns, we need to handle the removal differently
        if (isColumnElement) {
          // Remove from column style
          const { [property.name]: removed, ...restStyle } = selectedElement.style || {};
          const updates = {
            style: restStyle
          };

          console.log('[PropertyPanel] Disabling column property:', {
            propertyName: property.name,
            selectedElementId: selectedElement.id,
            currentStyle: selectedElement.style,
            restStyle: restStyle,
            updates: updates
          });

          // Also disable schema toggle when property is disabled
          if (selectedElement.schemaToggles?.[property.name]) {
            updates.schemaToggles = {
              ...selectedElement.schemaToggles,
              [property.name]: false
            };
          }

          // Cascade: disabling entranceAnimation also disables entranceDelay and entranceDuration
          if (property.name === 'entranceAnimation') {
            const { entranceDelay, entranceDuration, ...cleanStyle } = updates.style;
            updates.style = cleanStyle;
            updates.schemaToggles = {
              ...(updates.schemaToggles || selectedElement.schemaToggles),
              entranceDelay: false,
              entranceDuration: false,
            };
          }

          onUpdateElement(selectedElement.id, updates);
        } else {
          // Regular element removal
          const { [property.name]: removed, ...restStyle } = selectedElement.style || {};
          const updates = {
            style: restStyle
          };

          // Also disable schema toggle when property is disabled
          if (selectedElement.schemaToggles?.[property.name]) {
            updates.schemaToggles = {
              ...selectedElement.schemaToggles,
              [property.name]: false
            };
          }

          // Cascade: disabling entranceAnimation also disables entranceDelay and entranceDuration
          if (property.name === 'entranceAnimation') {
            const { entranceDelay, entranceDuration, ...cleanStyle } = updates.style;
            updates.style = cleanStyle;
            updates.schemaToggles = {
              ...(updates.schemaToggles || selectedElement.schemaToggles),
              entranceDelay: false,
              entranceDuration: false,
            };
          }

          onUpdateElement(selectedElement.id, updates);
        }
      }
    }
  };

  // Toggle schema editability
  const handleSchemaToggle = (propertyName, enabled) => {
    onUpdateElement(selectedElement.id, {
      schemaToggles: {
        ...selectedElement.schemaToggles,
        [propertyName]: enabled
      }
    });
  };

  // Handle property value change
  const handlePropertyChange = (property, value) => {
    if (property.responsive) {
      updateResponsiveStyle(property.name, value);
    } else {
      // For content props, update props; for style props, update style
      const isContentProp = elementDef.contentProps?.find(p => p.name === property.name);
      if (isContentProp) {
        updateProp(property.name, value);
      } else {
        updateStyle(property.name, value);
      }
    }

  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this element?')) {
      onDeleteElement(selectedElement.id);
    }
  };

  // Helper: Check if column contains a video element
  const columnContainsVideo = (element) => {
    if (!element.columns) return false;
    return element.columns.some(column =>
      column.some(child => child.type === 'video')
    );
  };

  // Group style properties by category
  const groupedStyleProps = {};
  elementDef.styleProps?.forEach(prop => {
    // Skip height and minHeight properties if this is a column with videos inside
    const isColumnType = selectedElement.type.startsWith('columns-');
    if ((prop.name === 'height' || prop.name === 'minHeight') && isColumnType && columnContainsVideo(selectedElement)) {
      return;
    }

    // Hide dependent properties when their parent isn't active
    // Video opacity only when a background video URL is set
    if (prop.name === 'backgroundVideoOpacity' && !selectedElement.props?.backgroundVideo) {
      return;
    }
    // Entrance animations don't belong on spacer/divider
    if ((prop.name === 'entranceAnimation' || prop.name === 'entranceDelay' || prop.name === 'entranceDuration') &&
        (selectedElement.type === 'spacer' || selectedElement.type === 'divider')) {
      return;
    }
    // Entrance delay/duration only when an animation is selected
    if ((prop.name === 'entranceDelay' || prop.name === 'entranceDuration') &&
        (!selectedElement.style?.entranceAnimation || selectedElement.style?.entranceAnimation === 'none')) {
      return;
    }

    const category = prop.category || 'other';
    if (!groupedStyleProps[category]) {
      groupedStyleProps[category] = [];
    }
    groupedStyleProps[category].push(prop);
  });

  return (
    <div className="property-panel">
      <div className="property-header" style={{ marginBottom: '10px' }}>
        <h3>{elementDef.displayName} Properties</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="delete-btn" onClick={handleDelete} title="Delete Element" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="property-sections">
        {/* Content Properties (Always Shown) */}
        {elementDef.contentProps && elementDef.contentProps.length > 0 && (
          <PropertyGroup title="Content" defaultExpanded={true}>
            {elementDef.contentProps.map(prop => {
              // Special handling for icon element's src field
              if (selectedElement.type === 'icon' && prop.name === 'src') {
                const handleIconSelect = (iconData) => {
                  if (iconData) {
                    // Update all props in a single call to avoid race conditions
                    onUpdateElement(selectedElement.id, {
                      props: {
                        ...selectedElement.props,
                        src: iconData.src,
                        alt: iconData.name,
                        uploadedFileName: `${iconData.name}.svg`,
                        iconCategory: iconData.category
                      }
                    });
                  }
                  setShowIconPicker(false);
                };

                return (
                  <div key={prop.name} style={{ marginBottom: '12px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      marginBottom: '6px',
                      color: '#333'
                    }}>
                      {prop.label}
                    </label>

                    {/* Icon Preview */}
                    {selectedElement.props?.src && (
                      <div style={{
                        marginBottom: '8px',
                        padding: '15px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid #e1e4e8'
                      }}>
                        <img
                          src={selectedElement.props.src}
                          alt="Icon preview"
                          style={{
                            width: '64px',
                            height: '64px',
                            objectFit: 'contain'
                          }}
                        />
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={() => setShowIconPicker(true)}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        backgroundColor: '#0066cc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}
                    >
                      Browse Icon Library
                    </button>

                    {/* Icon Picker Modal */}
                    {showIconPicker && (
                      <>
                        <div style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          zIndex: 9999
                        }} onClick={() => setShowIconPicker(false)} />
                        <IconPicker
                          onSelectIcon={handleIconSelect}
                          currentIcon={selectedElement.props?.src}
                        />
                      </>
                    )}
                  </div>
                );
              }

              // Special handling for map element's address field
              if (selectedElement.type === 'map' && prop.name === 'address') {
                return (
                  <div key={prop.name} style={{ marginBottom: '12px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      marginBottom: '6px',
                      color: '#333'
                    }}>
                      {prop.label}
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="text"
                        value={selectedElement.props?.address || ''}
                        onChange={(e) => updateProp('address', e.target.value)}
                        placeholder="Enter address (e.g., Boulder, CO, USA)"
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const address = selectedElement.props?.address;
                            if (address && address.trim()) {
                              const encodedAddress = encodeURIComponent(address);
                              const embedUrl = `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;
                              updateProp('embedUrl', embedUrl);
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const address = selectedElement.props?.address;
                          if (address && address.trim()) {
                            const encodedAddress = encodeURIComponent(address);
                            const embedUrl = `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;
                            updateProp('embedUrl', embedUrl);
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 16px',
                          backgroundColor: '#0066cc',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}
                      >
                        Generate Map
                      </button>
                    </div>
                  </div>
                );
              }

              // Standard property rendering
              const isSchemaEnabled = selectedElement.schemaToggles?.[prop.name] === true;

              return (
                <div key={prop.name} style={{ marginBottom: '12px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '6px',
                    color: '#333'
                  }}>
                    {prop.label}
                  </label>
                  <PropertyControl
                    property={prop}
                    value={selectedElement.props?.[prop.name] ?? prop.default}
                    element={selectedElement}
                    onFileInfo={() => {
                      // File info is now handled in onChange to avoid race conditions
                    }}
                    onChange={(value, fileInfo) => {
                      // For file uploads (src property), combine src + metadata in a single update
                      // to avoid race conditions where a second onUpdateElement overwrites the first
                      if (prop.name === 'src' && value && value.startsWith('data:')) {
                        const fileName = fileInfo?.fileName
                          || selectedElement.props?.uploadedFileName
                          || `${selectedElement.type}_${selectedElement.id.substring(0, 8)}.bin`;
                        onUpdateElement(selectedElement.id, {
                          props: {
                            ...selectedElement.props,
                            src: value,
                            uploadedFileName: fileName,
                            alt: selectedElement.props?.alt || fileName.replace(/\.[^/.]+$/, '')
                          }
                        });
                        return;
                      }

                      updateProp(prop.name, value);

                      // Auto-sync schema toggle with content prop value
                      if (prop.canBeSchemaEditable) {
                        const hasValue = value !== null && value !== undefined && value !== '' && value !== false;
                        if (hasValue && !selectedElement.schemaToggles?.[prop.name]) {
                          handleSchemaToggle(prop.name, true);
                        } else if (!hasValue && selectedElement.schemaToggles?.[prop.name]) {
                          handleSchemaToggle(prop.name, false);
                        }
                      }

                      // If this is the heading tag property, also update the level prop and fontSize
                      if (selectedElement.type === 'heading' && prop.name === 'tag') {
                        updateProp('level', value);

                        // Update fontSize to match the new heading level
                        const headingSizes = {
                          'h1': '36px',
                          'h2': '30px',
                          'h3': '24px',
                          'h4': '20px',
                          'h5': '18px',
                          'h6': '16px'
                        };

                        const newFontSize = headingSizes[value] || '24px';

                        // Check if fontSize is in responsive styles for current breakpoint
                        const currentResponsiveStyles = responsiveStyles?.[selectedElement.id]?.[breakpoint];
                        if (currentResponsiveStyles && currentResponsiveStyles.fontSize !== undefined && currentResponsiveStyles.fontSize !== '') {
                          // Update responsive style
                          onUpdateResponsiveStyle(selectedElement.id, 'fontSize', newFontSize);
                        } else {
                          // Update base style
                          updateStyle('fontSize', newFontSize);
                        }
                      }
                    }}
                  />

                  {/* Schema toggle for content properties */}
                  {prop.canBeSchemaEditable && (
                    <div style={{
                      marginTop: '10px',
                      paddingTop: '10px',
                      borderTop: '1px solid #e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedElement.schemaToggles?.[prop.name] === true}
                        onChange={(e) => handleSchemaToggle(prop.name, e.target.checked)}
                        data-id={`property-panel--schema-toggle--${prop.name}`}
                        style={{ margin: 0 }}
                      />
                      <span style={{ fontSize: '11px', color: '#666' }}>
                        Editable in Shopify
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </PropertyGroup>
        )}

        {/* Style Properties (Toggleable, Grouped by Category) */}
        {Object.entries(groupedStyleProps).map(([category, props]) => {
          // Custom compact renderer for visibility category
          if (category === 'visibility') {
            const devices = [
              { prop: 'hideOnMobile', Icon: Smartphone, label: 'Mobile' },
              { prop: 'hideOnDesktop', Icon: Monitor, label: 'Desktop' },
              { prop: 'hideOnFullscreen', Icon: Maximize2, label: 'Fullscreen' },
            ];
            return (
              <PropertyGroup key={category} title="visibility" defaultExpanded={true}>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', padding: '4px 0' }}>
                  {devices.map(({ prop: propName, Icon, label }) => {
                    const isHidden = selectedElement.style?.[propName] === true || selectedElement.style?.[propName] === 'true';
                    const isVisible = !isHidden;
                    return (
                      <button
                        key={propName}
                        data-id={`visibility--device--${label.toLowerCase()}`}
                        onClick={() => {
                          onUpdateElement(selectedElement.id, {
                            style: { ...selectedElement.style, [propName]: !isHidden }
                          });
                        }}
                        title={isVisible ? `Visible on ${label} — click to hide` : `Hidden on ${label} — click to show`}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '8px 14px',
                          border: `2px solid ${isVisible ? '#0066cc' : '#ddd'}`,
                          borderRadius: '8px',
                          background: isVisible ? '#e8f0fe' : '#f8f8f8',
                          cursor: 'pointer',
                          opacity: isVisible ? 1 : 0.4,
                          transition: 'all 0.15s ease',
                          minWidth: '60px',
                        }}
                      >
                        <Icon size={20} />
                        <span style={{ fontSize: '10px', fontWeight: 600, color: isVisible ? '#0066cc' : '#999' }}>
                          {isVisible ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </PropertyGroup>
            );
          }

          return (
          <PropertyGroup
            key={category}
            title={category}
            defaultExpanded={true}
          >
            {props.map(prop => (
              <ToggleableProperty
                key={prop.name}
                property={prop}
                element={selectedElement}
                currentBreakpoint={schemaBreakpoint}
                builderBreakpoint={breakpoint}
                globalResponsiveStyles={responsiveStyles}
                onToggle={(enabled) => handlePropertyToggle(prop, enabled)}
                onSchemaToggle={(enabled) => handleSchemaToggle(prop.name, enabled)}
                onChange={(value) => handlePropertyChange(prop, value)}
                onFileInfo={(fileInfo) => {
                  // When a file is uploaded (for src property), update uploadedFileName
                  if (prop.name === 'src' && fileInfo.fileName) {
                    onUpdateElement(selectedElement.id, {
                      props: {
                        ...selectedElement.props,
                        uploadedFileName: fileInfo.fileName,
                        alt: fileInfo.fileName.replace(/\.[^/.]+$/, '') // Use filename without extension as alt
                      }
                    });
                  }
                }}
              />
            ))}
          </PropertyGroup>
          );
        })}


        {/* Extracted CSS (if available) */}
        {liquidMetadata?.extractedCSS && (
          <div style={{
            margin: '10px',
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}>
            <div style={{
              fontWeight: 'bold',
              marginBottom: '8px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>📄 Extracted CSS</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(liquidMetadata.extractedCSS);
                  alert('CSS copied to clipboard!');
                }}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Copy
              </button>
            </div>
            <pre style={{
              fontSize: '11px',
              backgroundColor: '#fff',
              padding: '8px',
              borderRadius: '3px',
              overflow: 'auto',
              maxHeight: '200px',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              {liquidMetadata.extractedCSS}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
};

export default PropertyPanel;
