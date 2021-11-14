# Build
yarn run build

# Navigate into the build output directory
cd dist

# Deploying to a custom domain
echo 'www.one-among.us' > CNAME

git init
git add -A
git commit -m 'deploy'
git push -f https://github.com/hykilpikonna/one-among-us.git master:gh-pages
cd ..
