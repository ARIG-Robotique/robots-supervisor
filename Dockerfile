FROM gdepuille/docker-node-static
LABEL maintainer "Gregory DEPUILLE <gregory.depuille@gmail.com>"

# Création d'une arborescence de constuction
ENV BUILD_WORK_DIR /appbuild
RUN mkdir -p ${BUILD_WORK_DIR}

# Installation des outils de build Angular CLI
RUN mkdir $HOME \
    && npm install -g @angular/cli

# Ajout des sources de l'application
ADD . ${BUILD_WORK_DIR}/

# Installation des composants serveur
RUN cd ${BUILD_WORK_DIR} \
    && npm install

# Build de l'application Angular
RUN cd ${BUILD_WORK_DIR}/public-src \
    && npm install \
    && npm run build \
    && cd ${BUILD_WORK_DIR} \
    && rm -rf ${BUILD_WORK_DIR}/public-src

# Nettoyage NPM
RUN npm cache clean \
    && rm -rf ~/.npm \
    && rm -rf /tmp/npm*

# Déplacement de l'application construite
RUN cd / \
    && mv ${BUILD_WORK_DIR}/* /app

RUN cd /app
    && npm run start
