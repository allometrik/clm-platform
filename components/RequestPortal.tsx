'use client';

import { ContractRequest, RequestStatus } from '@/lib/data';
import { Ticket, User, Building, Calendar, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface RequestPortalProps {
  requests: ContractRequest[];
}

const statusConfig: Record<RequestStatus, { label: string; icon: any; color: string; textColor: string }> = {
  nueva: {
    label: 'Nueva',
    icon: Ticket,
    color: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  en_revision: {
    label: 'En Revisión',
    icon: Clock,
    color: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  asignada: {
    label: 'Asignada',
    icon: User,
    color: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  en_proceso: {
    label: 'En Proceso',
    icon: Clock,
    color: 'bg-orange-50',
    textColor: 'text-orange-700',
  },
  completada: {
    label: 'Completada',
    icon: CheckCircle,
    color: 'bg-emerald-50',
    textColor: 'text-emerald-700',
  },
  rechazada: {
    label: 'Rechazada',
    icon: XCircle,
    color: 'bg-red-50',
    textColor: 'text-red-700',
  },
};

const priorityConfig = {
  baja: { label: 'Baja', color: 'bg-gray-100', textColor: 'text-gray-700' },
  media: { label: 'Media', color: 'bg-blue-50', textColor: 'text-blue-700' },
  alta: { label: 'Alta', color: 'bg-orange-50', textColor: 'text-[#E85D4E]' },
  urgente: { label: 'Urgente', color: 'bg-[#FFE5E2]', textColor: 'text-[#E85D4E]' },
};

export default function RequestPortal({ requests }: RequestPortalProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {requests.map((request) => {
          const StatusIcon = statusConfig[request.status].icon;
          const statusConfig_item = statusConfig[request.status];
          const priority = priorityConfig[request.priority];

          return (
            <div key={request.id} className="card hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-primary-dark">{request.title}</h3>
                    <span className={`status-badge ${priority.color} ${priority.textColor} text-xs`}>
                      {priority.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{request.description}</p>
                </div>
                <div className={`status-badge ${statusConfig_item.color} ${statusConfig_item.textColor} flex items-center gap-1.5 flex-shrink-0`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span className="text-xs">{statusConfig_item.label}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <div>
                    <span className="font-medium">Solicitante:</span>
                    <div>{request.requester}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="w-4 h-4" />
                  <div>
                    <span className="font-medium">Departamento:</span>
                    <div>{request.department}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <div>
                    <span className="font-medium">Creada:</span>
                    <div>{new Date(request.createdDate).toLocaleDateString('es-ES')}</div>
                  </div>
                </div>
              </div>

              {request.assignedTo && (
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Asignado a:</span> {request.assignedTo}
                  {request.assignedDate && (
                    <span className="ml-2 text-xs">
                      ({new Date(request.assignedDate).toLocaleDateString('es-ES')})
                    </span>
                  )}
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Justificación de negocio:</span>
                  <span className="text-gray-600 ml-2">{request.businessJustification}</span>
                </p>
              </div>

              <div className="flex gap-2">
                <button className="btn-primary text-sm flex-1">Ver Detalles</button>
                {request.status === 'nueva' && (
                  <button className="btn-accent text-sm">Asignar</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

