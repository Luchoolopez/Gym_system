FROM node:20

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

EXPOSE 3000

# Comando para desarrollo usando tsx
CMD ["npx", "tsx", "src/server.ts"]
