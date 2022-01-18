#!/bin/bash

VERSION=$(cat lerna.json | jq -r '.version')
NAME=$(cat package.json | jq -r '.name')
TAG="kajyr/${NAME}:${VERSION}"
LATEST_TAG="kajyr/${NAME}:latest"

docker build -f Dockerfile --tag $TAG .


if [ "$DOCKER_PUSH" = 'true' ]; then
    docker tag $TAG $LATEST_TAG
    docker push $TAG
    
    docker push $LATEST_TAG
fi