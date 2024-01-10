#!/bin/bash

npm run build
scp -r ./dist/* khai:/var/www/furina.id
