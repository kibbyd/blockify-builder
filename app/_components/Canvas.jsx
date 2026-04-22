"use client";
import React, { useCallback } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import ElementRenderer from '@/app/_components/ElementRenderer';
import DropIndicator from '@/app/_components/DropIndicator';

const Canvas = ({
  elements,
  selectedElement,
  setSelectedElement,
  onMoveElement,
  onAddElement,
  onAddChildElement,
  onUpdateElement,
  viewport,
  breakpoint,
  responsiveStyles
}) => {
  const [{ isOver, draggedItem, canDrop }, drop] = useDrop({
    accept: ['component', 'element'],
    canDrop: (item) => {
      // Columns can only be dropped inside containers, not directly on canvas
      const isColumnType = item.type && (
        item.type === 'columns' ||
        item.type.startsWith('columns-')
      );

      // Basic elements must go inside containers/columns
      const basicElements = ['heading', 'text', 'image', 'video', 'icon', 'button', 'list', 'unordered-list', 'table', 'map', 'divider', 'accordion', 'tabs', 'countdown', 'slideshow', 'product-card'];
      const isBasicElement = item.type && basicElements.includes(item.type);

      if (isColumnType || isBasicElement) {
        return false; // Reject these on canvas
      }

      return true; // Allow other types (container, image-background, product, etc.)
    },
    drop: (item, monitor) => {
      try {

        if (!monitor.didDrop()) {

          if (item.elementId) {
            // Moving existing element - will be handled by individual drop indicators
          } else if (item.type) {
            // Adding new component from palette
            onAddElement(item.type, item.columnConfig, elements.length, item);
          } else {
          }
        } else {
        }
      } catch (error) {
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
      draggedItem: monitor.getItem(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const getCanvasWidth = () => {
    switch (viewport) {
      case 'small-mobile': return '320px';
      case 'mobile': return '364.8px';
      case 'tablet': return '768px';
      case 'laptop': return '1182.4px';
      case 'desktop':
      default: return '1509.6px';
    }
  };

  // Check if dragging a column type
  const isDraggingColumn = draggedItem && (
    draggedItem.type === 'columns' ||
    draggedItem.type?.startsWith('columns-')
  );

  // Check if dragging basic elements
  const basicElements = ['heading', 'text', 'image', 'video', 'icon', 'button', 'list', 'unordered-list', 'table', 'map', 'divider', 'accordion', 'tabs', 'countdown', 'slideshow', 'product-card'];
  const isDraggingBasicElement = draggedItem && basicElements.includes(draggedItem.type);

  return (
    <div className="canvas-area">
      <div className="canvas-wrapper">
        <div
          ref={drop}
          className={`canvas ${isOver ? (canDrop ? 'drag-over' : 'drag-over-invalid') : ''}`}
          style={{ width: getCanvasWidth() }}
        >
          {/* Show message when trying to drag columns to canvas */}
          {isOver && isDraggingColumn && !canDrop && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#fff3cd',
              border: '2px solid #ffc107',
              borderRadius: '8px',
              padding: '20px',
              zIndex: 1000,
              pointerEvents: 'none',
              textAlign: 'center',
              maxWidth: '300px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Column layouts must go inside a Container</div>
            </div>
          )}

          {/* Show message when trying to drag basic elements to canvas */}
          {isOver && isDraggingBasicElement && !canDrop && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#fff3cd',
              border: '2px solid #ffc107',
              borderRadius: '8px',
              padding: '20px',
              zIndex: 1000,
              pointerEvents: 'none',
              textAlign: 'center',
              maxWidth: '300px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Elements must go inside a Container or Column</div>
            </div>
          )}

          <div className="canvas-content">
            {elements.length === 0 ? (
              <div className="empty-canvas">
                <p>Drag a container here to start</p>
              </div>
            ) : (
              <ElementList
                elements={elements}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                onMoveElement={onMoveElement}
                onAddElement={onAddElement}
                onAddChildElement={onAddChildElement}
                onUpdateElement={onUpdateElement}
                isCanvasOver={isOver}
                draggedItem={draggedItem}
                breakpoint={breakpoint}
                responsiveStyles={responsiveStyles}

              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ElementList = ({
  elements,
  selectedElement,
  setSelectedElement,
  onMoveElement,
  onAddElement,
  onAddChildElement,
  onUpdateElement,
  isCanvasOver,
  draggedItem,
  breakpoint,
  responsiveStyles
}) => {
  const handleDrop = useCallback((item, dropIndex) => {
    try {

      if (item.elementId) {
        // Moving existing element
        const dragIndex = elements.findIndex(el => el.id === item.elementId);
        if (dragIndex !== -1 && dragIndex !== dropIndex) {
          // Adjust drop index if moving down
          const adjustedDropIndex = dragIndex < dropIndex ? dropIndex - 1 : dropIndex;
          onMoveElement(dragIndex, adjustedDropIndex);
        } else {
        }
      } else if (item.type) {
        // Adding new component from palette
        onAddElement(item.type, item.columnConfig, dropIndex, item);
      } else {
      }
    } catch (error) {
    }
  }, [elements, onMoveElement, onAddElement]);

  return (
    <>
      {elements.map((element, index) => (
        <React.Fragment key={element.id}>
          <DropIndicator
            index={index}
            isVisible={isCanvasOver && draggedItem}
            onDrop={handleDrop}
          />
          <SortableElement
            element={element}
            index={index}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            onMoveElement={onMoveElement}
            onAddChildElement={onAddChildElement}
            onUpdateElement={onUpdateElement}
            breakpoint={breakpoint}
            responsiveStyles={responsiveStyles}
          />
        </React.Fragment>
      ))}
      <DropIndicator
        index={elements.length}
        isVisible={isCanvasOver && draggedItem}
        onDrop={handleDrop}
      />
    </>
  );
};

const SortableElement = ({
  element,
  index,
  selectedElement,
  setSelectedElement,
  onMoveElement,
  onAddChildElement,
  onUpdateElement,
  breakpoint,
  responsiveStyles
}) => {
  // Apply responsive styles for current breakpoint
  const elementResponsiveStyles = responsiveStyles?.[element.id]?.[breakpoint] || {};

  // Filter out empty string values (disabled properties)
  const filteredResponsiveStyles = Object.entries(elementResponsiveStyles).reduce((acc, [key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});

  const mergedStyle = { ...element.style, ...filteredResponsiveStyles };
  const [{ isDragging }, drag] = useDrag({
    type: 'element',
    item: () => {
      return { elementId: element.id, index, type: element.type };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedElement(element.id);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    // Enable text editing for text elements
    if (element.type === 'text' || element.type === 'heading') {
      const target = e.currentTarget.querySelector('[contentEditable]');
      if (target) {
        target.focus();
      }
    }
  };

  return (
    <div
      ref={drag}
      className={`canvas-element ${selectedElement === element.id ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        opacity: isDragging ? 0.5 : 1,
        margin: '10px 0',
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <ElementRenderer
        element={{ ...element, style: mergedStyle }}
        isSelected={selectedElement === element.id}
        onAddChildElement={onAddChildElement}
        onUpdateElement={onUpdateElement}
        onSelectElement={setSelectedElement}
        selectedElement={selectedElement}
        breakpoint={breakpoint}
        responsiveStyles={responsiveStyles}
      />
    </div>
  );
};

export default Canvas;
