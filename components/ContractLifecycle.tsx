'use client';

import { Contract, ContractStatus } from '@/lib/data';
import { 
  FileText, 
  Edit, 
  Users, 
  CheckCircle, 
  Archive, 
  Activity, 
  RotateCw, 
  Calendar,
  DollarSign,
  Building,
  AlertCircle,
  TrendingUp,
  Clock,
  Eye
} from 'lucide-react';
import { useState } from 'react';

interface ContractLifecycleProps {
  contracts: Contract[];
  onContractClick: (contract: Contract) => void;
}

const lifecyclePhases = [
  { key: 'borrador', label: 'Borrador', icon: Edit, color: 'bg-gray-100 text-gray-600' },
  { key: 'negociacion', label: 'Negociación', icon: Users, color: 'bg-blue-100 text-blue-600' },
  { key: 'firma', label: 'Firma', icon: FileText, color: 'bg-purple-100 text-purple-600' },
  { key: 'archivado', label: 'Archivado', icon: Archive, color: 'bg-green-100 text-green-600' },
  { key: 'cumplimiento', label: 'Cumplimiento', icon: Activity, color: 'bg-teal-100 text-teal-600' },
  { key: 'renovacion', label: 'Renovación', icon: RotateCw, color: 'bg-orange-100 text-orange-600' },
  { key: 'vencido', label: 'Vencido', icon: AlertCircle, color: 'bg-red-100 text-red-600' },
];

const getStatusLabel = (status: ContractStatus) => {
  const phase = lifecyclePhases.find(p => p.key === status);
  return phase?.label || status;
};

const getStatusColor = (status: ContractStatus) => {
  const phase = lifecyclePhases.find(p => p.key === status);
  return phase?.color || 'bg-gray-100 text-gray-600';
};

const getStatusIcon = (status: ContractStatus) => {
  const phase = lifecyclePhases.find(p => p.key === status);
  return phase?.icon || FileText;
};

export default function ContractLifecycle({ contracts, onContractClick }: ContractLifecycleProps) {
  const [filterStatus, setFilterStatus] = useState<ContractStatus | 'all'>('all');
  const [selectedView, setSelectedView] = useState<'timeline' | 'table'>('timeline');

  // Calculate statistics
  const totalContracts = contracts.length;
  const activeContracts = contracts.filter(c => 
    ['archivado', 'cumplimiento'].includes(c.status)
  ).length;
  const expiringContracts = contracts.filter(c => {
    if (!c.expirationDate) return false;
    const daysToExpiration = Math.floor(
      (new Date(c.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysToExpiration <= 90 && daysToExpiration > 0;
  }).length;
  const renewalContracts = contracts.filter(c => c.status === 'renovacion').length;
  
  const totalValue = contracts.reduce((sum, c) => sum + (c.value || 0), 0);

  const filteredContracts = filterStatus === 'all' 
    ? contracts 
    : contracts.filter(c => c.status === filterStatus);

  const getPhaseProgress = (contract: Contract) => {
    const phases = ['borrador', 'negociacion', 'firma', 'archivado', 'cumplimiento', 'renovacion'];
    const currentIndex = phases.indexOf(contract.status);
    return ((currentIndex + 1) / phases.length) * 100;
  };

  const getDaysUntilExpiration = (expirationDate?: string) => {
    if (!expirationDate) return null;
    const days = Math.floor(
      (new Date(expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-primary-dark mb-1">
            Gestor de Ciclo de Vida de Contratos
          </h2>
          <p className="text-sm text-gray-500">
            Vista global del estado de todos los contratos
          </p>
        </div>
      </div>

      {/* Control Panel - Key Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Contratos</p>
              <p className="text-2xl font-bold text-primary-dark">{totalContracts}</p>
            </div>
            <FileText className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Activos</p>
              <p className="text-2xl font-bold text-green-600">{activeContracts}</p>
            </div>
            <Activity className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Próximos a Vencer</p>
              <p className="text-2xl font-bold text-orange-600">{expiringContracts}</p>
              <p className="text-xs text-gray-400">{"<90 días"}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">En Renovación</p>
              <p className="text-2xl font-bold text-blue-600">{renewalContracts}</p>
            </div>
            <RotateCw className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Valor Total</p>
              <p className="text-2xl font-bold text-primary-dark">
                {new Intl.NumberFormat('es-ES', { 
                  style: 'currency', 
                  currency: 'EUR',
                  maximumFractionDigits: 0
                }).format(totalValue)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Timeline Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Fase del ciclo:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  filterStatus === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              {lifecyclePhases.map((phase) => {
                const Icon = phase.icon;
                const count = contracts.filter(c => c.status === phase.key).length;
                return (
                  <button
                    key={phase.key}
                    onClick={() => setFilterStatus(phase.key as ContractStatus)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                      filterStatus === phase.key
                        ? 'bg-primary text-white'
                        : phase.color + ' hover:opacity-80'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {phase.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedView('timeline')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                selectedView === 'timeline'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Vista Timeline
            </button>
            <button
              onClick={() => setSelectedView('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                selectedView === 'table'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Vista Tabla
            </button>
          </div>
        </div>
      </div>

      {/* Contracts View */}
      {selectedView === 'timeline' ? (
        <div className="space-y-4">
          {filteredContracts.map((contract) => {
            const StatusIcon = getStatusIcon(contract.status);
            const daysToExpiration = getDaysUntilExpiration(contract.expirationDate);
            
            return (
              <div
                key={contract.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onContractClick(contract)}
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-primary-dark">
                          {contract.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {getStatusLabel(contract.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{contract.client}</p>
                    </div>
                    <button className="text-primary hover:text-primary-dark">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Timeline Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 font-medium">Progreso del ciclo de vida</span>
                      <span className="text-xs text-gray-500">{Math.round(getPhaseProgress(contract))}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                        style={{ width: `${getPhaseProgress(contract)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      {lifecyclePhases.slice(0, -1).map((phase, idx) => {
                        const Icon = phase.icon;
                        const isActive = lifecyclePhases.findIndex(p => p.key === contract.status) >= idx;
                        return (
                          <div key={phase.key} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isActive ? phase.color : 'bg-gray-100 text-gray-400'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs text-gray-500 mt-1 hidden md:block">{phase.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                    {contract.responsibleArea && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Área Responsable</p>
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {contract.responsibleArea}
                        </p>
                      </div>
                    )}
                    {contract.value && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Valor</p>
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {new Intl.NumberFormat('es-ES', { 
                            style: 'currency', 
                            currency: contract.currency || 'EUR',
                            maximumFractionDigits: 0
                          }).format(contract.value)}
                        </p>
                      </div>
                    )}
                    {contract.expirationDate && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Vencimiento</p>
                        <p className={`text-sm font-medium flex items-center gap-1 ${
                          daysToExpiration && daysToExpiration < 90 
                            ? 'text-orange-600' 
                            : 'text-gray-700'
                        }`}>
                          <Calendar className="w-3 h-3" />
                          {new Date(contract.expirationDate).toLocaleDateString('es-ES')}
                          {daysToExpiration !== null && daysToExpiration > 0 && (
                            <span className="text-xs">({daysToExpiration}d)</span>
                          )}
                        </p>
                      </div>
                    )}
                    {contract.signingParties && contract.signingParties.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Partes Firmantes</p>
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {contract.signingParties.length} partes
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Additional Info for Active Contracts */}
                  {['archivado', 'cumplimiento'].includes(contract.status) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {contract.archivedDate && (
                            <span>Archivado: {new Date(contract.archivedDate).toLocaleDateString('es-ES')}</span>
                          )}
                          {contract.autoRenewal && (
                            <span className="flex items-center gap-1 text-blue-600">
                              <RotateCw className="w-3 h-3" />
                              Renovación automática
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contrato</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Área</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContracts.map((contract) => {
                  const StatusIcon = getStatusIcon(contract.status);
                  const daysToExpiration = getDaysUntilExpiration(contract.expirationDate);
                  
                  return (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                        <div className="text-xs text-gray-500">{contract.contractType}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{contract.client}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {getStatusLabel(contract.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{contract.responsibleArea || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {contract.value 
                          ? new Intl.NumberFormat('es-ES', { 
                              style: 'currency', 
                              currency: contract.currency || 'EUR',
                              maximumFractionDigits: 0
                            }).format(contract.value)
                          : '-'
                        }
                      </td>
                      <td className="px-4 py-3">
                        {contract.expirationDate ? (
                          <div>
                            <div className={`text-sm ${
                              daysToExpiration && daysToExpiration < 90 
                                ? 'text-orange-600 font-medium' 
                                : 'text-gray-700'
                            }`}>
                              {new Date(contract.expirationDate).toLocaleDateString('es-ES')}
                            </div>
                            {daysToExpiration !== null && daysToExpiration > 0 && (
                              <div className="text-xs text-gray-500">
                                {daysToExpiration} días
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => onContractClick(contract)}
                          className="text-primary hover:text-primary-dark"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredContracts.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay contratos en esta fase</p>
        </div>
      )}
    </div>
  );
}

