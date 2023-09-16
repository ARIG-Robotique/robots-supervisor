# robots-supervisor

[![Build Status](https://img.shields.io/github/actions/workflow/status/ARIG-Robotique/robots-supervisor/build.yml?branch=dev&logo=github)](https://github.com/ARIG-Robotique/robots-supervisor/actions/workflows/build.yml)

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
L'image portera le nom et tag `ghcr.io/arig-robotique/robots-supervisor:local`.

Un port disponible sera réservé. Il faut controler celui-ci avec `docker ps`.\
Une fois le port déterminé l'application est disponible sur `http://localhost:<mon_port>`

