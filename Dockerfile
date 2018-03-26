FROM node:9.9.0-alpine

MAINTAINER 812135023@qq.com

RUN mkdir -p /app

ADD . /app/

WORKDIR /app

ENTRYPOINT npm run dev 3000