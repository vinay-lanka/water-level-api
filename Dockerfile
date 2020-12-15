FROM node:lts-alpine

RUN apk add --no-cache curl python2 g++ make

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

CMD [ "npm", "run", "start" ]