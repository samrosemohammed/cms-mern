# purpose: To build docker image for client side of the application
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

