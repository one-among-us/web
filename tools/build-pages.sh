#!/bin/bash
git clone --depth 1 --branch gh-pages https://github.com/one-among-us/data data-repo
yarn build
yarn gen-meta
