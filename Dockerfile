# CLIENT
FROM node:15.0.1-alpine3.10 AS CLIENT

WORKDIR /app/client
COPY "./client/package.json" package.json
COPY "./client/yarn.lock" yarn.lock

RUN yarn install

# Build client
COPY ./client .
RUN yarn build

# BACK
FROM node:15.0.1-alpine3.10 AS BACK

WORKDIR /app/server

COPY "./server/package.json" package.json
COPY "./server/yarn.lock" yarn.lock
RUN yarn install

# Server build server
COPY ./server .
RUN yarn build

# FINAL IMAGE
FROM node:15.0.1-alpine3.10


WORKDIR /app/server
COPY --from=BACK /app/server .
COPY --from=CLIENT /app/client/build public


CMD ["node", "build/index.js"]