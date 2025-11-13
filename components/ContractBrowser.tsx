'use client';

import { useState } from 'react';
import { Contract, mockClauses, mockTemplates } from '@/lib/data';
import { 
  FileText, 
  Calendar, 
  Tag, 
  ChevronRight, 
  ChevronDown, 
  Search,
  Users,
  Building,
  DollarSign,
  AlertTriangle,
  Edit,
  Archive,
  Activity,
  RotateCw,
  XCircle,
  BookOpen,
  CheckSquare,
  TrendingUp,
  Clock
} from 'lucide-react';

interface ContractBrowserProps {
  contracts: Contract[];
  onContractClick?: (contract: Contract) => void;
}

const statusConfig = {
  borrador: { label: 'Borrador', icon: Edit, color: 'text-gray-700' },
  negociacion: { label: 'Negociación', icon: Users, color: 'text-blue-700' },
  firma: { label: 'Firma', icon: FileText, color: 'text-purple-700' },
  archivado: { label: 'Archivado', icon: Archive, color: 'text-green-700' },
  cumplimiento: { label: 'Cumplimiento', icon: Activity, color: 'text-teal-700' },
  renovacion: { label: 'Renovación', icon: RotateCw, color: 'text-orange-700' },
  vencido: { label: 'Vencido', icon: XCircle, color: 'text-red-700' },
};

export default function ContractBrowser({ contracts, onContractClick }: ContractBrowserProps) {
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(['Servicios Tecnológicos', 'Mantenimiento']));
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar contratos por búsqueda
  const filteredContracts = contracts.filter(contract => {
    const searchLower = searchQuery.toLowerCase();
    return (
      contract.title.toLowerCase().includes(searchLower) ||
      contract.client.toLowerCase().includes(searchLower) ||
      (contract.contractType?.toLowerCase().includes(searchLower)) ||
      (contract.description?.toLowerCase().includes(searchLower))
    );
  });

  // Organizar contratos por tipo
  const contractsByType: Record<string, Contract[]> = {};
  filteredContracts.forEach(contract => {
    const type = contract.contractType || 'Sin Clasificar';
    if (!contractsByType[type]) {
      contractsByType[type] = [];
    }
    contractsByType[type].push(contract);
  });

  const toggleType = (type: string) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedTypes(newExpanded);
  };

  const selectContract = (contract: Contract) => {
    setSelectedContract(contract);
    onContractClick?.(contract);
  };

  // Obtener cláusulas del contrato (basado en la plantilla)
  const getContractClauses = (contract: Contract) => {
    if (!contract.templateId) return [];
    const template = mockTemplates.find(t => t.id === contract.templateId);
    if (!template) return [];
    return template.clauses.map(clauseId => 
      mockClauses.find(c => c.id === clauseId)
    ).filter(Boolean);
  };

  const StatusIcon = selectedContract ? statusConfig[selectedContract.status].icon : FileText;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Panel Izquierdo - Árbol de Contratos */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg border border-blue-200/50 p-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Buscador de Contratos</h3>
            </div>

            {/* Elegant Search Input */}
            <div className="relative mb-6 group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg group-focus-within:scale-110 transition-transform duration-300">
                  <Search className="text-white w-3.5 h-3.5" />
                </div>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar contratos..."
                className="w-full pl-12 pr-10 py-3 border-2 border-blue-200 rounded-xl
                focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                transition-all duration-300 bg-white/90 backdrop-blur-sm
                placeholder:text-gray-400 text-gray-900 font-medium text-sm
                hover:border-blue-300 hover:bg-white shadow-sm hover:shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 
                  bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-800
                  w-6 h-6 rounded-lg flex items-center justify-center
                  transition-all duration-200 hover:scale-110 font-semibold text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Contador de resultados */}
            {searchQuery && (
              <div className="mb-4 px-3 py-2 bg-white/60 rounded-lg">
                <p className="text-xs font-semibold text-gray-700">
                  {filteredContracts.length === 0 ? (
                    <span className="text-blue-600">No se encontraron resultados</span>
                  ) : (
                    <>
                      <span className="text-blue-600">{filteredContracts.length}</span>
                      {' '}
                      {filteredContracts.length === 1 ? 'contrato encontrado' : 'contratos encontrados'}
                    </>
                  )}
                </p>
              </div>
            )}

            {/* Árbol de contratos */}
            <div className="space-y-2">
              {Object.entries(contractsByType).map(([type, typeContracts]) => (
                <div key={type}>
                  {/* Tipo de contrato */}
                  <button
                    onClick={() => toggleType(type)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/60 transition-all duration-200 group"
                  >
                    {expandedTypes.has(type) ? (
                      <ChevronDown className="w-4 h-4 text-blue-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-blue-600" />
                    )}
                    <Tag className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-gray-900 flex-1 text-left">
                      {type}
                    </span>
                    <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600">
                      {typeContracts.length}
                    </span>
                  </button>

                  {/* Contratos dentro del tipo */}
                  {expandedTypes.has(type) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {typeContracts.map(contract => {
                        const Icon = statusConfig[contract.status].icon;
                        return (
                          <button
                            key={contract.id}
                            onClick={() => selectContract(contract)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 text-left ${
                              selectedContract?.id === contract.id
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'hover:bg-white/60 text-gray-700'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{contract.title}</p>
                              <p className="text-xs opacity-80 truncate">{contract.client}</p>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {Object.keys(contractsByType).length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No hay contratos disponibles</p>
              </div>
            )}
          </div>
        </div>

        {/* Panel Derecho - Detalles del Contrato */}
        <div className="col-span-12 lg:col-span-8">
          {selectedContract ? (
            <div className="space-y-6">
              {/* Header del contrato */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedContract.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold bg-${statusConfig[selectedContract.status].color.split('-')[1]}-100 ${statusConfig[selectedContract.status].color}`}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {statusConfig[selectedContract.status].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{selectedContract.client}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Creado: {new Date(selectedContract.createdDate).toLocaleDateString('es-ES')}</span>
                      </div>
                      {selectedContract.contractType && (
                        <div className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          <span>{selectedContract.contractType}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedContract.description && (
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{selectedContract.description}</p>
                  </div>
                )}

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                  {selectedContract.responsibleArea && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Área Responsable</p>
                      <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {selectedContract.responsibleArea}
                      </p>
                    </div>
                  )}
                  {selectedContract.value && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Valor</p>
                      <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {new Intl.NumberFormat('es-ES', { 
                          style: 'currency', 
                          currency: selectedContract.currency || 'EUR',
                          maximumFractionDigits: 0
                        }).format(selectedContract.value)}
                      </p>
                    </div>
                  )}
                  {selectedContract.expirationDate && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Vencimiento</p>
                      <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(selectedContract.expirationDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  )}
                  {selectedContract.riskLevel && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Nivel de Riesgo</p>
                      <div className={`text-sm font-semibold flex items-center gap-1 ${
                        selectedContract.riskLevel === 'critico' ? 'text-red-600' :
                        selectedContract.riskLevel === 'alto' ? 'text-orange-600' :
                        selectedContract.riskLevel === 'medio' ? 'text-amber-600' :
                        'text-green-600'
                      }`}>
                        <AlertTriangle className="w-3 h-3" />
                        <span className="capitalize">{selectedContract.riskLevel}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cláusulas del Contrato */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-xl">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Cláusulas del Contrato</h4>
                    <p className="text-sm text-gray-500">
                      {getContractClauses(selectedContract).length} cláusulas incluidas
                    </p>
                  </div>
                </div>

                {getContractClauses(selectedContract).length > 0 ? (
                  <div className="space-y-4">
                    {getContractClauses(selectedContract).map((clause, index) => {
                      if (!clause) return null;
                      return (
                        <div
                          key={clause.id}
                          className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-5 border border-orange-200/50 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h5 className="font-semibold text-gray-900">{clause.title}</h5>
                                <span className="text-xs bg-white px-2 py-1 rounded-md text-orange-700 font-medium">
                                  {clause.category}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {clause.content}
                              </p>
                              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>Modificado: {new Date(clause.lastModified).toLocaleDateString('es-ES')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      {selectedContract.templateId 
                        ? 'No se encontraron cláusulas para este contrato'
                        : 'Este contrato no tiene una plantilla asociada'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Información adicional si está archivado/cumplimiento */}
              {(selectedContract.status === 'archivado' || selectedContract.status === 'cumplimiento') && (
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl shadow-lg border border-green-200/50 p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Archive className="w-5 h-5 text-green-600" />
                    Información de Archivado
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedContract.signedDate && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Fecha de Firma</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(selectedContract.signedDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    )}
                    {selectedContract.archivedDate && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Fecha de Archivado</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(selectedContract.archivedDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    )}
                    {selectedContract.signingParties && selectedContract.signingParties.length > 0 && (
                      <div className="col-span-2 md:col-span-3">
                        <p className="text-xs text-gray-600 mb-2">Partes Firmantes</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedContract.signingParties.map((party, idx) => (
                            <span key={idx} className="text-xs bg-white px-3 py-1 rounded-lg text-gray-700 font-medium">
                              {party}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Estado vacío */
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Selecciona un contrato
              </h3>
              <p className="text-gray-600">
                Haz clic en cualquier contrato del árbol para ver sus detalles y cláusulas
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

