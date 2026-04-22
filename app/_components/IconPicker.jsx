"use client";
import React, { useState, useEffect } from 'react';

const IconPicker = ({ onSelectIcon, currentIcon }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(false);
  const iconsPerPage = 48;

  // Fetch icons from API
  useEffect(() => {
    const fetchIcons = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/icons');
        const data = await response.json();
        setIcons(data.icons || []);
      } catch (error) {
        console.error('Error fetching icons:', error);
        setIcons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIcons();
  }, []);

  // Filter icons based on search term
  const filteredIcons = icons.filter(({ name }) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredIcons.length / iconsPerPage);
  const startIndex = (currentPage - 1) * iconsPerPage;
  const endIndex = startIndex + iconsPerPage;
  const currentIcons = filteredIcons.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
        setCurrentPage(prev => prev + 1);
      } else if (e.key === 'Escape') {
        onSelectIcon(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages, onSelectIcon]);

  const handleIconSelect = (icon) => {
    onSelectIcon({
      src: icon.path,
      name: icon.name
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '600px',
      maxHeight: '600px',
      zIndex: 10000,
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ margin: '0 0 15px 0' }}>Choose an Icon</h3>

      {/* Search */}
      <input
        type="text"
        placeholder="Search icons..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        data-id="icon-picker--input--search"
        style={{
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          marginBottom: '15px',
          fontSize: '14px'
        }}
      />

      {/* Icon Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '10px',
        overflowY: 'auto',
        flex: 1,
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        minHeight: '300px'
      }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading icons...
          </div>
        ) : currentIcons.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
            {filteredIcons.length === 0 && icons.length === 0 ? (
              <>
                <p>No icons found.</p>
                <p style={{ fontSize: '12px', marginTop: '10px' }}>
                  Add SVG or PNG files to: <br/>
                  <code>public/icons/</code><br/>
                  <br/>
                  File naming format: <code>icon-name.svg</code> or <code>icon-name.png</code><br/>
                  <small>Resize icons using the width/height controls in the Property Panel.</small>
                </p>
              </>
            ) : (
              <p>No icons match your search.</p>
            )}
          </div>
        ) : (
          currentIcons.map((icon) => (
            <div
              key={icon.name}
              onClick={() => handleIconSelect(icon)}
              data-id={`icon-picker--icon--${icon.name}`}
              style={{
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e3f2fd';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title={icon.name}
            >
              <img
                src={icon.path}
                alt={icon.name}
                style={{
                  maxWidth: '70%',
                  maxHeight: '70%',
                  objectFit: 'contain'
                }}
              />
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div style={{
        marginTop: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px'
      }}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          data-id="icon-picker--btn--prev"
          style={{
            padding: '8px 16px',
            backgroundColor: currentPage === 1 ? '#e0e0e0' : '#0066cc',
            color: currentPage === 1 ? '#999' : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          ← Previous
        </button>

        <div style={{
          fontSize: '12px',
          color: '#666',
          textAlign: 'center'
        }}>
          Page {currentPage} of {totalPages}
          <br />
          <span style={{ fontSize: '11px' }}>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredIcons.length)} of {filteredIcons.length} icons
          </span>
        </div>

        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          data-id="icon-picker--btn--next"
          style={{
            padding: '8px 16px',
            backgroundColor: currentPage === totalPages ? '#e0e0e0' : '#0066cc',
            color: currentPage === totalPages ? '#999' : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          Next →
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div style={{
        marginTop: '10px',
        fontSize: '11px',
        color: '#999',
        textAlign: 'center'
      }}>
        💡 Tip: Use ← → arrow keys to navigate pages, ESC to close
      </div>

      {/* Close button */}
      <button
        onClick={() => onSelectIcon(null)}
        data-id="icon-picker--btn--cancel"
        style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Cancel
      </button>
    </div>
  );
};

export default IconPicker;
