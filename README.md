# 🚀 DevFolio — Full-Stack Portfolio

> Personal portfolio + admin panel | Built for the job market, not tutorials.

---

## 🧱 Tech Stack

### Backend
| Layer         | Technology         | Version  | Why                                              |
|---------------|--------------------|----------|--------------------------------------------------|
| Framework     | Laravel            | 11.x     | REST API, ORM, Auth, OOP Controllers             |
| Auth          | Laravel Sanctum    | built-in | SPA token-based auth — no session bloat         |
| Database      | PostgreSQL         | 16       | Production-grade, JSON support, better than MySQL|
| Image Storage | Cloudinary         | SDK v2   | CDN + transforms — DB stores URL only            |
| Runtime       | PHP                | 8.3      | Required by Laravel 11                           |
| Server        | Nginx              | latest   | Reverse proxy in Docker                          |

### Frontend
| Layer         | Technology         | Version  | Why                                              |
|---------------|--------------------|----------|--------------------------------------------------|
| Framework     | Next.js            | 15.x     | SSR + SSG + App Router — SEO critical            |
| Language      | TypeScript         | 5.x      | Type safety — no runtime surprises               |
| Styling       | Tailwind CSS       | 4.x      | Utility-first — no custom CSS needed             |
| Components    | shadcn/ui          | latest   | Copy-owned components, Tailwind-native           |
| Animation     | GSAP               | 3.x      | Industry-standard — ScrollTrigger + timelines    |
| HTTP Client   | Axios              | latest   | Interceptors for auth headers                    |

### Infrastructure
| Layer         | Technology         | Why                                              |
|---------------|--------------------|--------------------------------------------------|
| Containers    | Docker + Compose   | Dev/prod parity — no "works on my machine"       |
| Environment   | WSL2 (Ubuntu)      | Linux commands on Windows                        |
| Reverse Proxy | Nginx              | Routes traffic to Laravel + Next.js              |

---

## 🗂️ Project Structure (planned)

```
devfolio/
├── backend/                  # Laravel 11
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/
│   │   │   │       ├── AuthController.php
│   │   │   │       └── ProjectController.php
│   │   │   ├── Middleware/
│   │   │   │   └── AdminOnly.php
│   │   │   └── Requests/
│   │   │       ├── StoreProjectRequest.php
│   │   │       └── UpdateProjectRequest.php
│   │   ├── Models/
│   │   │   └── Project.php
│   │   └── Services/
│   │       └── CloudinaryService.php
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   │   └── api.php
│   └── .env
│
├── frontend/                 # Next.js 15
│   ├── app/
│   │   ├── (public)/         # Portfolio pages
│   │   │   ├── page.tsx      # Home
│   │   │   └── projects/
│   │   │       └── page.tsx
│   │   └── (admin)/          # Protected admin panel
│   │       └── dashboard/
│   │           └── page.tsx
│   ├── components/
│   │   ├── ui/               # shadcn components
│   │   └── animations/       # GSAP wrappers
│   ├── lib/
│   │   ├── api.ts            # Axios instance
│   │   └── auth.ts           # Token management
│   └── .env.local
│
├── docker/
│   ├── nginx/
│   │   └── default.conf
│   └── php/
│       └── Dockerfile
│
└── docker-compose.yml

```

---

## 🗄️ Database Schema

### `projects` table
| Column        | Type           | Notes                              |
|---------------|----------------|------------------------------------|
| id            | bigint PK      | Auto increment                     |
| title         | varchar(255)   | Project name                       |
| description   | text           | Full description                   |
| category      | varchar(100)   | frontend / backend / fullstack     |
| tech_stack    | jsonb          | ["React", "Laravel", ...]          |
| image_url     | varchar(500)   | Cloudinary URL                     |
| github_url    | varchar(500)   | nullable                           |
| deploy_url    | varchar(500)   | nullable                           |
| is_featured   | boolean        | Show on homepage hero              |
| created_at    | timestamp      |                                    |
| updated_at    | timestamp      |                                    |

---

## 🔌 API Endpoints

### Public (no auth)
```
GET    /api/projects              → All projects (supports filters)
GET    /api/projects?category=frontend&sort=latest&featured=true
GET    /api/projects/{id}         → Single project
```

### Protected (Admin — Sanctum token required)
```
POST   /api/admin/projects        → Create project
PUT    /api/admin/projects/{id}   → Update project
DELETE /api/admin/projects/{id}   → Delete project
POST   /api/auth/login            → Get token
POST   /api/auth/logout           → Revoke token
```

---

## 🔐 Security Checklist
- [ ] Sanctum token auth (Bearer)
- [ ] API Rate Limiting (60 req/min public, 30 req/min auth)
- [ ] CORS restricted to frontend domain only
- [ ] All inputs validated via FormRequest classes
- [ ] Cloudinary signed uploads only
- [ ] `.env` never committed (in .gitignore)
- [ ] SQL injection: blocked by Eloquent ORM
- [ ] Admin route protected by middleware

---

## 🌐 Query String Filters — How It Works

The public projects endpoint supports filtering via URL parameters:

```
GET /api/projects?category=fullstack&sort=latest&featured=true
```

| Parameter  | Values                        | Default  |
|------------|-------------------------------|----------|
| category   | frontend, backend, fullstack  | all      |
| sort       | latest, oldest                | latest   |
| featured   | true, false                   | all      |

Laravel processes these via `$request->query()` inside the controller.
No separate endpoints needed — one endpoint, flexible behavior.

---

## 🐳 Docker Services

```yaml
services:
  app:      PHP 8.3 + Laravel    → :8000
  db:       PostgreSQL 16        → :5432
  nginx:    Reverse proxy        → :80
  frontend: Next.js 15           → :3000
```

---

## 📦 Dev Phases

| Phase | Scope                                      | Status  |
|-------|--------------------------------------------|---------|
| 0     | Planning + README                          | ✅ Done |
| 1     | Docker + Laravel init + DB migration       | ✅ Done |
| 2     | CRUD API + Filter + Cloudinary             | ⏳ Next |
| 3     | Sanctum Auth + Admin middleware            | 🔒 Locked|
| 4     | Next.js init + Axios setup + Public pages  | 🔒 Locked|
| 5     | Admin panel (protected)                    | 🔒 Locked|
| 6     | GSAP animations + shadcn polish            | 🔒 Locked|
| 7     | Deploy-ready config + security audit       | 🔒 Locked|

---

## 🛠️ Local Dev Requirements

- WSL2 (Ubuntu 22.04+)
- Docker Desktop (WSL2 backend enabled)
- Node.js 20+
- Git

---

## 👤 Author

> Portfolio built from scratch — no tutorials, no templates.
> Architecture decisions documented at every phase.