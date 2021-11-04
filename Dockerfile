FROM node:14-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock lerna.json ./
RUN yarn --pure-lockfile
ENV NODE_ENV production

COPY . .

RUN yarn lerna bootstrap && yarn lerna run build


# FROM gcr.io/distroless/nodejs:14
FROM node:14-alpine
ENV NODE_ENV production

WORKDIR /app

COPY entrypoint.sh ./
COPY --from=builder /app/public public
COPY --from=builder /app/backend backend
COPY data data

WORKDIR /app
EXPOSE 4445
ENTRYPOINT ["./entrypoint.sh"]
CMD [ "kledger-ui" ] 
