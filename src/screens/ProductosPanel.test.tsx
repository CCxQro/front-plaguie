import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('../hooks/useProducts', () => ({ useProducts: vi.fn() }));
vi.mock('../hooks/useCategories', () => ({ useCategories: vi.fn() }));
vi.mock('../hooks/useTechnicalSellerId', () => ({ useTechnicalSellerId: vi.fn() }));

vi.mock('../components/NuevoProductoModal/NuevoProductoModal', () => ({
  NuevoProductoModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="nuevo-modal"><button onClick={onClose}>cerrar</button></div>
  ),
}));
vi.mock('../components/VerProductoModal/VerProductoModal', () => ({
  VerProductoModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="ver-modal"><button onClick={onClose}>cerrar</button></div>
  ),
}));
vi.mock('../components/EditarProductoModal/EditarProductoModal', () => ({
  EditarProductoModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="editar-modal"><button onClick={onClose}>cerrar</button></div>
  ),
}));
vi.mock('../components/DataTable/DataTable', () => ({
  DataTable: ({ rows, headerActionText, emptyText, onView, onEdit, onDelete }: {
    rows: { id: string }[];
    headerActionText: string;
    emptyText: string;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
  }) => (
    <div data-testid="data-table">
      <span data-testid="header-action">{headerActionText}</span>
      <span data-testid="row-count">{rows.length}</span>
      <span data-testid="empty-text">{emptyText}</span>
      <button onClick={() => onView('1')}>view</button>
      <button onClick={() => onEdit('1')}>edit</button>
      <button onClick={() => onDelete('1')}>delete</button>
    </div>
  ),
}));

import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useTechnicalSellerId } from '../hooks/useTechnicalSellerId';
import ProductosPanel from './ProductosPanel';

const productsHook = vi.mocked(useProducts);
const categoriesHook = vi.mocked(useCategories);
const sellerHook = vi.mocked(useTechnicalSellerId);

const products = [
  { skuSellerId: 1, name: 'Fertilizante NPK', sku: 'NPK-1', categoryName: 'Fertilizantes', categoryId: 1, stock: 50, unitValue: 1, unitName: 'Litro', firebaseImageId: null, latestPrice: 100 },
  { skuSellerId: 2, name: 'Insecticida', sku: 'INS-2', categoryName: 'Insecticidas', categoryId: 2, stock: 0, unitValue: 2, unitName: 'Kilo', firebaseImageId: 'img', latestPrice: null },
  { skuSellerId: 3, name: 'Herbicida', sku: 'HRB-3', categoryName: 'Herbicidas', categoryId: 3, stock: 5, unitValue: 1, latestPrice: 50 },
];
const categories = [
  { categoryId: 1, name: 'Fertilizantes', colorHexa: '#10B981' },
  { categoryId: 2, name: 'Insecticidas', colorHexa: '#F59E0B' },
  { categoryId: 3, name: 'Herbicidas', colorHexa: '#EF4444' },
];

beforeEach(() => {
  vi.clearAllMocks();
  sellerHook.mockReturnValue({ data: 7, isLoading: false, error: null } as never);
  productsHook.mockReturnValue({ data: products, isLoading: false, error: null } as never);
  categoriesHook.mockReturnValue({ data: categories } as never);
});

describe('ProductosPanel', () => {
  it('renders all products with the header count', () => {
    render(<ProductosPanel />);
    expect(screen.getByTestId('row-count')).toHaveTextContent('3');
    expect(screen.getByTestId('header-action')).toHaveTextContent('Mostrando 3 productos');
  });

  it('filters by search term', () => {
    render(<ProductosPanel />);
    fireEvent.change(screen.getByPlaceholderText(/Buscar productos/i), { target: { value: 'NPK' } });
    expect(screen.getByTestId('row-count')).toHaveTextContent('1');
  });

  it('filters by category and stock state', () => {
    render(<ProductosPanel />);
    const [categorySelect, stockSelect] = screen.getAllByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'fertilizantes' } });
    expect(screen.getByTestId('row-count')).toHaveTextContent('1');

    fireEvent.change(categorySelect, { target: { value: '' } });
    fireEvent.change(stockSelect, { target: { value: 'agotado' } });
    expect(screen.getByTestId('row-count')).toHaveTextContent('1');
  });

  it('opens and closes the new product modal', () => {
    render(<ProductosPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Nuevo Producto/i }));
    expect(screen.getByTestId('nuevo-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('nuevo-modal').querySelector('button')!);
    expect(screen.queryByTestId('nuevo-modal')).toBeNull();
  });

  it('opens the view and edit modals from the table, and logs delete', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    render(<ProductosPanel />);

    fireEvent.click(screen.getByRole('button', { name: 'view' }));
    expect(screen.getByTestId('ver-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('ver-modal').querySelector('button')!);

    fireEvent.click(screen.getByRole('button', { name: 'edit' }));
    expect(screen.getByTestId('editar-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'delete' }));
    expect(logSpy).toHaveBeenCalledWith('eliminar', expect.objectContaining({ id: '1' }));
  });

  it('shows a loading header while fetching', () => {
    sellerHook.mockReturnValue({ data: undefined, isLoading: true, error: null } as never);
    productsHook.mockReturnValue({ data: [], isLoading: true, error: null } as never);
    render(<ProductosPanel />);
    expect(screen.getByTestId('header-action')).toHaveTextContent('Cargando');
    expect(screen.getByTestId('empty-text')).toHaveTextContent('Cargando productos');
  });
});
