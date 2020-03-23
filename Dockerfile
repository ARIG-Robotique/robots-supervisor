FROM node:13-alpine as builder

ENV NODE_ENV dev
WORKDIR /build

COPY . .

RUN yarn install --production=false --ignore-engines
RUN yarn build

# Image finale #
# ------------ #
FROM node:13-alpine as final

EXPOSE 80

RUN npm install -g http-server \
    && npm cache clean --force

WORKDIR /www
COPY --from=builder /build/dist/ /www/

CMD ["http-server", "/www", "-p 80"]
