FROM node:20-alpine
EXPOSE 8154
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production

COPY . .
CMD ["node", "index"]