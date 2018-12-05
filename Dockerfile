FROM node:10.13
COPY ./framework-ui /app
RUN cd /app
RUN cd /app && npm i && npm install -g serve
RUN cd /app && npm run build
CMD [ "serve", "-s", "/app/build" ]