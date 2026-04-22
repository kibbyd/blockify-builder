"use client";

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BlockBuilder from '@/app/_components/BlockBuilder';

export default function BuilderPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <BlockBuilder />
    </DndProvider>
  );
}
