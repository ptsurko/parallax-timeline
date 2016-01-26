#!/bin/bash

# This makes sure, that we don't deploy pull requests to gh-pages :-)
if [ $TRAVIS_PULL_REQUEST != false ];
  then
  echo "Not deploying test-run for a pull request"
  exit 0
fi
(
  echo "Pushing build to ${GH_REF} gh-pages branch."
  git checkout -b gh-pages

  cd out
  git init

  # inside this git repo we'll pretend to be a new user
  git config user.name "${GIT_NAME}"
  git config user.email "${GIT_EMAIL}"

  # The first and only commit to this new Git repo contains all the
  # files present with the commit message "Deploy to GitHub Pages".
  git add .
  git commit -m "Deployed to Github Pages" > /dev/null

  # Force push from the current repo's master branch to the remote
  # repo's gh-pages branch. (All previous history on the gh-pages branch
  # will be lost, since we are overwriting it.) We redirect any output to
  # /dev/null to hide any sensitive credential data that might otherwise be exposed.
  git push --force "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1

  echo "New gh-pages branch has been pushed to ${GH_REF}."
)
