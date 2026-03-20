FROM node:20.16.0-alpine

ARG APP_VERSION
ARG GIT_COMMIT

ENV APP_VERSION=${APP_VERSION}
ENV GIT_COMMIT=${GIT_COMMIT}

ENV NODE_OPTIONS="--max-old-space-size=8192"

WORKDIR /app

RUN apk add --no-cache curl \
    && update-ca-certificates

COPY package*.json ./
RUN yarn install --non-interactive --network-timeout 1000000


COPY . .
RUN yarn build \
    && yarn cache clean \
    && rm -rf /app/.next/cache/* \
    && rm -rf /usr/local/share/.cache/yarn*

EXPOSE 3000
CMD ["yarn", "start"]