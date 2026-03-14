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
