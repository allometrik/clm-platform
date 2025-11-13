'use client';

import { Contract } from '@/lib/data';
import { mockApprovalFlows, mockRiskAssessments } from '@/lib/data';
import VersionControl from './VersionControl';
import ApprovalFlow from './ApprovalFlow';
import RiskAssessment from './RiskAssessment';
import { X, FileText, User, Calendar, AlertTriangle, Archive, Building, DollarSign, Users, RotateCw } from 'lucide-react';

interface ContractDetailsProps {
  contract: Contract;
  onClose: () => void;
}

export default function ContractDetails({ contract, onClose }: ContractDetailsProps) {
  const approvalFlow = mockApprovalFlows.find((af) => af.contractId === contract.id);
  const riskAssessment = mockRiskAssessments.find((ra) => ra.contractId === contract.id);

  const riskConfig = {
    bajo: { label: 'Bajo', color: 'bg-green-500' },
    medio: { label: 'Medio', color: 'bg-yellow-500' },
    alto: { label: 'Alto', color: 'bg-orange-500' },
    critico: { label: 'Crítico', color: 'bg-red-500' },
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto transition-opacity duration-200">
      <div className="bg-white rounded-lg max-w-6xl w-full my-8 shadow-2xl transform transition-all duration-200 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-dark to-primary-dark/95 text-white p-6 rounded-t-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{contract.title}</h2>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {contract.client}
                </span>
                {contract.assignedTo && (
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Asignado a: {contract.assignedTo}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Estado</p>
              <p className="font-semibold text-primary-dark capitalize">{contract.status}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Versión Actual</p>
              <p className="font-semibold text-primary-dark">v{contract.currentVersion}</p>
            </div>
            {contract.riskLevel && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Riesgo</p>
                <span className={`status-badge ${riskConfig[contract.riskLevel].color} text-white`}>
                  {riskConfig[contract.riskLevel].label}
                </span>
              </div>
            )}
          </div>

          {contract.description && (
            <div>
              <h3 className="font-semibold text-primary-dark mb-2">Descripción</h3>
              <p className="text-gray-700">{contract.description}</p>
            </div>
          )}

          {/* Lifecycle & Archiving Metadata */}
          {(contract.signedDate || contract.archivedDate || contract.expirationDate || contract.responsibleArea) && (
            <div className="bg-gradient-to-br from-primary-light/10 to-accent-light/10 p-5 rounded-lg border border-primary-light/20">
              <div className="flex items-center gap-2 mb-4">
                <Archive className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-primary-dark">Información de Ciclo de Vida</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {contract.signedDate && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Fecha de Firma
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(contract.signedDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                )}
                {contract.archivedDate && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <Archive className="w-3 h-3" />
                      Fecha de Archivado
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(contract.archivedDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                )}
                {contract.expirationDate && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Fecha de Vencimiento
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(contract.expirationDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                )}
                {contract.renewalDate && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <RotateCw className="w-3 h-3" />
                      Renovación
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(contract.renewalDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                )}
                {contract.responsibleArea && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      Área Responsable
                    </p>
                    <p className="text-sm font-semibold text-gray-800">{contract.responsibleArea}</p>
                  </div>
                )}
                {contract.contractType && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Tipo de Contrato
                    </p>
                    <p className="text-sm font-semibold text-gray-800">{contract.contractType}</p>
                  </div>
                )}
                {contract.value && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Valor
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Intl.NumberFormat('es-ES', { 
                        style: 'currency', 
                        currency: contract.currency || 'EUR'
                      }).format(contract.value)}
                    </p>
                  </div>
                )}
                {contract.signingParties && contract.signingParties.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Partes Firmantes
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {contract.signingParties.length} partes
                    </p>
                  </div>
                )}
              </div>
              {contract.signingParties && contract.signingParties.length > 0 && (
                <div className="mt-4 pt-4 border-t border-primary-light/20">
                  <p className="text-xs text-gray-600 mb-2">Detalles de Partes Firmantes:</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {contract.signingParties.map((party, idx) => (
                      <li key={idx}>{party}</li>
                    ))}
                  </ul>
                </div>
              )}
              {contract.autoRenewal && (
                <div className="mt-4 pt-4 border-t border-primary-light/20">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <RotateCw className="w-4 h-4" />
                    <span className="font-medium">Renovación automática activada</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-4">
              <button className="px-4 py-2 border-b-2 border-primary-dark text-primary-dark font-medium">
                Versiones
              </button>
              {approvalFlow && (
                <button className="px-4 py-2 text-gray-600 hover:text-primary-dark">
                  Aprobaciones
                </button>
              )}
              {riskAssessment && (
                <button className="px-4 py-2 text-gray-600 hover:text-primary-dark">
                  Evaluación de Riesgo
                </button>
              )}
            </div>
          </div>

          {/* Versiones */}
          <VersionControl contractId={contract.id} />

          {/* Aprobaciones */}
          {approvalFlow && (
            <div>
              <ApprovalFlow approvalFlow={approvalFlow} />
            </div>
          )}

          {/* Evaluación de Riesgo */}
          {riskAssessment && (
            <div>
              <RiskAssessment riskAssessment={riskAssessment} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

