import { v4 as uuidv4 } from "uuid";
import {
  getDefaultStyle,
  getDefaultProps,
  getElementDef,
} from "@/app/_config/elementDefinitions";
import { getDefaultSchemaToggles } from "@/app/_components/BlockBuilder";

/**
 * Instantiates a template by building each element from its type defaults
 * then overlaying the template's delta values.
 * Returns a new array of elements ready to insert into the canvas.
 */
export function instantiateTemplate(template) {
  return template.elements.map((element) => buildElement(element, template.id));
}

function buildElement(templateElement, templateId) {
  const { type } = templateElement;

  const style = {
    ...getDefaultStyle(type),
    ...(templateElement.styleOverrides || {}),
  };

  const props = {
    ...getDefaultProps(type),
    ...(templateElement.propOverrides || {}),
  };

  let schemaToggles;
  if (templateId) {
    const filteredDef = getElementDef(type, templateId);
    const allowedProps = [
      ...(filteredDef?.contentProps?.map((p) => p.name) || []),
      ...(filteredDef?.styleProps?.map((p) => p.name) || []),
    ];
    schemaToggles = {};
    allowedProps.forEach((name) => { schemaToggles[name] = true; });

    // For column elements, auto-generate namespaced col-{i}-propName toggles from column filter map
    if (type.startsWith('columns-') || type === 'grid-2x2') {
      const colDef = getElementDef('column', templateId);
      if (colDef) {
        const colProps = [
          ...(colDef.contentProps?.map((p) => p.name) || []),
          ...(colDef.styleProps?.map((p) => p.name) || []),
        ];
        const columnCount = type === 'grid-2x2' ? 4 : parseInt(type.split('-')[1] || '2');
        const colStyles = templateElement.columnStyles || {};
        for (let i = 0; i < columnCount; i++) {
          const thisColStyles = colStyles[String(i)] || {};
          colProps.forEach((name) => {
            if (name in thisColStyles) {
              schemaToggles[`col-${i}-${name}`] = true;
            }
          });
        }
      }
    }
  } else {
    schemaToggles = { ...getDefaultSchemaToggles(type) };
  }

  const element = {
    id: uuidv4(),
    type,
    fromTemplate: templateId,
    props,
    style,
    responsiveStyles: templateElement.responsiveStyles
      ? JSON.parse(JSON.stringify(templateElement.responsiveStyles))
      : {},
    schemaToggles,
    children: [],
  };

  // Pass through columnStyles as-is
  if (templateElement.columnStyles) {
    element.columnStyles = JSON.parse(
      JSON.stringify(templateElement.columnStyles)
    );
  }

  // Recurse children
  if (Array.isArray(templateElement.children)) {
    element.children = templateElement.children.map((child) =>
      buildElement(child, templateId)
    );
  }

  // Recurse columns
  if (Array.isArray(templateElement.columns)) {
    element.columns = templateElement.columns.map((column) =>
      column.map((child) => buildElement(child, templateId))
    );
  }

  return element;
}
