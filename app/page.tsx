'use client';

import { useState } from 'react';
import { mockContracts, mockRequests, Contract } from '@/lib/data';
import ContractList from '@/components/ContractList';
import ContractForm from '@/components/ContractForm';
import ClauseLibrary from '@/components/ClauseLibrary';
import RequestPortal from '@/components/RequestPortal';
import TemplateSupermarket from '@/components/TemplateSupermarket';
import LegalPlaybookView from '@/components/LegalPlaybook';
import ContractDetails from '@/components/ContractDetails';
import SearchBar from '@/components/SearchBar';
import { FileText, Plus, BookOpen, Ticket, ShoppingCart, Scale, Search } from 'lucide-react';

export default function Home() {
  const [contracts, setContracts] = useState(mockContracts);
  const [requests] = useState(mockRequests);
  const [activeView, setActiveView] = useState<
    'contracts' | 'new' | 'clauses' | 'requests' | 'supermarket' | 'playbook'
  >('contracts');
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
    setActiveView('contracts');
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-dark to-primary-dark/95 text-white shadow-md">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-7 h-7" />
              <h1 className="text-xl font-semibold">Gestor de Contratos</h1>
            </div>
            <nav className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveView('contracts')}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-medium ${
                  activeView === 'contracts'
                    ? 'bg-accent text-white shadow-sm'
                    : 'hover:bg-white/10 text-white/90'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-1.5" />
                Contratos
              </button>
              <button
                onClick={() => setActiveView('requests')}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-medium ${
                  activeView === 'requests'
                    ? 'bg-accent text-white shadow-sm'
                    : 'hover:bg-white/10 text-white/90'
                }`}
              >
                <Ticket className="w-4 h-4 inline mr-1.5" />
                Solicitudes
              </button>
              <button
                onClick={() => setActiveView('clauses')}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-medium ${
                  activeView === 'clauses'
                    ? 'bg-accent text-white shadow-sm'
                    : 'hover:bg-white/10 text-white/90'
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-1.5" />
                Cláusulas
              </button>
              <button
                onClick={() => setActiveView('supermarket')}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-medium ${
                  activeView === 'supermarket'
                    ? 'bg-accent text-white shadow-sm'
                    : 'hover:bg-white/10 text-white/90'
                }`}
              >
                <ShoppingCart className="w-4 h-4 inline mr-1.5" />
                Supermarket
              </button>
              <button
                onClick={() => setActiveView('playbook')}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-medium ${
                  activeView === 'playbook'
                    ? 'bg-accent text-white shadow-sm'
                    : 'hover:bg-white/10 text-white/90'
                }`}
              >
                <Scale className="w-4 h-4 inline mr-1.5" />
                Playbook
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeView === 'contracts' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-semibold text-primary-dark mb-1">Panel de Contratos</h2>
                <p className="text-sm text-gray-500">Gestiona y revisa todos tus contratos</p>
              </div>
              <button
                onClick={() => setActiveView('new')}
                className="btn-accent flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nuevo Contrato
              </button>
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

        {activeView === 'requests' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-semibold text-primary-dark">Portal de Solicitudes</h2>
              <button
                onClick={() => setActiveView('new')}
                className="btn-accent flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Nueva Solicitud
              </button>
            </div>
            <RequestPortal requests={requests} />
          </div>
        )}

        {activeView === 'supermarket' && (
          <TemplateSupermarket />
        )}

        {activeView === 'playbook' && (
          <LegalPlaybookView />
        )}

        {activeView === 'new' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveView('contracts')}
                className="btn-secondary"
              >
                ← Volver
              </button>
              <h2 className="text-2xl font-semibold text-primary-dark">Solicitar Nuevo Contrato</h2>
            </div>
            <ContractForm onSubmit={handleGenerateContract} />
          </div>
        )}

        {activeView === 'clauses' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-primary-dark">Biblioteca de Cláusulas</h2>
            </div>
            <ClauseLibrary />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">Gestor de Contratos</p>
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

