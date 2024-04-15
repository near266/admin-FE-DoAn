FROM node:18-alpine
WORKDIR /app
COPY package*.json . 
RUN npm install --force
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
