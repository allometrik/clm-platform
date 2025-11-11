'use client';

import { useState } from 'react';
import { mockLegalPlaybook, mockClauses } from '@/lib/data';
import { BookOpen, AlertTriangle, CheckCircle, FileText, Tag } from 'lucide-react';

export default function LegalPlaybookView() {
  const [selectedPlaybook, setSelectedPlaybook] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(mockLegalPlaybook.map((p) => p.category)))];

  const filteredPlaybooks =
    selectedCategory === 'all'
      ? mockLegalPlaybook
      : mockLegalPlaybook.filter((p) => p.category === selectedCategory);

  const getPlaybookDetails = (playbookId: string) => {
    return mockLegalPlaybook.find((p) => p.id === playbookId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-dark mb-2">Playbook Jurídico</h2>
        <p className="text-gray-600">
          Guía sobre cláusulas aceptables y riesgos para ayudarte en la redacción de contratos
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category
                ? 'bg-primary-dark text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category === 'all' ? 'Todas' : category}
          </button>
        ))}
      </div>

      {/* Grid de playbooks */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredPlaybooks.map((playbook) => (
          <div
            key={playbook.id}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedPlaybook(playbook.id)}
          >
            <div className="flex items-start gap-3 mb-3">
              <BookOpen className="w-6 h-6 text-primary-dark flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-primary-dark">{playbook.title}</h3>
                  <span className="status-badge bg-blue-100 text-primary-dark text-xs">
                    {playbook.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{playbook.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {playbook.risks.length} riesgos
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {playbook.bestPractices.length} mejores prácticas
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {playbook.relatedClauses.length} cláusulas relacionadas
                  </span>
                </div>
              </div>
            </div>
            <button className="w-full btn-primary text-sm mt-4">Ver Guía Completa</button>
          </div>
        ))}
      </div>

      {/* Modal de detalles */}
      {selectedPlaybook && (() => {
        const playbook = getPlaybookDetails(selectedPlaybook);
        if (!playbook) return null;

        const relatedClauses = playbook.relatedClauses
          .map((clauseId) => mockClauses.find((c) => c.id === clauseId))
          .filter((clause): clause is NonNullable<typeof clause> => clause !== undefined);

        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-primary-dark">{playbook.title}</h3>
                    <span className="status-badge bg-blue-100 text-primary-dark mt-2 inline-block">
                      {playbook.category}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedPlaybook(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-gray-600 mb-6">{playbook.description}</p>

                {/* Guía */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-primary-dark mb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Guía Principal
                  </h4>
                  <p className="text-gray-700">{playbook.guidance}</p>
                </div>

                {/* Riesgos */}
                <div className="mb-6">
                  <h4 className="font-semibold text-primary-dark mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Riesgos a Considerar
                  </h4>
                  <div className="space-y-2">
                    {playbook.risks.map((risk, index) => (
                      <div key={index} className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                        <p className="text-sm text-gray-700">{risk}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mejores prácticas */}
                <div className="mb-6">
                  <h4 className="font-semibold text-primary-dark mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Mejores Prácticas
                  </h4>
                  <div className="space-y-2">
                    {playbook.bestPractices.map((practice, index) => (
                      <div key={index} className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                        <p className="text-sm text-gray-700">{practice}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cláusulas relacionadas */}
                {relatedClauses.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-primary-dark mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Cláusulas Relacionadas
                    </h4>
                    <div className="space-y-3">
                      {relatedClauses.map((clause) => (
                        <div key={clause.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium text-primary-dark">{clause.title}</h5>
                            <span className="status-badge bg-blue-100 text-primary-dark text-xs">
                              <Tag className="w-3 h-3 inline mr-1" />
                              {clause.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{clause.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setSelectedPlaybook(null)}
                  className="btn-secondary w-full"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

