'use client';

import { useState } from 'react';
import { mockVersions, mockRedlines } from '@/lib/data';
import { GitBranch, FileText, User, Calendar, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function VersionControl({ contractId }: { contractId: string }) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const versions = mockVersions.filter((v) => v.contractId === contractId);
  const redlines = mockRedlines.filter((r) =>
    versions.some((v) => v.id === r.versionId)
  );

  const statusConfig = {
    activa: { label: 'Activa', icon: Eye, color: 'bg-green-500' },
    historial: { label: 'Historial', icon: FileText, color: 'bg-gray-400' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary-dark">Control de Versiones</h2>
        <button className="btn-primary">Nueva Versión</button>
      </div>

      {/* Lista de versiones */}
      <div className="space-y-4">
        {versions.map((version) => {
          const StatusIcon = statusConfig[version.status].icon;
          const statusColor = statusConfig[version.status].color;
          const versionRedlines = redlines.filter((r) => r.versionId === version.id);

          return (
            <div key={version.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <GitBranch className="w-6 h-6 text-primary-dark" />
                  <div>
                    <h3 className="text-lg font-semibold text-primary-dark">
                      Versión {version.versionNumber}
                    </h3>
                    <p className="text-sm text-gray-600">{version.changes}</p>
                  </div>
                </div>
                <div className={`status-badge ${statusColor} text-white flex items-center gap-1`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusConfig[version.status].label}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <div>
                    <span className="font-medium">Creada por:</span>
                    <div>{version.createdBy}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <div>
                    <span className="font-medium">Fecha:</span>
                    <div>{new Date(version.createdDate).toLocaleDateString('es-ES')}</div>
                  </div>
                </div>
                {versionRedlines.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <div>
                      <span className="font-medium">Redlines:</span>
                      <div>{versionRedlines.length} propuestas</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedVersion(version.id)}
                  className="btn-primary text-sm"
                >
                  Ver Contenido
                </button>
                {version.status === 'activa' && (
                  <button className="btn-secondary text-sm">Comparar Versiones</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Redlines */}
      {redlines.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-primary-dark mb-4">Propuestas de Cambio (Redlines)</h3>
          <div className="space-y-4">
            {redlines.map((redline) => {
              const redlineStatusConfig = {
                pendiente: { label: 'Pendiente', icon: Clock, color: 'bg-yellow-500' },
                aceptado: { label: 'Aceptado', icon: CheckCircle, color: 'bg-green-500' },
                rechazado: { label: 'Rechazado', icon: XCircle, color: 'bg-red-500' },
              };
              const StatusIcon = redlineStatusConfig[redline.status].icon;
              const statusColor = redlineStatusConfig[redline.status].color;

              return (
                <div key={redline.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`status-badge ${statusColor} text-white flex items-center gap-1`}>
                          <StatusIcon className="w-4 h-4" />
                          {redlineStatusConfig[redline.status].label}
                        </span>
                        <span className="text-sm text-gray-600">
                          por {redline.suggestedBy}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded">
                      <p className="text-xs font-medium text-amber-800 mb-1">Texto Original</p>
                      <p className="text-sm text-gray-700 line-through">{redline.originalText}</p>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                      <p className="text-xs font-medium text-green-800 mb-1">Texto Propuesto</p>
                      <p className="text-sm text-gray-700">{redline.proposedText}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-xs font-medium text-blue-800 mb-1">Comentario</p>
                      <p className="text-sm text-gray-700">{redline.comment}</p>
                    </div>
                  </div>

                  {redline.status === 'pendiente' && (
                    <div className="flex gap-2 mt-4">
                      <button className="btn-accent text-sm flex-1">Aceptar</button>
                      <button className="btn-secondary text-sm flex-1">Rechazar</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de contenido */}
      {selectedVersion && (() => {
        const version = versions.find((v) => v.id === selectedVersion);
        if (!version) return null;

        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-primary-dark">
                    Versión {version.versionNumber} - Contenido
                  </h3>
                  <button
                    onClick={() => setSelectedVersion(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Cambios:</strong> {version.changes}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Creada por:</strong> {version.createdBy} el{' '}
                    {new Date(version.createdDate).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{version.content}</p>
                </div>
                <button
                  onClick={() => setSelectedVersion(null)}
                  className="btn-secondary mt-4"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

