import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('../../hooks/useProduct', () => ({ useProduct: vi.fn() }));
vi.mock('../../hooks/useCategories', () => ({ useCategories: vi.fn() }));
vi.mock('../../hooks/useFirebaseImageUrl', () => ({ useFirebaseImageUrl: vi.fn() }));

import { useProduct } from '../../hooks/useProduct';
import { useCategories } from '../../hooks/useCategories';
import { useFirebaseImageUrl } from '../../hooks/useFirebaseImageUrl';
import { VerProductoModal } from './VerProductoModal';

const productHook = vi.mocked(useProduct);
const categoriesHook = vi.mocked(useCategories);
const imageHook = vi.mocked(useFirebaseImageUrl);

const product = (overrides = {}) => ({
  skuSellerId: 1,
  sku: 'NPK-1',
  name: 'Fertilizante NPK',
  stock: 50,
  categoryId: 1,
  categoryName: 'Fertilizantes',
  providerName: 'Proveedor X',
  sellerName: 'Vendedor Y',
  unitName: 'Litro',
  unitValue: 2,
  statusName: 'Activo',
  description: 'Un fertilizante',
  firebaseImageId: 'img/path',
  latestPrice: 100,
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  categoriesHook.mockReturnValue({ data: [{ categoryId: 1, name: 'Fertilizantes', colorHexa: '#10B981' }] } as never);
  imageHook.mockReturnValue({ data: undefined } as never);
});

describe('VerProductoModal', () => {
  it('shows the loading state', () => {
    productHook.mockReturnValue({ data: undefined, isLoading: true, error: null } as never);
    render(<VerProductoModal skuSellerId={1} onClose={vi.fn()} />);
    expect(screen.getByText(/Cargando producto/i)).toBeInTheDocument();
  });

  it('shows the error state', () => {
    productHook.mockReturnValue({ data: undefined, isLoading: false, error: new Error('x') } as never);
    render(<VerProductoModal skuSellerId={1} onClose={vi.fn()} />);
    expect(screen.getByText(/No se pudo cargar el producto/i)).toBeInTheDocument();
  });

  it('renders product details with normal stock and pluralized unit', () => {
    productHook.mockReturnValue({ data: product(), isLoading: false, error: null } as never);
    render(<VerProductoModal skuSellerId={1} onClose={vi.fn()} />);
    expect(screen.getByText('Fertilizante NPK')).toBeInTheDocument();
    expect(screen.getByText('En Stock')).toBeInTheDocument();
    expect(screen.getByText('2 Litros')).toBeInTheDocument();
    expect(screen.getByText('Proveedor X')).toBeInTheDocument();
  });

  it.each([
    [0, 'Agotado'],
    [5, 'Stock Crítico'],
    [15, 'Stock Bajo'],
  ])('shows the right label for stock %i', (stock, label) => {
    productHook.mockReturnValue({ data: product({ stock }), isLoading: false, error: null } as never);
    render(<VerProductoModal skuSellerId={1} onClose={vi.fn()} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('renders the firebase image when a url is available', () => {
    productHook.mockReturnValue({ data: product(), isLoading: false, error: null } as never);
    imageHook.mockReturnValue({ data: 'https://img/test.png' } as never);
    render(<VerProductoModal skuSellerId={1} onClose={vi.fn()} />);
    expect(screen.getByRole('img', { name: 'Fertilizante NPK' })).toBeInTheDocument();
  });

  it('handles singular unit and missing fields', () => {
    productHook.mockReturnValue({
      data: product({ unitValue: 1, providerName: '', description: '' }),
      isLoading: false,
      error: null,
    } as never);
    render(<VerProductoModal skuSellerId={1} onClose={vi.fn()} />);
    expect(screen.getByText('1 Litro')).toBeInTheDocument();
    expect(screen.getByText('Sin descripción.')).toBeInTheDocument();
  });

  it('closes from the footer button', () => {
    productHook.mockReturnValue({ data: product(), isLoading: false, error: null } as never);
    const onClose = vi.fn();
    render(<VerProductoModal skuSellerId={1} onClose={onClose} />);
    const closeButtons = screen.getAllByRole('button', { name: 'Cerrar' });
    fireEvent.click(closeButtons[closeButtons.length - 1]); // footer button
    expect(onClose).toHaveBeenCalled();
  });
});
