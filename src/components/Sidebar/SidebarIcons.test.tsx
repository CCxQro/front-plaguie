import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import { IconLogoCheck, IconLogoLeaf, SidebarIcon, type SidebarIconName } from './SidebarIcons';

const NAMES: SidebarIconName[] = [
  'dashboard',
  'clientes',
  'inventario',
  'mapa',
  'informacion',
  'usuarios',
  'cubo',
  'validacion',
  'dashboards',
  'ajustes',
  'salir',
];

describe('SidebarIcon', () => {
  it.each(NAMES)('renders an svg for the "%s" icon', (name) => {
    const { container } = render(<SidebarIcon icon={name} className="h-5 w-5" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders the logo icons', () => {
    const leaf = render(<IconLogoLeaf className="h-6 w-6" />);
    expect(leaf.container.querySelector('svg')).toBeInTheDocument();
    const check = render(<IconLogoCheck className="h-6 w-6" />);
    expect(check.container.querySelector('svg')).toBeInTheDocument();
  });
});
