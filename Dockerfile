# Utiliser une image officielle de Node.js
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer toutes les dépendances, y compris les dépendances de développement
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port
EXPOSE 3000

# Commande pour démarrer l'application en mode développement
CMD ["npm", "run", "dev"]
