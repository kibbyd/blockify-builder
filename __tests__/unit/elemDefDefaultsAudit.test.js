/**
 * Audit: elementDefinitions defaults vs route 2 (getDefaultStyle/getDefaultProps)
 */

jest.mock('@/app/_components/ComponentPalette', () => () => null);
jest.mock('@/app/_components/TemplatePanel', () => () => null);
jest.mock('@/app/_components/Canvas', () => () => null);
jest.mock('@/app/_components/PropertyPanel', () => () => null);
jest.mock('@/app/_components/Toolbar', () => () => null);
jest.mock('@/app/_components/Navigator', () => () => null);
jest.mock('@/app/_components/ErrorBoundary', () => () => null);
jest.mock('@/app/_components/PaymentWall', () => () => null);
jest.mock('lucide-react', () => ({ X: () => null }));
jest.mock('@/app/_utils/liquidParser', () => ({
  parseLiquidToElements: jest.fn(),
  convertElementsToLiquid: jest.fn(),
}));
jest.mock('@/app/_utils/jsonToLiquid', () => ({
  convertJSONToLiquid: jest.fn(),
}));
jest.mock('@/app/_utils/licenseManager', () => ({
  __esModule: true,
  default: { isActive: () => true },
}));

import { elementDefinitions } from '@/app/_config/elementDefinitions';
import { getDefaultStyle, getDefaultProps } from '@/app/_components/BlockBuilder';

test('Audit elementDefinitions defaults', () => {
  const duplicates = [];
  const orphans = [];

  for (const [type, def] of Object.entries(elementDefinitions)) {
    const style = getDefaultStyle(type) || {};
    const props = getDefaultProps(type) || {};
    const allProps = [...(def.contentProps || []), ...(def.styleProps || [])];

    for (const prop of allProps) {
      if (prop.default === undefined || prop.default === null) continue;
      const kind = (def.contentProps || []).includes(prop) ? 'content' : 'style';
      const inRoute2 = kind === 'content'
        ? (props[prop.name] !== undefined)
        : (style[prop.name] !== undefined);

      const entry = `${type} | ${kind} | ${prop.name} | ${JSON.stringify(prop.default)}`;
      if (inRoute2) {
        duplicates.push(entry);
      } else {
        orphans.push(entry);
      }
    }
  }

  console.log('DUPLICATES_START');
  duplicates.forEach(d => console.log('DUP:' + d));
  console.log('DUPLICATES_END:' + duplicates.length);
  console.log('ORPHANS_START');
  orphans.forEach(o => console.log('ORP:' + o));
  console.log('ORPHANS_END:' + orphans.length);

  expect(true).toBe(true);
});
