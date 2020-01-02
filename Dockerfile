###
### BASE
###
FROM node:12-alpine as base

COPY wait-for /bin
RUN chmod +x /bin/wait-for

WORKDIR /server

COPY package*.json ./
RUN npm install

###
### DEV
###
FROM base as dev

# Expects the host context folder to be mounted at /server.

EXPOSE 3000
EXPOSE 9229

CMD ["npx", "nest", "start", "--watch", "--debug", "0.0.0.0:9229"]

###
### PROD-BUILD
###
FROM base as prod-build

COPY . .

RUN npm run build

###
### PROD
###
FROM node:12-alpine as prod

WORKDIR /server

COPY --from=prod-build /server/dist ./

EXPOSE 3000

CMD ["node", "main"]
