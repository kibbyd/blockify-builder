"use client";
import React from 'react';
import { Smartphone, Tablet, Monitor, MonitorUp, Maximize2, RefreshCw, Undo2, Redo2, Compass, Trash2, Upload, Download, Droplets, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const Toolbar = ({ viewport, setViewport, breakpoint, setBreakpoint, onSyncStyles, selectedElement, onUndo, onRedo, onNavigatorToggle, onClearCanvas, onImportPage, onExportJSON, onExportLiquid }) => {
  const viewportOptions = [
    { value: 'small-mobile', Icon: Smartphone, label: 'XS - Mobile', width: '320px', breakpoint: 'xs', desc: '0-575px' },
    { value: 'mobile', Icon: Smartphone, label: 'SM - Mobile', width: '375px', breakpoint: 'sm', desc: '576-767px' },
    { value: 'tablet', Icon: Tablet, label: 'MD - Tablet', width: '768px', breakpoint: 'md', desc: '768-991px' },
    { value: 'laptop', Icon: Monitor, label: 'LG - Desktop', width: '1440px', breakpoint: 'lg', desc: '992-1199px' },
    { value: 'desktop', Icon: Maximize2, label: 'XL - Desktop', width: 'Full', breakpoint: 'xl', desc: '1200px+' },
  ];

  const handleViewportChange = (option) => {
    setViewport(option.value);
    if (setBreakpoint) {
      setBreakpoint(option.breakpoint);
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left" style={{ width: '280px', flexShrink: 0 }}>
        <h1>Blockify Builder</h1>
      </div>

      <div className="toolbar-center" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', paddingRight: '320px' }}>
        <button
          className="btn-toolbar"
          onClick={onSyncStyles}
          disabled={!selectedElement}
          title={selectedElement ? `Sync ${breakpoint.toUpperCase()} styles to all breakpoints` : "Select an element to sync styles"}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: selectedElement ? '#2196f3' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: selectedElement ? 'pointer' : 'not-allowed',
            opacity: selectedElement ? 1 : 0.6,
          }}
        >
          <RefreshCw size={12} style={{ flexShrink: 0 }} />
          Sync
        </button>

        <div style={{ width: '1px', height: '28px', backgroundColor: '#e1e4e8', margin: '0 4px' }} />

        <div className="viewport-controls">
          {viewportOptions.map(option => (
            <button
              key={option.value}
              className={`viewport-btn ${viewport === option.value ? 'active' : ''}`}
              onClick={() => handleViewportChange(option)}
              title={`${option.label} - ${option.desc}`}
            >
              <option.Icon size={14} />
              <span style={{ fontSize: '9px', display: 'block', marginTop: '1px' }}>
                {option.breakpoint.toUpperCase()}
              </span>
            </button>
          ))}
        </div>

        <div style={{ fontSize: '11px', color: '#666' }}>
          <strong>{viewportOptions.find(opt => opt.value === viewport)?.desc}</strong>
        </div>

        <div style={{ marginLeft: '10px', display: 'flex', gap: '6px' }}>
          <button
            className="btn-toolbar"
            title="Undo (Ctrl+Z)"
            data-id="toolbar--button--undo"
            onClick={onUndo}
            style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Undo2 size={16} />
          </button>
          <button
            className="btn-toolbar"
            title="Redo (Ctrl+Shift+Z)"
            data-id="toolbar--button--redo"
            onClick={onRedo}
            style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Redo2 size={16} />
          </button>
          <div style={{ width: '1px', height: '28px', backgroundColor: '#e1e4e8', margin: '0 2px' }} />
          <button
            className="btn-toolbar"
            title="Open Navigator"
            data-id="toolbar--button--navigator"
            onClick={onNavigatorToggle}
            style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Compass size={16} />
          </button>
          <button
            className="btn-toolbar"
            title="Clear Canvas"
            data-id="toolbar--button--clear"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
                onClearCanvas && onClearCanvas();
              }
            }}
            style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Trash2 size={16} />
          </button>
          <div style={{ width: '1px', height: '28px', backgroundColor: '#e1e4e8', margin: '0 2px' }} />
          <button
            className="btn-toolbar"
            title="Import Page"
            data-id="toolbar--button--import"
            onClick={onImportPage}
            style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Upload size={16} />
          </button>
          <button
            className="btn-toolbar"
            title="Export JSON"
            data-id="toolbar--button--export-json"
            onClick={onExportJSON}
            style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Download size={16} />
          </button>
          <button
            className="btn-toolbar"
            title="Export Liquid"
            data-id="toolbar--button--export-liquid"
            onClick={onExportLiquid}
            style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#5c3a9e', color: 'white', border: 'none', borderRadius: '6px' }}
          >
            <Droplets size={16} />
          </button>
          <div style={{ width: '1px', height: '28px', backgroundColor: '#e1e4e8', margin: '0 2px' }} />
          <button
            className="btn-toolbar"
            title="Log out"
            data-id="toolbar--button--logout"
            onClick={() => {
              if (window.confirm('Log out of Blockify?')) {
                signOut({ callbackUrl: '/login' });
              }
            }}
            style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Toolbar;