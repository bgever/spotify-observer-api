FROM node:12-alpine

WORKDIR /server

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN chmod +x wait-for

CMD ["npm", "run", "start:prod"]
