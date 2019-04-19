# robots-supervisor

Travis CI : [![Travis branch dev](https://img.shields.io/travis/ARIG-Robotique/robots-supervisor/dev.svg?style=plastic)](https://travis-ci.org/ARIG-Robotique/robots-supervisor)\
Docker : [![Docker Build Statu](https://img.shields.io/docker/build/arig/robots-supervisor.svg?style=plastic)](https://hub.docker.com/r/arig/robots-supervisor/)
[![Docker Pulls](https://img.shields.io/docker/pulls/arig/robots-supervisor.svg?style=plastic)](https://hub.docker.com/r/arig/robots-supervisor/)
[![Docker Automated build](https://img.shields.io/docker/automated/arig/robots-supervisor.svg?style=plastic)](https://hub.docker.com/r/arig/robots-supervisor/)\
Codecov : *Prochainement !*

Monitoring et réglage des robots.

## Pour développer en local :

```bash
$ npm install
$ npm run start
```
Application disponible sur `http://localhost:4200` (dev).

## Pour construire une image docker local

```bash
$ make build
$ make run
``` 
L'image portera le nom et tag `arig/robots-supervisor:local`.

Un port disponible sera réservé. Il faut controler celui-ci avec `docker ps`.\
Une fois le port déterminé l'application est disponible sur `http://localhost:<mon_port>`

