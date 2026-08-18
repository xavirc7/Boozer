FROM python:3.11-slim

# Evita que Python escriba archivos .pyc y fuerza stdout sin búfer para ver logs en tiempo real
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar dependencias del sistema mínimas si fueran necesarias
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar e instalar requirements aprovechando la caché de Docker
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación
COPY . .

# Crear y cambiar a un usuario sin privilegios
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# Ejecución con Uvicorn (ajusta "main:app" según tu archivo de entrada)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]