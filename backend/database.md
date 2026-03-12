## Setup

0. `cd spankki`
1. `docker compose up -d`

The command creates all the images and containers needed to run the services defined in docker-compose.yaml, namely the "db" container.

## To .env file

`POSTGRES_USER="myuser"`

`POSTGRES_PASSWORD="mysupersecretpassword"`

`POSTGRES_DB="spankki"`

`PGADMIN_DEFAULT_PASSWORD="mysecretpassword"`

`PGADMIN_DEFAULT_EMAIL="some default email"`

## Running from command line

#### To run Dockerfile from cmd/bash:

Run this if you already have composed a db-stack

`docker compose restart`

#### To stop Dockerfile from cmd/bash:

Run this if you want to stop your Dockerfile

`docker compose stop`

#### To check what docker has up and running from cmd/bash:

`docker compose ps`

## Running from Docker desktop

All docker containers are located in the Containers tab. Images tab has all the images which can be composed into a container. You can see which containers have been set up and which are stopped/running from the Containers tab. You can check container's status by clicking the container which you want to inspect. 

#### To run from Docker desktop

Press the Start button from Containers tab

#### To stop 

Press the stop button from Containers tab