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
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-dark to-primary-dark/95 text-white shadow-md">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-7 h-7" />
              <h1 className="text-xl font-semibold">Plataforma CLM</h1>
            </div>
            <nav className="flex flex-wrap gap-1.5">
              {/* Screen 1: Contratos, Cláusulas, Market */}
              <button
                onClick={() => {
                  setActiveScreen('screen1');
                  setScreen1View('contracts');
                }}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-medium ${
                  activeScreen === 'screen1'
                    ? 'bg-accent text-white shadow-sm'
                    : 'hover:bg-white/10 text-white/90'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-1.5" />
                Repositorio
              </button>
              {/* Screen 2: Solicitudes/Ticketing */}
              <button
                onClick={() => {
                  setActiveScreen('screen2');
                  setScreen2View('dashboard');
                }}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-medium ${
                  activeScreen === 'screen2'
                    ? 'bg-accent text-white shadow-sm'
                    : 'hover:bg-white/10 text-white/90'
                }`}
              >
                <Ticket className="w-4 h-4 inline mr-1.5" />
                Solicitudes
              </button>
              {/* Screen 3: Gestor CLM */}
              <button
                onClick={() => {
                  setActiveScreen('screen3');
                  setScreen3View('lifecycle');
                }}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-medium ${
                  activeScreen === 'screen3'
                    ? 'bg-accent text-white shadow-sm'
                    : 'hover:bg-white/10 text-white/90'
                }`}
              >
                <Activity className="w-4 h-4 inline mr-1.5" />
                Gestor CLM
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
            {/* Submenu for Screen 1 */}
            <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setScreen1View('contracts')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    screen1View === 'contracts'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-1.5" />
                  Contratos
                </button>
                <button
                  onClick={() => setScreen1View('clauses')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    screen1View === 'clauses'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-1.5" />
                  Cláusulas
                </button>
                <button
                  onClick={() => setScreen1View('market')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    screen1View === 'market'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 inline mr-1.5" />
                  Supermarket
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
            {/* Submenu for Screen 2 */}
            <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setScreen2View('dashboard')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    screen2View === 'dashboard'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Activity className="w-4 h-4 inline mr-1.5" />
                  Dashboard
                </button>
                <button
                  onClick={() => setScreen2View('requests')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    screen2View === 'requests'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Ticket className="w-4 h-4 inline mr-1.5" />
                  Vista de Solicitudes
                </button>
                <button
                  onClick={() => setScreen2View('new-request')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    screen2View === 'new-request'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Plus className="w-4 h-4 inline mr-1.5" />
                  Nueva Solicitud
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

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">Plataforma CLM - Contract Lifecycle Management</p>
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

