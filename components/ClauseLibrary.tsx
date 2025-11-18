'use client';

import { useState, useEffect, useRef } from 'react';
import { mockClauses, mockTemplates } from '@/lib/data';
import { 
  BookOpen, 
  Calendar, 
  Tag, 
  ChevronRight, 
  ChevronDown, 
  Edit3, 
  Save, 
  X, 
  History, 
  FileText,
  Plus,
  CheckSquare,
  Square,
  Sparkles,
  Download,
  Search,
  AlertCircle,
  Copy,
  GitCompare,
  FileDown
} from 'lucide-react';

interface ClauseVersion {
  version: number;
  content: string;
  modifiedBy: string;
  modifiedDate: string;
  changes: string;
}

interface ClauseNode {
  id: string;
  title: string;
  category: string;
  content: string;
  lastModified: string;
  children?: ClauseNode[];
  versions?: ClauseVersion[];
}

interface ClauseLibraryProps {
  initialClauseId?: string | null;
  onClauseSelected?: () => void;
}

export default function ClauseLibrary({ initialClauseId, onClauseSelected }: ClauseLibraryProps = {}) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Seguridad', 'Legal']));
  const [selectedClause, setSelectedClause] = useState<ClauseNode | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [selectedClauses, setSelectedClauses] = useState<Set<string>>(new Set());
  const [showCreateContract, setShowCreateContract] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveAsNewVersion, setSaveAsNewVersion] = useState(true);
  const [versionDescription, setVersionDescription] = useState('');
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareVersion1, setCompareVersion1] = useState<number>(0);
  const [compareVersion2, setCompareVersion2] = useState<number>(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const aiMenuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú de IA al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aiMenuRef.current && !aiMenuRef.current.contains(event.target as Node)) {
        setShowAiMenu(false);
      }
    };

    if (showAiMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAiMenu]);

  // Organizar TODAS las cláusulas en estructura jerárquica (para el modal)
  const allClausesTree: Record<string, ClauseNode[]> = {};
  mockClauses.forEach(clause => {
    if (!allClausesTree[clause.category]) {
      allClausesTree[clause.category] = [];
    }
    allClausesTree[clause.category].push({
      id: clause.id,
      title: clause.title,
      category: clause.category,
      content: clause.content,
      lastModified: clause.lastModified,
      versions: [
        {
          version: 1,
          content: clause.content,
          modifiedBy: 'Sistema',
          modifiedDate: clause.lastModified,
          changes: 'Versión inicial'
        },
        {
          version: 2,
          content: clause.content + ' (Actualización menor de redacción)',
          modifiedBy: 'Juan Pérez',
          modifiedDate: '2024-02-15',
          changes: 'Mejora en la redacción para mayor claridad'
        },
        {
          version: 3,
          content: clause.content + ' (Actualización menor de redacción) (Ajuste legal)',
          modifiedBy: 'María García',
          modifiedDate: '2024-03-20',
          changes: 'Ajuste según nueva normativa legal'
        }
      ]
    });
  });

  // Filtrar cláusulas por búsqueda (para el sidebar)
  const filteredClauses = mockClauses.filter(clause => {
    const searchLower = searchQuery.toLowerCase();
    return (
      clause.title.toLowerCase().includes(searchLower) ||
      clause.category.toLowerCase().includes(searchLower) ||
      clause.content.toLowerCase().includes(searchLower)
    );
  });

  // Árbol filtrado para el sidebar
  const clauseTree: Record<string, ClauseNode[]> = {};
  filteredClauses.forEach(clause => {
    if (!clauseTree[clause.category]) {
      clauseTree[clause.category] = [];
    }
    clauseTree[clause.category].push({
      id: clause.id,
      title: clause.title,
      category: clause.category,
      content: clause.content,
      lastModified: clause.lastModified,
      versions: [
        {
          version: 1,
          content: clause.content,
          modifiedBy: 'Sistema',
          modifiedDate: clause.lastModified,
          changes: 'Versión inicial'
        },
        {
          version: 2,
          content: clause.content + ' (Actualización menor de redacción)',
          modifiedBy: 'Juan Pérez',
          modifiedDate: '2024-02-15',
          changes: 'Mejora en la redacción para mayor claridad'
        },
        {
          version: 3,
          content: clause.content + ' (Actualización menor de redacción) (Ajuste legal)',
          modifiedBy: 'María García',
          modifiedDate: '2024-03-20',
          changes: 'Ajuste según nueva normativa legal'
        }
      ]
    });
  });

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const selectClause = (clause: ClauseNode) => {
    setSelectedClause(clause);
    setEditedContent(clause.content);
    setIsEditing(false);
    setShowVersionHistory(false);
    if (onClauseSelected) {
      onClauseSelected();
    }
  };

  // Efecto para seleccionar automáticamente una cláusula si se pasa initialClauseId
  useEffect(() => {
    if (initialClauseId) {
      // Buscar la cláusula en el árbol
      const clause = mockClauses.find(c => c.id === initialClauseId);
      if (clause) {
        const clauseNode: ClauseNode = {
          id: clause.id,
          title: clause.title,
          category: clause.category,
          content: clause.content,
          lastModified: clause.lastModified,
          versions: [
            {
              version: 1,
              content: clause.content,
              modifiedBy: 'Sistema',
              modifiedDate: clause.lastModified,
              changes: 'Versión inicial'
            },
            {
              version: 2,
              content: clause.content + ' (Actualización menor de redacción)',
              modifiedBy: 'Juan Pérez',
              modifiedDate: '2024-02-15',
              changes: 'Mejora en la redacción para mayor claridad'
            },
            {
              version: 3,
              content: clause.content + ' (Actualización menor de redacción) (Ajuste legal)',
              modifiedBy: 'María García',
              modifiedDate: '2024-03-20',
              changes: 'Ajuste según nueva normativa legal'
            }
          ]
        };
        selectClause(clauseNode);
        // Expandir la categoría de la cláusula
        setExpandedCategories(prev => {
          const newSet = new Set(prev);
          newSet.add(clause.category);
          return newSet;
        });
      }
    }
  }, [initialClauseId]);

  const handleSave = () => {
    if (selectedClause && editedContent !== selectedClause.content) {
      // Abrir modal para decidir cómo guardar
      setVersionDescription('');
      setSaveAsNewVersion(true);
      setShowSaveModal(true);
    } else {
      setIsEditing(false);
    }
  };

  const confirmSave = () => {
    if (!selectedClause) return;

    if (saveAsNewVersion) {
      // Guardar como nueva versión
      setSelectedClause({
        ...selectedClause,
        content: editedContent,
        lastModified: new Date().toISOString(),
        versions: [
          ...(selectedClause.versions || []),
          {
            version: (selectedClause.versions?.length || 0) + 1,
            content: editedContent,
            modifiedBy: 'Usuario Actual',
            modifiedDate: new Date().toISOString(),
            changes: versionDescription || 'Contenido actualizado'
          }
        ]
      });
    } else {
      // Sobreescribir versión actual
      const updatedVersions = [...(selectedClause.versions || [])];
      if (updatedVersions.length > 0) {
        updatedVersions[updatedVersions.length - 1] = {
          ...updatedVersions[updatedVersions.length - 1],
          content: editedContent,
          modifiedDate: new Date().toISOString(),
          changes: versionDescription || 'Contenido actualizado (versión sobreescrita)'
        };
      }
      setSelectedClause({
        ...selectedClause,
        content: editedContent,
        lastModified: new Date().toISOString(),
        versions: updatedVersions
      });
    }
    
    setIsEditing(false);
    setShowSaveModal(false);
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

  const getTemplateUsageCount = (clauseId: string) => {
    return mockTemplates.filter(template => 
      template.clauses.includes(clauseId)
    ).length;
  };

  const getTemplateNames = (clauseId: string) => {
    return mockTemplates
      .filter(template => template.clauses.includes(clauseId))
      .map(template => template.name);
  };

  const handleAiGenerate = (action: string) => {
    setIsGeneratingAi(true);
    setShowAiMenu(false);
    
    // Simular generación de IA
    setTimeout(() => {
      let newContent = editedContent;
      
      switch(action) {
        case 'improve':
          newContent = editedContent + '\n\n[Texto mejorado por IA] Este texto ha sido optimizado para mayor claridad y precisión legal, manteniendo el significado original pero con mejor estructura gramatical y terminología más precisa.';
          break;
        case 'simplify':
          newContent = editedContent + '\n\n[Versión simplificada por IA] Esta cláusula ha sido redactada de manera más sencilla y accesible, eliminando jerga innecesaria mientras mantiene su validez legal.';
          break;
        case 'expand':
          newContent = editedContent + '\n\n[Texto expandido por IA] Esta sección incluye detalles adicionales, casos de uso específicos y aclaraciones que fortalecen la cobertura legal de la cláusula original.';
          break;
        case 'translate':
          newContent = editedContent + '\n\n[Traducción adaptada por IA] Esta cláusula ha sido adaptada al contexto legal específico, manteniendo equivalencia funcional con el texto original.';
          break;
      }
      
      setEditedContent(newContent);
      setIsGeneratingAi(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Biblioteca de Cláusulas</h2>
          <p className="text-sm text-gray-500">
            Gestiona y edita tus cláusulas legales con control de versiones
          </p>
        </div>
        <div className="flex gap-3">
          {/* Botón de Exportar */}
          <button
            onClick={() => setShowExportModal(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Exportar
          </button>
          {/* Botón siempre visible */}
          <button
            onClick={() => setShowCreateContract(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Crear Contrato
          </button>
          {/* Botón con contador cuando hay selección previa */}
          {selectedClauses.size > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowCreateContract(true)}
                className="btn-accent flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Con {selectedClauses.size} Seleccionadas
              </button>
              <div className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                {selectedClauses.size}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Panel Izquierdo - Árbol de Cláusulas */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg border border-orange-200/50 p-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-xl">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Buscador de Cláusulas</h3>
            </div>

            {/* Elegant Search Input */}
            <div className="relative mb-6 group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg group-focus-within:scale-110 transition-transform duration-300">
                  <Search className="text-white w-3.5 h-3.5" />
                </div>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cláusulas..."
                className="w-full pl-12 pr-10 py-3 border-2 border-orange-200 rounded-xl
                focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500
                transition-all duration-300 bg-white/90 backdrop-blur-sm
                placeholder:text-gray-400 text-gray-900 font-medium text-sm
                hover:border-orange-300 hover:bg-white shadow-sm hover:shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 
                  bg-orange-100 hover:bg-orange-200 text-orange-600 hover:text-orange-800
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
                  {filteredClauses.length === 0 ? (
                    <span className="text-orange-600">No se encontraron resultados</span>
                  ) : (
                    <>
                      <span className="text-orange-600">{filteredClauses.length}</span>
                      {' '}
                      {filteredClauses.length === 1 ? 'cláusula encontrada' : 'cláusulas encontradas'}
                    </>
                  )}
                </p>
              </div>
            )}

            <div className="space-y-2">
              {Object.entries(clauseTree).map(([category, clauses]) => (
                <div key={category}>
                  {/* Categoría */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/60 transition-all duration-200 group"
                  >
                    {expandedCategories.has(category) ? (
                      <ChevronDown className="w-4 h-4 text-orange-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-orange-600" />
                    )}
                    <Tag className="w-4 h-4 text-orange-600" />
                    <span className="font-semibold text-gray-900 flex-1 text-left">
                      {category}
                    </span>
                    <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600">
                      {clauses.length}
                    </span>
                  </button>

                  {/* Cláusulas dentro de la categoría */}
                  {expandedCategories.has(category) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {clauses.map(clause => (
                        <div
                          key={clause.id}
                          className="flex items-center gap-2 group"
                        >
                          <button
                            onClick={() => toggleClauseSelection(clause.id)}
                            className="flex-shrink-0"
                          >
                            {selectedClauses.has(clause.id) ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                            )}
                          </button>
                          <button
                            onClick={() => selectClause(clause)}
                            className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 text-left ${
                              selectedClause?.id === clause.id
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'hover:bg-white/60 text-gray-700'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="flex-1 font-medium">{clause.title}</span>
                            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Derecho - Contenido de la Cláusula */}
        <div className="col-span-12 lg:col-span-8">
          {selectedClause ? (
            <div className="space-y-6">
              {/* Header de la cláusula */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedClause.title}
                      </h3>
                      <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-orange-100 text-orange-700">
                        {selectedClause.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Modificado: {new Date(selectedClause.lastModified).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        <span>
                          Versión: {selectedClause.versions?.length || 1}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <>
                        <button
                          onClick={() => {
                            alert('Cláusula clonada exitosamente');
                          }}
                          className="btn-secondary flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Clonar
                        </button>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="btn-secondary flex items-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => setShowVersionHistory(!showVersionHistory)}
                          className="btn-secondary flex items-center gap-2"
                        >
                          <History className="w-4 h-4" />
                          Historial
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleSave}
                          className="btn-primary flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Guardar
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditedContent(selectedClause.content);
                          }}
                          className="btn-secondary flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Funcionalidades */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Funcionalidades</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                    <span>Encabezado y posibilidad de cambiarlo</span>
                  </div>
                </div>

                {/* Editor de contenido */}
                <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Texto original de la cláusula
                    </h4>
                    {isEditing && (
                      <div className="relative" ref={aiMenuRef}>
                        <button
                          onClick={() => setShowAiMenu(!showAiMenu)}
                          disabled={isGeneratingAi}
                          className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-xl transition-all duration-500 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                        >
                          {/* Efecto de brillo animado */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                          
                          {isGeneratingAi ? (
                            <>
                              <Sparkles className="w-4 h-4 animate-spin" />
                              <span className="text-sm font-semibold relative z-10">Generando...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 animate-pulse relative z-10" />
                              <span className="text-sm font-semibold relative z-10">IA Generativa</span>
                            </>
                          )}
                        </button>

                        {/* Menú desplegable de IA */}
                        {showAiMenu && !isGeneratingAi && (
                          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-purple-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Header del menú */}
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
                              <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-5 h-5" />
                                <h5 className="font-bold">Asistente IA</h5>
                              </div>
                              <p className="text-xs text-purple-100">
                                Selecciona una acción para mejorar tu cláusula
                              </p>
                            </div>

                            {/* Opciones de IA */}
                            <div className="p-2">
                              <button
                                onClick={() => handleAiGenerate('improve')}
                                className="w-full p-3 rounded-xl hover:bg-purple-50 transition-all text-left group border border-transparent hover:border-purple-200"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                                    <Sparkles className="w-4 h-4 text-purple-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h6 className="font-semibold text-gray-900 text-sm mb-0.5">
                                      Mejorar Redacción
                                    </h6>
                                    <p className="text-xs text-gray-600">
                                      Optimiza claridad y precisión legal
                                    </p>
                                  </div>
                                </div>
                              </button>

                              <button
                                onClick={() => handleAiGenerate('simplify')}
                                className="w-full p-3 rounded-xl hover:bg-blue-50 transition-all text-left group border border-transparent hover:border-blue-200"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h6 className="font-semibold text-gray-900 text-sm mb-0.5">
                                      Simplificar Lenguaje
                                    </h6>
                                    <p className="text-xs text-gray-600">
                                      Hace el texto más accesible
                                    </p>
                                  </div>
                                </div>
                              </button>

                              <button
                                onClick={() => handleAiGenerate('expand')}
                                className="w-full p-3 rounded-xl hover:bg-green-50 transition-all text-left group border border-transparent hover:border-green-200"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                                    <Plus className="w-4 h-4 text-green-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h6 className="font-semibold text-gray-900 text-sm mb-0.5">
                                      Expandir Detalles
                                    </h6>
                                    <p className="text-xs text-gray-600">
                                      Añade casos específicos y ejemplos
                                    </p>
                                  </div>
                                </div>
                              </button>

                              <button
                                onClick={() => handleAiGenerate('translate')}
                                className="w-full p-3 rounded-xl hover:bg-orange-50 transition-all text-left group border border-transparent hover:border-orange-200"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                                    <FileText className="w-4 h-4 text-orange-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h6 className="font-semibold text-gray-900 text-sm mb-0.5">
                                      Adaptar Contexto
                                    </h6>
                                    <p className="text-xs text-gray-600">
                                      Ajusta al contexto legal específico
                                    </p>
                                  </div>
                                </div>
                              </button>
                            </div>

                            {/* Footer del menú */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-t border-purple-100">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Sparkles className="w-3 h-3 text-purple-600" />
                                <span>Powered by IA Generativa</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="relative">
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        disabled={isGeneratingAi}
                        className="w-full min-h-[200px] p-4 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm resize-y disabled:opacity-50 disabled:cursor-wait transition-all"
                      />
                      {isGeneratingAi && (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-purple-200">
                            <div className="flex flex-col items-center gap-4">
                              <div className="relative">
                                {/* Círculo animado exterior */}
                                <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-ping absolute"></div>
                                {/* Círculo animado medio */}
                                <div className="w-16 h-16 border-4 border-t-purple-600 border-r-pink-600 border-b-purple-400 border-l-pink-400 rounded-full animate-spin"></div>
                                {/* Icono central */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="font-bold text-gray-900 mb-1">IA Generando Contenido</p>
                                <p className="text-sm text-gray-600">Esto tomará solo unos segundos...</p>
                              </div>
                              {/* Barra de progreso animada */}
                              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 animate-gradient rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedClause.content}
                    </p>
                  )}
                </div>
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-2 gap-6">
                {/* Uso en plantillas */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Uso en Plantillas
                  </h4>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-blue-600">
                      {getTemplateUsageCount(selectedClause.id)}
                    </div>
                    <p className="text-sm text-gray-600">
                      {getTemplateUsageCount(selectedClause.id) === 1 
                        ? 'plantilla usa esta cláusula' 
                        : 'plantillas usan esta cláusula'}
                    </p>
                    {getTemplateNames(selectedClause.id).length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2 font-medium">Plantillas:</p>
                        <ul className="space-y-1">
                          {getTemplateNames(selectedClause.id).map((name, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                              {name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Historial de versiones */}
                {showVersionHistory && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <History className="w-5 h-5 text-purple-600" />
                        Historial de Versiones
                      </h4>
                      <button
                        onClick={() => {
                          if (selectedClause?.versions && selectedClause.versions.length >= 2) {
                            setCompareVersion1(selectedClause.versions.length - 1);
                            setCompareVersion2(selectedClause.versions.length - 2);
                            setShowCompareModal(true);
                          }
                        }}
                        className="text-xs btn-secondary flex items-center gap-1 py-1 px-2"
                      >
                        <GitCompare className="w-3 h-3" />
                        Comparar
                      </button>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {selectedClause.versions?.slice().reverse().map((version, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm text-gray-900">
                              Versión {version.version}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(version.modifiedDate).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{version.changes}</p>
                          <p className="text-xs text-gray-500">Por: {version.modifiedBy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Estado vacío */
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Selecciona una cláusula
              </h3>
              <p className="text-gray-600">
                Haz clic en cualquier cláusula del árbol para ver y editar su contenido
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de guardar versión */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Save className="w-5 h-5" />
                Guardar Cambios
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                Selecciona cómo deseas guardar los cambios realizados
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Opciones de guardado */}
              <div className="space-y-3">
                <button
                  onClick={() => setSaveAsNewVersion(true)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    saveAsNewVersion
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                      saveAsNewVersion ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {saveAsNewVersion && <div className="w-2 h-2 bg-white rounded-full"></div>}
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
                  onClick={() => setSaveAsNewVersion(false)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    !saveAsNewVersion
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                      !saveAsNewVersion ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                    }`}>
                      {!saveAsNewVersion && <div className="w-2 h-2 bg-white rounded-full"></div>}
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
                  Descripción de cambios {saveAsNewVersion && '*'}
                </label>
                <textarea
                  value={versionDescription}
                  onChange={(e) => setVersionDescription(e.target.value)}
                  placeholder="Describe brevemente los cambios realizados..."
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl flex gap-3">
              <button
                onClick={confirmSave}
                disabled={saveAsNewVersion && !versionDescription.trim()}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Guardar Cambios
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="btn-secondary px-6"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de comparación de versiones */}
      {showCompareModal && selectedClause && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <GitCompare className="w-6 h-6" />
                    Comparar Versiones
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">
                    {selectedClause.title}
                  </p>
                </div>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Selectores de versión */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Versión A
                  </label>
                  <select
                    value={compareVersion1}
                    onChange={(e) => setCompareVersion1(Number(e.target.value))}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500"
                  >
                    {selectedClause.versions?.map((v, idx) => (
                      <option key={idx} value={idx}>
                        Versión {v.version} - {new Date(v.modifiedDate).toLocaleDateString('es-ES')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Versión B
                  </label>
                  <select
                    value={compareVersion2}
                    onChange={(e) => setCompareVersion2(Number(e.target.value))}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500"
                  >
                    {selectedClause.versions?.map((v, idx) => (
                      <option key={idx} value={idx}>
                        Versión {v.version} - {new Date(v.modifiedDate).toLocaleDateString('es-ES')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Comparación lado a lado */}
              <div className="grid grid-cols-2 gap-4">
                {/* Versión A */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 mb-1">
                      Versión {selectedClause.versions?.[compareVersion1]?.version}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {selectedClause.versions?.[compareVersion1]?.changes}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Por: {selectedClause.versions?.[compareVersion1]?.modifiedBy} - {' '}
                      {new Date(selectedClause.versions?.[compareVersion1]?.modifiedDate || '').toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedClause.versions?.[compareVersion1]?.content}
                    </p>
                  </div>
                </div>

                {/* Versión B */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200">
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 mb-1">
                      Versión {selectedClause.versions?.[compareVersion2]?.version}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {selectedClause.versions?.[compareVersion2]?.changes}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Por: {selectedClause.versions?.[compareVersion2]?.modifiedBy} - {' '}
                      {new Date(selectedClause.versions?.[compareVersion2]?.modifiedDate || '').toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedClause.versions?.[compareVersion2]?.content}
                    </p>
                  </div>
                </div>
              </div>

              {/* Resumen de diferencias */}
              <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Resumen de Diferencias
                </h5>
                <p className="text-sm text-gray-700">
                  {compareVersion1 === compareVersion2 
                    ? 'Estás comparando la misma versión. Selecciona versiones diferentes para ver los cambios.'
                    : `Comparando versión ${selectedClause.versions?.[compareVersion1]?.version} con versión ${selectedClause.versions?.[compareVersion2]?.version}. Las diferencias se muestran en el contenido de texto arriba.`
                  }
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <button
                onClick={() => setShowCompareModal(false)}
                className="btn-primary w-full"
              >
                Cerrar Comparación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de exportar */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <FileDown className="w-5 h-5" />
                    Exportar Cláusulas
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
              {/* Información de cláusulas a exportar */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-gray-700 font-medium mb-2">
                  Cláusulas a exportar:
                </p>
                {selectedClauses.size > 0 ? (
                  <div className="space-y-1">
                    <p className="text-sm text-blue-700 font-semibold">
                      {selectedClauses.size} cláusula{selectedClauses.size !== 1 ? 's' : ''} seleccionada{selectedClauses.size !== 1 ? 's' : ''}
                    </p>
                    <ul className="text-xs text-gray-600 ml-4 mt-2 space-y-1">
                      {Array.from(selectedClauses).slice(0, 5).map(clauseId => {
                        const clause = mockClauses.find(c => c.id === clauseId);
                        return clause ? (
                          <li key={clauseId} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                            {clause.title}
                          </li>
                        ) : null;
                      })}
                      {selectedClauses.size > 5 && (
                        <li className="text-gray-500 italic">
                          Y {selectedClauses.size - 5} más...
                        </li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    No hay cláusulas seleccionadas. Se exportarán todas las cláusulas visibles.
                  </p>
                )}
              </div>

              {/* Opciones de formato */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    alert('Exportando cláusulas a Word...');
                    setShowExportModal(false);
                  }}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <FileDown className="w-5 h-5 text-blue-600" />
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
                    alert('Exportando cláusulas a PDF...');
                    setShowExportModal(false);
                  }}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
                      <FileDown className="w-5 h-5 text-red-600" />
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

      {/* Modal crear contrato mejorado */}
      {showCreateContract && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Crear Nuevo Contrato
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Selecciona las cláusulas que deseas incluir en tu contrato
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateContract(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Columna Izquierda - Selección de Cláusulas */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900">
                      Cláusulas Disponibles
                    </h4>
                    <span className="text-sm text-gray-500">
                      {selectedClauses.size} seleccionadas
                    </span>
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto bg-gray-50 rounded-xl p-4">
                    {Object.entries(allClausesTree).map(([category, clauses]) => (
                      <div key={category} className="space-y-2">
                        {/* Categoría con checkbox "Seleccionar todas" */}
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
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
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : clauses.some(c => selectedClauses.has(c.id)) ? (
                              <div className="w-4 h-4 border-2 border-blue-600 rounded bg-blue-100 flex items-center justify-center">
                                <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
                              </div>
                            ) : (
                              <Square className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                          <Tag className="w-4 h-4 text-orange-600" />
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
                                <CheckSquare className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-400 group-hover:text-blue-400 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700 truncate">
                                  {clause.title}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {clause.content.substring(0, 60)}...
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedClauses.size === 0 && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="flex items-center gap-2 text-amber-800">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Selecciona al menos una cláusula para crear el contrato
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Columna Derecha - Detalles del Contrato */}
                <div className="space-y-6">
                  {/* Nombre del contrato */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre del Contrato *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Ej: Contrato de Servicios Profesionales"
                    />
                  </div>

                  {/* Tipo de contrato */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo de Contrato
                    </label>
                    <select className="input-field">
                      <option>Servicios</option>
                      <option>Consultoría</option>
                      <option>Mantenimiento</option>
                      <option>Licencia</option>
                      <option>NDA</option>
                      <option>Otro</option>
                    </select>
                  </div>

                  {/* Cliente */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cliente
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Nombre del cliente"
                    />
                  </div>

                  {/* Resumen de cláusulas seleccionadas */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Cláusulas Seleccionadas ({selectedClauses.size})
                    </h5>
                    {selectedClauses.size > 0 ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {Array.from(selectedClauses).map(clauseId => {
                          const clause = mockClauses.find(c => c.id === clauseId);
                          if (!clause) return null;
                          return (
                            <div key={clauseId} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                              <span className="text-gray-700 font-medium">{clause.title}</span>
                              <span className="text-xs text-gray-500 ml-auto">{clause.category}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        Ninguna cláusula seleccionada
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex gap-3">
                <button 
                  disabled={selectedClauses.size === 0}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Crear Contrato con {selectedClauses.size} Cláusulas
                </button>
                <button 
                  onClick={() => setShowCreateContract(false)}
                  className="btn-secondary px-6"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

