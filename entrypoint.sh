#!/bin/sh

set -e

if [ "$1" = 'kledger-ui' ]; then
    cd backend
    NODE_ENV="production" yarn start
fi

exec "$@"