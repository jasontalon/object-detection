FROM nikolaik/python-nodejs:python3.8-nodejs13-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . /usr/src/app

RUN npm run tsc

EXPOSE 8080

CMD [ "npm", "start" ]