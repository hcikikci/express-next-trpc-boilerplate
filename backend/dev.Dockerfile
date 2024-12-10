# Use the official Node.js image as the base image
FROM node:current-bookworm-slim AS app

#backend
WORKDIR /app/backend

ARG UID=1000
ARG GID=1000

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential curl libpq-dev \
    && rm -rf /var/lib/apt/lists/* /usr/share/doc /usr/share/man \
    && apt-get clean \
    && groupmod -g "${GID}" node && usermod -u "${UID}" -g "${GID}" node \
    && mkdir -p /node_modules && chown node:node -R /node_modules /app

USER node

ARG NODE_ENV="development"
ENV NODE_ENV="${NODE_ENV}" \
    PATH="${PATH}:/node_modules/.bin" \
    USER="node"

COPY --chown=node:node backend/package.json backend/package-lock.json ./

RUN npm install


COPY --chown=node:node backend/ ./

# Ensure prisma schema is in the correct location
RUN npx prisma generate
