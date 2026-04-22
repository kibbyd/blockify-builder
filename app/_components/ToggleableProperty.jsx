/**
 * Toggleable Property Component
 *
 * Allows properties to be toggled on/off and marked as schema-editable
 */

"use client";
import React from 'react';
import { PropertyControl } from '@/app/_components/PropertyControls';
import { ChevronDown } from 'lucide-react';

export function ToggleableProperty({
  property,
  element,
  currentBreakpoint,
  builderBreakpoint,
  globalResponsiveStyles = {},
  onToggle,
  onSchemaToggle,
  onChange,
  onFileInfo
}) {
  // Determine if property is enabled (has a value in style or global responsiveStyles)
  // For responsive properties, check global state; treat empty string as disabled
  // Handle column elements specially (ID pattern: parentId-col-columnIndex)
  const isColumnElement = element.id?.includes('-col-');
  let isEnabled;

  if (property.responsive) {
    if (isColumnElement) {
      // For columns, check namespaced property in parent element's responsive styles
      const parts = element.id.split('-col-');
      const parentElementId = parts[0];
      const columnIndex = parseInt(parts[1]);
      const namespacedKey = `col-${columnIndex}-${property.name}`;

      isEnabled = (globalResponsiveStyles?.[parentElementId]?.[builderBreakpoint]?.[namespacedKey] !== undefined &&
                   globalResponsiveStyles?.[parentElementId]?.[builderBreakpoint]?.[namespacedKey] !== '') ||
                  (element.style?.[property.name] !== undefined && element.style?.[property.name] !== '');
    } else {
      isEnabled = (globalResponsiveStyles?.[element.id]?.[builderBreakpoint]?.[property.name] !== undefined &&
                   globalResponsiveStyles?.[element.id]?.[builderBreakpoint]?.[property.name] !== '') ||
                  (element.style?.[property.name] !== undefined && element.style?.[property.name] !== '');
    }
  } else {
    isEnabled = (element.style?.[property.name] !== undefined);
  }

  // Check if property is schema-enabled (auto-enable if property has a value)
  const isSchemaEnabled = element.schemaToggles?.[property.name] === true || isEnabled;

  // Get current value
  const getCurrentValue = () => {
    if (property.responsive) {
      // For responsive properties, get value from global responsiveStyles at current builder breakpoint
      if (isColumnElement) {
        // For columns, get namespaced property from parent element's responsive styles
        const parts = element.id.split('-col-');
        const parentElementId = parts[0];
        const columnIndex = parseInt(parts[1]);
        const namespacedKey = `col-${columnIndex}-${property.name}`;

        return globalResponsiveStyles?.[parentElementId]?.[builderBreakpoint]?.[namespacedKey]
               || element.style?.[property.name]
               || property.default;
      } else {
        return globalResponsiveStyles?.[element.id]?.[builderBreakpoint]?.[property.name]
               || element.style?.[property.name]
               || property.default;
      }
    } else {
      // For non-responsive properties, get from style
      return element.style?.[property.name] || property.default;
    }
  };

  const currentValue = getCurrentValue();

  return (
    <div style={{
      padding: '12px',
      backgroundColor: isEnabled ? '#f8f9fa' : '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: '6px',
      marginBottom: '8px',
      transition: 'all 0.2s'
    }}>
      {/* Property Header with Enable Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: isEnabled ? '10px' : '0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          userSelect: 'none'
        }}>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => onToggle(e.target.checked)}
            style={{
              marginRight: '8px',
              cursor: 'pointer',
              width: '16px',
              height: '16px'
            }}
          />
          <span style={{
            fontSize: '13px',
            fontWeight: isEnabled ? '600' : 'normal',
            color: isEnabled ? '#333' : '#666'
          }}>
            {property.label}
            {property.responsive && (
              <span style={{
                marginLeft: '6px',
                fontSize: '11px',
                color: '#0066cc',
                backgroundColor: '#e3f2fd',
                padding: '2px 6px',
                borderRadius: '3px',
                fontWeight: 'normal'
              }}>
                Responsive
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Property Control - Only show if enabled */}
      {isEnabled && (
        <>
          <PropertyControl
            property={property}
            value={currentValue}
            onChange={onChange}
            onFileInfo={onFileInfo}
            element={element}
          />

          {/* Schema Toggle - Show if canBeSchemaEditable */}
          {property.canBeSchemaEditable && (
            <div style={{
              marginTop: '10px',
              paddingTop: '10px',
              borderTop: '1px solid #e0e0e0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                userSelect: 'none',
                fontSize: '12px',
                color: '#666'
              }}>
                <input
                  type="checkbox"
                  checked={isSchemaEnabled}
                  onChange={(e) => onSchemaToggle(e.target.checked)}
                  style={{
                    marginRight: '6px',
                    cursor: 'pointer'
                  }}
                />
                <span>
                  Editable in Shopify
                  {isSchemaEnabled && property.responsive && (
                    <span style={{
                      marginLeft: '4px',
                      color: '#0066cc',
                      fontWeight: '500'
                    }}>
                      (3 settings: mobile, desktop, fullscreen)
                    </span>
                  )}
                </span>
              </div>
              {isSchemaEnabled && (
                <div style={{
                  marginTop: '6px',
                  fontSize: '11px',
                  color: '#2e7d32',
                  backgroundColor: '#e8f5e9',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  lineHeight: '1.4'
                }}>
                  ✓ Merchants can adjust this in Shopify's theme editor
                </div>
              )}
            </div>
          )}

          {/* Current value info for debugging */}
          {currentValue && (
            <div style={{
              marginTop: '8px',
              fontSize: '11px',
              color: '#999',
              fontFamily: 'monospace'
            }}>
              Current: {currentValue}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Property Group - Collapsible group of properties
 */
export function PropertyGroup({ title, children, defaultExpanded = true, collapsible = false }) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  return (
    <div style={{
      marginBottom: '16px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: 'white'
    }}>
      {/* Group Header */}
      <div
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
        style={{
          padding: '12px 16px',
          backgroundColor: '#f5f5f5',
          borderBottom: isExpanded ? '1px solid #e0e0e0' : 'none',
          cursor: collapsible ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          userSelect: 'none'
        }}
      >
        <h4 style={{
          margin: 0,
          fontSize: '14px',
          fontWeight: '600',
          color: '#333',
          textTransform: 'capitalize'
        }}>
          {title}
        </h4>
        {collapsible && (
          <span style={{
            color: '#666',
            transition: 'transform 0.2s',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            display: 'inline-flex',
          }}>
            <ChevronDown size={14} />
          </span>
        )}
      </div>

      {/* Group Content */}
      {isExpanded && (
        <div style={{
          padding: '12px'
        }}>
          {children}
        </div>
      )}
    </div>
  );
}
