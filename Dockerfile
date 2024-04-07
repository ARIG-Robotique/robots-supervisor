FROM node:18-alpine as final

RUN <<EOF
npm install -g http-server
npm cache clean --force
EOF

EXPOSE 80

ENV NODE_ENV production

WORKDIR /www
COPY dist/ .

CMD ["http-server", "/www", "-p 80"]
