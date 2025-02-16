FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

RUN npm install --production

COPY . .

RUN npm uninstall bcrypt

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    node-gyp

RUN npm install bcrypt --build-from-source

RUN npm run build

EXPOSE 80

CMD ["npm", "run", "start:prod"]