#!/usr/bin/env sh

# Abort on errors
set -e

# Build
yarn run build

# Navigate into the build output directory
cd dist
cp index.html 404.html

# Deploying to a custom domain
echo 'www.one-among.us' > CNAME

git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:one-among-us/web.git master:gh-pages
cd -
