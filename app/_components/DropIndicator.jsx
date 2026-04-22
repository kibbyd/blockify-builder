"use client";
import React from 'react';
import { useDrop } from 'react-dnd';

const DropIndicator = ({ index, isVisible, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ['component', 'element'],
    drop: (item, monitor) => {
      if (onDrop) {
        onDrop(item, index);
      }
      return { index };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  });

  if (!isVisible && !isOver) {
    return null;
  }

  return (
    <div
      ref={drop}
      className="drop-indicator"
      style={{
        height: isOver ? '8px' : '2px',
        backgroundColor: '#0066cc',
        borderRadius: '2px',
        margin: '5px 0',
        opacity: isOver ? 1 : 0.5,
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
    >
      {isOver && (
        <div
          style={{
            position: 'absolute',
            left: '-10px',
            top: '-3px',
            width: '14px',
            height: '14px',
            backgroundColor: '#0066cc',
            borderRadius: '50%',
            border: '2px solid white',
          }}
        />
      )}
    </div>
  );
};

export default DropIndicator;