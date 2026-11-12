# Client

Lightweight React + Vite frontend for the e-commerce backend (Spring Boot, MongoDB + PostgreSQL).

```bash
npm install
npm run dev        # http://localhost:5173, proxies /api -> http://localhost:8080
```

Use `BACKEND_URL=http://host:port npm run dev` to point at a different backend.

## Structure
- `src/styles/` — `tokens.css` (MongoDB colours/fonts/spacing), `base.css`, `layout.css`, `ui.css`
- `src/api/` — fetch wrapper + one function per endpoint
- `src/components/ui/` — Card, Field, Button, Notice, KeyValue primitives
- `src/features/{products,customers,orders}/` — one folder per page
