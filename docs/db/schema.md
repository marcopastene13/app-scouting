# Modelo de Datos - ScoutChile MVP

## Entidades principales

### users
Tabla base de autenticacion para todos los roles.

```sql
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(50) NOT NULL CHECK (role IN ('club', 'player', 'agent', 'scout', 'admin')),
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### clubs
```sql
CREATE TABLE clubs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  category    VARCHAR(50) NOT NULL CHECK (category IN ('primera_a', 'primera_b', 'segunda', 'tercera')),
  city        VARCHAR(100),
  region      VARCHAR(100),
  logo_url    TEXT,
  website     TEXT,
  contact_name   VARCHAR(255),
  contact_email  VARCHAR(255),
  contact_phone  VARCHAR(50),
  is_verified BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### players
```sql
CREATE TABLE players (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  birthdate     DATE,
  nationality   VARCHAR(100) DEFAULT 'Chilena',
  rut           VARCHAR(20),
  height_cm     INTEGER,
  weight_kg     INTEGER,
  dominant_foot VARCHAR(10) CHECK (dominant_foot IN ('derecho', 'izquierdo', 'ambidiestro')),
  photo_url     TEXT,
  bio           TEXT,
  is_available  BOOLEAN DEFAULT true,
  is_public     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### positions
```sql
CREATE TABLE positions (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name  VARCHAR(100) NOT NULL,
  code  VARCHAR(20) UNIQUE NOT NULL
);
-- Ej: Portero (GK), Lateral Derecho (RB), Central (CB), etc.
```

### player_positions
```sql
CREATE TABLE player_positions (
  player_id   UUID REFERENCES players(id) ON DELETE CASCADE,
  position_id UUID REFERENCES positions(id) ON DELETE CASCADE,
  is_primary  BOOLEAN DEFAULT false,
  PRIMARY KEY (player_id, position_id)
);
```

### player_history
Historial de clubes del jugador.
```sql
CREATE TABLE player_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id   UUID REFERENCES players(id) ON DELETE CASCADE,
  club_name   VARCHAR(255) NOT NULL,
  category    VARCHAR(100),
  season      VARCHAR(20),
  matches     INTEGER DEFAULT 0,
  goals       INTEGER DEFAULT 0,
  assists     INTEGER DEFAULT 0,
  minutes     INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### videos
```sql
CREATE TABLE videos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id   UUID REFERENCES players(id) ON DELETE CASCADE,
  title       VARCHAR(255),
  url         TEXT NOT NULL,
  type        VARCHAR(50) CHECK (type IN ('highlights', 'partido_completo', 'clip', 'entrenamiento')),
  is_primary  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### needs
Vacantes publicadas por clubes.
```sql
CREATE TABLE needs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id      UUID REFERENCES clubs(id) ON DELETE CASCADE,
  position_id  UUID REFERENCES positions(id),
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  min_age      INTEGER,
  max_age      INTEGER,
  dominant_foot VARCHAR(10),
  status       VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'paused')),
  deadline     DATE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### applications
Postulaciones de jugadores a vacantes.
```sql
CREATE TABLE applications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id     UUID REFERENCES needs(id) ON DELETE CASCADE,
  player_id   UUID REFERENCES players(id) ON DELETE CASCADE,
  message     TEXT,
  status      VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (need_id, player_id)
);
```

### reports
Reportes de scouting sobre un jugador.
```sql
CREATE TABLE reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  scout_user_id   UUID REFERENCES users(id),
  club_id         UUID REFERENCES clubs(id),
  need_id         UUID REFERENCES needs(id),
  match_date      DATE,
  match_opponent  VARCHAR(255),
  -- Evaluacion tecnica (1-10)
  score_technical   SMALLINT CHECK (score_technical BETWEEN 1 AND 10),
  score_tactical    SMALLINT CHECK (score_tactical BETWEEN 1 AND 10),
  score_physical    SMALLINT CHECK (score_physical BETWEEN 1 AND 10),
  score_mental      SMALLINT CHECK (score_mental BETWEEN 1 AND 10),
  score_potential   SMALLINT CHECK (score_potential BETWEEN 1 AND 10),
  -- Notas
  notes_technical TEXT,
  notes_tactical  TEXT,
  notes_physical  TEXT,
  notes_mental    TEXT,
  summary         TEXT,
  recommendation  VARCHAR(20) CHECK (recommendation IN ('fichar', 'seguir', 'descartar')),
  is_private      BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### shortlists
```sql
CREATE TABLE shortlists (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id   UUID REFERENCES clubs(id) ON DELETE CASCADE,
  need_id   UUID REFERENCES needs(id),
  name      VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### shortlist_players
```sql
CREATE TABLE shortlist_players (
  shortlist_id UUID REFERENCES shortlists(id) ON DELETE CASCADE,
  player_id    UUID REFERENCES players(id) ON DELETE CASCADE,
  notes        TEXT,
  added_at     TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (shortlist_id, player_id)
);
```

---

## Entidades preparadas para Fase 2

### agents *(Fase 2)*
```sql
CREATE TABLE agents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id),
  name         VARCHAR(255),
  license_fifa VARCHAR(100),
  verified     BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### agent_players *(Fase 2)*
```sql
CREATE TABLE agent_players (
  agent_id  UUID REFERENCES agents(id),
  player_id UUID REFERENCES players(id),
  since     DATE,
  PRIMARY KEY (agent_id, player_id)
);
```

### scouts *(Fase 2)*
```sql
CREATE TABLE scouts (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID REFERENCES users(id),
  club_id   UUID REFERENCES clubs(id),
  agent_id  UUID REFERENCES agents(id),
  type      VARCHAR(20) CHECK (type IN ('interno', 'externo')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Indices recomendados

```sql
CREATE INDEX idx_players_is_public ON players(is_public);
CREATE INDEX idx_players_is_available ON players(is_available);
CREATE INDEX idx_needs_status ON needs(status);
CREATE INDEX idx_needs_club_id ON needs(club_id);
CREATE INDEX idx_applications_need_id ON applications(need_id);
CREATE INDEX idx_reports_player_id ON reports(player_id);
CREATE INDEX idx_reports_club_id ON reports(club_id);
```
