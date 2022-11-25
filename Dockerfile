FROM node:18.11-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json lerna.json ./
COPY . .

RUN npm install
RUN NODE_ENV=production npm run build


FROM node:18.11-alpine
ENV NODE_ENV production

WORKDIR /app

COPY entrypoint.sh ./
COPY --from=builder /app/public public
COPY --from=builder /app/backend backend
# COPY data data

WORKDIR /app
EXPOSE 4445
ENTRYPOINT ["./entrypoint.sh"]
CMD [ "kledger-ui" ] 
