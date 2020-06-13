# robots-supervisor

[![Build Status](https://img.shields.io/github/workflow/status/ARIG-Robotique/robots-supervisor/CI?logo=github)](https://github.com/ARIG-Robotique/robots-supervisor/actions)
[![Docker Status](https://img.shields.io/docker/build/arig/robots-supervisor?logo=docker)](https://hub.docker.com/r/arig/robots-supervisor/)

Monitoring et réglage des robots.

## Pour développer en local :

```bash
$ yarn --production=false
$ yarn start
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

