#!/usr/bin/env bash

curl -s https://nodejs.org/dist/index.tab | awk '{if (/^v[1-9]/ ||/^v0.10.4[8-9]/ || /^v0.12.[1][8-9]/) print $1;}'

