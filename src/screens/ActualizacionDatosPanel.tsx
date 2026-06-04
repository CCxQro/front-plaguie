import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadIngestionFile } from '../services/ingestion/ingestionService';
import { useIngestionRuns } from '../hooks/useIngestionRuns';
import { useIngestionProgress } from '../hooks/useIngestionProgress';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast/Toast';

export default function ActualizacionDatosPanel() {
  const { messages, dismissToast, success, error } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const queryClient = useQueryClient();
  const { data: runs, isLoading: isRunsLoading } = useIngestionRuns();

  const progressEvents = useIngestionProgress(
    (msg) => success('Éxito', msg),
    (msg) => error('Error', msg)
  );

  const uploadMutation = useMutation({
    mutationFn: uploadIngestionFile,
    onSuccess: (data) => {
      if (data.status === 'skipped/already ingested') {
        success('Archivo ya ingerido', data.message);
      } else {
        success('Archivo en cola', 'El archivo se está procesando en el servidor.');
      }
      setSelectedFile(null);
      // Reset input element
      const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      queryClient.invalidateQueries({ queryKey: ['ingestion-runs'] });
    },
    onError: (err: Error) => {
      error('Error al subir', err.message);
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.name.endsWith('.csv')) {
        error('Formato inválido', 'Solo se aceptan archivos CSV.');
        e.target.value = '';
        setSelectedFile(null);
        return;
      }
      if (file.size > 300 * 1024 * 1024) {
        error('Archivo demasiado grande', 'El límite es de 300MB.');
        e.target.value = '';
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-6xl mx-auto w-full">
      {/* Toasts overlay */}
      <ToastContainer messages={messages} onDismiss={dismissToast} />

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Actualización de Datos</h1>
        <p className="text-gray-600">
          Sube el archivo CSV de SENASICA para actualizar la base de datos de plagas y hospedantes. El archivo se procesará en segundo plano.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Subir archivo CSV</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input 
            id="csv-upload"
            type="file" 
            accept=".csv"
            onChange={handleFileChange}
            data-testid="file-upload-input"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2.5 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 cursor-pointer"
          />
          <button 
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
            data-testid="upload-button"
            className={`px-6 py-2.5 rounded-md font-medium text-white transition-colors flex-shrink-0
              ${!selectedFile || uploadMutation.isPending 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-[#75C79E] hover:bg-[#6ab080]'}`}
          >
            {uploadMutation.isPending ? 'Subiendo...' : 'Subir archivo'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3">Tamaño máximo permitido: 300 MB</p>
      </div>

      {/* Live Progress */}
      {Object.keys(progressEvents).length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Progreso en vivo</h2>
          <div className="flex flex-col gap-4">
            {Object.values(progressEvents).map((ev) => {
              const percent = ev.total > 0 ? Math.round((ev.processed / ev.total) * 100) : 0;
              return (
                <div key={ev.filename} data-testid="progress-card" className="p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-gray-800 truncate pr-4">{ev.filename}</span>
                    <span className="text-sm font-medium text-[#45556C] px-2 py-1 bg-white rounded shadow-sm border border-gray-100">
                      {ev.status === 'DONE' ? 'Completado' : ev.status === 'FAILED' ? 'Fallido' : 'Procesando...'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-[#75C79E] transition-all duration-300 w-(--fill) ease-out"
                      style={{ '--fill': `${percent}%` } as React.CSSProperties}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{percent}%</span>
                    <span>{ev.processed.toLocaleString()} / {ev.total.toLocaleString()} filas</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Historial de cargas</h2>
        </div>
        {isRunsLoading ? (
          <div className="p-8 text-center text-gray-500">Cargando historial...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Archivo</th>
                  <th className="px-6 py-4 font-medium">Fecha</th>
                  <th className="px-6 py-4 font-medium">Filas Insertadas</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {runs?.map((run) => {
                  const file = run.files && run.files.length > 0 ? run.files[0] : null;
                  return (
                    <tr key={run.id} data-testid="history-row" className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[200px]" title={file?.filename || 'Desconocido'}>
                        {file?.filename || 'Desconocido'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(run.startedAt).toLocaleString('es-MX', { 
                          dateStyle: 'medium', timeStyle: 'short' 
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right pr-12">
                        {file?.rowsInserted ? file.rowsInserted.toLocaleString() : 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${(run.status === 'COMPLETED' || run.status === 'DONE') ? 'bg-green-50 text-green-700 border-green-200' :
                            run.status === 'FAILED' ? 'bg-red-50 text-red-700 border-red-200' :
                            run.status === 'SKIPPED' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'}`}
                        >
                          {run.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {runs?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No se encontraron registros de ingesta. Sube un archivo para comenzar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
