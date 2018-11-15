FROM node:8.11.4-jessie
COPY src/ /app
WORKDIR /app
RUN npm i
CMD [ "npm", "start" ]
EXPOSE 3000