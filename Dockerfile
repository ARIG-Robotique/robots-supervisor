FROM node:13-alpine as builder

ENV NODE_ENV dev
WORKDIR /app

COPY . .

RUN yarn install --production=false --ignore-engines
RUN yarn build

# Image finale #
# ------------ #
FROM node:13-alpine as final

EXPOSE 80
WORKDIR /app

RUN npm install -g http-server \
    && npm cache clean --force

COPY --from=builder /app/dist/* /app/

CMD ["http-server", ".", "-p 80"]
