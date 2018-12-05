# OpenVM Framework Directory Application

## Installation

To get this project up and running please install the docker engine according to your OS.

## Starting the Application

All you need to do afterwards is running `docker-compose up` inside of this folder. The UI can then be found at [http://localhost:3000](http://localhost:3000) and the API at [http://localhost:6060](http://localhost:6060).

## Development

### The UI and API

The according `src` folders of the UI (./framework-ui/src) and the API (./framework-api/src) are mounted to their respective containers and file changes are being monitore so the accoring server will be restarted automatically with the changes and the UI also has hot reloading enabled.

### The Database

The database can be populated with the OpenVM framework data, which is located in the [competencies.js](./framework-api/src/database/competencies.js) file. It holds the current state of the framework. This can be triggered via the `/populate` route. To purge the database `GET` the `/deleteAll` route. Be aware that on rebuilding the Database container changes to the database data will be lost. THis is what the `/populate` route is for.

## API Documentation

The API documentation can be found in [./api.postman_collection.json](./api.postman_collection.json)

## Apendix

The `framework-ui-production` container is purely for demo purposes.
