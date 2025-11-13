# Plataforma CLM - Contract Lifecycle Management

Aplicación web desarrollada en Next.js que implementa una plataforma completa de gestión del ciclo de vida de contratos (CLM), desde la solicitud hasta el archivado y renovación.

## Estructura de la Plataforma

La plataforma está organizada en **3 pantallas principales**:

### 📋 Pantalla 1: Repositorio (Contratos, Cláusulas, Market)
Gestión del repositorio central de recursos contractuales.

#### Contratos
- ✅ **Repositorio de Contratos**: Vista completa de todos los contratos
- ✅ **Búsqueda Avanzada**: Filtrado por título, cliente, y otros criterios
- ✅ **Vista Detallada**: Información completa de cada contrato

#### Cláusulas
- ✅ **Biblioteca de Cláusulas**: Repositorio de cláusulas jurídicas estandarizadas
  - 10+ cláusulas de ejemplo categorizadas
  - Filtros por categoría (Seguridad, Legal, General, Calidad)
  - Visualización expandible de contenido
  - Indicadores de uso y recomendaciones

#### Market (Supermarket)
- ✅ **Template Supermarket**: Plantillas de libre acceso para la organización
  - Plantillas públicas y privadas
  - Contador de usos
  - Vista detallada de cláusulas incluidas
  - Filtros por categoría

### 🎫 Pantalla 2: Solicitudes/Ticketing
Sistema completo de gestión de solicitudes contractuales.

#### Dashboard de Solicitudes
- ✅ **Panel de Control**: Indicadores clave de rendimiento
  - Total de solicitudes
  - Nuevas solicitudes
  - Solicitudes en proceso
  - Solicitudes completadas
- ✅ **Filtros Avanzados**: Por estado y prioridad
- ✅ **Vista Detallada**: Información completa de cada solicitud

#### Vista de Solicitudes
- ✅ **Portal de Solicitudes**: Lista detallada con estados y prioridades
  - Estados: Nueva, En Revisión, Asignada, En Proceso, Completada, Rechazada
  - Prioridades: Baja, Media, Alta, Urgente
  - Información de solicitante, departamento y justificación

#### Formulario de Nueva Solicitud
- ✅ **Creación de Solicitudes**: Formulario completo para nueva solicitud
  - Selección de tipo de contrato
  - Datos del cliente
  - Justificación de negocio
  - Priorización

### 🔄 Pantalla 3: Gestor CLM (Contract Lifecycle Management)
**La pantalla más importante**: Gestión completa del ciclo de vida contractual.

#### Panel de Control con Indicadores
- ✅ **KPIs Principales**:
  - Total de contratos
  - Contratos activos
  - Contratos próximos a vencer (<90 días)
  - Contratos en renovación
  - Valor total de la cartera

#### Timeline del Ciclo de Vida
- ✅ **Fases del Contrato**:
  1. **Borrador**: Creación inicial del contrato
  2. **Negociación**: Revisión y ajustes con contrapartes
  3. **Firma**: Proceso de firma del contrato
  4. **Archivado**: Almacenamiento en repositorio central
  5. **Cumplimiento**: Ejecución y seguimiento del contrato
  6. **Renovación**: Proceso de renovación o extensión
  7. **Vencido**: Contratos finalizados

#### Archivado y Metadata
- ✅ **Información de Archivado**:
  - Fecha de firma
  - Fecha de archivado
  - Fecha de vencimiento
  - Fecha de renovación
  - Partes firmantes
  - Tipo de contrato
  - Área responsable
  - Valor del contrato
  - Renovación automática

#### Vistas y Filtros
- ✅ **Vista Timeline**: Visualización del progreso por fases
- ✅ **Vista Tabla**: Tabla detallada con toda la información
- ✅ **Filtros por Fase**: Filtra contratos por estado del ciclo de vida
- ✅ **Alertas de Vencimiento**: Destacado de contratos próximos a vencer

### 🔧 Funcionalidades Adicionales

#### Negociación y Aprobaciones
- ✅ **Control de Versiones y Redlines**:
  - Historial completo de versiones
  - Sistema de redlines (propuestas de cambio)
  - Comparación de versiones
  - Aceptación/rechazo de cambios

- ✅ **Flujos de Aprobación**:
  - Pasos secuenciales con roles definidos
  - Estados: Pendiente, Aprobado, Rechazado, Devuelto
  - Comentarios y fecha de completación

- ✅ **Evaluación de Riesgo Contractual**:
  - Puntuación de riesgo (0-100)
  - Factores de riesgo por categoría
  - Recomendaciones automáticas
  - Niveles: Bajo, Medio, Alto, Crítico

## Diseño

- Colores corporativos: azul oscuro (#1F4788) y naranja (#FF6B35)
- Layout limpio y profesional
- Iconos intuitivos para cada estado y funcionalidad
- Diseño completamente responsive
- Modales para vistas detalladas
- Sistema de badges y estados visuales

## Datos Simulados

- 6 contratos de ejemplo con información completa del ciclo de vida
  - Contratos en diferentes fases: borrador, negociación, firma, archivado, cumplimiento, renovación
  - Metadata completa: fechas, partes firmantes, valores, áreas responsables
- 5 solicitudes de ejemplo con diferentes estados y prioridades
- 10 cláusulas de ejemplo categorizadas
- 5 plantillas de ejemplo (públicas y privadas)
- 3 versiones de ejemplo con historial
- 2 redlines de ejemplo
- 1 flujo de aprobación completo
- 1 evaluación de riesgo detallada
- 3 guías del Playbook Jurídico

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Build para Producción

```bash
npm run build
npm start
```

## Tecnologías

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (iconos)

