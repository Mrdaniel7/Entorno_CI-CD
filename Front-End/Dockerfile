# Fase de build: usa Node.js oficial
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

# Fase de producción: usa Nginx para servir estáticos
FROM nginx:stable-alpine

# Borra configuración por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copia la carpeta de build desde la fase anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Usa el comando por defecto de Nginx
