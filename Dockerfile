FROM node:14.17.5 as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run all

RUN npm pack

FROM node:14.17.5-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=build /usr/src/app/easer-*.tgz .
COPY --from=build /usr/src/app/default-rest-api /usr/src/app/default-rest-api

RUN npm i -g --omit easer-*.tgz

USER node

EXPOSE 3007

ENTRYPOINT ["easer"]
