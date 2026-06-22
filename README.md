# ScoutChile ⚽

> Plataforma de scouting y gestión de rendimiento para clubes de fútbol de menor presupuesto en Chile.

[![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)](#)
[![Licencia](https://img.shields.io/badge/licencia-MIT-blue)](#)
[![Stack](https://img.shields.io/badge/stack-React%20%7C%20Node.js%20%7C%20PostgreSQL-informational)](#)

---

## Visión del producto

ScoutChile centraliza en un solo lugar la información de jugadores, reportes de scouting, shortlists y postulaciones, para que clubes de Primera B y media tabla de Primera División puedan fichar mejor con menos recursos.

El problema que resuelve:
- Los clubes pequeños en Chile no tienen departamento de datos ni presupuesto para herramientas enterprise.
- El scouting se hace por WhatsApp, planillas Excel y llamadas telefónicas.
- Los jugadores sin representante no tienen visibilidad formal ante los clubes.
- Los agentes pequeños no tienen una plataforma para gestionar su cartera.

---

## Segmento objetivo (MVP)

- Clubes de **Primera B** (toda la categoría)
- Clubes de **media tabla hacia abajo** de Primera División
- Jugadores sin agente o con agentes pequeños
- Scouts/analistas internos de 1-2 personas

---

## Roles de la plataforma

| Rol | Descripción |
|---|---|
| **Club** | Director deportivo / DT / analista interno |
| **Jugador** | Crea perfil, sube videos, postula a necesidades |
| **Admin** | Valida clubes, modera contenido, ve métricas |
| **Agente** *(fase 2)* | Gestiona cartera de jugadores, envía perfiles |
| **Scout externo** *(fase 2)* | Cubre partidos y genera reportes para clubes |

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Base de datos | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | JWT + bcrypt |
| Storage (fase 2) | AWS S3 / Cloudflare R2 |
| Deploy Frontend | Vercel |
| Deploy Backend | Railway |
| Monorepo | Turborepo |

---

## Estructura del repositorio

```
app-scouting/
├─ apps/
│  ├─ web/          # Frontend React + TypeScript
│  └─ api/          # Backend Node.js + Express
├─ packages/
│  ├─ types/        # Tipos e interfaces compartidas
│  ├─ ui/           # Componentes UI compartidos
│  └─ config/       # ESLint, TypeScript, Prettier
├─ docs/
│  ├─ product/      # Especificaciones y decisiones de producto
│  ├─ api/          # Documentación de endpoints
│  └─ db/           # Modelo de datos y migraciones
├─ .github/
│  └─ workflows/    # CI/CD GitHub Actions
├─ turbo.json
├─ package.json
└─ README.md
```

---

## Módulos del MVP

### 1. Jugadores
- Registro y perfil futbolístico completo
- Posición, pie hábil, historial de clubes, foto
- Enlace a videos (YouTube / Vimeo / Drive)
- Estadísticas básicas por temporada
- Visibilidad pública o privada

### 2. Clubes
- Perfil de club con categoría, ciudad y contacto
- Publicación de necesidades/vacantes por posición
- Búsqueda de jugadores con filtros avanzados
- Shortlists por vacante o necesidad

### 3. Scouting y Reportes
- Formulario de reporte: técnico, táctico, físico, mental
- Recomendación final: fichar / seguir / descartar
- Historial de reportes por jugador
- Asignación de reportes a una vacante concreta

### 4. Matching jugador ↔ club
- Jugador ve vacantes y postula con su perfil
- Club ve postulados + candidatos sugeridos por filtros

### 5. Backoffice Admin
- Panel de métricas globales
- Activación/desactivación de clubes
- Moderación de contenido

---

## Modelo de datos (entidades principales)

```
users → players / clubs / agents / scouts
needs (vacantes publicadas por clubs)
applications (postulaciones player → need)
reports (scouting reports)
shortlists + shortlist_players
videos (links asociados a jugadores)
```

---

## Roadmap

### Fase 1 — MVP (actual)
- [ ] Auth: registro y login de Club y Jugador
- [ ] Perfil de jugador con videos y estadísticas
- [ ] Perfil de club con vacantes
- [ ] Reportes de scouting
- [ ] Shortlists y búsqueda con filtros
- [ ] Backoffice Admin básico

### Fase 2 — Agentes y Scouts externos
- [ ] Rol agente con cartera de jugadores
- [ ] Rol scout externo con asignación de partidos
- [ ] Trials digitales (clubes abren convocatorias)
- [ ] Carga de video propio (S3)

### Fase 3 — IA y datos avanzados
- [ ] Ranking de jugadores por posición y métricas
- [ ] Sugerencias automáticas de jugadores similares
- [ ] Resúmenes automáticos de reportes (NLP)
- [ ] Integración con datos externos (Futbolytics)

---

## Flujo de ramas

```
main          → producción estable
dev           → integración general
feature/*     → funcionalidades individuales
fix/*         → correcciones
```

---

## Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/marcopastene13/app-scouting.git
cd app-scouting

# Instalar dependencias (raíz del monorepo)
npm install

# Configurar variables de entorno
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Levantar en desarrollo
npm run dev
```

---

## Contribuir

1. Crea una rama desde `dev`: `git checkout -b feature/nombre`
2. Haz tus cambios y commits descriptivos
3. Abre un Pull Request hacia `dev`
4. Espera revisión antes de hacer merge a `main`

---

## Licencia

MIT © 2026 Marco Pastene
