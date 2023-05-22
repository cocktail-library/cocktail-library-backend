#!/bin/bash

export DOCKER_CONFIG="${HOME}/.docker-cocktail-library-backend"
# on first deploy, go to machine and enter docker login here
# docker login -u <TOKEN> -p <TOKEN> registry.fritsler.ru
cp ../.env.backend .env
mv -f ./deploy/docker-compose.yaml .
docker compose pull
# todo remove old images
docker compose up -d
