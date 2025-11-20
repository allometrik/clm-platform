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
  X,
  ExternalLink,
  History,
  Eye,
  Download,
  Plus,
  CheckSquare,
  Square,
  Type,
  Copy,
  Edit3,
  Save,
  Sparkles
} from 'lucide-react';

interface ContractBrowserProps {
  contracts: Contract[];
  onContractClick?: (contract: Contract) => void;
  onNavigateToClause?: (clauseId: string) => void;
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

export default function ContractBrowser({ contracts, onContractClick, onNavigateToClause }: ContractBrowserProps) {
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showClausesModal, setShowClausesModal] = useState(false);
  const [showPlainView, setShowPlainView] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [selectedClauses, setSelectedClauses] = useState<Set<string>>(new Set());
  const [templateName, setTemplateName] = useState('');
  const [customText, setCustomText] = useState('');
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [editedTemplateTitle, setEditedTemplateTitle] = useState('');
  const [showTemplateHistory, setShowTemplateHistory] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [saveAsNewTemplateVersion, setSaveAsNewTemplateVersion] = useState(true);
  const [templateVersionDescription, setTemplateVersionDescription] = useState('');

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
    setIsEditingTemplate(false);
    setEditedTemplateTitle('');
    setShowTemplateHistory(false);
  };

  const handleSaveTemplate = () => {
    if (!editedTemplateTitle.trim()) {
      alert('El nombre de la plantilla no puede estar vacío');
      return;
    }
    setShowSaveTemplateModal(true);
  };

  const confirmSaveTemplate = () => {
    alert(`Plantilla "${editedTemplateTitle}" guardada exitosamente como versión ${saveAsNewTemplateVersion ? 'nueva' : 'actualizada'}!`);
    setIsEditingTemplate(false);
    setShowSaveTemplateModal(false);
    setTemplateVersionDescription('');
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

  const toggleClauseSelection = (clauseId: string) => {
    const newSelection = new Set(selectedClauses);
    if (newSelection.has(clauseId)) {
      newSelection.delete(clauseId);
    } else {
      newSelection.add(clauseId);
    }
    setSelectedClauses(newSelection);
  };

  const handleCreateTemplate = () => {
    if (!templateName.trim()) {
      alert('Por favor ingresa un nombre para la plantilla');
      return;
    }
    
    // Simulación de creación de plantilla
    alert(`Plantilla "${templateName}" creada exitosamente con ${selectedClauses.size} cláusulas!`);
    setShowCreateTemplate(false);
    setTemplateName('');
    setCustomText('');
    setSelectedClauses(new Set());
  };

  // Organizar cláusulas por categoría para el modal
  const clausesByCategory: Record<string, typeof mockClauses> = {};
  mockClauses.forEach(clause => {
    if (!clausesByCategory[clause.category]) {
      clausesByCategory[clause.category] = [];
    }
    clausesByCategory[clause.category].push(clause);
  });

  return (
    <>
      {/* Header con botón de crear plantilla */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Plantillas de Contratos</h2>
          <p className="text-sm text-gray-500">
            Gestiona tus plantillas y crea nuevas a partir de cláusulas
          </p>
        </div>
        <button
          onClick={() => setShowCreateTemplate(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Crear Plantilla
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Panel Izquierdo - Sidebar de Categorías */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg border border-gray-300/50 p-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-2 rounded-xl">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Categorías</h3>
            </div>

            {/* Elegant Search Input */}
            <div className="relative mb-6 group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300">
                <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-2 rounded-lg group-focus-within:scale-110 transition-transform duration-300">
                  <Search className="text-white w-3.5 h-3.5" />
                </div>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar contratos..."
                className="w-full pl-12 pr-10 py-3 border-2 border-gray-300 rounded-xl
                focus:outline-none focus:ring-4 focus:ring-gray-500/20 focus:border-gray-500
                transition-all duration-300 bg-white/90 backdrop-blur-sm
                placeholder:text-gray-400 text-gray-900 font-medium text-sm
                hover:border-gray-400 hover:bg-white shadow-sm hover:shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 
                  bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900
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
                    <span className="text-gray-600">No se encontraron resultados</span>
                  ) : (
                    <>
                      <span className="text-gray-800">{filteredContracts.length}</span>
                      {' '}
                      {filteredContracts.length === 1 ? 'contrato encontrado' : 'contratos encontrados'}
                    </>
                  )}
                </p>
              </div>
            )}

            {/* Árbol de categorías */}
            <div className="space-y-2">
              {Object.entries(contractsByType).map(([type, typeContracts]) => (
                <div key={type}>
                  {/* Tipo de contrato */}
                  <button
                    onClick={() => toggleType(type)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/60 transition-all duration-200 group"
                  >
                    {expandedTypes.has(type) ? (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    )}
                    <Tag className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-gray-900 flex-1 text-left text-sm">
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
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 text-left hover:bg-white/60 text-gray-700"
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

        {/* Panel Derecho - Grid de Contratos */}
        <div className="col-span-12 lg:col-span-9">
          <div className="space-y-6">
            {Object.entries(contractsByType)
              .filter(([type]) => expandedTypes.has(type))
              .map(([type, typeContracts]) => (
                <div key={type}>
                  {/* Header de la sección */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                      <Tag className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{type}</h3>
                    <span className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full font-semibold">
                      {typeContracts.length}
                    </span>
                  </div>

                  {/* Grid de contratos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {typeContracts.map(contract => {
                      const Icon = statusConfig[contract.status].icon;
                      const statusInfo = statusConfig[contract.status];
                      return (
                        <button
                          key={contract.id}
                          onClick={() => selectContract(contract)}
                          className="bg-white rounded-xl p-5 text-left transition-all duration-200 hover:shadow-xl hover:scale-105 border border-gray-200 hover:border-blue-300 group"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`${statusInfo.bgColor} p-2.5 rounded-lg`}>
                              <Icon className={`w-5 h-5 ${statusInfo.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-base mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {contract.title}
                              </h4>
                              <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                                <Users className="w-3.5 h-3.5" />
                                <span className="truncate">{contract.client}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${statusInfo.bgColor} ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

            {/* Mensaje cuando no hay categorías expandidas */}
            {Object.entries(contractsByType).filter(([type]) => expandedTypes.has(type)).length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center">
                <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Selecciona una categoría
                </h3>
                <p className="text-gray-600">
                  Haz clic en las categorías de la izquierda para ver los contratos
                </p>
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
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      {isEditingTemplate ? (
                        <input
                          type="text"
                          value={editedTemplateTitle}
                          onChange={(e) => setEditedTemplateTitle(e.target.value)}
                          className="text-2xl font-bold bg-white/20 px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-white/70"
                          placeholder="Nombre de la plantilla"
                        />
                      ) : (
                        <h3 className="text-2xl font-bold">
                          {selectedContract.title}
                        </h3>
                      )}
                      <p className="text-blue-100 text-sm mt-1">
                        {isEditingTemplate ? 'Editando plantilla' : 'Detalles del Contrato y Cláusulas'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditingTemplate ? (
                    <>
                      <button
                        onClick={() => {
                          alert(`Plantilla "${selectedContract.title}" clonada exitosamente como "${selectedContract.title} (Copia)"`);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 font-semibold text-sm"
                      >
                        <Copy className="w-4 h-4" />
                        Clonar
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingTemplate(true);
                          setEditedTemplateTitle(selectedContract.title);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 font-semibold text-sm"
                      >
                        <Edit3 className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => setShowTemplateHistory(!showTemplateHistory)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 font-semibold text-sm ${
                          showTemplateHistory
                            ? 'bg-white text-blue-600'
                            : 'bg-white/20 hover:bg-white/30'
                        }`}
                      >
                        <History className="w-4 h-4" />
                        Historial
                      </button>
                      <button
                        onClick={() => setShowPlainView(!showPlainView)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 font-semibold text-sm ${
                          showPlainView
                            ? 'bg-white text-blue-600'
                            : 'bg-white/20 hover:bg-white/30'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        {showPlainView ? 'Vista Normal' : 'Vista Previa'}
                      </button>
                      <button
                        onClick={() => setShowExportModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 font-semibold text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Exportar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSaveTemplate}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-white/90 rounded-xl transition-all duration-200 font-semibold text-sm"
                      >
                        <Save className="w-4 h-4" />
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingTemplate(false);
                          setEditedTemplateTitle('');
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 font-semibold text-sm"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>
                    </>
                  )}
                  <button
                    onClick={closeModal}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all duration-200 hover:rotate-90"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Información de versión */}
              {!isEditingTemplate && (
                <div className="flex items-center gap-4 text-sm text-blue-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Versión 3.2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Última modificación: {new Date(selectedContract.lastModified || '').toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Por: María García</span>
                  </div>
                </div>
              )}
            </div>

            {/* Contenido del Modal */}
            <div className="overflow-y-auto max-h-[calc(90vh-88px)] flex">
              {/* Panel de Historial de Versiones */}
              {showTemplateHistory && (
                <div className="w-80 bg-gradient-to-b from-purple-50 to-pink-50 border-r border-purple-200 p-6 overflow-y-auto">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <History className="w-5 h-5 text-purple-600" />
                    Historial de Versiones
                  </h4>
                  
                  <div className="space-y-3">
                    {/* Versión 3.2 - Actual */}
                    <div className="bg-white rounded-xl p-4 border-2 border-purple-300 shadow-md">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-bold text-purple-900">Versión 3.2</span>
                          <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">Actual</span>
                        </div>
                        <span className="text-xs text-gray-500">Hace 2 días</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        Actualización de cláusulas de confidencialidad según nueva normativa GDPR
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                        <Users className="w-3 h-3" />
                        <span>María García</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <p className="font-semibold mb-1">Cambios realizados:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                          <li>2 cláusulas modificadas</li>
                          <li>1 cláusula añadida</li>
                          <li>Texto personalizado actualizado</li>
                        </ul>
                      </div>
                    </div>

                    {/* Versión 3.1 */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-bold text-gray-900">Versión 3.1</span>
                        <span className="text-xs text-gray-500">Hace 1 semana</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        Correcciones menores en redacción de cláusulas de pago
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Users className="w-3 h-3" />
                        <span>Juan Pérez</span>
                      </div>
                      <button 
                        onClick={() => alert('Mostrando versión 3.1...')}
                        className="mt-3 w-full text-xs btn-secondary py-1.5"
                      >
                        Ver esta versión
                      </button>
                    </div>

                    {/* Versión 3.0 */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-bold text-gray-900">Versión 3.0</span>
                        <span className="text-xs text-gray-500">Hace 2 semanas</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        Reestructuración completa de la plantilla con nuevas cláusulas
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Users className="w-3 h-3" />
                        <span>Ana Martínez</span>
                      </div>
                      <button 
                        onClick={() => alert('Mostrando versión 3.0...')}
                        className="mt-3 w-full text-xs btn-secondary py-1.5"
                      >
                        Ver esta versión
                      </button>
                    </div>

                    {/* Versión 2.5 */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-bold text-gray-900">Versión 2.5</span>
                        <span className="text-xs text-gray-500">Hace 1 mes</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        Añadidas cláusulas de servicios adicionales
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Users className="w-3 h-3" />
                        <span>Carlos López</span>
                      </div>
                      <button 
                        onClick={() => alert('Mostrando versión 2.5...')}
                        className="mt-3 w-full text-xs btn-secondary py-1.5"
                      >
                        Ver esta versión
                      </button>
                    </div>

                    {/* Versión 2.0 */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-bold text-gray-900">Versión 2.0</span>
                        <span className="text-xs text-gray-500">Hace 2 meses</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        Revisión legal completa y aprobación del departamento jurídico
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Users className="w-3 h-3" />
                        <span>María García</span>
                      </div>
                      <button 
                        onClick={() => alert('Mostrando versión 2.0...')}
                        className="mt-3 w-full text-xs btn-secondary py-1.5"
                      >
                        Ver esta versión
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Documento del Contrato */}
              <div className={`flex-1 bg-white p-12 ${showPlainView ? 'font-mono text-sm' : ''} ${showTemplateHistory ? 'max-w-3xl' : 'max-w-4xl mx-auto'}`}>
                {/* Encabezado del Contrato */}
                <div className={`text-center mb-12 pb-8 ${!showPlainView && 'border-b-2 border-gray-200'}`}>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedContract.title}
                  </h1>
                  {!showPlainView && (
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{selectedContract.client}</span>
                      </div>
                      {selectedContract.createdDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Fecha: {new Date(selectedContract.createdDate).toLocaleDateString('es-ES')}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {showPlainView && (
                    <p className="text-sm text-gray-600">
                      {selectedContract.client} - {new Date(selectedContract.createdDate || '').toLocaleDateString('es-ES')}
                    </p>
                  )}
                </div>

                {/* Preámbulo del Contrato */}
                <div className="mb-8 prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed text-justify mb-4">
                    En la ciudad de Madrid, a {new Date(selectedContract.createdDate || '').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}, se celebra el presente contrato entre:
                  </p>
                  <p className="text-gray-700 leading-relaxed text-justify mb-4">
                    <strong>DE UNA PARTE:</strong> {selectedContract.client}, en adelante denominado como "EL CLIENTE", con domicilio en [Dirección del Cliente], y con NIF/CIF [Número de Identificación].
                  </p>
                  <p className="text-gray-700 leading-relaxed text-justify mb-6">
                    <strong>Y DE OTRA PARTE:</strong> [Nombre de la Empresa Proveedora], en adelante denominada como "EL PROVEEDOR", con domicilio en [Dirección del Proveedor], y con CIF [Número de Identificación].
                  </p>
                  <p className="text-gray-700 leading-relaxed text-justify font-semibold mb-6">
                    Ambas partes, reconociéndose mutuamente la capacidad legal necesaria para contratar y obligarse, acuerdan suscribir el presente contrato de {selectedContract.contractType || 'servicios'}, que se regirá por las siguientes:
                  </p>
                </div>

                {/* Cláusulas del Contrato */}
                <div className="space-y-6">
                  {/* Cláusulas Externas (No editables) */}
                  <div className="space-y-6">
                    {/* Cláusula 1 - Objeto del Contrato (Externa) */}
                    <div className="py-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">1. OBJETO DEL CONTRATO</h3>
                      <p className="text-gray-700 leading-relaxed text-justify">
                        El presente contrato tiene por objeto regular la prestación de servicios de desarrollo de software entre EL PROVEEDOR y EL CLIENTE. Los servicios incluyen, de manera enunciativa pero no limitativa: desarrollo de aplicaciones web, mantenimiento correctivo y evolutivo, consultoría técnica, y soporte técnico especializado según las especificaciones acordadas en el Anexo I del presente documento.
                      </p>
                    </div>

                    {/* Cláusula 2 - Duración (Externa) */}
                    <div className="py-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">2. DURACIÓN Y VIGENCIA</h3>
                      <p className="text-gray-700 leading-relaxed text-justify">
                        El presente contrato tendrá una duración de doce (12) meses, contados a partir de la fecha de su firma, renovándose automáticamente por períodos anuales sucesivos, salvo manifestación en contrario por cualquiera de las partes con una antelación mínima de treinta (30) días naturales a la fecha de vencimiento. La fecha de vencimiento inicial será el {selectedContract.expirationDate ? new Date(selectedContract.expirationDate).toLocaleDateString('es-ES') : '[Fecha]'}.
                      </p>
                    </div>
                  </div>

                  {/* Cláusulas de la Biblioteca (Editables/Linkeadas) */}
                  <div className="space-y-6">
                    {getContractClauses(selectedContract).map((clause, index) => {
                      if (!clause) return null;
                      
                      // Vista plana sin decoraciones
                      if (showPlainView) {
                        return (
                          <div key={clause.id} className="py-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                              {index + 3}. {clause.title.toUpperCase()}
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-justify">
                              {clause.content}
                            </p>
                          </div>
                        );
                      }
                      
                      // Vista normal con decoraciones
                      return (
                        <div
                          key={clause.id}
                          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-200 group"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                              {index + 3}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {clause.title.toUpperCase()}
                                  </h3>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                      <BookOpen className="w-3 h-3" />
                                      Biblioteca de Cláusulas
                                    </span>
                                    <span className="inline-block px-2 py-1 bg-white text-gray-700 text-xs font-semibold rounded-full border border-gray-200">
                                      {clause.category}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    if (onNavigateToClause) {
                                      closeModal();
                                      onNavigateToClause(clause.id);
                                    }
                                  }}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-white text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-all border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow group-hover:scale-105"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  Ver en Biblioteca
                                </button>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed text-justify pl-11 mb-3">
                            {clause.content}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 pl-11">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Última modificación: {new Date(clause.lastModified).toLocaleDateString('es-ES')}</span>
                            </div>
                            <button
                              onClick={() => alert(`Mostrando historial de versiones de "${clause.title}"...`)}
                              className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium hover:underline"
                            >
                              <History className="w-3 h-3" />
                              3 versiones
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Más Cláusulas Externas */}
                  <div className="space-y-6">
                    {/* Cláusula N - Jurisdicción (Externa) */}
                    <div className="py-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        {getContractClauses(selectedContract).length + 3}. JURISDICCIÓN Y LEY APLICABLE
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-justify">
                        Para la resolución de cualquier controversia derivada del presente contrato, las partes se someten expresamente a la jurisdicción de los Juzgados y Tribunales de Madrid, renunciando a cualquier otro fuero que pudiera corresponderles. El presente contrato se regirá e interpretará de conformidad con la legislación española vigente.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Firma */}
                <div className="mt-12 pt-8 border-t-2 border-gray-200">
                  <p className="text-gray-700 leading-relaxed text-justify mb-8">
                    Y en prueba de conformidad con todo lo expuesto, ambas partes firman el presente contrato por duplicado y a un solo efecto, en el lugar y fecha indicados en el encabezamiento.
                  </p>
                  <div className="grid grid-cols-2 gap-12 mt-12">
                    <div className="text-center">
                      <div className="border-t-2 border-gray-400 pt-3">
                        <p className="font-bold text-gray-900">EL CLIENTE</p>
                        <p className="text-sm text-gray-600">{selectedContract.client}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="border-t-2 border-gray-400 pt-3">
                        <p className="font-bold text-gray-900">EL PROVEEDOR</p>
                        <p className="text-sm text-gray-600">[Nombre del Proveedor]</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de exportar contrato */}
      {showExportModal && selectedContract && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Exportar Contrato
                  </h3>
                  <p className="text-green-100 text-sm mt-1">
                    Selecciona el formato de exportación
                  </p>
                </div>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Información del contrato */}
              <div className="bg-gray-100 rounded-xl p-4 border border-gray-300">
                <p className="text-sm text-gray-700 font-medium mb-2">
                  Contrato a exportar:
                </p>
                <div className="space-y-1">
                  <p className="text-sm text-gray-800 font-semibold">
                    {selectedContract.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    Cliente: {selectedContract.client}
                  </p>
                  <p className="text-xs text-gray-600">
                    {getContractClauses(selectedContract).length + 3} cláusulas incluidas
                  </p>
                </div>
              </div>

              {/* Opciones de formato */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    alert('Exportando contrato a Word...');
                    setShowExportModal(false);
                  }}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Download className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        Exportar a Word (.docx)
                      </h4>
                      <p className="text-sm text-gray-600">
                        Documento editable compatible con Microsoft Word
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    alert('Exportando contrato a PDF...');
                    setShowExportModal(false);
                  }}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                      <Download className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        Exportar a PDF
                      </h4>
                      <p className="text-sm text-gray-600">
                        Documento de solo lectura en formato PDF
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowExportModal(false)}
                className="btn-secondary w-full"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de guardar plantilla con versionado */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Save className="w-5 h-5" />
                Guardar Cambios en Plantilla
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                Selecciona cómo deseas guardar los cambios realizados
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Opciones de guardado */}
              <div className="space-y-3">
                <button
                  onClick={() => setSaveAsNewTemplateVersion(true)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    saveAsNewTemplateVersion
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                      saveAsNewTemplateVersion ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {saveAsNewTemplateVersion && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Guardar como nueva versión
                      </h4>
                      <p className="text-sm text-gray-600">
                        Crea una nueva versión manteniendo el historial completo. Recomendado para cambios importantes.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSaveAsNewTemplateVersion(false)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    !saveAsNewTemplateVersion
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                      !saveAsNewTemplateVersion ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {!saveAsNewTemplateVersion && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Sobreescribir versión actual
                      </h4>
                      <p className="text-sm text-gray-600">
                        Actualiza la versión actual sin crear una nueva. Usar solo para correcciones menores.
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Descripción de cambios */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción de cambios {saveAsNewTemplateVersion && '*'}
                </label>
                <textarea
                  value={templateVersionDescription}
                  onChange={(e) => setTemplateVersionDescription(e.target.value)}
                  placeholder="Describe brevemente los cambios realizados en la plantilla..."
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl flex gap-3">
              <button
                onClick={confirmSaveTemplate}
                disabled={saveAsNewTemplateVersion && !templateVersionDescription.trim()}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Guardar Cambios
              </button>
              <button
                onClick={() => {
                  setShowSaveTemplateModal(false);
                  setTemplateVersionDescription('');
                }}
                className="btn-secondary px-6"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Crear Plantilla */}
      {showCreateTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-[#EC0000] to-[#C50000] p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Plus className="w-6 h-6" />
                    Crear Nueva Plantilla
                  </h3>
                  <p className="text-green-100 text-sm">
                    Selecciona cláusulas y añade texto personalizado para tu plantilla
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateTemplate(false);
                    setTemplateName('');
                    setCustomText('');
                    setSelectedClauses(new Set());
                  }}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Información básica de la plantilla */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre de la Plantilla *
                    </label>
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500"
                      placeholder="Ej: Plantilla de Servicios Profesionales"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo de Plantilla
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500">
                      <option>Servicios</option>
                      <option>Consultoría</option>
                      <option>Mantenimiento</option>
                      <option>Licencia</option>
                      <option>NDA</option>
                      <option>Otro</option>
                    </select>
                  </div>
                </div>

                {/* Sección de Cláusulas y Texto */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Columna Izquierda - Selección de Cláusulas */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        Cláusulas de la Biblioteca
                      </h4>
                      <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                        {selectedClauses.size} seleccionadas
                      </span>
                    </div>
                    
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {Object.entries(clausesByCategory).map(([category, clauses]) => (
                        <div key={category} className="space-y-2">
                          {/* Categoría */}
                          <div className="flex items-center gap-2 pb-2 border-b border-gray-300">
                            <button
                              onClick={() => {
                                const categoryClauses = clauses.map(c => c.id);
                                const allSelected = categoryClauses.every(id => selectedClauses.has(id));
                                const newSelection = new Set(selectedClauses);
                                
                                if (allSelected) {
                                  categoryClauses.forEach(id => newSelection.delete(id));
                                } else {
                                  categoryClauses.forEach(id => newSelection.add(id));
                                }
                                setSelectedClauses(newSelection);
                              }}
                              className="flex-shrink-0"
                            >
                              {clauses.every(c => selectedClauses.has(c.id)) ? (
                                <CheckSquare className="w-4 h-4 text-green-600" />
                              ) : clauses.some(c => selectedClauses.has(c.id)) ? (
                                <div className="w-4 h-4 border-2 border-green-600 rounded bg-green-100 flex items-center justify-center">
                                  <div className="w-2 h-2 bg-green-600 rounded-sm"></div>
                                </div>
                              ) : (
                                <Square className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                            <Tag className="w-4 h-4 text-gray-600" />
                            <span className="font-semibold text-sm text-gray-900">{category}</span>
                            <span className="text-xs text-gray-500 ml-auto">
                              {clauses.length}
                            </span>
                          </div>

                          {/* Cláusulas de la categoría */}
                          <div className="ml-6 space-y-1">
                            {clauses.map(clause => (
                              <button
                                key={clause.id}
                                onClick={() => toggleClauseSelection(clause.id)}
                                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white transition-all group text-left"
                              >
                                {selectedClauses.has(clause.id) ? (
                                  <CheckSquare className="w-4 h-4 text-green-600 flex-shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 text-gray-400 group-hover:text-green-400 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-700 truncate">
                                    {clause.title}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {clause.content.substring(0, 50)}...
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Columna Derecha - Texto Personalizado */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Type className="w-5 h-5 text-purple-600" />
                      Texto Personalizado (Mock)
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Preámbulo o Introducción
                        </label>
                        <textarea
                          value={customText}
                          onChange={(e) => setCustomText(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 resize-none bg-white"
                          rows={6}
                          placeholder="Añade texto personalizado para la introducción de la plantilla..."
                        />
                      </div>

                      <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                        <p className="text-xs font-semibold text-purple-900 mb-2">Vista Previa Mock:</p>
                        <div className="space-y-2 text-xs text-gray-700">
                          {customText ? (
                            <p className="italic">{customText}</p>
                          ) : (
                            <p className="text-gray-400 italic">El texto personalizado aparecerá aquí...</p>
                          )}
                          {selectedClauses.size > 0 && (
                            <div className="mt-3 pt-3 border-t border-purple-200">
                              <p className="font-semibold mb-2">Cláusulas incluidas:</p>
                              <ul className="space-y-1">
                                {Array.from(selectedClauses).slice(0, 3).map(clauseId => {
                                  const clause = mockClauses.find(c => c.id === clauseId);
                                  return clause ? (
                                    <li key={clauseId} className="flex items-center gap-2">
                                      <div className="w-1 h-1 rounded-full bg-purple-600"></div>
                                      {clause.title}
                                    </li>
                                  ) : null;
                                })}
                                {selectedClauses.size > 3 && (
                                  <li className="text-gray-500 italic ml-3">
                                    +{selectedClauses.size - 3} cláusulas más
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumen */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200">
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Resumen de la Plantilla
                  </h5>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Nombre:</p>
                      <p className="font-semibold text-gray-900">
                        {templateName || 'Sin nombre'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Cláusulas:</p>
                      <p className="font-semibold text-gray-900">
                        {selectedClauses.size} seleccionadas
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Texto personalizado:</p>
                      <p className="font-semibold text-gray-900">
                        {customText ? `${customText.length} caracteres` : 'Sin texto'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex gap-3">
                <button 
                  onClick={handleCreateTemplate}
                  disabled={!templateName.trim()}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Crear Plantilla
                </button>
                <button 
                  onClick={() => {
                    setShowCreateTemplate(false);
                    setTemplateName('');
                    setCustomText('');
                    setSelectedClauses(new Set());
                  }}
                  className="btn-secondary px-6"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
