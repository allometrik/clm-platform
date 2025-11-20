'use client';

import { useState } from 'react';
import { mockContracts, mockRequests, Contract } from '@/lib/data';
import ContractBrowser from '@/components/ContractBrowser';
import ContractForm from '@/components/ContractForm';
import ClauseLibrary from '@/components/ClauseLibrary';
import RequestPortal from '@/components/RequestPortal';
import RequestDashboard from '@/components/RequestDashboard';
import TemplateSupermarket from '@/components/TemplateSupermarket';
import LegalPlaybookView from '@/components/LegalPlaybook';
import ContractLifecycle from '@/components/ContractLifecycle';
import { FileText, Plus, BookOpen, Ticket, ShoppingCart, Scale, Search, Activity, ExternalLink, UserCircle, Shield } from 'lucide-react';

type MainScreen = 'screen1' | 'screen2' | 'screen3';
type Screen1View = 'clauses' | 'contracts' | 'market';
type Screen2View = 'requests' | 'new-request' | 'dashboard';
type Screen3View = 'lifecycle';

export default function Home() {
  const [contracts, setContracts] = useState(mockContracts);
  const [requests] = useState(mockRequests);
  const [activeScreen, setActiveScreen] = useState<MainScreen>('screen1');
  const [screen1View, setScreen1View] = useState<Screen1View>('clauses');
  const [screen2View, setScreen2View] = useState<Screen2View>('dashboard');
  const [screen3View, setScreen3View] = useState<Screen3View>('lifecycle');
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(null);

  const handleGenerateContract = (contractData: any) => {
    const newContract = {
      id: String(contracts.length + 1),
      ...contractData,
      status: 'borrador' as const,
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
    };
    setContracts([newContract, ...contracts]);
    setActiveScreen('screen1');
    setScreen1View('contracts');
  };

  const handleNavigateToClause = (clauseId: string) => {
    setSelectedClauseId(clauseId);
    setActiveScreen('screen1');
    setScreen1View('clauses');
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 border-b border-gray-300 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Plataforma de Accesibilidad
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="flex flex-wrap gap-2">
                {/* Herramienta de Accesibilidad - Enlace externo */}
                <a
                  href="https://compiagent.streamlit.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 border border-gray-300"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>Herramienta de Accesibilidad</span>
                  </div>
                </a>
                {/* Screen 1: Gestor de Contratos */}
                <button
                  onClick={() => {
                    setActiveScreen('screen1');
                    setScreen1View('clauses');
                  }}
                  className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeScreen === 'screen1'
                      ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg shadow-[#10b981]/30'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 border border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Gestor de Contratos</span>
                  </div>
                  {activeScreen === 'screen1' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#10b981] to-transparent"></div>
                  )}
                </button>
                {/* Screen 2: Solicitudes */}
                <button
                  onClick={() => {
                    setActiveScreen('screen2');
                    setScreen2View('dashboard');
                  }}
                  className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeScreen === 'screen2'
                      ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg shadow-[#10b981]/30'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 border border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4" />
                    <span>Solicitudes</span>
                  </div>
                  {activeScreen === 'screen2' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#10b981] to-transparent"></div>
                  )}
                </button>
                {/* Screen 3: Gestor CLM */}
                <button
                  onClick={() => {
                    setActiveScreen('screen3');
                    setScreen3View('lifecycle');
                  }}
                  className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeScreen === 'screen3'
                      ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg shadow-[#10b981]/30'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 border border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    <span>Gestor CLM</span>
                  </div>
                  {activeScreen === 'screen3' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#10b981] to-transparent"></div>
                  )}
                </button>
              </nav>
              {/* Admin User Icon */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="relative">
                  <UserCircle className="w-8 h-8 text-amber-700" />
                  <Shield className="w-4 h-4 text-amber-600 absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-amber-900">Admin</span>
                  <span className="text-xs text-amber-700">Juan Pérez</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* SCREEN 1: Repositorio (Contratos, Cláusulas, Market) */}
        {activeScreen === 'screen1' && (
          <>
            {/* Submenu for Screen 1 */}
            <div className="mb-8 backdrop-blur-sm bg-white/70 rounded-2xl shadow-lg border border-gray-200/50 p-4">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setScreen1View('clauses')}
                  className={`group relative px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    screen1View === 'clauses'
                      ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg shadow-[#10b981]/30'
                      : 'bg-gray-50 text-gray-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Cláusulas</span>
                  </div>
                </button>
                <button
                  onClick={() => setScreen1View('contracts')}
                  className={`group relative px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    screen1View === 'contracts'
                      ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg shadow-[#10b981]/30'
                      : 'bg-gray-50 text-gray-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Plantillas</span>
                  </div>
                </button>
                <button
                  onClick={() => setScreen1View('market')}
                  className={`group relative px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    screen1View === 'market'
                      ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg shadow-[#10b981]/30'
                      : 'bg-gray-50 text-gray-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Supermarket</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Screen 1 Content */}
            {screen1View === 'clauses' && (
              <div className="space-y-6">
                <ClauseLibrary 
                  initialClauseId={selectedClauseId}
                  onClauseSelected={() => setSelectedClauseId(null)}
                />
              </div>
            )}

            {screen1View === 'contracts' && (
              <ContractBrowser 
                contracts={contracts}
                onNavigateToClause={handleNavigateToClause}
              />
            )}

            {screen1View === 'market' && (
              <TemplateSupermarket />
            )}
          </>
        )}

        {/* SCREEN 2: Solicitudes/Ticketing */}
        {activeScreen === 'screen2' && (
          <>
            {/* Modern Submenu for Screen 2 */}
            <div className="mb-8 backdrop-blur-sm bg-white/70 rounded-2xl shadow-lg border border-gray-200/50 p-4">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setScreen2View('dashboard')}
                  className={`group relative px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    screen2View === 'dashboard'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gray-50 text-gray-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    <span>Dashboard</span>
                  </div>
                </button>
                <button
                  onClick={() => setScreen2View('requests')}
                  className={`group relative px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    screen2View === 'requests'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gray-50 text-gray-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4" />
                    <span>Vista de Solicitudes</span>
                  </div>
                </button>
                <button
                  onClick={() => setScreen2View('new-request')}
                  className={`group relative px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    screen2View === 'new-request'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gray-50 text-gray-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Nueva Solicitud</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Screen 2 Content */}
            {screen2View === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-primary-dark mb-1">Dashboard de Solicitudes</h2>
                  <p className="text-sm text-gray-500">Seguimiento y gestión de todas las solicitudes</p>
                </div>
                <RequestDashboard requests={requests} />
              </div>
            )}

            {screen2View === 'requests' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-primary-dark">Vista de Solicitudes</h2>
                </div>
                <RequestPortal requests={requests} />
              </div>
            )}

            {screen2View === 'new-request' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setScreen2View('dashboard')}
                    className="btn-secondary"
                  >
                    ← Volver
                  </button>
                  <h2 className="text-2xl font-semibold text-primary-dark">Nueva Solicitud de Contrato</h2>
                </div>
                <ContractForm onSubmit={handleGenerateContract} />
              </div>
            )}
          </>
        )}

        {/* SCREEN 3: Gestor CLM (Contract Lifecycle Management) */}
        {activeScreen === 'screen3' && (
          <div className="space-y-6">
            <ContractLifecycle 
              contracts={contracts}
            />
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="relative mt-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <div className="relative container mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Plataforma de Accesibilidad
                </h3>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                © 2025 Plataforma de Accesibilidad. Gestión contractual profesional.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

