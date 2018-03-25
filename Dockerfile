FROM node:9.9.0

RUN mkdir -p /app/data

ADD ./* /app/

ENTRYPOINT npm run dev 3000