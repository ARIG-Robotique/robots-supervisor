FROM node:16-alpine as final

RUN npm install -g http-server \
    && npm cache clean --force

EXPOSE 80

ENV NODE_ENV production

WORKDIR /www
COPY dist/ .

CMD ["http-server", "/www", "-p 80"]
