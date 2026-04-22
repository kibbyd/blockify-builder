"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Compass, X, ChevronDown, ChevronRight, Square, Heading, Type, ImageIcon, Video, RectangleHorizontal, Columns2, Star, ArrowUpDown, ImagePlus, ListOrdered, List, Table, Circle } from 'lucide-react';

const Navigator = ({
  elements,
  selectedElement,
  onSelectElement,
  onReorderElements,
  onMoveElement,
  show = false,
  onClose
}) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);

  const handleMouseDown = (e) => {
    // Only start dragging if clicking on the header
    if (e.target.closest('.navigator-modal-header')) {
      setIsDraggingModal(true);
      const rect = modalRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDraggingModal) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingModal(false);
  };

  useEffect(() => {
    if (isDraggingModal) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingModal, dragOffset]);

  if (!show) return null;

  return (
    <div
      ref={modalRef}
      className="navigator-modal"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
        cursor: isDraggingModal ? 'grabbing' : 'default'
      }}
    >
      <div
        className="navigator-modal-header"
        onMouseDown={handleMouseDown}
        style={{ cursor: 'grab' }}
      >
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Compass size={16} /> Navigator</h3>
        <button className="navigator-close-btn" onClick={onClose}><X size={14} /></button>
      </div>
      <div className="navigator-modal-content">
        {elements.length === 0 ? (
          <div className="navigator-empty">
            No elements yet. Add components from the palette.
          </div>
        ) : (
          <NavigatorTree
            elements={elements}
            selectedElement={selectedElement}
            onSelectElement={onSelectElement}
            onReorderElements={onReorderElements}
            onMoveElement={onMoveElement}
            level={0}
          />
        )}
      </div>
    </div>
  );
};

const NavigatorTree = ({
  elements,
  selectedElement,
  onSelectElement,
  onReorderElements,
  onMoveElement,
  level = 0,
  parentId = null,
  columnIndex = null
}) => {
  return (
    <div className="navigator-tree">
      {elements.map((element, index) => (
        <NavigatorItem
          key={element.id}
          element={element}
          index={index}
          selectedElement={selectedElement}
          onSelectElement={onSelectElement}
          onReorderElements={onReorderElements}
          onMoveElement={onMoveElement}
          level={level}
          parentId={parentId}
          columnIndex={columnIndex}
        />
      ))}
    </div>
  );
};

const NavigatorItem = ({
  element,
  index,
  selectedElement,
  onSelectElement,
  onReorderElements,
  onMoveElement,
  level,
  parentId,
  columnIndex
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = (element.children && element.children.length > 0) ||
                      (element.columns && element.columns.some(col => col && col.length > 0));

  // Drag and drop for reordering
  const [{ isDragging }, drag] = useDrag({
    type: 'navigator-item',
    item: {
      elementId: element.id,
      index,
      parentId,
      columnIndex
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'navigator-item',
    canDrop: (item) => {
      // Prevent dropping element into itself
      if (item.elementId === element.id) return false;

      // Prevent dropping parent into its own children
      const isDescendant = (el, ancestorId) => {
        if (el.id === ancestorId) return true;
        if (el.children) {
          for (const child of el.children) {
            if (isDescendant(child, ancestorId)) return true;
          }
        }
        if (el.columns) {
          for (const column of el.columns) {
            for (const child of column) {
              if (isDescendant(child, ancestorId)) return true;
            }
          }
        }
        return false;
      };

      return !isDescendant(element, item.elementId);
    },
    drop: (item, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;

      // Move the dragged element to this position
      if (onMoveElement) {
        onMoveElement(item.elementId, element.id, 'before');
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const getElementIcon = (type) => {
    const iconMap = {
      'container': Square,
      'heading': Heading,
      'text': Type,
      'image': ImageIcon,
      'video': Video,
      'button': RectangleHorizontal,
      'columns-1': Columns2,
      'columns-2': Columns2,
      'columns-3': Columns2,
      'columns-4': Columns2,
      'columns-5': Columns2,
      'columns-6': Columns2,
      'icon': Star,
      'spacer': ArrowUpDown,
      'image-background': ImagePlus,
      'list': ListOrdered,
      'unordered-list': List,
      'table': Table,
    };
    const IconComponent = iconMap[type] || Circle;
    return <IconComponent size={14} />;
  };

  const getElementLabel = (element) => {
    const labels = {
      'container': 'Container',
      'heading': element.props?.text?.substring(0, 20) || 'Heading',
      'text': element.props?.text?.substring(0, 20) || 'Text',
      'image': 'Image',
      'video': 'Video',
      'button': element.props?.text || 'Button',
      'columns-1': '1 Column',
      'columns-2': '2 Columns',
      'columns-3': '3 Columns',
      'columns-4': '4 Columns',
      'columns-5': '5 Columns',
      'columns-6': '6 Columns',
      'icon': 'Icon',
      'spacer': 'Spacer',
      'image-background': 'Background Image',
      'list': 'Ordered List',
      'unordered-list': 'Unordered List',
      'table': 'Table',
    };
    return labels[element.type] || element.type;
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelectElement(element.id);
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="navigator-item-wrapper">
      <div
        ref={(node) => drag(drop(node))}
        className={`navigator-item ${selectedElement === element.id ? 'selected' : ''} ${isDragging ? 'dragging' : ''} ${isOver && canDrop ? 'drop-target' : ''}`}
        style={{
          paddingLeft: `${level * 20 + 10}px`,
          opacity: isDragging ? 0.5 : 1,
          cursor: 'pointer'
        }}
        onClick={handleClick}
      >
        {hasChildren && (
          <button
            className="toggle-btn"
            onClick={handleToggle}
          >
            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        )}
        {!hasChildren && <span className="no-toggle" />}

        <span className="element-icon">{getElementIcon(element.type)}</span>
        <span className="element-label">{getElementLabel(element)}</span>
      </div>

      {hasChildren && isExpanded && (
        <div className="navigator-children">
          {/* Render children */}
          {element.children && element.children.length > 0 && (
            <NavigatorTree
              elements={element.children}
              selectedElement={selectedElement}
              onSelectElement={onSelectElement}
              onReorderElements={onReorderElements}
              onMoveElement={onMoveElement}
              level={level + 1}
              parentId={element.id}
            />
          )}

          {/* Render columns */}
          {element.columns && element.columns.map((column, colIndex) => (
            <ColumnDropZone
              key={`col-${colIndex}`}
              parentElement={element}
              columnIndex={colIndex}
              column={column}
              level={level}
              selectedElement={selectedElement}
              onSelectElement={onSelectElement}
              onReorderElements={onReorderElements}
              onMoveElement={onMoveElement}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Column drop zone component that accepts drops even when empty
const ColumnDropZone = ({
  parentElement,
  columnIndex,
  column,
  level,
  selectedElement,
  onSelectElement,
  onReorderElements,
  onMoveElement
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'navigator-item',
    canDrop: (item) => {
      // Prevent dropping element into itself
      if (item.elementId === parentElement.id) {
        return false;
      }

      // Allow moving elements between columns of the same parent
      // The moveElement logic will handle any invalid moves
      return true;
    },
    drop: (item, monitor) => {
      // Check if already handled by a nested drop zone
      if (monitor.didDrop()) {
        return;
      }

      // Move element into the specified column
      if (onMoveElement) {
        onMoveElement(item.elementId, parentElement.id, 'into-column', columnIndex);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
      canDrop: !!monitor.canDrop(),
    }),
  });

  // Create column ID to match ElementRenderer's column selection format
  const columnId = `${parentElement.id}-col-${columnIndex}`;
  const isSelected = selectedElement === columnId;

  const handleColumnClick = (e) => {
    e.stopPropagation();
    onSelectElement(columnId);
  };

  return (
    <div className="navigator-column">
      <div
        ref={drop}
        className={`navigator-column-label ${isSelected ? 'selected' : ''} ${isOver && canDrop ? 'drop-target' : ''}`}
        style={{
          paddingLeft: `${(level + 1) * 20 + 10}px`,
          background: isOver && canDrop ? '#e8f4fd' : 'transparent',
          borderRadius: '4px',
          transition: 'background 0.2s ease',
          minHeight: column && column.length === 0 ? '40px' : 'auto',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={handleColumnClick}
      >
        Column {columnIndex + 1}
        {column && column.length === 0 && (
          <span style={{ fontSize: '10px', color: '#999', marginLeft: '8px' }}>(empty - drop here)</span>
        )}
      </div>
      {column && column.length > 0 && (
        <NavigatorTree
          elements={column}
          selectedElement={selectedElement}
          onSelectElement={onSelectElement}
          onReorderElements={onReorderElements}
          onMoveElement={onMoveElement}
          level={level + 2}
          parentId={parentElement.id}
          columnIndex={columnIndex}
        />
      )}
    </div>
  );
};

export default Navigator;
