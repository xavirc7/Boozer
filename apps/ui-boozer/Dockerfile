# Stage 1: Build de la aplicación Node
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar dependencias e instalar
COPY package*.json ./
RUN npm ci

# Copiar código y compilar (genera carpeta /dist o /build)
COPY . .
RUN npm run build

# Stage 2: Servidor Nginx ligero
FROM nginx:alpine

# Copiar los estáticos compilados (cambia "dist" por "build" si usas Create-React-App)
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]