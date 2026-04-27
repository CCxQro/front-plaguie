import useAuthStore from '../services/Contexts/useAuthStore';

function SalesTechnicianPanel() {
  const { user } = useAuthStore();
  const userName = user?.name ?? 'Técnico';

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-[#F9FAFB] font-sans">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-[#DBEAFE] rounded-full flex items-center justify-center">
          <span className="text-3xl">🧪</span>
        </div>
        <h1 className="text-3xl font-bold text-[#101828]">Panel de Técnico de Ventas</h1>
        <p className="text-base text-[#4A5565]">
          Bienvenido, <span className="font-semibold">{userName}</span>
        </p>
        <p className="text-sm text-[#6A7282]">Inicio</p>
      </div>
    </div>
  );
}

export default SalesTechnicianPanel;
