FROM node:15.0.1-alpine3.10

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++

WORKDIR /app/dist

# Client install deps
WORKDIR /app/client

COPY "./client/package.json" .
RUN yarn install

RUN apk del .gyp

# Server install deps
WORKDIR /app/server

COPY "./server/package.json" .
RUN yarn install

# Client build front
WORKDIR /app/client
COPY ./client .
RUN yarn build
RUN ls
RUN mv build ../dist/public

# Server build server
WORKDIR /app/server
COPY ./server .
RUN yarn build
RUN mv build ../dist/src && mv node_modules ../dist/node_modules

# Start
WORKDIR /app/dist
CMD ["node", "src/index.js"]