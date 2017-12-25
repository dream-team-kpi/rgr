# rgr
[![Build Status](https://travis-ci.org/dream-team-kpi/rgr.svg?branch=master)](https://travis-ci.org/dream-team-kpi/rgr)

## Preparation
Install git from https://git-scm.com/download
Install node.js and npm from https://nodejs.org/download
Install mongoDB from https://www.mongodb.com/download-center
Install Docker from https://docs.docker.com/engine/installation/

## Running
Make sure that mongodb daemon is up and running.
Open your favorite command line tool and clone repository:
```
git clone https://github.com/dream-team-kpi/rgr.git
cd ./rgr
```

Install project dependencies:
```
npm install
```

Run chat server:
```
npm start
```

Open your favorite web browser and go to:
```
http://localhost:3000/
```

## Running with Docker
Make sure that docker engine is up and running and mongod is off.
In the project root directory type the following commands:
```
docker-compose pull
docker-compose build
docker-compose up
```

And again you can open previous URL address, login and type any message you want.

## Executing tests
Make sure that mongodb daemon is up and running.
Run chat server in background:
```
npm start &
```

Execute tests:
```
npm test
```
All provided tests should pass.

Stop chat server that is running in background:
```
npm stop
```
