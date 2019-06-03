#!/bin/bash

# Force publishes the dist folder only to the gh-pages branch
git subtree split --prefix dist -b gh-pages
git push -f cdm gh-pages:gh-pages
git branch -D gh-pages