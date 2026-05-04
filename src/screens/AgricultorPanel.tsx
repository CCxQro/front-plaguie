import useAuthStore from '../services/Contexts/useAuthStore';

function AgricultorPanel() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center font-sans">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-[#DCFCE7] rounded-full flex items-center justify-center">
          <span className="text-3xl">🌱</span>
        </div>
        <h1 className="text-3xl font-bold text-[#101828]">Panel de Agricultor</h1>
        <p className="text-base text-[#4A5565]">
          Bienvenido, <span className="font-semibold">{user?.name ?? 'Agricultor'}</span>
        </p>
        <p className="text-sm text-[#6A7282]">Gestión de cultivos y monitoreo de plagas</p>
      </div>
    </div>
  );
}

export default AgricultorPanel;
