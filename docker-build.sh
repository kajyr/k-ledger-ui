#!/bin/bash

VERSION=$(cat lerna.json | jq -r '.version')
NAME=$(cat package.json | jq -r '.name')
HOST="ghcr.io"
TAG="${HOST}/kajyr/${NAME}:${VERSION}"
LATEST_TAG="${HOST}/kajyr/${NAME}:latest"

docker build -f Dockerfile --tag $TAG .

echo "TAG: $TAG"
echo "LATEST: $LATEST_TAG"

if [ "$DOCKER_PUSH" = 'true' ]; then
    docker tag $TAG $LATEST_TAG
    docker push $TAG
    
    docker push $LATEST_TAG
fi