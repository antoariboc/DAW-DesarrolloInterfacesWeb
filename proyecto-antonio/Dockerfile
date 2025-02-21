# Imagen base con Node.js
FROM node:18-alpine
# Carpeta de trabajo dentro del contenedor
WORKDIR /app
# Copiar archivos de configuración
COPY package.json ./
# Instalar dependencias
RUN npm install ejs 
RUN npm install pg 
RUN npm install bcrypt
RUN npm install express-session
RUN npm install express-flash
RUN npm install passport
RUN npm install passport-local
# Copiar todo el código al contenedor
COPY . .
# Exponer el puerto en el que corre la app
EXPOSE 3000
# Comando para iniciar el servidor
CMD ["node", "server.js"]