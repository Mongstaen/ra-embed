FROM node:latest

WORKDIR /
COPY package.json package.json
COPY package-lock.json package-lock.json

VOLUME [ "/app" ]
RUN npm install

COPY . .
CMD ["node", "index.js"]
EXPOSE 8080