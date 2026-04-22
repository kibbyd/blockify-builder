The rule

For a property to survive export in a template:
1. It MUST be in the filter map → goes through normal pipeline as Liquid var, OR
2. It MUST be hardcoded in templateCSS → static CSS

If it's in neither place, it's invisible to the export pipeline. getElementDef strips it from the definition, so the normal pipeline can't see it. And if templateCSS doesn't
write it, nobody does. Silent loss.

The template JSON styleOverrides are only for canvas rendering. They feed the React preview. They have zero effect on export.