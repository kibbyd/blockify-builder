"use client";
import React from 'react';
import { useDrag } from 'react-dnd';
import {
  Square, Image, Columns2, Columns3, Columns4, ArrowUpDown,
  Heading, Type, ImageIcon, GalleryHorizontalEnd, Video, Star, RectangleHorizontal,
  List, ListOrdered, Table, Map, Minus, Newspaper,
  ChevronDown, PanelTop, Timer, SlidersHorizontal, FileText, MessageSquare,
  RotateCw, ArrowLeftRight, ScrollText,
  DollarSign, ShoppingCart, CreditCard, LayoutGrid, Library, Palette, Flame,
  ImagePlus, Lightbulb, Zap, ShoppingBag
} from 'lucide-react';

const ComponentPalette = ({ onAddElement }) => {
  return (
    <div className="component-palette">
      <div className="palette-content">
        <ComponentsTab onAddElement={onAddElement} />
      </div>
    </div>
  );
};

const ComponentsTab = ({ onAddElement }) => {
  const componentCategories = [
    {
      name: 'Layout',
      Info: Lightbulb,
      info: 'Start with Container, then add columns inside',
      components: [
        { type: 'container', Icon: Square, label: 'Container', tooltip: 'Add this first!' },
        { type: 'image-background', Icon: ImagePlus, label: 'Image Background' },
        { type: 'columns-1', Icon: RectangleHorizontal, label: '1 Column', columnConfig: 1, tooltip: 'Must be inside Container' },
        { type: 'columns-2', Icon: Columns2, label: '2 Columns', columnConfig: 2, tooltip: 'Must be inside Container' },
        { type: 'columns-3', Icon: Columns3, label: '3 Columns', columnConfig: 3, tooltip: 'Must be inside Container' },
        { type: 'columns-4', Icon: Columns4, label: '4 Columns', columnConfig: 4, tooltip: 'Must be inside Container' },
        { type: 'columns-5', Icon: Columns4, label: '5 Columns', columnConfig: 5, tooltip: 'Must be inside Container' },
        { type: 'columns-6', Icon: Columns4, label: '6 Columns', columnConfig: 6, tooltip: 'Must be inside Container' },
        { type: 'spacer', Icon: ArrowUpDown, label: 'Spacer' }
      ]
    },
    {
      name: 'Basic Elements',
      components: [
        { type: 'heading', Icon: Heading, label: 'Heading' },
        { type: 'text', Icon: Type, label: 'Text' },
        { type: 'image', Icon: ImageIcon, label: 'Image' },
        { type: 'image-gallery', Icon: GalleryHorizontalEnd, label: 'Gallery' },
        { type: 'video', Icon: Video, label: 'Video' },
        { type: 'icon', Icon: Star, label: 'Icon' },
        { type: 'button', Icon: RectangleHorizontal, label: 'Button' },
        { type: 'list', Icon: ListOrdered, label: 'Ordered List' },
        { type: 'unordered-list', Icon: List, label: 'Unordered List' },
        { type: 'table', Icon: Table, label: 'Table' },
        { type: 'map', Icon: Map, label: 'Map' },
        { type: 'divider', Icon: Minus, label: 'Divider' }
      ]
    },
    {
      name: 'Interactive',
      Info: Zap,
      info: 'Dynamic elements with built-in interactivity',
      components: [
        { type: 'accordion', Icon: ChevronDown, label: 'Accordion' },
        { type: 'tabs', Icon: PanelTop, label: 'Tabs' },
        { type: 'countdown', Icon: Timer, label: 'Countdown' },
        { type: 'slideshow', Icon: SlidersHorizontal, label: 'Slideshow' },
        { type: 'form', Icon: FileText, label: 'Form' },
        { type: 'popup', Icon: MessageSquare, label: 'Popup' },
        { type: 'flip-card', Icon: RotateCw, label: 'Flip Card' },
        { type: 'before-after', Icon: ArrowLeftRight, label: 'Before/After' },
        { type: 'marquee', Icon: ScrollText, label: 'Marquee' },
        { type: 'blog-post', Icon: Newspaper, label: 'Blog Posts' }
      ]
    },
    {
      name: 'Shopify',
      Info: ShoppingBag,
      info: 'Dynamic Shopify product elements',
      components: [
        { type: 'product-card', Icon: CreditCard, label: 'Product Card' },
        { type: 'product-grid', Icon: LayoutGrid, label: 'Product Grid' },
        { type: 'collection-list', Icon: Library, label: 'Collection List' }
      ]
    }
  ];

  return (
    <div className="components-tab">
      {componentCategories.map(category => (
        <div key={category.name} className="component-category">
          <h4>{category.name}</h4>
          {category.info && (
            <div style={{
              fontSize: '11px',
              color: '#666',
              padding: '5px 10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              marginBottom: '10px',
              border: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}>
              {category.Info && <category.Info size={12} style={{ flexShrink: 0 }} />}
              {category.info}
            </div>
          )}
          <div className="component-grid">
            {category.components.map(component => (
              <DraggableComponent
                key={component.type}
                component={component}
                onAddElement={onAddElement}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const DraggableComponent = ({ component, onAddElement }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { type: component.type, columnConfig: component.columnConfig },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Click functionality removed - components can only be dragged
  // This ensures proper placement within columns and containers

  return (
    <div
      ref={drag}
      className={`component-item ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
      title={`Drag to add ${component.label}`}
    >
      <span className="component-icon">{component.Icon ? <component.Icon size={20} /> : null}</span>
      <span className="component-label">{component.label}</span>
    </div>
  );
};

export default ComponentPalette;