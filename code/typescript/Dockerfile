FROM node:latest

WORKDIR /app

RUN npm install --save-dev jest

RUN npm install --save-dev babel-jest @babel/core @babel/preset-env

RUN npm install --save-dev @babel/preset-typescript ts-jest @types/jest

COPY babel.config.js .
