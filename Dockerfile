# Utiliser une image officielle de Node.js
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer toutes les dépendances, y compris les dépendances de développement
RUN npm install

RUN npm install -g ts-node-dev

# Exposer le port
EXPOSE 3000

# Commande pour démarrer l'application en mode développement
CMD ["npm", "run", "dev"]
