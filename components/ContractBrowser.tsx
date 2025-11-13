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
  Clock,
  X
} from 'lucide-react';

interface ContractBrowserProps {
  contracts: Contract[];
  onContractClick?: (contract: Contract) => void;
}

const statusConfig = {
  borrador: { label: 'Borrador', icon: Edit, color: 'text-gray-700', bgColor: 'bg-gray-100' },
  negociacion: { label: 'Negociación', icon: Users, color: 'text-blue-700', bgColor: 'bg-blue-100' },
  firma: { label: 'Firma', icon: FileText, color: 'text-purple-700', bgColor: 'bg-purple-100' },
  archivado: { label: 'Archivado', icon: Archive, color: 'text-green-700', bgColor: 'bg-green-100' },
  cumplimiento: { label: 'Cumplimiento', icon: Activity, color: 'text-teal-700', bgColor: 'bg-teal-100' },
  renovacion: { label: 'Renovación', icon: RotateCw, color: 'text-orange-700', bgColor: 'bg-orange-100' },
  vencido: { label: 'Vencido', icon: XCircle, color: 'text-red-700', bgColor: 'bg-red-100' },
};

export default function ContractBrowser({ contracts, onContractClick }: ContractBrowserProps) {
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(['Servicios Tecnológicos', 'Mantenimiento', 'Consultoría']));
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showClausesModal, setShowClausesModal] = useState(false);

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
    setShowClausesModal(true);
    onContractClick?.(contract);
  };

  const closeModal = () => {
    setShowClausesModal(false);
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

  return (
    <>
      <div className="space-y-6">
        {/* Panel de Contratos - Full Width */}
        <div className="w-full">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg border border-blue-200/50 p-6">
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

            {/* Árbol de contratos en formato de grid/cards */}
            <div className="space-y-3">
              {Object.entries(contractsByType).map(([type, typeContracts]) => (
                <div key={type} className="bg-white/40 rounded-xl p-4">
                  {/* Tipo de contrato */}
                  <button
                    onClick={() => toggleType(type)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/60 transition-all duration-200 group mb-2"
                  >
                    {expandedTypes.has(type) ? (
                      <ChevronDown className="w-5 h-5 text-blue-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-blue-600" />
                    )}
                    <Tag className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-gray-900 flex-1 text-left text-lg">
                      {type}
                    </span>
                    <span className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full font-semibold">
                      {typeContracts.length}
                    </span>
                  </button>

                  {/* Contratos dentro del tipo - Grid */}
                  {expandedTypes.has(type) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                      {typeContracts.map(contract => {
                        const Icon = statusConfig[contract.status].icon;
                        const statusInfo = statusConfig[contract.status];
                        return (
                          <button
                            key={contract.id}
                            onClick={() => selectContract(contract)}
                            className="bg-white rounded-xl p-4 text-left transition-all duration-200 hover:shadow-lg hover:scale-105 border border-gray-200 hover:border-blue-300 group"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div className={`${statusInfo.bgColor} p-2 rounded-lg`}>
                                <Icon className={`w-4 h-4 ${statusInfo.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                  {contract.title}
                                </h4>
                                <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                                  <Users className="w-3 h-3" />
                                  <span className="truncate">{contract.client}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <span className={`text-xs font-semibold px-2 py-1 rounded-md ${statusInfo.bgColor} ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                              {contract.value && (
                                <span className="text-xs font-semibold text-gray-700">
                                  {new Intl.NumberFormat('es-ES', { 
                                    style: 'currency', 
                                    currency: contract.currency || 'EUR',
                                    maximumFractionDigits: 0,
                                    notation: 'compact'
                                  }).format(contract.value)}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {Object.keys(contractsByType).length === 0 && (
              <div className="text-center py-12 bg-white/40 rounded-xl">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-500 font-medium">No hay contratos disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Cláusulas */}
      {showClausesModal && selectedContract && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        {selectedContract.title}
                      </h3>
                      <p className="text-blue-100 text-sm mt-1">Detalles del Contrato y Cláusulas</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all duration-200 hover:rotate-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="overflow-y-auto max-h-[calc(90vh-88px)] p-6">
              {/* Información del Contrato */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4 flex-wrap mb-4">
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${statusConfig[selectedContract.status].bgColor} ${statusConfig[selectedContract.status].color} flex items-center gap-2`}>
                    {(() => {
                      const Icon = statusConfig[selectedContract.status].icon;
                      return <Icon className="w-4 h-4" />;
                    })()}
                    {statusConfig[selectedContract.status].label}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{selectedContract.client}</span>
                  </div>
                  {selectedContract.contractType && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Tag className="w-4 h-4" />
                      <span className="font-medium">{selectedContract.contractType}</span>
                    </div>
                  )}
                </div>

                {selectedContract.description && (
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {selectedContract.description}
                  </p>
                )}

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedContract.createdDate && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Fecha de Creación</p>
                      <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(selectedContract.createdDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  )}
                  {selectedContract.responsibleArea && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Área Responsable</p>
                      <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        {selectedContract.responsibleArea}
                      </p>
                    </div>
                  )}
                  {selectedContract.value && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Valor</p>
                      <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        {new Intl.NumberFormat('es-ES', { 
                          style: 'currency', 
                          currency: selectedContract.currency || 'EUR',
                          maximumFractionDigits: 0
                        }).format(selectedContract.value)}
                      </p>
                    </div>
                  )}
                  {selectedContract.expirationDate && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Vencimiento</p>
                      <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(selectedContract.expirationDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  )}
                  {selectedContract.riskLevel && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Nivel de Riesgo</p>
                      <div className={`text-sm font-semibold flex items-center gap-1 ${
                        selectedContract.riskLevel === 'critico' ? 'text-red-600' :
                        selectedContract.riskLevel === 'alto' ? 'text-orange-600' :
                        selectedContract.riskLevel === 'medio' ? 'text-amber-600' :
                        'text-green-600'
                      }`}>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span className="capitalize">{selectedContract.riskLevel}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cláusulas del Contrato */}
              <div className="bg-white rounded-xl border-2 border-orange-200/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Cláusulas del Contrato</h4>
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
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h5 className="font-bold text-gray-900">{clause.title}</h5>
                                <span className="text-xs bg-white px-3 py-1 rounded-full text-orange-700 font-semibold">
                                  {clause.category}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                                {clause.content}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>Modificado: {new Date(clause.lastModified).toLocaleDateString('es-ES')}</span>
                                </div>
                                {clause.riskLevel && (
                                  <div className={`flex items-center gap-1 font-medium ${
                                    clause.riskLevel === 'critico' ? 'text-red-600' :
                                    clause.riskLevel === 'alto' ? 'text-orange-600' :
                                    clause.riskLevel === 'medio' ? 'text-amber-600' :
                                    'text-green-600'
                                  }`}>
                                    <AlertTriangle className="w-3 h-3" />
                                    <span className="capitalize">Riesgo: {clause.riskLevel}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">
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
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border-2 border-green-200/50 p-6 mt-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <Archive className="w-5 h-5 text-green-600" />
                    Información de Archivado
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedContract.signedDate && (
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Fecha de Firma</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(selectedContract.signedDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    )}
                    {selectedContract.archivedDate && (
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Fecha de Archivado</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(selectedContract.archivedDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    )}
                    {selectedContract.signingParties && selectedContract.signingParties.length > 0 && (
                      <div className="col-span-2 md:col-span-3 bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-2">Partes Firmantes</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedContract.signingParties.map((party, idx) => (
                            <span key={idx} className="text-xs bg-gradient-to-r from-green-100 to-teal-100 px-3 py-1.5 rounded-lg text-gray-700 font-medium border border-green-200">
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
          </div>
        </div>
      )}
    </>
  );
}
