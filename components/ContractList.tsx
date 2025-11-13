'use client';

import { Contract, ContractStatus } from '@/lib/data';
import { FileText, Calendar, CheckCircle, Clock, Edit, AlertTriangle, Users, Archive, Activity, RotateCw, XCircle } from 'lucide-react';

interface ContractListProps {
  contracts: Contract[];
  onContractClick?: (contract: Contract) => void;
}

const statusConfig: Record<ContractStatus, { label: string; icon: any; color: string; textColor: string }> = {
  borrador: {
    label: 'Borrador',
    icon: Edit,
    color: 'bg-gray-100',
    textColor: 'text-gray-700',
  },
  negociacion: {
    label: 'Negociación',
    icon: Users,
    color: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  firma: {
    label: 'Firma',
    icon: FileText,
    color: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  archivado: {
    label: 'Archivado',
    icon: Archive,
    color: 'bg-green-50',
    textColor: 'text-green-700',
  },
  cumplimiento: {
    label: 'Cumplimiento',
    icon: Activity,
    color: 'bg-teal-50',
    textColor: 'text-teal-700',
  },
  renovacion: {
    label: 'Renovación',
    icon: RotateCw,
    color: 'bg-orange-50',
    textColor: 'text-orange-700',
  },
  vencido: {
    label: 'Vencido',
    icon: XCircle,
    color: 'bg-red-50',
    textColor: 'text-red-700',
  },
};

export default function ContractList({ contracts, onContractClick }: ContractListProps) {
  if (contracts.length === 0) {
    return (
      <div className="card text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
          <FileText className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No se encontraron contratos</h3>
        <p className="text-gray-500 text-sm">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {contracts.map((contract) => {
        const StatusIcon = statusConfig[contract.status].icon;
        const statusConfig_item = statusConfig[contract.status];

        return (
          <div 
            key={contract.id} 
            className="card hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full group cursor-pointer"
            onClick={() => onContractClick?.(contract)}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary-dark flex-1 pr-2 leading-tight group-hover:text-primary-dark/80 transition-colors">
                {contract.title}
              </h3>
              <div className={`status-badge ${statusConfig_item.color} ${statusConfig_item.textColor} flex items-center gap-1.5 flex-shrink-0`}>
                <StatusIcon className="w-3.5 h-3.5" />
                <span className="text-xs">{statusConfig_item.label}</span>
              </div>
            </div>

            <div className="space-y-2.5 mb-4 flex-grow">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="font-medium text-gray-700">Cliente:</span>
                <span className="text-gray-600">{contract.client}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="font-medium text-gray-700">Creado:</span>
                <span className="text-gray-600">{new Date(contract.createdDate).toLocaleDateString('es-ES')}</span>
              </div>

              {contract.description && (
                <p className="text-sm text-gray-600 mt-3 line-clamp-2 leading-relaxed">{contract.description}</p>
              )}

              {contract.riskLevel && contract.riskLevel !== 'bajo' && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${
                    contract.riskLevel === 'critico' ? 'text-red-600' :
                    contract.riskLevel === 'alto' ? 'text-orange-600' :
                    'text-amber-600'
                  }`} />
                  <span className={`font-medium ${
                    contract.riskLevel === 'critico' ? 'text-red-700' :
                    contract.riskLevel === 'alto' ? 'text-orange-700' :
                    'text-amber-700'
                  }`}>
                    Riesgo {contract.riskLevel}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onContractClick?.(contract);
                }}
                className="w-full btn-primary text-sm py-2.5 group-hover:shadow-md transition-all"
              >
                Ver Detalles
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
