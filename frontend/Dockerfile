# Etapa 1: El Taller de Construcción
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Etapa 2: El Contenedor de Despliegue
FROM nginx:1.23-alpine

# Copiar solo los archivos construidos desde la etapa anterior
COPY --from=builder /app/build /usr/share/nginx/html

# Copiar la configuración de Nginx
# Esto es importante para que React Router funcione correctamente
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
