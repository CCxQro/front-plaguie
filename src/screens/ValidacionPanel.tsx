import { SidebarIcon } from '../components/Sidebar/SidebarIcons';

function ValidacionPanel() {
  return (
    <div
      data-testid="validacion-panel"
      className="flex min-h-full flex-1 items-center justify-center font-sans"
    >
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#DCFCE7]">
          <SidebarIcon icon="validacion" className="h-8 w-8 text-[#00A63E]" />
        </div>
        <h1 className="text-3xl font-bold text-[#101828]">Validación de Registros</h1>
        <p className="text-sm text-[#6A7282]">Aquí podrás revisar y validar los registros del sistema.</p>
        <span className="inline-flex items-center rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-medium text-[#92400E]">
          En desarrollo
        </span>
      </div>
    </div>
  );
}

export default ValidacionPanel;
