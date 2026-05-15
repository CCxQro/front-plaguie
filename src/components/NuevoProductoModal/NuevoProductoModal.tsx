import { useEffect, useRef, useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useProviders } from '../../hooks/useProviders';
import { useUnits } from '../../hooks/useUnits';
import { useTechnicalSellerId } from '../../hooks/useTechnicalSellerId';
import { useCreateProduct } from '../../hooks/useCreateProduct';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];
const MAX_SIZE_MB = 5;

interface Props {
  onClose: () => void;
}

interface FormState {
  name: string;
  sku: string;
  description: string;
  categoryId: string;
  providerId: string;
  unitValue: string;
  price: string;
  stockActual: string;
  unitId: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  sku: '',
  description: '',
  categoryId: '',
  providerId: '',
  unitValue: '',
  price: '',
  stockActual: '',
  unitId: '',
};

export function NuevoProductoModal({ onClose }: Props) {
  const { data: categories = [], isLoading: loadingCats } = useCategories();
  const { data: providers = [], isLoading: loadingProvs } = useProviders();
  const { data: units = [], isLoading: loadingUnits } = useUnits();
  const { data: sellerId, isLoading: loadingSeller, error: sellerError } = useTechnicalSellerId();
  const { mutate: createProduct, isPending, isSuccess, error: createError } = useCreateProduct();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const loading = loadingCats || loadingProvs || loadingUnits || loadingSeller;

  useEffect(() => {
    if (sellerError) console.error('[NuevoProductoModal] seller error:', sellerError);
  }, [sellerError]);

  useEffect(() => {
    if (createError) console.error('[NuevoProductoModal] create product error:', createError);
  }, [createError]);

  function handleField(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
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

  function validate(): boolean {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) errors.name = 'Requerido';
    if (!form.sku.trim()) errors.sku = 'Requerido';
    if (!form.categoryId) errors.categoryId = 'Requerido';
    if (!form.providerId) errors.providerId = 'Requerido';
    if (!form.unitId) errors.unitId = 'Requerido';
    if (!form.unitValue || isNaN(Number(form.unitValue)) || Number(form.unitValue) <= 0)
      errors.unitValue = 'Valor inválido';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errors.price = 'Precio inválido';
    if (form.stockActual === '' || isNaN(Number(form.stockActual)) || Number(form.stockActual) < 0)
      errors.stockActual = 'Stock inválido';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit() {
    if (!validate() || !imageFile || !sellerId) return;
    createProduct(
      {
        imageFile,
        sellerId,
        name: form.name.trim(),
        sku: form.sku.trim(),
        categoryId: Number(form.categoryId),
        providerId: Number(form.providerId),
        unitValue: Number(form.unitValue),
        unitId: Number(form.unitId),
        description: form.description.trim(),
        price: Number(form.price).toFixed(5),
        stock: Number(form.stockActual),
        onProgress: setUploadProgress,
      },
      { onSuccess: () => setTimeout(onClose, 800) },
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex w-full max-w-175 max-h-[90vh] flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">

        {/* ── Header ── */}
        <div className="flex items-start justify-between border-b border-[#F1F5F9] px-6 pb-6 pt-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold leading-7 text-[#0F172B]">Nuevo Producto</h2>
            <p className="text-sm leading-5 text-[#62748E]">Agrega un nuevo producto al inventario</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 place-content-center rounded-full text-[#90A1B9] transition-colors hover:bg-[#F1F5F9] hover:text-[#314158]"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 pt-6">

            {/* Image picker */}
            <div>
              <Label text="Imagen del producto" required />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex min-h-24 w-full items-center justify-center overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white transition-colors hover:border-[#75C79E] hover:bg-[#F0FDF4]"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-24 w-full object-contain" />
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
              <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" onChange={handleImageChange} className="sr-only" />
              {imageError && <p className="mt-1 text-xs text-[#E7000B]">{imageError}</p>}
            </div>

            {/* Row 1: Nombre + SKU */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nombre del Producto" required error={fieldErrors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleField('name', e.target.value)}
                  placeholder="Ej: Fungicida X-100 Pro"
                  disabled={loading}
                  className={inputCls(!!fieldErrors.name)}
                />
              </Field>
              <Field label="SKU" required error={fieldErrors.sku}>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => handleField('sku', e.target.value)}
                  placeholder="Ej: FG-100-2024"
                  disabled={loading}
                  className={inputCls(!!fieldErrors.sku)}
                />
              </Field>
            </div>

            {/* Row 2: Categoría + Proveedor */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Categoría" required error={fieldErrors.categoryId}>
                <select
                  value={form.categoryId}
                  onChange={(e) => handleField('categoryId', e.target.value)}
                  disabled={loadingCats}
                  className={inputCls(!!fieldErrors.categoryId)}
                >
                  <option value="">Seleccionar…</option>
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Proveedor" required error={fieldErrors.providerId}>
                <select
                  value={form.providerId}
                  onChange={(e) => handleField('providerId', e.target.value)}
                  disabled={loadingProvs}
                  className={inputCls(!!fieldErrors.providerId)}
                >
                  <option value="">Ej: AgroQuim SA</option>
                  {providers.map((p) => (
                    <option key={p.providerId} value={p.providerId}>{p.name}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Row 3: Valor Unitario + Precio */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Valor Unitario" required error={fieldErrors.unitValue}>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.unitValue}
                  onChange={(e) => handleField('unitValue', e.target.value)}
                  placeholder="0"
                  disabled={loading}
                  className={inputCls(!!fieldErrors.unitValue)}
                />
              </Field>
              <Field label="Precio" required error={fieldErrors.price}>
                <input
                  type="number"
                  min="0"
                  step="0.00001"
                  value={form.price}
                  onChange={(e) => handleField('price', e.target.value)}
                  placeholder="0"
                  disabled={loading}
                  className={inputCls(!!fieldErrors.price)}
                />
              </Field>
            </div>

            {/* Row 4: Stock Actual + Unidad */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Stock Actual" required error={fieldErrors.stockActual}>
                <input
                  type="number"
                  min="0"
                  value={form.stockActual}
                  onChange={(e) => handleField('stockActual', e.target.value)}
                  placeholder="0"
                  disabled={loading}
                  className={inputCls(!!fieldErrors.stockActual)}
                />
              </Field>
              <Field label="Unidad" required error={fieldErrors.unitId}>
                <select
                  value={form.unitId}
                  onChange={(e) => handleField('unitId', e.target.value)}
                  disabled={loadingUnits}
                  className={inputCls(!!fieldErrors.unitId)}
                >
                  <option value="">Seleccionar…</option>
                  {units.map((u) => (
                    <option key={u.unitId} value={u.unitId}>{u.name}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Descripción */}
            <Field label="Descripción" required={false} error={fieldErrors.description}>
              <textarea
                value={form.description}
                onChange={(e) => handleField('description', e.target.value)}
                placeholder="Descripción detallada del producto..."
                rows={4}
                disabled={loading}
                className={`${inputCls(false)} resize-none`}
              />
            </Field>

            {/* Upload progress */}
            {isPending && uploadProgress > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs text-[#62748E]">Subiendo imagen… {uploadProgress}%</p>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#F1F5F9]">
                  <div className={`h-1.5 rounded-full bg-[#75C79E] transition-all w-(--w) [--w:${uploadProgress}%]`} />
                </div>
              </div>
            )}

            {/* Success */}
            {isSuccess && (
              <p className="rounded-[10px] border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm font-medium text-[#008236]">
                ¡Producto registrado con éxito!
              </p>
            )}

            {/* bottom padding so last field isn't flush against footer */}
            <div className="h-0" />
          </div>

          {/* ── Footer ── */}
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
              disabled={isPending || !imageFile || !sellerId || loading}
              className="flex-1 rounded-[10px] bg-[#75C79E] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#6ab080] disabled:opacity-50"
            >
              {isPending ? 'Guardando…' : 'Agregar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Helpers ── */

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <p className="mb-2 text-sm font-bold leading-5 text-[#314158]">
      {text}{required && <span className="ml-0.5 text-[#E7000B]">*</span>}
    </p>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label text={label} required={required} />
      {children}
      {error && <p className="mt-1 text-xs text-[#E7000B]">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return [
    'w-full rounded-[10px] border bg-white px-4 py-2.5 text-sm leading-[17px] text-[#0F172A]',
    'placeholder-[rgba(10,10,10,0.5)] outline-none transition-shadow',
    'focus:ring-2 focus:ring-[#75C79E]/40',
    hasError ? 'border-[#E7000B]/50' : 'border-[#E2E8F0]',
  ].join(' ');
}
