FROM node:10-alpine as builder

ENV NODE_ENV dev

RUN mkdir -p /build

WORKDIR /build

COPY . .

RUN npm install \
  && npm run build



FROM node:10-alpine

RUN mkdir /app

WORKDIR /app

COPY --from=builder /build/dist/simulateur .

RUN npm install -g http-server \
    && npm cache clean --force \
    && rm -rf ~/.npm \
    && rm -rf /tmp/npm*

EXPOSE 80

CMD ["http-server", "-r", "-p 80"]
