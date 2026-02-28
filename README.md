# 🍸 BOOZER

**Software de la máquina BOOZER – alcoholímetro recreativo para discotecas**

Este repositorio está organizado como un **monorepo** con dos aplicaciones independientes:

- 🖥️ **Frontend:** React + Vite (`apps/kiosk-ui`)
- 🔧 **Backend:** FastAPI (Python) (`apps/device-api`)

---

## 📁 Estructura del proyecto

```
Boozer
├── apps
│   ├── kiosk-ui       # interfaz del kiosk (frontend)
│   └── device-api     # API local / lógica (backend)
└── README.md
```

---

## ✅ Requisitos

- Node.js & npm (para el frontend)
- Python 3.10+ (para el backend)

> ⚠️ **Importante:** No ejecutes `npm install` en el directorio raíz `apps/`; cada aplicación maneja sus propias dependencias.

---

## 🎨 Frontend (apps/kiosk-ui)

1. Cambia al directorio:

   ```bash
   cd apps/kiosk-ui
   npm install
   ```

2. **Modo de desarrollo**:

   ```bash
   npm run dev
   ```

   El sitio estará disponible en: [http://localhost:5173](http://localhost:5173)

3. **Generar build de producción**:

   ```bash
   npm run build
   ```

4. **Configuración de entorno**

   Crea el archivo `apps/kiosk-ui/.env` con el contenido:

   ```env
   VITE_DEVICE_API=http://localhost:8000
   ```

---

## ⚙️ Backend (apps/device-api)

1. Crear y activar el entorno virtual (solo la primera vez):

   **macOS / Linux**
   ```bash
   cd apps/device-api
   python3 -m venv .venv
   source .venv/bin/activate
   ```

   **Windows (PowerShell)**
   ```powershell
   cd apps/device-api
   python -m venv .venv
   .\.venv\Scripts\activate
   ```

2. Instalar dependencias:

   - Si ya existe `requirements.txt`:
     ```bash
     pip install -r requirements.txt
     ```

   - Si es la primera vez:
     ```bash
     pip install fastapi uvicorn[standard] python-dotenv
     pip freeze > requirements.txt
     ```

3. Ejecutar el servidor (con el entorno virtual activado):

   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   Endpoints útiles:
   - `http://localhost:8000/health`
   - `http://localhost:8000/docs`

---

## 🔌 Comunicación Frontend ↔ Backend

El frontend necesita la URL del backend. Configura la variable `VITE_DEVICE_API` en el `.env` del frontend para apuntar a la instancia de desarrollo (p. ej. `http://localhost:8000`).

---

## 🚀 Comandos rápidos

| Acción           | Comando                                                                                       |
|------------------|-----------------------------------------------------------------------------------------------|
| Arrancar frontend| `cd apps/kiosk-ui && npm run dev`                                                             |
| Arrancar backend | `cd apps/device-api && source .venv/bin/activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000` |

---

## ⚠️ Notas importantes

- Cada aplicación gestiona sus propias dependencias.
- No subir al repositorio la carpeta `.venv` ni archivos `.env`.
- Activa el entorno virtual antes de ejecutar el backend.

---

¡Listo para usar BOOZER! 🎉
