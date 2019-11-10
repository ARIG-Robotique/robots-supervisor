FROM node:12-alpine

EXPOSE 80

ENV NODE_ENV dev

RUN mkdir -p /app

WORKDIR /app

RUN npm install -g http-server \
    && npm cache clean --force \
    && rm -rf ~/.npm \
    && rm -rf /tmp/npm*

COPY . .

RUN npm install \
    && npm run build \
    && npm cache clean --force \
    && rm -rf ~/.npm \
    && rm -rf /tmp/npm*

CMD ["http-server", "./dist", "-p 80"]
