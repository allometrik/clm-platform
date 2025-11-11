'use client';

import { RiskAssessment as RiskAssessmentType } from '@/lib/data';
import { AlertTriangle, CheckCircle, AlertCircle, XCircle, Lightbulb } from 'lucide-react';

interface RiskAssessmentProps {
  riskAssessment: RiskAssessmentType;
}

export default function RiskAssessment({ riskAssessment }: RiskAssessmentProps) {
  const riskConfig = {
    bajo: { label: 'Bajo', icon: CheckCircle, color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
    medio: { label: 'Medio', icon: AlertCircle, color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50' },
    alto: { label: 'Alto', icon: AlertTriangle, color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-50' },
    critico: { label: 'Crítico', icon: XCircle, color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' },
  };

  const RiskIcon = riskConfig[riskAssessment.overallRisk].icon;
  const riskColor = riskConfig[riskAssessment.overallRisk].color;
  const riskTextColor = riskConfig[riskAssessment.overallRisk].textColor;
  const riskBgColor = riskConfig[riskAssessment.overallRisk].bgColor;

  const factorRiskConfig = {
    bajo: { color: 'bg-green-100 text-green-800' },
    medio: { color: 'bg-yellow-100 text-yellow-800' },
    alto: { color: 'bg-orange-100 text-orange-800' },
    critico: { color: 'bg-red-100 text-red-800' },
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-primary-dark">Evaluación de Riesgo Contractual</h3>
        <div className={`status-badge ${riskColor} text-white flex items-center gap-2`}>
          <RiskIcon className="w-5 h-5" />
          {riskConfig[riskAssessment.overallRisk].label}
        </div>
      </div>

      {/* Score */}
      <div className={`${riskBgColor} p-4 rounded-lg mb-6`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1">Puntuación de Riesgo</p>
            <p className={`text-3xl font-bold ${riskTextColor}`}>{riskAssessment.riskScore}/100</p>
          </div>
          <div className="w-32 h-32 relative">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(riskAssessment.riskScore / 100) * 352} 352`}
                className={riskTextColor}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${riskTextColor}`}>
                {riskAssessment.riskScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Factores de riesgo */}
      <div className="mb-6">
        <h4 className="font-semibold text-primary-dark mb-3">Factores de Riesgo Identificados</h4>
        <div className="space-y-3">
          {riskAssessment.factors.map((factor, index) => {
            const factorConfig = factorRiskConfig[factor.riskLevel];
            return (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-primary-dark">{factor.category}</span>
                      <span className={`status-badge ${factorConfig.color} text-xs`}>
                        {factor.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{factor.description}</p>
                    <p className="text-xs text-gray-600">
                      <strong>Impacto:</strong> {factor.impact}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recomendaciones */}
      <div>
        <h4 className="font-semibold text-primary-dark mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-accent" />
          Recomendaciones
        </h4>
        <div className="space-y-2">
          {riskAssessment.recommendations.map((rec, index) => (
            <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <p className="text-sm text-gray-700">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t text-sm text-gray-600">
        <p>
          <strong>Evaluado por:</strong> {riskAssessment.assessedBy}
        </p>
        <p>
          <strong>Fecha:</strong> {new Date(riskAssessment.assessedDate).toLocaleDateString('es-ES')}
        </p>
      </div>
    </div>
  );
}

