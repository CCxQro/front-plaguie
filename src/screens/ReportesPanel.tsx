function ReportesPanel() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-[#F9FAFB] font-sans">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-[#DBEAFE] rounded-full flex items-center justify-center">
          <span className="text-3xl">📊</span>
        </div>
        <h1 className="text-3xl font-bold text-[#101828]">Reportes</h1>
        <p className="text-sm text-[#6A7282]">Revisa los reportes y estadísticas.</p>
      </div>
    </div>
  );
}

export default ReportesPanel;
