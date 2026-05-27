import { useRef, useState } from 'react';
import { NuevoPrecioModal } from '../NuevoPrecioModal/NuevoPrecioModal';
import { AjustarStockModal } from '../AjustarStockModal/AjustarStockModal';
import { useProduct } from '../../hooks/useProduct';
import { useCategories } from '../../hooks/useCategories';
import { useProviders } from '../../hooks/useProviders';
import { useUnits } from '../../hooks/useUnits';
import { useUpdateProduct } from '../../hooks/useUpdateProduct';
import { useFirebaseImageUrl } from '../../hooks/useFirebaseImageUrl';
import type { UpdateProductPayload } from '../../types/Product';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];
const MAX_SIZE_MB = 5;

interface Props {
  skuSellerId: number;
  onClose: () => void;
}

interface FormState {
  name: string;
  sku: string;
  categoryId: string;
  providerId: string;
  unitValue: string;
  unitId: string;
  description: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  sku: '',
  categoryId: '',
  providerId: '',
  unitValue: '',
  unitId: '',
  description: '',
};

export function EditarProductoModal({ skuSellerId, onClose }: Props) {
  const { data: product, isLoading, error } = useProduct(skuSellerId);
  const { data: categories = [] } = useCategories();
  const { data: providers = [] } = useProviders();
  const { data: units = [] } = useUnits();
  const { mutate: updateProductMutation, isPending, isSuccess, error: updateError } = useUpdateProduct();
  const { data: existingImageUrl } = useFirebaseImageUrl(product?.firebaseImageId);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [hydratedForId, setHydratedForId] = useState<number | null>(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize the form once per product. Subsequent refetches (after a price or
  // stock mutation) refresh the displayed badges but preserve the user's edits.
  if (product && hydratedForId !== skuSellerId) {
    setHydratedForId(skuSellerId);
    setForm({
      name: product.name ?? '',
      sku: product.sku ?? '',
      categoryId: product.categoryId != null ? String(product.categoryId) : '',
      providerId: product.providerId != null ? String(product.providerId) : '',
      unitValue: product.unitValue != null ? String(product.unitValue) : '',
      unitId: product.unitId != null ? String(product.unitId) : '',
      description: product.description ?? '',
    });
  }

  function handleField<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setImageError('Solo se aceptan archivos .jpg o .png.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setImageError(`El archivo no debe superar ${MAX_SIZE_MB} MB.`);
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;
    const payload: UpdateProductPayload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      categoryId: form.categoryId ? Number(form.categoryId) : undefined,
      providerId: form.providerId ? Number(form.providerId) : undefined,
      unitValue: form.unitValue ? Number(form.unitValue) : undefined,
      unitId: form.unitId ? Number(form.unitId) : undefined,
      description: form.description.trim(),
      statusId: product.statusId,
      firebaseImageId: product.firebaseImageId,
    };
    updateProductMutation(
      { skuSellerId, payload, imageFile, onProgress: setUploadProgress },
      { onSuccess: () => setTimeout(onClose, 600) },
    );
  }

  const currentPrice = product?.latestPrice ? Number(product.latestPrice) : 0;
  const currentStock = product?.stock ?? 0;
  const currentUnitName = product?.unitName ?? '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex w-full max-w-175 max-h-[90vh] flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#F1F5F9] px-6 pb-6 pt-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold leading-7 text-[#0F172B]">Editar Producto</h2>
            <p className="text-sm leading-5 text-[#62748E]">
              Actualiza la información del producto · SKU: {product?.sku ?? form.sku ?? '—'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 place-content-center rounded-full text-[#90A1B9] transition-colors hover:bg-[#F1F5F9] hover:text-[#314158]"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 pt-6">
            {isLoading && (
              <p className="py-12 text-center text-sm text-[#62748E]">Cargando producto…</p>
            )}

            {error && !isLoading && (
              <p className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#B91C1C]">
                No se pudo cargar el producto.
              </p>
            )}

            {product && (
              <>
                {/* Quick actions: Price + Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setShowPriceModal(true)}
                    className="group flex items-center justify-between rounded-[12px] border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-4 text-left transition-colors hover:bg-[#DCFCE7]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-content-center rounded-full bg-white">
                        <svg viewBox="0 0 20 20" className="h-5 w-5 text-[#00A63E]" fill="none" aria-hidden="true">
                          <path
                            d="M10 1.67v16.66M14.17 5H7.92a2.71 2.71 0 0 0 0 5.42h4.16a2.71 2.71 0 0 1 0 5.41H5"
                            stroke="currentColor"
                            strokeWidth="1.67"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-xs leading-4 text-[#008236]">Precio actual</p>
                        <p className="text-lg font-bold leading-6 text-[#0F172B] tabular-nums">
                          ${currentPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#008236] transition-transform group-hover:translate-x-0.5">
                      Actualizar
                      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                        <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowStockModal(true)}
                    className="group flex items-center justify-between rounded-[12px] border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-4 text-left transition-colors hover:bg-[#DBEAFE]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-content-center rounded-full bg-white">
                        <svg viewBox="0 0 20 20" className="h-5 w-5 text-[#2563EB]" fill="none" aria-hidden="true">
                          <path
                            d="M16.67 5l-6.67 3.33L3.33 5m13.34 0l-6.67-3.33L3.33 5m13.34 0v10l-6.67 3.33m-6.67-13.33v10l6.67 3.33m0-10v10"
                            stroke="currentColor"
                            strokeWidth="1.67"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-xs leading-4 text-[#1D4ED8]">Stock actual</p>
                        <p className="text-lg font-bold leading-6 text-[#0F172B] tabular-nums">
                          {currentStock}{' '}
                          <span className="text-sm font-medium text-[#62748E]">
                            {currentUnitName}
                            {currentStock === 1 ? '' : 's'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#1D4ED8] transition-transform group-hover:translate-x-0.5">
                      Ajustar
                      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                        <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </button>
                </div>

                {/* Image */}
                <div>
                  <label className="mb-2 block text-sm font-bold leading-5 text-[#314158]">
                    Imagen del producto
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isPending}
                    className="flex min-h-24 w-full items-center justify-center overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white transition-colors hover:border-[#75C79E] hover:bg-[#F0FDF4] disabled:opacity-50"
                  >
                    {imagePreview || existingImageUrl ? (
                      <img
                        src={imagePreview ?? existingImageUrl}
                        alt="Imagen del producto"
                        className="h-24 w-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 py-5 text-[#90A1B9]">
                        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
                          <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
                          <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M3 15l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-sm font-medium">Seleccionar imagen</span>
                        <span className="text-xs">JPG o PNG · máx. 5 MB</span>
                      </div>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                  {imageError && <p className="mt-1 text-xs text-[#E7000B]">{imageError}</p>}
                </div>

                {/* Row 1: Nombre + SKU */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nombre del Producto" required>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleField('name', e.target.value)}
                      disabled={isPending}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="SKU" required>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) => handleField('sku', e.target.value)}
                      disabled={isPending}
                      className={inputCls}
                    />
                  </Field>
                </div>

                {/* Row 2: Categoría + Proveedor */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Categoría" required>
                    <select
                      value={form.categoryId}
                      onChange={(e) => handleField('categoryId', e.target.value)}
                      disabled={isPending}
                      className={inputCls}
                    >
                      <option value="">Seleccionar…</option>
                      {categories.map((c) => (
                        <option key={c.categoryId} value={c.categoryId}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Proveedor" required>
                    <select
                      value={form.providerId}
                      onChange={(e) => handleField('providerId', e.target.value)}
                      disabled={isPending}
                      className={inputCls}
                    >
                      <option value="">Seleccionar…</option>
                      {providers.map((p) => (
                        <option key={p.providerId} value={p.providerId}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Row 3: Valor Unitario + Unidad */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Valor Unitario" required>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.unitValue}
                      onChange={(e) => handleField('unitValue', e.target.value)}
                      disabled={isPending}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Unidad" required>
                    <select
                      value={form.unitId}
                      onChange={(e) => handleField('unitId', e.target.value)}
                      disabled={isPending}
                      className={inputCls}
                    >
                      <option value="">Seleccionar…</option>
                      {units.map((u) => (
                        <option key={u.unitId} value={u.unitId}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Description */}
                <Field label="Descripción">
                  <textarea
                    value={form.description}
                    onChange={(e) => handleField('description', e.target.value)}
                    rows={4}
                    disabled={isPending}
                    className={`${inputCls} resize-none`}
                  />
                </Field>

                {isPending && uploadProgress > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs text-[#62748E]">Subiendo imagen… {uploadProgress}%</p>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#F1F5F9]">
                      <div className={`h-1.5 rounded-full bg-[#75C79E] transition-all w-(--w) [--w:${uploadProgress}%]`} />
                    </div>
                  </div>
                )}

                {updateError && (
                  <p className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#B91C1C]">
                    No se pudo actualizar el producto.
                  </p>
                )}

                {isSuccess && (
                  <p className="rounded-[10px] border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm font-medium text-[#008236]">
                    ¡Producto actualizado!
                  </p>
                )}

                <div className="h-0" />
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-[#F1F5F9] bg-[#F8FAFC] px-6 py-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 rounded-[10px] border border-[#E2E8F0] bg-white py-2.5 text-sm font-bold text-[#314158] transition-colors hover:bg-[#F1F5F9] disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!product || isPending}
              className="flex-1 rounded-[10px] bg-[#75C79E] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#6ab080] disabled:opacity-50"
            >
              {isPending ? 'Guardando…' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>

      {/* Sub-modals */}
      {showPriceModal && product && (
        <NuevoPrecioModal
          skuSellerId={skuSellerId}
          productName={product.name}
          currentPrice={currentPrice}
          unitName={currentUnitName}
          onClose={() => setShowPriceModal(false)}
        />
      )}

      {showStockModal && product && (
        <AjustarStockModal
          skuSellerId={skuSellerId}
          productName={product.name}
          currentStock={currentStock}
          unitName={currentUnitName}
          onClose={() => setShowStockModal(false)}
        />
      )}
    </div>
  );
}

const inputCls = [
  'w-full rounded-[10px] border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm leading-[17px] text-[#0F172A]',
  'placeholder-[rgba(10,10,10,0.5)] outline-none transition-shadow',
  'focus:ring-2 focus:ring-[#75C79E]/40 disabled:opacity-60',
].join(' ');

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold leading-5 text-[#314158]">
        {label}
        {required && <span className="ml-0.5 text-[#E7000B]">*</span>}
      </p>
      {children}
    </div>
  );
}
