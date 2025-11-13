export type ContractStatus = 'borrador' | 'negociacion' | 'firma' | 'archivado' | 'cumplimiento' | 'renovacion' | 'vencido';
export type RequestStatus = 'nueva' | 'en_revision' | 'asignada' | 'en_proceso' | 'completada' | 'rechazada';
export type ApprovalStatus = 'pendiente' | 'aprobado' | 'rechazado' | 'devuelto';
export type RiskLevel = 'bajo' | 'medio' | 'alto' | 'critico';

export interface Contract {
  id: string;
  title: string;
  client: string;
  status: ContractStatus;
  createdDate: string;
  lastModified: string;
  description?: string;
  requestId?: string;
  templateId?: string;
  currentVersion: number;
  riskLevel?: RiskLevel;
  assignedTo?: string;
  // Archiving metadata
  signedDate?: string;
  archivedDate?: string;
  expirationDate?: string;
  renewalDate?: string;
  signingParties?: string[];
  contractType?: string;
  responsibleArea?: string;
  value?: number;
  currency?: string;
  autoRenewal?: boolean;
}

export interface ContractRequest {
  id: string;
  title: string;
  requester: string;
  department: string;
  status: RequestStatus;
  priority: 'baja' | 'media' | 'alta' | 'urgente';
  contractType: string;
  description: string;
  createdDate: string;
  assignedTo?: string;
  assignedDate?: string;
  completedDate?: string;
  businessJustification: string;
}

export interface Clause {
  id: string;
  title: string;
  category: string;
  content: string;
  lastModified: string;
  riskLevel?: RiskLevel;
  usageCount?: number;
  isRecommended?: boolean;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  clauses: string[];
  category: string;
  isPublic: boolean;
  usageCount?: number;
  lastModified: string;
}

export interface ContractVersion {
  id: string;
  contractId: string;
  versionNumber: number;
  content: string;
  createdBy: string;
  createdDate: string;
  changes: string;
  status: 'activa' | 'historial';
}

export interface Redline {
  id: string;
  versionId: string;
  clauseId: string;
  originalText: string;
  proposedText: string;
  comment: string;
  suggestedBy: string;
  status: 'pendiente' | 'aceptado' | 'rechazado';
  createdDate: string;
}

export interface ApprovalFlow {
  id: string;
  contractId: string;
  currentStep: number;
  steps: ApprovalStep[];
  status: 'en_proceso' | 'completado' | 'rechazado';
  startedDate: string;
}

export interface ApprovalStep {
  stepNumber: number;
  approver: string;
  role: string;
  status: ApprovalStatus;
  comments?: string;
  completedDate?: string;
  required: boolean;
}

export interface RiskAssessment {
  id: string;
  contractId: string;
  overallRisk: RiskLevel;
  riskScore: number;
  factors: RiskFactor[];
  recommendations: string[];
  assessedDate: string;
  assessedBy: string;
}

export interface RiskFactor {
  category: string;
  description: string;
  riskLevel: RiskLevel;
  impact: string;
}

export interface LegalPlaybook {
  id: string;
  title: string;
  category: string;
  description: string;
  guidance: string;
  risks: string[];
  bestPractices: string[];
  relatedClauses: string[];
}

// Datos simulados de contratos
export const mockContracts: Contract[] = [
  {
    id: '1',
    title: 'Contrato de Servicios Tecnológicos',
    client: 'Empresa ABC S.A.',
    status: 'cumplimiento',
    createdDate: '2024-01-15',
    lastModified: '2024-01-20',
    signedDate: '2024-01-25',
    archivedDate: '2024-01-26',
    expirationDate: '2025-01-25',
    description: 'Contrato para servicios de desarrollo de software',
    requestId: 'REQ-003',
    templateId: '2',
    currentVersion: 1,
    riskLevel: 'bajo',
    assignedTo: 'María González',
    signingParties: ['Empresa ABC S.A.', 'Nuestra Empresa'],
    contractType: 'Servicios Tecnológicos',
    responsibleArea: 'TI',
    value: 50000,
    currency: 'EUR',
    autoRenewal: true,
  },
  {
    id: '2',
    title: 'Contrato de Consultoría',
    client: 'XYZ Consultores',
    status: 'negociacion',
    createdDate: '2024-02-01',
    lastModified: '2024-02-05',
    description: 'Servicios de consultoría estratégica',
    requestId: 'REQ-002',
    templateId: '4',
    currentVersion: 3,
    riskLevel: 'medio',
    assignedTo: 'María González',
    contractType: 'Consultoría',
    responsibleArea: 'Dirección',
    value: 75000,
    currency: 'EUR',
  },
  {
    id: '3',
    title: 'Acuerdo de Confidencialidad',
    client: 'Tech Solutions Inc.',
    status: 'borrador',
    createdDate: '2024-02-10',
    lastModified: '2024-02-12',
    description: 'NDA para proyecto confidencial',
    requestId: 'REQ-002',
    templateId: '3',
    currentVersion: 1,
    riskLevel: 'bajo',
    assignedTo: 'Ana Martínez',
    contractType: 'NDA',
    responsibleArea: 'Legal',
  },
  {
    id: '4',
    title: 'Contrato de Mantenimiento',
    client: 'Global Systems',
    status: 'archivado',
    createdDate: '2024-01-20',
    lastModified: '2024-01-25',
    signedDate: '2024-01-30',
    archivedDate: '2024-01-31',
    expirationDate: '2025-01-30',
    renewalDate: '2024-12-30',
    description: 'Mantenimiento anual de sistemas',
    requestId: 'REQ-003',
    templateId: '1',
    currentVersion: 1,
    riskLevel: 'bajo',
    assignedTo: 'María González',
    signingParties: ['Global Systems', 'Nuestra Empresa'],
    contractType: 'Mantenimiento',
    responsibleArea: 'Operaciones',
    value: 25000,
    currency: 'EUR',
    autoRenewal: true,
  },
  {
    id: '5',
    title: 'Contrato de Licencia',
    client: 'Digital Partners',
    status: 'firma',
    createdDate: '2024-02-08',
    lastModified: '2024-02-14',
    description: 'Licencia de software empresarial',
    requestId: 'REQ-005',
    templateId: '5',
    currentVersion: 1,
    riskLevel: 'medio',
    assignedTo: 'Ana Martínez',
    contractType: 'Licencia',
    responsibleArea: 'TI',
    value: 30000,
    currency: 'EUR',
  },
  {
    id: '6',
    title: 'Contrato de Proveedor Cloud',
    client: 'CloudTech Services',
    status: 'renovacion',
    createdDate: '2023-03-15',
    lastModified: '2024-02-10',
    signedDate: '2023-04-01',
    archivedDate: '2023-04-02',
    expirationDate: '2024-04-01',
    renewalDate: '2024-03-01',
    description: 'Servicios de infraestructura cloud',
    templateId: '2',
    currentVersion: 2,
    riskLevel: 'medio',
    assignedTo: 'María González',
    signingParties: ['CloudTech Services', 'Nuestra Empresa'],
    contractType: 'Servicios Cloud',
    responsibleArea: 'TI',
    value: 120000,
    currency: 'EUR',
    autoRenewal: false,
  },
  {
    id: '7',
    title: 'Desarrollo de Aplicación Móvil',
    client: 'MobileDev Partners',
    status: 'cumplimiento',
    createdDate: '2023-11-10',
    lastModified: '2023-11-20',
    signedDate: '2023-11-25',
    archivedDate: '2023-11-26',
    expirationDate: '2024-11-25',
    description: 'Desarrollo de aplicación móvil iOS y Android',
    requestId: 'REQ-001',
    templateId: '2',
    currentVersion: 1,
    riskLevel: 'medio',
    assignedTo: 'Carlos Ruiz',
    signingParties: ['MobileDev Partners', 'Nuestra Empresa'],
    contractType: 'Servicios Tecnológicos',
    responsibleArea: 'TI',
    value: 68000,
    currency: 'EUR',
    autoRenewal: false,
  },
  {
    id: '8',
    title: 'Infraestructura Cloud AWS',
    client: 'Amazon Web Services',
    status: 'archivado',
    createdDate: '2023-08-01',
    lastModified: '2023-08-15',
    signedDate: '2023-08-20',
    archivedDate: '2023-08-21',
    expirationDate: '2025-08-20',
    renewalDate: '2025-07-20',
    description: 'Servicios de infraestructura en AWS',
    requestId: 'REQ-004',
    templateId: '2',
    currentVersion: 1,
    riskLevel: 'alto',
    assignedTo: 'María González',
    signingParties: ['Amazon Web Services', 'Nuestra Empresa'],
    contractType: 'Servicios Cloud',
    responsibleArea: 'TI',
    value: 95000,
    currency: 'EUR',
    autoRenewal: true,
  },
  {
    id: '9',
    title: 'Mantenimiento de Servidores',
    client: 'TechSupport Pro',
    status: 'cumplimiento',
    createdDate: '2024-02-01',
    lastModified: '2024-02-10',
    signedDate: '2024-02-15',
    archivedDate: '2024-02-16',
    expirationDate: '2025-02-15',
    description: 'Mantenimiento preventivo y correctivo de servidores',
    requestId: 'REQ-003',
    templateId: '1',
    currentVersion: 1,
    riskLevel: 'bajo',
    assignedTo: 'Ana Martínez',
    signingParties: ['TechSupport Pro', 'Nuestra Empresa'],
    contractType: 'Mantenimiento',
    responsibleArea: 'Operaciones',
    value: 32000,
    currency: 'EUR',
    autoRenewal: true,
  },
  {
    id: '10',
    title: 'Soporte Técnico 24/7',
    client: 'Support Global Inc.',
    status: 'archivado',
    createdDate: '2023-12-01',
    lastModified: '2023-12-15',
    signedDate: '2023-12-20',
    archivedDate: '2023-12-21',
    expirationDate: '2024-12-20',
    renewalDate: '2024-11-20',
    description: 'Soporte técnico continuo para sistemas críticos',
    requestId: 'REQ-002',
    templateId: '1',
    currentVersion: 1,
    riskLevel: 'medio',
    assignedTo: 'Carlos Ruiz',
    signingParties: ['Support Global Inc.', 'Nuestra Empresa'],
    contractType: 'Mantenimiento',
    responsibleArea: 'TI',
    value: 45000,
    currency: 'EUR',
    autoRenewal: true,
  },
  {
    id: '11',
    title: 'Mantenimiento Infraestructura Red',
    client: 'Network Solutions Ltd.',
    status: 'renovacion',
    createdDate: '2023-05-01',
    lastModified: '2024-02-20',
    signedDate: '2023-06-01',
    archivedDate: '2023-06-02',
    expirationDate: '2024-06-01',
    renewalDate: '2024-05-01',
    description: 'Mantenimiento de equipos de red y telecomunicaciones',
    requestId: 'REQ-013',
    templateId: '1',
    currentVersion: 2,
    riskLevel: 'medio',
    assignedTo: 'María González',
    signingParties: ['Network Solutions Ltd.', 'Nuestra Empresa'],
    contractType: 'Mantenimiento',
    responsibleArea: 'TI',
    value: 38000,
    currency: 'EUR',
    autoRenewal: true,
  },
  {
    id: '12',
    title: 'Consultoría Estratégica Digital',
    client: 'Innovation Advisors',
    status: 'negociacion',
    createdDate: '2024-02-20',
    lastModified: '2024-03-01',
    description: 'Consultoría para transformación digital',
    requestId: 'REQ-006',
    templateId: '4',
    currentVersion: 2,
    riskLevel: 'medio',
    assignedTo: 'María González',
    contractType: 'Consultoría',
    responsibleArea: 'Dirección',
    value: 95000,
    currency: 'EUR',
  },
  {
    id: '13',
    title: 'Consultoría de Procesos',
    client: 'Process Experts Ltd.',
    status: 'borrador',
    createdDate: '2024-03-05',
    lastModified: '2024-03-06',
    description: 'Optimización de procesos operativos',
    requestId: 'REQ-007',
    templateId: '4',
    currentVersion: 1,
    riskLevel: 'bajo',
    assignedTo: 'Ana Martínez',
    contractType: 'Consultoría',
    responsibleArea: 'Operaciones',
    value: 42000,
    currency: 'EUR',
  },
  {
    id: '14',
    title: 'Asesoría Legal Corporativa',
    client: 'Legal Partners LLC',
    status: 'cumplimiento',
    createdDate: '2023-10-01',
    lastModified: '2023-10-15',
    signedDate: '2023-10-20',
    archivedDate: '2023-10-21',
    expirationDate: '2024-10-20',
    renewalDate: '2024-09-20',
    description: 'Servicios de asesoría legal y compliance',
    requestId: 'REQ-014',
    templateId: '4',
    currentVersion: 1,
    riskLevel: 'alto',
    assignedTo: 'Carlos Ruiz',
    signingParties: ['Legal Partners LLC', 'Nuestra Empresa'],
    contractType: 'Consultoría',
    responsibleArea: 'Legal',
    value: 78000,
    currency: 'EUR',
    autoRenewal: true,
  },
  {
    id: '15',
    title: 'NDA Proyecto Innovación',
    client: 'Future Labs S.A.',
    status: 'firma',
    createdDate: '2024-03-08',
    lastModified: '2024-03-10',
    description: 'Acuerdo de confidencialidad para proyecto de I+D',
    requestId: 'REQ-008',
    templateId: '3',
    currentVersion: 1,
    riskLevel: 'bajo',
    assignedTo: 'Carlos Ruiz',
    contractType: 'NDA',
    responsibleArea: 'Legal',
  },
  {
    id: '16',
    title: 'NDA Alianza Estratégica',
    client: 'Strategic Partners Inc.',
    status: 'archivado',
    createdDate: '2024-01-10',
    lastModified: '2024-01-15',
    signedDate: '2024-01-20',
    archivedDate: '2024-01-21',
    expirationDate: '2026-01-20',
    description: 'NDA para exploración de alianza comercial',
    requestId: 'REQ-015',
    templateId: '3',
    currentVersion: 1,
    riskLevel: 'bajo',
    assignedTo: 'Ana Martínez',
    signingParties: ['Strategic Partners Inc.', 'Nuestra Empresa'],
    contractType: 'NDA',
    responsibleArea: 'Dirección',
  },
  {
    id: '17',
    title: 'Licencia de Software CRM',
    client: 'Salesforce Inc.',
    status: 'cumplimiento',
    createdDate: '2023-09-01',
    lastModified: '2023-09-15',
    signedDate: '2023-09-20',
    archivedDate: '2023-09-21',
    expirationDate: '2025-09-20',
    description: 'Licencia anual de Salesforce CRM',
    requestId: 'REQ-009',
    templateId: '5',
    currentVersion: 1,
    riskLevel: 'alto',
    assignedTo: 'María González',
    signingParties: ['Salesforce Inc.', 'Nuestra Empresa'],
    contractType: 'Licencia',
    responsibleArea: 'TI',
    value: 150000,
    currency: 'EUR',
    autoRenewal: true,
  },
  {
    id: '18',
    title: 'Licencia Microsoft 365',
    client: 'Microsoft Corporation',
    status: 'archivado',
    createdDate: '2024-01-05',
    lastModified: '2024-01-10',
    signedDate: '2024-01-15',
    archivedDate: '2024-01-16',
    expirationDate: '2025-01-15',
    renewalDate: '2024-12-15',
    description: 'Licencias corporativas Microsoft 365',
    requestId: 'REQ-010',
    templateId: '5',
    currentVersion: 1,
    riskLevel: 'bajo',
    assignedTo: 'Ana Martínez',
    signingParties: ['Microsoft Corporation', 'Nuestra Empresa'],
    contractType: 'Licencia',
    responsibleArea: 'TI',
    value: 28000,
    currency: 'EUR',
    autoRenewal: true,
  },
  {
    id: '19',
    title: 'Licencia Adobe Creative Cloud',
    client: 'Adobe Systems',
    status: 'renovacion',
    createdDate: '2023-07-01',
    lastModified: '2024-02-25',
    signedDate: '2023-07-15',
    archivedDate: '2023-07-16',
    expirationDate: '2024-07-15',
    renewalDate: '2024-06-15',
    description: 'Licencias de Adobe Creative Suite',
    requestId: 'REQ-016',
    templateId: '5',
    currentVersion: 2,
    riskLevel: 'bajo',
    assignedTo: 'Carlos Ruiz',
    signingParties: ['Adobe Systems', 'Nuestra Empresa'],
    contractType: 'Licencia',
    responsibleArea: 'Marketing',
    value: 18000,
    currency: 'EUR',
    autoRenewal: true,
  },
  {
    id: '20',
    title: 'Contrato de Arrendamiento Oficinas',
    client: 'Inmobiliaria Prime',
    status: 'cumplimiento',
    createdDate: '2023-06-01',
    lastModified: '2023-06-15',
    signedDate: '2023-07-01',
    archivedDate: '2023-07-02',
    expirationDate: '2026-07-01',
    description: 'Arrendamiento de oficinas corporativas',
    requestId: 'REQ-011',
    templateId: '1',
    currentVersion: 1,
    riskLevel: 'medio',
    assignedTo: 'Carlos Ruiz',
    signingParties: ['Inmobiliaria Prime', 'Nuestra Empresa'],
    contractType: 'Arrendamiento',
    responsibleArea: 'Administración',
    value: 180000,
    currency: 'EUR',
    autoRenewal: false,
  },
  {
    id: '21',
    title: 'Suministro Material de Oficina',
    client: 'Office Supplies Co.',
    status: 'vencido',
    createdDate: '2023-01-10',
    lastModified: '2023-01-20',
    signedDate: '2023-02-01',
    archivedDate: '2023-02-02',
    expirationDate: '2024-02-01',
    description: 'Suministro anual de material de oficina',
    requestId: 'REQ-012',
    templateId: '1',
    currentVersion: 1,
    riskLevel: 'bajo',
    assignedTo: 'Ana Martínez',
    signingParties: ['Office Supplies Co.', 'Nuestra Empresa'],
    contractType: 'Suministro',
    responsibleArea: 'Administración',
    value: 12000,
    currency: 'EUR',
    autoRenewal: false,
  },
  {
    id: '22',
    title: 'Suministro de Equipamiento',
    client: 'Tech Equipment Ltd.',
    status: 'negociacion',
    createdDate: '2024-03-01',
    lastModified: '2024-03-10',
    description: 'Suministro de equipos informáticos',
    requestId: 'REQ-017',
    templateId: '1',
    currentVersion: 1,
    riskLevel: 'medio',
    assignedTo: 'María González',
    contractType: 'Suministro',
    responsibleArea: 'TI',
    value: 85000,
    currency: 'EUR',
  },
];

// Datos simulados de cláusulas
export const mockClauses: Clause[] = [
  {
    id: '1',
    title: 'Confidencialidad',
    category: 'Seguridad',
    content: 'Las partes se comprometen a mantener la confidencialidad de toda la información intercambiada durante la vigencia del contrato y por un período de 5 años posteriores.',
    lastModified: '2024-01-10',
  },
  {
    id: '2',
    title: 'Propiedad Intelectual',
    category: 'Legal',
    content: 'Todos los derechos de propiedad intelectual sobre los productos desarrollados serán propiedad exclusiva del cliente una vez completado el pago.',
    lastModified: '2024-01-12',
  },
  {
    id: '3',
    title: 'Terminación',
    category: 'General',
    content: 'Cualquiera de las partes puede terminar este contrato con un aviso previo de 30 días por escrito.',
    lastModified: '2024-01-08',
  },
  {
    id: '4',
    title: 'Limitación de Responsabilidad',
    category: 'Legal',
    content: 'En ningún caso la responsabilidad total excederá el monto total pagado bajo este contrato en los últimos 12 meses.',
    lastModified: '2024-01-15',
  },
  {
    id: '5',
    title: 'Garantías',
    category: 'Calidad',
    content: 'El proveedor garantiza que los servicios se prestarán de acuerdo con los estándares de la industria y las mejores prácticas.',
    lastModified: '2024-01-20',
  },
  {
    id: '6',
    title: 'Condiciones de Pago',
    category: 'General',
    content: 'El pago se realizará según los términos y condiciones acordados en el cronograma establecido.',
    lastModified: '2024-01-18',
  },
  {
    id: '7',
    title: 'Resolución de Disputas',
    category: 'Legal',
    content: 'Cualquier disputa será resuelta mediante arbitraje de acuerdo con las reglas de la Cámara de Comercio local.',
    lastModified: '2024-01-22',
  },
  {
    id: '8',
    title: 'Fuerza Mayor',
    category: 'General',
    content: 'Ninguna parte será responsable por el incumplimiento debido a causas fuera de su control razonable.',
    lastModified: '2024-01-14',
  },
  {
    id: '9',
    title: 'Modificaciones',
    category: 'General',
    content: 'Este contrato solo puede ser modificado mediante un acuerdo escrito firmado por ambas partes.',
    lastModified: '2024-01-16',
  },
  {
    id: '10',
    title: 'Cesión',
    category: 'Legal',
    content: 'Ninguna parte puede ceder sus derechos u obligaciones bajo este contrato sin el consentimiento previo por escrito de la otra parte.',
    lastModified: '2024-01-19',
  },
];

// Datos simulados de plantillas
export const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Contrato de Servicios Estándar',
    description: 'Plantilla básica para contratos de servicios generales',
    clauses: ['1', '3', '5', '6', '9'],
    category: 'Servicios',
    isPublic: true,
    usageCount: 45,
    lastModified: '2024-01-15',
  },
  {
    id: '2',
    name: 'Contrato de Desarrollo de Software',
    description: 'Plantilla especializada para proyectos de desarrollo',
    clauses: ['1', '2', '4', '5', '6', '7', '9'],
    category: 'Tecnología',
    isPublic: true,
    usageCount: 32,
    lastModified: '2024-01-20',
  },
  {
    id: '3',
    name: 'Acuerdo de Confidencialidad',
    description: 'NDA estándar para proteger información confidencial',
    clauses: ['1', '8', '10'],
    category: 'Legal',
    isPublic: true,
    usageCount: 78,
    lastModified: '2024-01-10',
  },
  {
    id: '4',
    name: 'Contrato de Consultoría',
    description: 'Plantilla para servicios de consultoría estratégica',
    clauses: ['1', '3', '4', '6', '7'],
    category: 'Consultoría',
    isPublic: true,
    usageCount: 28,
    lastModified: '2024-02-01',
  },
  {
    id: '5',
    name: 'Contrato de Licencia de Software',
    description: 'Plantilla para licencias de software empresarial',
    clauses: ['1', '2', '4', '6', '9', '10'],
    category: 'Tecnología',
    isPublic: false,
    usageCount: 15,
    lastModified: '2024-01-25',
  },
];

// Datos simulados de solicitudes
export const mockRequests: ContractRequest[] = [
  {
    id: 'REQ-001',
    title: 'Nuevo contrato de servicios cloud',
    requester: 'Juan Pérez',
    department: 'TI',
    status: 'asignada',
    priority: 'alta',
    contractType: 'Servicios Tecnológicos',
    description: 'Contrato para servicios de infraestructura cloud con proveedor externo',
    createdDate: '2024-02-10',
    assignedTo: 'María González',
    assignedDate: '2024-02-11',
    businessJustification: 'Necesario para migración a cloud y cumplimiento de objetivos estratégicos',
  },
  {
    id: 'REQ-002',
    title: 'Acuerdo de confidencialidad con socio',
    requester: 'Carlos Rodríguez',
    department: 'Comercial',
    status: 'en_proceso',
    priority: 'urgente',
    contractType: 'NDA',
    description: 'NDA requerido para inicio de negociaciones con nuevo socio estratégico',
    createdDate: '2024-02-08',
    assignedTo: 'Ana Martínez',
    assignedDate: '2024-02-08',
    businessJustification: 'Bloqueante para iniciar negociaciones comerciales',
  },
  {
    id: 'REQ-003',
    title: 'Contrato de mantenimiento anual',
    requester: 'Laura Sánchez',
    department: 'Operaciones',
    status: 'completada',
    priority: 'media',
    contractType: 'Mantenimiento',
    description: 'Renovación de contrato de mantenimiento preventivo',
    createdDate: '2024-01-25',
    assignedTo: 'María González',
    assignedDate: '2024-01-26',
    completedDate: '2024-02-05',
    businessJustification: 'Renovación anual estándar de servicios críticos',
  },
  {
    id: 'REQ-004',
    title: 'Contrato de consultoría estratégica',
    requester: 'Roberto Fernández',
    department: 'Dirección',
    status: 'nueva',
    priority: 'alta',
    contractType: 'Consultoría',
    description: 'Servicios de consultoría para transformación digital',
    createdDate: '2024-02-14',
    businessJustification: 'Proyecto estratégico de transformación empresarial',
  },
  {
    id: 'REQ-005',
    title: 'Licencia de software CRM',
    requester: 'Sofía Morales',
    department: 'Ventas',
    status: 'en_revision',
    priority: 'media',
    contractType: 'Licencia',
    description: 'Licencia anual de software CRM para equipo de ventas',
    createdDate: '2024-02-12',
    businessJustification: 'Mejora de procesos de venta y seguimiento de clientes',
  },
];

// Datos simulados de versiones
export const mockVersions: ContractVersion[] = [
  {
    id: 'v1',
    contractId: '2',
    versionNumber: 1,
    content: 'Versión inicial del contrato de consultoría',
    createdBy: 'María González',
    createdDate: '2024-02-01',
    changes: 'Versión inicial',
    status: 'historial',
  },
  {
    id: 'v2',
    contractId: '2',
    versionNumber: 2,
    content: 'Versión con modificaciones en cláusulas de pago y plazo',
    createdBy: 'María González',
    createdDate: '2024-02-03',
    changes: 'Modificadas cláusulas de pago (plazo extendido a 60 días) y duración del contrato',
    status: 'historial',
  },
  {
    id: 'v3',
    contractId: '2',
    versionNumber: 3,
    content: 'Versión actual en negociación',
    createdBy: 'María González',
    createdDate: '2024-02-05',
    changes: 'Ajustes finales según feedback del cliente',
    status: 'activa',
  },
];

// Datos simulados de redlines
export const mockRedlines: Redline[] = [
  {
    id: 'r1',
    versionId: 'v2',
    clauseId: '6',
    originalText: 'El pago se realizará según los términos y condiciones acordados en el cronograma establecido',
    proposedText: 'El pago se realizará según los términos y condiciones acordados, con plazo extendido según cronograma revisado',
    comment: 'El cliente solicita ajustar el cronograma de pagos',
    suggestedBy: 'Cliente - XYZ Consultores',
    status: 'aceptado',
    createdDate: '2024-02-03',
  },
  {
    id: 'r2',
    versionId: 'v2',
    clauseId: '4',
    originalText: 'En ningún caso la responsabilidad total excederá los límites establecidos en este acuerdo',
    proposedText: 'En ningún caso la responsabilidad total excederá el 50% de los límites establecidos en este acuerdo',
    comment: 'Solicitamos reducir la exposición de responsabilidad',
    suggestedBy: 'Cliente - XYZ Consultores',
    status: 'pendiente',
    createdDate: '2024-02-04',
  },
];

// Datos simulados de flujos de aprobación
export const mockApprovalFlows: ApprovalFlow[] = [
  {
    id: 'af1',
    contractId: '2',
    currentStep: 2,
    steps: [
      {
        stepNumber: 1,
        approver: 'María González',
        role: 'Legal',
        status: 'aprobado',
        completedDate: '2024-02-06',
        required: true,
      },
      {
        stepNumber: 2,
        approver: 'Pedro Silva',
        role: 'Finanzas',
        status: 'pendiente',
        required: true,
      },
      {
        stepNumber: 3,
        approver: 'Elena Vega',
        role: 'Dirección',
        status: 'pendiente',
        required: true,
      },
    ],
    status: 'en_proceso',
    startedDate: '2024-02-05',
  },
];

// Datos simulados de evaluaciones de riesgo
export const mockRiskAssessments: RiskAssessment[] = [
  {
    id: 'ra1',
    contractId: '2',
    overallRisk: 'medio',
    riskScore: 65,
    factors: [
      {
        category: 'Operacional',
        description: 'Dependencia de proveedor único',
        riskLevel: 'alto',
        impact: 'Riesgo operacional si proveedor falla',
      },
      {
        category: 'Legal',
        description: 'Cláusulas de limitación de responsabilidad negociadas',
        riskLevel: 'medio',
        impact: 'Mayor exposición legal que estándar',
      },
      {
        category: 'Compliance',
        description: 'Contrato requiere revisión adicional por alcance',
        riskLevel: 'medio',
        impact: 'Mayor complejidad en cumplimiento normativo',
      },
    ],
    recommendations: [
      'Incluir cláusula de penalización por incumplimiento',
      'Establecer SLA claros con métricas medibles',
      'Considerar proveedor alternativo como respaldo',
    ],
    assessedDate: '2024-02-05',
    assessedBy: 'Sistema de IA',
  },
];

// Datos simulados de Playbook Jurídico
export const mockLegalPlaybook: LegalPlaybook[] = [
  {
    id: 'pb1',
    title: 'Guía de Confidencialidad',
    category: 'Seguridad',
    description: 'Mejores prácticas para cláusulas de confidencialidad',
    guidance: 'Las cláusulas de confidencialidad deben incluir: período de vigencia post-terminación (mínimo 3 años), definición clara de información confidencial, excepciones legales, y medidas de seguridad requeridas.',
    risks: [
      'Exposición de información sensible si la cláusula es débil',
      'Limitaciones legales para hacer cumplir confidencialidad indefinida',
      'Falta de definición clara puede llevar a disputas',
    ],
    bestPractices: [
      'Definir claramente qué constituye información confidencial',
      'Establecer período razonable post-terminación',
      'Incluir excepciones para información pública o previamente conocida',
      'Especificar medidas de seguridad documentadas',
    ],
    relatedClauses: ['1'],
  },
  {
    id: 'pb2',
    title: 'Gestión de Propiedad Intelectual',
    category: 'Legal',
    description: 'Cómo manejar derechos de propiedad intelectual en contratos',
    guidance: 'Para contratos de desarrollo, determinar quién posee el IP: cliente (work for hire), proveedor (licencia), o compartido. Considerar casos de uso futuro y explotación comercial.',
    risks: [
      'Pérdida de derechos sobre desarrollos realizados',
      'Limitaciones futuras en uso de soluciones desarrolladas',
      'Disputas sobre propiedad de mejoras incrementales',
    ],
    bestPractices: [
      'Establecer claramente la propiedad desde el inicio',
      'Considerar licencias de uso futuro si el IP queda con el proveedor',
      'Incluir cláusulas sobre mejoras y derivados',
      'Documentar entregables y su propiedad',
    ],
    relatedClauses: ['2'],
  },
  {
    id: 'pb3',
    title: 'Limitación de Responsabilidad',
    category: 'Legal',
    description: 'Estrategias para limitar exposición legal',
    guidance: 'La limitación de responsabilidad debe ser proporcional al alcance y naturaleza del contrato. Evitar límites absolutos que puedan ser inválidos. Considerar exclusiones específicas y límites razonables.',
    risks: [
      'Responsabilidad ilimitada en caso de negligencia grave',
      'Límites demasiado bajos pueden ser rechazados por contraparte',
      'Exposición en caso de daños indirectos o consecuentes',
    ],
    bestPractices: [
      'Establecer límite proporcional al alcance del contrato',
      'Excluir específicamente daños indirectos cuando sea posible',
      'Mantener responsabilidad ilimitada para negligencia grave o incumplimiento intencional',
      'Revisar regulaciones locales sobre limitación de responsabilidad',
    ],
    relatedClauses: ['4'],
  },
];

