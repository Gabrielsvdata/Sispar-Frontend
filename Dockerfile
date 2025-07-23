# Etapa 1: build
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: produção com nginx
FROM nginx:stable-alpine

# Copia os arquivos estáticos gerados pelo build para o nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia config padrão do nginx
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
