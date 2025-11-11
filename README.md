# Gestor de Contratos - Microsoft 365

Aplicación web desarrollada en Next.js que demuestra un Gestor de Contratos integrado con Microsoft 365, implementando un sistema completo de gestión del ciclo de vida de contratos.

## Funcionalidades Implementadas

### 1. Solicitud y Captura de Necesidades (Ticketing jurídico)
- ✅ **Portal de Solicitudes**: Centraliza y estandariza la creación de nuevas solicitudes contractuales
- ✅ **Gestión de Demandas Internas**: Control del flujo y estado de solicitudes de áreas de negocio
  - Estados: Nueva, En Revisión, Asignada, En Proceso, Completada, Rechazada
  - Prioridades: Baja, Media, Alta, Urgente
  - Información de solicitante, departamento y justificación de negocio

### 2. Creación y Redacción (Biblioteca)
- ✅ **Biblioteca de Plantillas y Cláusulas**: Repositorio conectado de plantillas y cláusulas jurídicas
  - 10 cláusulas de ejemplo categorizadas
  - Filtros por categoría
  - Visualización expandible de contenido
- ✅ **Automatización de Documentos**: Generación automática de contratos con datos del sistema
  - Selección de plantillas
  - Incorporación automática de cláusulas
  - Vista previa antes de guardar
- ✅ **Playbook Jurídico**: Guía sobre cláusulas aceptables y riesgos
  - Mejores prácticas por categoría
  - Identificación de riesgos
  - Cláusulas relacionadas

### 3. Front con Plantillas de Libre Acceso
- ✅ **Supermarket**: Repositorio de plantillas accesible para toda la organización
  - Plantillas públicas y privadas
  - Contador de usos
  - Vista detallada de cláusulas incluidas
  - Filtros por categoría

### 4. Negociación y Aprobaciones (Gestor de tareas)
- ✅ **Control de Versiones y Redlines**: Gestión de revisiones y cambios en negociación
  - Historial completo de versiones
  - Sistema de redlines (propuestas de cambio)
  - Comparación de versiones
  - Aceptación/rechazo de cambios
- ✅ **Flujos de Aprobación**: Asegura revisiones y aprobaciones según política
  - Pasos secuenciales con roles definidos
  - Estados: Pendiente, Aprobado, Rechazado, Devuelto
  - Comentarios y fecha de completación
  - Indicador de paso actual
- ✅ **Evaluación de Riesgo Contractual**: Mide exposición legal antes de aprobar
  - Puntuación de riesgo (0-100)
  - Factores de riesgo por categoría
  - Recomendaciones automáticas
  - Niveles: Bajo, Medio, Alto, Crítico

### Funcionalidades Adicionales
- ✅ Panel principal con lista de contratos completa
- ✅ Búsqueda avanzada de contratos
- ✅ Vista detallada de contratos con todas las funcionalidades integradas
- ✅ Estados de contrato: Borrador, En Negociación, En Aprobación, Aprobado, Rechazado
- ✅ Indicadores visuales de riesgo en las tarjetas de contratos

## Diseño

- Colores corporativos: azul oscuro (#1F4788) y naranja (#FF6B35)
- Layout limpio y profesional
- Iconos intuitivos para cada estado y funcionalidad
- Diseño completamente responsive
- Modales para vistas detalladas
- Sistema de badges y estados visuales

## Datos Simulados

- 5 contratos de ejemplo con información completa
- 5 solicitudes de ejemplo con diferentes estados
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

