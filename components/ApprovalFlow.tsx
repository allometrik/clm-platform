'use client';

import { ApprovalFlow as ApprovalFlowType } from '@/lib/data';
import { CheckCircle, Clock, XCircle, ArrowRight, User } from 'lucide-react';

interface ApprovalFlowProps {
  approvalFlow: ApprovalFlowType;
}

export default function ApprovalFlow({ approvalFlow }: ApprovalFlowProps) {
  const statusConfig = {
    pendiente: { label: 'Pendiente', icon: Clock, color: 'bg-yellow-500' },
    aprobado: { label: 'Aprobado', icon: CheckCircle, color: 'bg-green-500' },
    rechazado: { label: 'Rechazado', icon: XCircle, color: 'bg-red-500' },
    devuelto: { label: 'Devuelto', icon: XCircle, color: 'bg-orange-500' },
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-primary-dark">Flujo de Aprobación</h3>
        <span className={`status-badge ${
          approvalFlow.status === 'completado' ? 'bg-green-500' :
          approvalFlow.status === 'rechazado' ? 'bg-red-500' :
          'bg-blue-500'
        } text-white`}>
          {approvalFlow.status === 'completado' ? 'Completado' :
           approvalFlow.status === 'rechazado' ? 'Rechazado' :
           'En Proceso'}
        </span>
      </div>

      <div className="space-y-4">
        {approvalFlow.steps.map((step, index) => {
          const StatusIcon = statusConfig[step.status].icon;
          const statusColor = statusConfig[step.status].color;
          const isCurrent = step.stepNumber === approvalFlow.currentStep;
          const isCompleted = step.status === 'aprobado';
          const isPending = step.status === 'pendiente' && isCurrent;

          return (
            <div key={step.stepNumber}>
              <div className={`flex items-center gap-4 p-4 rounded-lg ${
                isPending ? 'bg-blue-50 border-2 border-blue-500' :
                isCompleted ? 'bg-green-50' :
                'bg-gray-50'
              }`}>
                <div className={`status-badge ${statusColor} text-white flex items-center justify-center w-10 h-10 rounded-full`}>
                  <StatusIcon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-primary-dark">
                      Paso {step.stepNumber}: {step.role}
                    </h4>
                    {!step.required && (
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">Opcional</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{step.approver}</span>
                  </div>
                  {step.comments && (
                    <div className="mt-2 text-sm text-gray-700 bg-white p-2 rounded">
                      <strong>Comentarios:</strong> {step.comments}
                    </div>
                  )}
                  {step.completedDate && (
                    <div className="mt-1 text-xs text-gray-500">
                      Completado: {new Date(step.completedDate).toLocaleDateString('es-ES')}
                    </div>
                  )}
                </div>

                <div className={`status-badge ${statusColor} text-white`}>
                  {statusConfig[step.status].label}
                </div>
              </div>

              {index < approvalFlow.steps.length - 1 && (
                <div className="flex justify-center my-2">
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t">
        <p className="text-sm text-gray-600">
          <strong>Iniciado:</strong> {new Date(approvalFlow.startedDate).toLocaleDateString('es-ES')}
        </p>
        {approvalFlow.status === 'en_proceso' && (
          <div className="mt-4 flex gap-2">
            <button className="btn-accent text-sm">Aprobar</button>
            <button className="btn-secondary text-sm">Rechazar</button>
            <button className="btn-secondary text-sm">Devolver</button>
          </div>
        )}
      </div>
    </div>
  );
}

