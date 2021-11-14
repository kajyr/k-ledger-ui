#!/bin/sh

set -e

if [ "$1" = 'kledger-ui' ]; then
    cd backend
    NODE_ENV="production" npm start
fi

exec "$@"