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

RUN npm install --omit=dev --unsafe-perm --include=optional sharp


COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]