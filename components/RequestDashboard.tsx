'use client';

import { ContractRequest, RequestStatus } from '@/lib/data';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  Filter,
  Calendar,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Eye
} from 'lucide-react';
import { useState } from 'react';

interface RequestDashboardProps {
  requests: ContractRequest[];
}

const statusConfig: Record<RequestStatus, { label: string; color: string; icon: any }> = {
  nueva: { label: 'Nueva', color: 'bg-blue-100 text-blue-700', icon: Ticket },
  en_revision: { label: 'En Revisión', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  asignada: { label: 'Asignada', color: 'bg-purple-100 text-purple-700', icon: Users },
  en_proceso: { label: 'En Proceso', color: 'bg-orange-100 text-orange-700', icon: TrendingUp },
  completada: { label: 'Completada', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rechazada: { label: 'Rechazada', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const priorityConfig = {
  baja: { label: 'Baja', color: 'text-gray-600', icon: ArrowDown },
  media: { label: 'Media', color: 'text-blue-600', icon: ArrowRight },
  alta: { label: 'Alta', color: 'text-[#E85D4E]', icon: ArrowUp },
  urgente: { label: 'Urgente', color: 'text-[#E85D4E]', icon: AlertCircle },
};

export default function RequestDashboard({ requests }: RequestDashboardProps) {
  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<'baja' | 'media' | 'alta' | 'urgente' | 'all'>('all');
  const [selectedRequest, setSelectedRequest] = useState<ContractRequest | null>(null);

  // Calculate statistics
  const totalRequests = requests.length;
  const newRequests = requests.filter(r => r.status === 'nueva').length;
  const inProgressRequests = requests.filter(r => ['asignada', 'en_proceso', 'en_revision'].includes(r.status)).length;
  const completedRequests = requests.filter(r => r.status === 'completada').length;
  
  // Calculate average time (mock calculation)
  const avgResponseTime = '2.3 días';

  // Filter requests
  let filteredRequests = requests;
  if (filterStatus !== 'all') {
    filteredRequests = filteredRequests.filter(r => r.status === filterStatus);
  }
  if (filterPriority !== 'all') {
    filteredRequests = filteredRequests.filter(r => r.priority === filterPriority);
  }

  const getDaysFromCreation = (createdDate: string) => {
    const days = Math.floor(
      (new Date().getTime() - new Date(createdDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Modern Statistics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Solicitudes */}
        <div className="group relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                <Ticket className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-blue-100 mb-1">Total Solicitudes</p>
            <p className="text-3xl font-bold">{totalRequests}</p>
          </div>
        </div>

        {/* Nuevas */}
        <div className="group relative bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-indigo-100 mb-1">Nuevas</p>
            <p className="text-3xl font-bold">{newRequests}</p>
          </div>
        </div>

        {/* En Proceso */}
        <div className="group relative bg-gradient-to-br from-[#E85D4E] to-[#D14839] rounded-2xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden ring-2 ring-[#E85D4E] ring-offset-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-orange-100 mb-1">En Proceso</p>
            <p className="text-3xl font-bold">{inProgressRequests}</p>
          </div>
        </div>

        {/* Completadas */}
        <div className="group relative bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-emerald-100 mb-1">Completadas</p>
            <p className="text-3xl font-bold">{completedRequests}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Estado:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as RequestStatus | 'all')}
                className="text-sm border-2 border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-[#E85D4E]/20 focus:border-[#E85D4E] transition-all"
              >
                <option value="all">Todos</option>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Prioridad:</span>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="text-sm border-2 border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-[#E85D4E]/20 focus:border-[#E85D4E] transition-all"
              >
                <option value="all">Todas</option>
                {Object.entries(priorityConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const StatusIcon = statusConfig[request.status].icon;
          const PriorityIcon = priorityConfig[request.priority].icon;
          const daysOpen = getDaysFromCreation(request.createdDate);
          
          return (
            <div
              key={request.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-gray-500">{request.id}</span>
                      <h3 className="text-lg font-semibold text-primary-dark">
                        {request.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[request.status].color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[request.status].label}
                      </span>
                      <span className={`inline-flex items-center text-xs font-medium ${priorityConfig[request.priority].color}`}>
                        <PriorityIcon className="w-3 h-3 mr-1" />
                        {priorityConfig[request.priority].label}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {request.contractType}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="text-primary hover:text-primary-dark"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">{request.description}</p>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Solicitante</p>
                    <p className="text-sm font-medium text-gray-700">{request.requester}</p>
                    <p className="text-xs text-gray-500">{request.department}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Fecha Creación</p>
                    <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(request.createdDate).toLocaleDateString('es-ES')}
                    </p>
                    <p className="text-xs text-gray-500">Hace {daysOpen} días</p>
                  </div>

                  {request.assignedTo && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Asignado a</p>
                      <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {request.assignedTo}
                      </p>
                      {request.assignedDate && (
                        <p className="text-xs text-gray-500">
                          {new Date(request.assignedDate).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                  )}

                  {request.completedDate && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Fecha Completada</p>
                      <p className="text-sm font-medium text-green-700 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {new Date(request.completedDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Business Justification */}
                {request.businessJustification && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Justificación de Negocio</p>
                    <p className="text-sm text-gray-700">{request.businessJustification}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay solicitudes con los filtros seleccionados</p>
        </div>
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-sm font-mono text-gray-500">{selectedRequest.id}</span>
                  <h2 className="text-2xl font-bold text-primary-dark mt-1">
                    {selectedRequest.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {(() => {
                  const ModalPriorityIcon = priorityConfig[selectedRequest.priority].icon;
                  return (
                    <div className="flex gap-2">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[selectedRequest.status].color}`}>
                        {statusConfig[selectedRequest.status].label}
                      </span>
                      <span className={`inline-flex items-center text-sm font-medium ${priorityConfig[selectedRequest.priority].color}`}>
                        <ModalPriorityIcon className="w-4 h-4 mr-1" />
                        Prioridad: {priorityConfig[selectedRequest.priority].label}
                      </span>
                    </div>
                  );
                })()}

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Descripción</h3>
                  <p className="text-gray-600">{selectedRequest.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Solicitante</h3>
                    <p className="text-gray-600">{selectedRequest.requester}</p>
                    <p className="text-sm text-gray-500">{selectedRequest.department}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Tipo de Contrato</h3>
                    <p className="text-gray-600">{selectedRequest.contractType}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Justificación de Negocio</h3>
                  <p className="text-gray-600">{selectedRequest.businessJustification}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Fecha de Creación</h3>
                    <p className="text-gray-600">
                      {new Date(selectedRequest.createdDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  {selectedRequest.assignedTo && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-1">Asignado a</h3>
                      <p className="text-gray-600">{selectedRequest.assignedTo}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="btn-primary flex-1">
                  Procesar Solicitud
                </button>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="btn-secondary"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

