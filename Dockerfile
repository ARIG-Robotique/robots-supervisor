FROM node:16-alpine as builder

ENV NODE_ENV dev
WORKDIR /build

COPY . .

RUN echo "Arch : $(uname -m)"; \
    if [ "$(uname -m)" == "aarch64" ]; then \
        apk add python3 build-base gcc wget git; \
    fi

RUN yarn install
RUN yarn build

# Image finale #
# ------------ #
FROM node:16-alpine as final

RUN npm install -g http-server \
    && npm cache clean --force

EXPOSE 80

ENV NODE_ENV production

WORKDIR /www
COPY --from=builder /build/dist/ .

CMD ["http-server", "/www", "-p 80"]
