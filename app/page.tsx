'use client';

import { useState } from 'react';
import { mockContracts, mockRequests, Contract } from '@/lib/data';
import ContractList from '@/components/ContractList';
import ContractForm from '@/components/ContractForm';
import ClauseLibrary from '@/components/ClauseLibrary';
import RequestPortal from '@/components/RequestPortal';
import RequestDashboard from '@/components/RequestDashboard';
import TemplateSupermarket from '@/components/TemplateSupermarket';
import LegalPlaybookView from '@/components/LegalPlaybook';
import ContractDetails from '@/components/ContractDetails';
import ContractLifecycle from '@/components/ContractLifecycle';
import SearchBar from '@/components/SearchBar';
import { FileText, Plus, BookOpen, Ticket, ShoppingCart, Scale, Search, Activity } from 'lucide-react';

type MainScreen = 'screen1' | 'screen2' | 'screen3';
type Screen1View = 'contracts' | 'clauses' | 'market';
type Screen2View = 'requests' | 'new-request' | 'dashboard';
type Screen3View = 'lifecycle';

export default function Home() {
  const [contracts, setContracts] = useState(mockContracts);
  const [requests] = useState(mockRequests);
  const [activeScreen, setActiveScreen] = useState<MainScreen>('screen1');
  const [screen1View, setScreen1View] = useState<Screen1View>('contracts');
  const [screen2View, setScreen2View] = useState<Screen2View>('dashboard');
  const [screen3View, setScreen3View] = useState<Screen3View>('lifecycle');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Modern Header with Glassmorphism */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 border-b border-white/10 shadow-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Plataforma CLM
                </h1>
                <p className="text-xs text-gray-400 font-medium">Contract Lifecycle Management</p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-2">
              {/* Screen 1: Contratos, Cláusulas, Market */}
              <button
                onClick={() => {
                  setActiveScreen('screen1');
                  setScreen1View('contracts');
                }}
                className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeScreen === 'screen1'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Repositorio</span>
                </div>
                {activeScreen === 'screen1' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                )}
              </button>
              {/* Screen 2: Solicitudes/Ticketing */}
              <button
                onClick={() => {
                  setActiveScreen('screen2');
                  setScreen2View('dashboard');
                }}
                className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeScreen === 'screen2'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4" />
                  <span>Solicitudes</span>
                </div>
                {activeScreen === 'screen2' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"></div>
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
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>Gestor CLM</span>
                </div>
                {activeScreen === 'screen3' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* SCREEN 1: Repositorio (Contratos, Cláusulas, Market) */}
        {activeScreen === 'screen1' && (
          <>
            {/* Modern Submenu for Screen 1 */}
            <div className="mb-8 backdrop-blur-sm bg-white/70 rounded-2xl shadow-lg border border-gray-200/50 p-4">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setScreen1View('contracts')}
                  className={`group relative px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    screen1View === 'contracts'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gray-50 text-gray-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Contratos</span>
                  </div>
                </button>
                <button
                  onClick={() => setScreen1View('clauses')}
                  className={`group relative px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    screen1View === 'clauses'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gray-50 text-gray-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Cláusulas</span>
                  </div>
                </button>
                <button
                  onClick={() => setScreen1View('market')}
                  className={`group relative px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    screen1View === 'market'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
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
            {screen1View === 'contracts' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-semibold text-primary-dark mb-1">Repositorio de Contratos</h2>
                    <p className="text-sm text-gray-500">Gestiona y revisa todos tus contratos</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                  {searchQuery && (
                    <p className="text-sm text-gray-600">
                      {filteredContracts.length === 1 
                        ? '1 contrato encontrado' 
                        : `${filteredContracts.length} contratos encontrados`}
                    </p>
                  )}
                </div>

                <ContractList
                  contracts={filteredContracts}
                  onContractClick={setSelectedContract}
                />
              </div>
            )}

            {screen1View === 'clauses' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-semibold text-primary-dark">Biblioteca de Cláusulas</h2>
                </div>
                <ClauseLibrary />
              </div>
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
              onContractClick={setSelectedContract}
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
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Plataforma CLM
                </h3>
                <p className="text-sm text-gray-400">Contract Lifecycle Management</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                © 2025 Plataforma CLM. Diseñado para el futuro de la gestión contractual.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de detalles del contrato */}
      {selectedContract && (
        <ContractDetails
          contract={selectedContract}
          onClose={() => setSelectedContract(null)}
        />
      )}
    </div>
  );
}

