# Especificacion del MVP - ScoutChile

## Objetivo

Desarrollar una plataforma web que permita a clubes de menor presupuesto de Chile (Primera B y media tabla de Primera Division) centralizar su proceso de scouting y gestion de talento futbolistico.

---

## Alcance del MVP (Fase 1)

### Lo que SÍ incluye el MVP

- Registro y autenticacion de usuarios (Club / Jugador / Admin)
- Perfil completo de jugador con videos y estadisticas
- Perfil de club con vacantes publicadas
- Busqueda de jugadores con filtros basicos
- Sistema de postulaciones (jugador aplica a vacante)
- Reportes de scouting internos del club
- Shortlists por vacante
- Backoffice Admin basico

### Lo que NO incluye el MVP (se deja para Fase 2+)

- Agentes y scouts externos
- Carga de video propio (solo links externos)
- Trials digitales
- Notificaciones email/push
- Pagos o subscripciones
- IA y datos avanzados

---

## Roles y permisos

### Club
- Registro con nombre, categoria, ciudad y contacto
- Crear vacantes (necesidades de fichaje)
- Buscar jugadores por filtros
- Ver perfil de jugadores publicos
- Crear reportes de scouting
- Gestionar shortlists
- Ver postulaciones a sus vacantes

### Jugador
- Registro con datos personales y futbolisticos
- Completar perfil con posiciones, historial, videos
- Configurar visibilidad (publico/privado)
- Ver vacantes de clubes
- Postular a vacantes con su perfil
- Ver estado de sus postulaciones

### Admin
- Ver metricas globales del sistema
- Activar/inactivar cuentas de clubes
- Moderar contenido reportado

---

## Flujos principales

### Flujo 1: Club busca jugador
```
Club inicia sesion
→ Va a Busqueda de jugadores
→ Filtra por posicion, edad, pie, disponibilidad
→ Ve lista de jugadores que coinciden
→ Abre perfil de jugador
→ Revisa videos, historial y estadisticas
→ Agrega a shortlist o crea reporte
```

### Flujo 2: Jugador postula a vacante
```
Jugador inicia sesion
→ Va a Vacantes abiertas
→ Filtra por posicion y categoria
→ Abre detalle de vacante
→ Hace clic en Postular
→ Agrega mensaje opcional
→ Envia postulacion con su perfil
```

### Flujo 3: Club recibe y evalua candidatos
```
Club va a su vacante
→ Ve lista de postulados
→ Abre perfil de cada candidato
→ Crea reporte de scouting
→ Cambia estado de postulacion (revisado / aceptado / rechazado)
→ Agrega a shortlist si interesa
```

---

## Pantallas del MVP

### Publicas
- Landing page con propuesta de valor
- Registro (seleccion de rol: club/jugador)
- Login

### Club
- Dashboard: resumen de vacantes, postulaciones y reportes recientes
- Mis vacantes: lista y creacion
- Busqueda de jugadores: filtros + resultados
- Perfil de jugador (vista lectura)
- Crear reporte de scouting
- Shortlists: crear y gestionar listas
- Perfil del club: editar datos

### Jugador
- Dashboard: estado de postulaciones y visitas al perfil
- Mi perfil: editar datos, posiciones, videos, historial
- Vacantes abiertas: buscar y postular
- Mis postulaciones: estado de cada una

### Admin
- Dashboard: metricas globales
- Gestion de clubes: activar/desactivar

---

## Endpoints API principales

### Auth
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- GET  /auth/me

### Jugadores
- GET  /players          (busqueda con filtros)
- GET  /players/:id
- POST /players          (crear perfil)
- PUT  /players/:id
- POST /players/:id/videos

### Clubes
- GET  /clubs/:id
- POST /clubs
- PUT  /clubs/:id

### Vacantes
- GET  /needs            (listado publico con filtros)
- GET  /needs/:id
- POST /needs            (crear, solo clubs)
- PUT  /needs/:id
- DELETE /needs/:id

### Postulaciones
- POST /needs/:id/applications
- GET  /needs/:id/applications   (solo el club dueno)
- PUT  /applications/:id         (cambiar estado)

### Reportes
- POST /reports
- GET  /reports/player/:playerId
- GET  /reports/:id

### Shortlists
- POST /shortlists
- GET  /shortlists      (del club autenticado)
- POST /shortlists/:id/players
- DELETE /shortlists/:id/players/:playerId

---

## Decisiones tecnicas

| Decision | Opcion elegida | Razon |
|---|---|---|
| Monorepo | Turborepo | Comparte tipos y configs entre api y web |
| ORM | Prisma | Migraciones simples, tipado fuerte |
| Auth | JWT (access + refresh) | Sin sesiones, compatible con mobile futuro |
| Video | Links externos (YouTube/Vimeo) | Sin costo de storage en MVP |
| Deploy frontend | Vercel | CI/CD automatico, gratuito |
| Deploy backend | Railway | Simple, soporte a Node.js |
| Base de datos | Neon (PostgreSQL serverless) | Gratis en tier inicial |

---

## Criterios de exito del MVP

- Al menos 5 clubes de Primera B o Primera A registrados y activos
- Al menos 30 jugadores con perfil completo (foto + video + historial)
- Al menos 10 reportes de scouting generados
- Al menos 20 postulaciones realizadas
- Tiempo de carga de pagina < 3 segundos
- Sin errores criticos en produccion en los primeros 30 dias
