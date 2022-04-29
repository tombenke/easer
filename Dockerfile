FROM node:14.17.5 as build

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build && \
    npm pack

FROM node:14.17.5-alpine

WORKDIR /

ENV NODE_ENV=production

COPY --from=build /easer-*.tgz .
COPY --from=build /default-rest-api /default-rest-api

RUN npm i -g --omit easer-*.tgz

USER node

EXPOSE 3007

ENTRYPOINT ["easer"]
