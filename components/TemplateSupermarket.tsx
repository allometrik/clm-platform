'use client';

import { useState } from 'react';
import { mockTemplates, mockClauses } from '@/lib/data';
import { ShoppingCart, FileText, Tag, Users, Calendar } from 'lucide-react';

export default function TemplateSupermarket() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const publicTemplates = mockTemplates.filter((t) => t.isPublic);
  const categories = ['all', ...Array.from(new Set(publicTemplates.map((t) => t.category)))];

  const filteredTemplates =
    selectedCategory === 'all'
      ? publicTemplates
      : publicTemplates.filter((t) => t.category === selectedCategory);

  const getTemplateDetails = (templateId: string) => {
    const template = mockTemplates.find((t) => t.id === templateId);
    if (!template) return null;

    const clauses = template.clauses
      .map((clauseId) => mockClauses.find((c) => c.id === clauseId))
      .filter((clause): clause is NonNullable<typeof clause> => clause !== undefined);

    return { template, clauses };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-dark mb-2">Supermarket de Plantillas</h2>
          <p className="text-gray-600">
            Repositorio de plantillas de libre acceso para toda la organización
          </p>
        </div>
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

      {/* Grid de plantillas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-primary-dark flex-1">
                {template.name}
              </h3>
              <span className="status-badge bg-green-100 text-green-800 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Público
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4">{template.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Tag className="w-4 h-4" />
                <span>{template.category}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>{template.clauses.length} cláusulas incluidas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ShoppingCart className="w-4 h-4" />
                <span>{template.usageCount || 0} usos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Actualizado: {new Date(template.lastModified).toLocaleDateString('es-ES')}</span>
              </div>
            </div>

            <button className="w-full btn-primary text-sm">Usar Plantilla</button>
          </div>
        ))}
      </div>

      {/* Modal de detalles */}
      {selectedTemplate && (() => {
        const details = getTemplateDetails(selectedTemplate);
        if (!details) return null;

        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-primary-dark">{details.template.name}</h3>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-gray-600 mb-6">{details.template.description}</p>

                <div className="mb-6">
                  <h4 className="font-semibold text-primary-dark mb-3">Cláusulas incluidas:</h4>
                  <div className="space-y-3">
                    {details.clauses.map((clause) => (
                      <div key={clause.id} className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-primary-dark mb-2">{clause.title}</h5>
                        <p className="text-sm text-gray-700">{clause.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="btn-accent flex-1">Usar esta Plantilla</button>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="btn-secondary"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

