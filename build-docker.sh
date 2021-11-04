#!/bin/bash

VERSION=$(cat package.json | jq -r '.version')
NAME=$(cat package.json | jq -r '.name')
TAG="kajyr/${NAME}:${VERSION}"
docker build -f Dockerfile --tag $TAG .


if [ "$DOCKER_PUSH" = 'true' ]; then
    docker tag $TAG kajyr/${NAME}:latest

    docker push $TAG
    
    docker push kajyr/${NAME}:latest
fi