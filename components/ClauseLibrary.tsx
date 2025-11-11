'use client';

import { useState } from 'react';
import { mockClauses } from '@/lib/data';
import { BookOpen, Calendar, Tag } from 'lucide-react';

export default function ClauseLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedClause, setExpandedClause] = useState<string | null>(null);

  const categories = ['all', ...Array.from(new Set(mockClauses.map((c) => c.category)))];

  const filteredClauses =
    selectedCategory === 'all'
      ? mockClauses
      : mockClauses.filter((c) => c.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Filtros por categoría */}
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

      {/* Lista de cláusulas */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredClauses.map((clause) => (
          <div key={clause.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-primary-dark flex-1">
                {clause.title}
              </h3>
              <span className="status-badge bg-blue-100 text-primary-dark flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {clause.category}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Calendar className="w-4 h-4" />
              <span>
                Modificado: {new Date(clause.lastModified).toLocaleDateString('es-ES')}
              </span>
            </div>

            <p
              className={`text-gray-700 ${
                expandedClause === clause.id ? '' : 'line-clamp-3'
              }`}
            >
              {clause.content}
            </p>

            <button
              onClick={() =>
                setExpandedClause(expandedClause === clause.id ? null : clause.id)
              }
              className="text-accent text-sm font-medium mt-2 hover:underline"
            >
              {expandedClause === clause.id ? 'Ver menos' : 'Ver más'}
            </button>
          </div>
        ))}
      </div>

      {filteredClauses.length === 0 && (
        <div className="card text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No se encontraron cláusulas en esta categoría</p>
        </div>
      )}
    </div>
  );
}

