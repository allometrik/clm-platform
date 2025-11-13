'use client';

import { useState } from 'react';
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
  Download
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

export default function ClauseLibrary() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Seguridad', 'Legal']));
  const [selectedClause, setSelectedClause] = useState<ClauseNode | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [selectedClauses, setSelectedClauses] = useState<Set<string>>(new Set());
  const [showCreateContract, setShowCreateContract] = useState(false);

  // Organizar cláusulas en estructura jerárquica
  const clauseTree: Record<string, ClauseNode[]> = {};
  mockClauses.forEach(clause => {
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
  };

  const handleSave = () => {
    if (selectedClause && editedContent !== selectedClause.content) {
      // Aquí iría la lógica para guardar y crear nueva versión
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
            changes: 'Contenido actualizado'
          }
        ]
      });
    }
    setIsEditing(false);
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
        {selectedClauses.size > 0 && (
          <button
            onClick={() => setShowCreateContract(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Crear Contrato con {selectedClauses.size} Cláusulas
          </button>
        )}
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
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                    Texto original de la cláusula
                  </h4>
                  {isEditing ? (
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full min-h-[200px] p-4 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm resize-y"
                    />
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
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <History className="w-5 h-5 text-purple-600" />
                      Historial de Versiones
                    </h4>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {selectedClause.versions?.reverse().map((version, idx) => (
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

      {/* Modal crear contrato */}
      {showCreateContract && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Crear Contrato con Cláusulas Seleccionadas
            </h3>
            <p className="text-gray-600 mb-6">
              Has seleccionado {selectedClauses.size} cláusulas para tu nuevo contrato.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Contrato
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Ej: Contrato de Servicios Profesionales"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cláusulas Incluidas
              </label>
              <div className="bg-gray-50 rounded-xl p-4 max-h-40 overflow-y-auto">
                {Array.from(selectedClauses).map(clauseId => {
                  const clause = mockClauses.find(c => c.id === clauseId);
                  return (
                    <div key={clauseId} className="flex items-center gap-2 py-2">
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{clause?.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Crear Contrato
              </button>
              <button 
                onClick={() => setShowCreateContract(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

