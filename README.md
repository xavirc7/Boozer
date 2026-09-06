# 🍸 BOOZER

**Software for the BOOZER machine – a recreational breathalyzer for nightclubs**

This repository is organized as a **monorepo** with two independent applications:

- 🖥️ **Frontend:** React + Vite (`apps/ui-boozer`)
- 🔧 **Backend:** FastAPI (Python) (`apps/api-boozer`)

---

## 📁 Project Structure

```
Boozer
├── apps
│   ├── ui-boozer       # kiosk interface (frontend)
│   └── api-boozer     # local API / logic (backend)
└── README.md
```

---

## ✅ Requirements

- Node.js & npm (for the frontend)
- Python 3.10+ (for the backend)

> ⚠️ **Important:** Do not run `npm install` in the root `apps/` directory; each app manages its own dependencies.

---

## 🐳 Docker: desarrollo del frontend

Con Docker Desktop abierto, ejecuta desde `apps/`:

```bash
docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up --build -d frontend
```

Abre http://localhost. Este modo ejecuta Vite y monta el código local: al guardar
cambios en React, CSS o `src/content/copy.json`, el navegador se actualiza
automáticamente. Si ya tenías la versión compilada abierta, recarga la página una
vez tras cambiar a desarrollo. La primera instalación de dependencias puede tardar.
El backend conserva su configuración; `/api/`, `/docs` y `/openapi.json` se envían
a FastAPI. Esto no sustituye los servicios simulados por integraciones reales.

```bash
# Ver el arranque y las actualizaciones de Vite (Ctrl+C sale del visor)
docker compose -f docker-compose.yaml -f docker-compose.dev.yaml logs -f frontend

# Tras cambiar package.json o package-lock.json, reinstalar y reiniciar Vite
docker compose -f docker-compose.yaml -f docker-compose.dev.yaml restart frontend

# Detener solo el frontend
docker compose -f docker-compose.yaml -f docker-compose.dev.yaml stop frontend

# Volver al frontend compilado, servido por Nginx
docker compose -f docker-compose.yaml up --build -d --no-deps frontend
```

Usa ambos archivos Compose para trabajar en desarrollo. Las dependencias Linux se
guardan en un volumen separado de las instaladas en tu Mac. El modo base con un
solo archivo sirve una compilación fija y necesita reconstruirse para mostrar cambios.
El backend no tiene recarga automática ni volumen persistente para SQLite en esta
configuración; evita eliminarlo o recrearlo si necesitas conservar sus datos.

---

## 🎨 Frontend (apps/ui-boozer)

1. Change into the directory:

   ```bash
   cd apps/ui-boozer
   npm install
   ```

2. **Development mode**:

   ```bash
   npm run dev
   ```

   The app will be available at: [http://localhost:5173](http://localhost:5173)

3. **Build for production**:

   ```bash
   npm run build
   ```

4. **Environment configuration**

   Create `apps/ui-boozer/.env` with the following content:

   ```env
   VITE_DEVICE_API=http://localhost:8000
   ```

---

## ⚙️ Backend (apps/api-boozer)

1. Create and activate the virtual environment (only the first time):

   **macOS / Linux**
   ```bash
   cd apps/api-boozer
   python3 -m venv .venv
   source .venv/bin/activate
   ```

   **Windows (PowerShell)**
   ```powershell
   cd apps/api-boozer
   python -m venv .venv
   .\.venv\Scripts\activate
   ```

2. Install dependencies:

   - If `requirements.txt` already exists:
     ```bash
     pip install -r requirements.txt
     ```

   - If this is the first run:
     ```bash
     pip install fastapi uvicorn[standard] python-dotenv
     pip freeze > requirements.txt
     ```

3. Run the server (with the virtual environment activated):

   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   Useful endpoints:
   - `http://localhost:8000/health`
   - `http://localhost:8000/docs`

4. Database creation (with the virtual environment activated):
   Generate the migration scripts:
   ```bash
   alembic revision --autogenerate -m "initial_migration"
   ```

   Execute the migration scripts:
   ```bash
   alembic upgrade head
   ```
---

## 🔌 Frontend ↔ Backend Communication

The frontend needs to know where the backend is hosted. Set the `VITE_DEVICE_API` variable in the frontend `.env` file to point to your development instance (e.g. `http://localhost:8000`).

---

## 🚀 Quick Commands

| Action            | Command                                                                                       |
|-------------------|-----------------------------------------------------------------------------------------------|
| Start frontend    | `cd apps/kiosk-ui && npm run dev`                                                             |
| Start backend     | `cd apps/api-boozer && source .venv/bin/activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000` |

---

## ⚠️ Important Notes

- Each application manages its own dependencies.
- Do not commit the `.venv` directory or any `.env` files to the repository.
- Activate the virtual environment before running the backend.

---

Ready to use BOOZER! 🎉
