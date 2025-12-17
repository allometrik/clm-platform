'use client';

import { Contract, ContractStatus } from '@/lib/data';
import { 
  FileText, 
  Edit, 
  Users, 
  CheckCircle, 
  Archive, 
  Activity, 
  RotateCw, 
  Calendar,
  DollarSign,
  Building,
  AlertCircle,
  TrendingUp,
  Clock,
  Eye,
  Upload,
  Brain,
  Table as TableIcon,
  X,
  FileJson,
  Loader2,
  Check
} from 'lucide-react';
import { useState, useRef } from 'react';

interface ContractLifecycleProps {
  contracts: Contract[];
  onContractClick?: (contract: Contract) => void;
  onAddContract?: (contract: any) => void;
}

const lifecyclePhases = [
  { key: 'borrador', label: 'Borrador', icon: Edit, color: 'bg-gray-100 text-gray-600' },
  { key: 'negociacion', label: 'Negociación', icon: Users, color: 'bg-blue-100 text-blue-600' },
  { key: 'firma', label: 'Firma', icon: FileText, color: 'bg-purple-100 text-purple-600' },
  { key: 'archivado', label: 'Archivado', icon: Archive, color: 'bg-green-100 text-green-600' },
  { key: 'cumplimiento', label: 'Cumplimiento', icon: Activity, color: 'bg-teal-100 text-teal-600' },
  { key: 'renovacion', label: 'Renovación', icon: RotateCw, color: 'bg-[#FFE5E2] text-[#E85D4E]' },
  { key: 'vencido', label: 'Vencido', icon: AlertCircle, color: 'bg-red-100 text-red-600' },
];

const getStatusLabel = (status: ContractStatus) => {
  const phase = lifecyclePhases.find(p => p.key === status);
  return phase?.label || status;
};

const getStatusColor = (status: ContractStatus) => {
  const phase = lifecyclePhases.find(p => p.key === status);
  return phase?.color || 'bg-gray-100 text-gray-600';
};

const getStatusIcon = (status: ContractStatus) => {
  const phase = lifecyclePhases.find(p => p.key === status);
  return phase?.icon || FileText;
};

export default function ContractLifecycle({ contracts, onContractClick, onAddContract }: ContractLifecycleProps) {
  const [filterStatus, setFilterStatus] = useState<ContractStatus | 'all'>('all');
  const [selectedView, setSelectedView] = useState<'timeline' | 'table'>('timeline');
  
  // Analysis State
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<'idle' | 'uploading' | 'processing' | 'complete'>('idle');
  const [analyzedFile, setAnalyzedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockExtractionData = {
    summary: "Contrato de prestación de servicios de desarrollo de software y mantenimiento evolutivo.",
    entities: [
      { label: "Cliente", value: "TechCorp Industries S.A." },
      { label: "Proveedor", value: "DevSolutions Global Ltd." },
      { label: "Fecha Inicio", value: "01/01/2024" },
      { label: "Duración", value: "24 meses" },
      { label: "Valor Total", value: "120.000,00 €" },
      { label: "Jurisdicción", value: "Madrid, España" }
    ],
    obligations: [
      "Entregar código fuente documentado mensualmente",
      "Realizar reuniones de seguimiento quincenales",
      "Garantizar disponibilidad del servicio 99.9%"
    ],
    tables: [
      {
        title: "Cronograma de Pagos",
        headers: ["Hito", "Fecha Estimada", "Porcentaje", "Importe"],
        rows: [
          ["Firma del contrato", "01/01/2024", "20%", "24.000 €"],
          ["Entrega Fase 1", "01/06/2024", "30%", "36.000 €"],
          ["Entrega Fase 2", "01/12/2024", "30%", "36.000 €"],
          ["Finalización y Cierre", "31/12/2025", "20%", "24.000 €"]
        ]
      }
    ]
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAnalyzedFile(file);
      setAnalysisStep('uploading');
      // Mock upload process
      setTimeout(() => {
        setAnalysisStep('processing');
        // Mock processing
        setTimeout(() => {
          setAnalysisStep('complete');
        }, 2000);
      }, 1500);
    }
  };

  const resetAnalysis = () => {
    setAnalyzedFile(null);
    setAnalysisStep('idle');
    setShowAnalysis(false);
  };

  // Calculate statistics
  const totalContracts = contracts.length;
  const activeContracts = contracts.filter(c => 
    ['archivado', 'cumplimiento'].includes(c.status)
  ).length;
  const expiringContracts = contracts.filter(c => {
    if (!c.expirationDate) return false;
    const daysToExpiration = Math.floor(
      (new Date(c.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysToExpiration <= 90 && daysToExpiration > 0;
  }).length;
  const renewalContracts = contracts.filter(c => c.status === 'renovacion').length;
  
  const totalValue = contracts.reduce((sum, c) => sum + (c.value || 0), 0);

  const filteredContracts = filterStatus === 'all' 
    ? contracts 
    : contracts.filter(c => c.status === filterStatus);

  const getPhaseProgress = (contract: Contract) => {
    const phases = ['borrador', 'negociacion', 'firma', 'archivado', 'cumplimiento', 'renovacion'];
    const currentIndex = phases.indexOf(contract.status);
    return ((currentIndex + 1) / phases.length) * 100;
  };

  const getDaysUntilExpiration = (expirationDate?: string) => {
    if (!expirationDate) return null;
    const days = Math.floor(
      (new Date(expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-primary-dark mb-1">
            Gestor de Ciclo de Vida de Contratos
          </h2>
          <p className="text-sm text-gray-500">
            Vista global del estado de todos los contratos
          </p>
        </div>
        <button
          onClick={() => setShowAnalysis(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 transition-all hover:-translate-y-0.5"
        >
          <Brain className="w-4 h-4" />
          <span>Analizar Documento</span>
        </button>
      </div>

      {/* Analysis Modal/Overlay */}
      {showAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="bg-violet-100 p-2 rounded-lg">
                  <Brain className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Análisis de Documento</h3>
                  <p className="text-sm text-gray-500">Extracción automática de datos y tablas</p>
                </div>
              </div>
              <button 
                onClick={resetAnalysis}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1">
              {analysisStep === 'idle' && (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-violet-500 hover:bg-violet-50 transition-all cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf" 
                    onChange={handleFileUpload}
                  />
                  <div className="bg-violet-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-violet-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">Sube tu documento PDF</h4>
                  <p className="text-gray-500 max-w-sm mb-4">
                    Arrastra y suelta tu archivo aquí o haz clic para explorar. 
                    El sistema procesará automáticamente el contenido.
                  </p>
                  <span className="text-xs text-gray-400">Soporta PDF hasta 10MB</span>
                </div>
              )}

              {(analysisStep === 'uploading' || analysisStep === 'processing') && (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-8 h-8 text-violet-600 animate-pulse" />
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    {analysisStep === 'uploading' ? 'Subiendo documento...' : 'Analizando contenido...'}
                  </h4>
                  <p className="text-gray-500 animate-pulse">
                    {analysisStep === 'uploading' 
                      ? 'Por favor espere mientras se carga el archivo.'
                      : 'Nuestra IA está extrayendo entidades, cláusulas y tablas.'}
                  </p>
                </div>
              )}

              {analysisStep === 'complete' && analyzedFile && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 bg-green-50 p-4 rounded-xl border border-green-100">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Análisis completado con éxito</p>
                      <p className="text-sm text-green-600">{analyzedFile.name}</p>
                    </div>
                  </div>

                  {/* Extracted Data Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* General Info */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center gap-2 mb-4">
                        <FileJson className="w-5 h-5 text-violet-600" />
                        <h4 className="font-semibold text-gray-800">Información General</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                          <p className="text-xs text-gray-500 mb-1">Resumen del Documento</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{mockExtractionData.summary}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {mockExtractionData.entities.map((entity, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                              <p className="text-xs text-gray-500 mb-1">{entity.label}</p>
                              <p className="text-sm font-medium text-gray-800">{entity.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Tables */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center gap-2 mb-4">
                        <TableIcon className="w-5 h-5 text-violet-600" />
                        <h4 className="font-semibold text-gray-800">Tablas Extraídas</h4>
                      </div>
                      <div className="space-y-6">
                        {mockExtractionData.tables.map((table, idx) => (
                          <div key={idx} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-700">
                              {table.title}
                            </div>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    {table.headers.map((header, hIdx) => (
                                      <th key={hIdx} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {header}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {table.rows.map((row, rIdx) => (
                                    <tr key={rIdx}>
                                      {row.map((cell, cIdx) => (
                                        <td key={cIdx} className="px-3 py-2 text-xs text-gray-700 whitespace-nowrap">
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-violet-600" />
                          <h4 className="font-semibold text-gray-800">Obligaciones Clave</h4>
                        </div>
                        <ul className="space-y-2">
                          {mockExtractionData.obligations.map((obs, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                              <div className="min-w-[6px] h-[6px] rounded-full bg-violet-500 mt-1.5"></div>
                              {obs}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {analysisStep === 'complete' && (
              <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                <button 
                  onClick={resetAnalysis}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
                <button 
                  onClick={() => {
                    if (onAddContract) {
                      const client = mockExtractionData.entities.find(e => e.label === "Cliente")?.value || "Cliente Desconocido";
                      const valueStr = mockExtractionData.entities.find(e => e.label === "Valor Total")?.value || "0";
                      const value = parseFloat(valueStr.replace(/\./g, '').replace(/,/g, '.').replace(/[^0-9.]/g, ''));
                      
                      const newContractData = {
                        title: analyzedFile?.name.replace('.pdf', '') || "Nuevo Contrato",
                        client: client,
                        description: mockExtractionData.summary,
                        value: value,
                        currency: 'EUR',
                        contractType: 'Servicios',
                        responsibleArea: 'Legal',
                        signingParties: [client, 'Nuestra Empresa'],
                        currentVersion: 1,
                        riskLevel: 'medio',
                        expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0] // 2 years from now
                      };
                      onAddContract(newContractData);
                    }
                    resetAnalysis();
                  }}
                  className="px-6 py-2 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 shadow-lg shadow-violet-500/20 transition-all"
                >
                  Guardar como Borrador
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modern Control Panel - Key Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total Contratos */}
        <div className="group relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-blue-100 mb-1">Total Contratos</p>
            <p className="text-3xl font-bold">{totalContracts}</p>
          </div>
        </div>

        {/* Activos */}
        <div className="group relative bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-emerald-100 mb-1">Activos</p>
            <p className="text-3xl font-bold">{activeContracts}</p>
          </div>
        </div>

        {/* Próximos a Vencer */}
        <div className="group relative bg-gradient-to-br from-[#E85D4E] to-[#D14839] rounded-2xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden ring-2 ring-[#E85D4E] ring-offset-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-orange-100 mb-1">Próximos a Vencer</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">{expiringContracts}</p>
              <span className="text-xs text-orange-200">{"<90 días"}</span>
            </div>
          </div>
        </div>

        {/* En Renovación */}
        <div className="group relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                <RotateCw className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-purple-100 mb-1">En Renovación</p>
            <p className="text-3xl font-bold">{renewalContracts}</p>
          </div>
        </div>

        {/* Valor Total */}
        <div className="group relative bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-amber-100 mb-1">Valor Total</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat('es-ES', { 
                style: 'currency', 
                currency: 'EUR',
                maximumFractionDigits: 0
              }).format(totalValue)}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Fase del ciclo:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  filterStatus === 'all'
                    ? 'bg-gradient-to-r from-[#E85D4E] to-[#D14839] text-white ring-2 ring-[#E85D4E] ring-offset-1 shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              {lifecyclePhases.map((phase) => {
                const Icon = phase.icon;
                const count = contracts.filter(c => c.status === phase.key).length;
                return (
                  <button
                    key={phase.key}
                    onClick={() => setFilterStatus(phase.key as ContractStatus)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                      filterStatus === phase.key
                        ? 'bg-gradient-to-r from-[#E85D4E] to-[#D14839] text-white ring-2 ring-[#E85D4E] ring-offset-1 shadow-md'
                        : phase.color + ' hover:opacity-80'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {phase.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedView('timeline')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                selectedView === 'timeline'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Vista Timeline
            </button>
            <button
              onClick={() => setSelectedView('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                selectedView === 'table'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Vista Tabla
            </button>
          </div>
        </div>
      </div>

      {/* Contracts View */}
      {selectedView === 'timeline' ? (
        <div className="space-y-4">
          {filteredContracts.map((contract) => {
            const StatusIcon = getStatusIcon(contract.status);
            const daysToExpiration = getDaysUntilExpiration(contract.expirationDate);
            
            return (
              <div
                key={contract.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onContractClick?.(contract)}
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-primary-dark">
                          {contract.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {getStatusLabel(contract.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{contract.client}</p>
                    </div>
                    <button className="text-primary hover:text-primary-dark">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Timeline Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 font-medium">Progreso del ciclo de vida</span>
                      <span className="text-xs text-gray-500">{Math.round(getPhaseProgress(contract))}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                        style={{ width: `${getPhaseProgress(contract)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      {lifecyclePhases.slice(0, -1).map((phase, idx) => {
                        const Icon = phase.icon;
                        const isActive = lifecyclePhases.findIndex(p => p.key === contract.status) >= idx;
                        return (
                          <div key={phase.key} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isActive ? phase.color : 'bg-gray-100 text-gray-400'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs text-gray-500 mt-1 hidden md:block">{phase.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                    {contract.responsibleArea && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Área Responsable</p>
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {contract.responsibleArea}
                        </p>
                      </div>
                    )}
                    {contract.value && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Valor</p>
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {new Intl.NumberFormat('es-ES', { 
                            style: 'currency', 
                            currency: contract.currency || 'EUR',
                            maximumFractionDigits: 0
                          }).format(contract.value)}
                        </p>
                      </div>
                    )}
                    {contract.expirationDate && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Vencimiento</p>
                        <p className={`text-sm font-medium flex items-center gap-1 ${
                          daysToExpiration && daysToExpiration < 90 
                            ? 'text-orange-600' 
                            : 'text-gray-700'
                        }`}>
                          <Calendar className="w-3 h-3" />
                          {new Date(contract.expirationDate).toLocaleDateString('es-ES')}
                          {daysToExpiration !== null && daysToExpiration > 0 && (
                            <span className="text-xs">({daysToExpiration}d)</span>
                          )}
                        </p>
                      </div>
                    )}
                    {contract.signingParties && contract.signingParties.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Partes Firmantes</p>
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {contract.signingParties.length} partes
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Additional Info for Active Contracts */}
                  {['archivado', 'cumplimiento'].includes(contract.status) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {contract.archivedDate && (
                            <span>Archivado: {new Date(contract.archivedDate).toLocaleDateString('es-ES')}</span>
                          )}
                          {contract.autoRenewal && (
                            <span className="flex items-center gap-1 text-blue-600">
                              <RotateCw className="w-3 h-3" />
                              Renovación automática
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contrato</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Área</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContracts.map((contract) => {
                  const StatusIcon = getStatusIcon(contract.status);
                  const daysToExpiration = getDaysUntilExpiration(contract.expirationDate);
                  
                  return (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                        <div className="text-xs text-gray-500">{contract.contractType}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{contract.client}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {getStatusLabel(contract.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{contract.responsibleArea || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {contract.value 
                          ? new Intl.NumberFormat('es-ES', { 
                              style: 'currency', 
                              currency: contract.currency || 'EUR',
                              maximumFractionDigits: 0
                            }).format(contract.value)
                          : '-'
                        }
                      </td>
                      <td className="px-4 py-3">
                        {contract.expirationDate ? (
                          <div>
                            <div className={`text-sm ${
                              daysToExpiration && daysToExpiration < 90 
                                ? 'text-orange-600 font-medium' 
                                : 'text-gray-700'
                            }`}>
                              {new Date(contract.expirationDate).toLocaleDateString('es-ES')}
                            </div>
                            {daysToExpiration !== null && daysToExpiration > 0 && (
                              <div className="text-xs text-gray-500">
                                {daysToExpiration} días
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => onContractClick?.(contract)}
                          className="text-primary hover:text-primary-dark"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredContracts.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay contratos en esta fase</p>
        </div>
      )}
    </div>
  );
}

