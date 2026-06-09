import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import { BellIcon } from './BellIcon';
import { ChevronDownIcon } from './ChevronDownIcon';
import { CloseIcon } from './CloseIcon';
import { HumidityIcon } from './HumidityIcon';
import { InventoryGlyph } from './InventoryGlyph';
import { MetricAddUserIcon } from './MetricAddUserIcon';
import { MetricMoneyIcon } from './MetricMoneyIcon';
import { MetricPeopleIcon } from './MetricPeopleIcon';
import { PowerIcon } from './PowerIcon';
import { RainDropIcon } from './RainDropIcon';
import { RefreshIcon } from './RefreshIcon';
import { SearchIcon } from './SearchIcon';
import { WarningTriangleIcon } from './WarningTriangleIcon';
import { WindIcon } from './WindIcon';

const icons = [
  ['BellIcon', BellIcon],
  ['ChevronDownIcon', ChevronDownIcon],
  ['CloseIcon', CloseIcon],
  ['HumidityIcon', HumidityIcon],
  ['InventoryGlyph', InventoryGlyph],
  ['MetricAddUserIcon', MetricAddUserIcon],
  ['MetricMoneyIcon', MetricMoneyIcon],
  ['MetricPeopleIcon', MetricPeopleIcon],
  ['PowerIcon', PowerIcon],
  ['RainDropIcon', RainDropIcon],
  ['RefreshIcon', RefreshIcon],
  ['SearchIcon', SearchIcon],
  ['WarningTriangleIcon', WarningTriangleIcon],
  ['WindIcon', WindIcon],
] as const;

describe('Icons', () => {
  it.each(icons)('%s renders an svg', (_name, Icon) => {
    const { container } = render(<Icon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
