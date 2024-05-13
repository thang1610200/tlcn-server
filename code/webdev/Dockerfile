FROM node:latest

WORKDIR /app

RUN npm install --save-dev jest

RUN npm install --save-dev identity-obj-proxy jsdom

COPY jest.config.json .