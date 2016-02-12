# TomatoSearch Website

## Prequisites
 - TSD (`npm install -g tsd`)
 - NPM >= 3

## Installing dependencies
 - `tsd install`
 - `npm install`

## Dev build
- `npm start`

## Production build
- `npm build`
- `NODE_ENV=production npm start`

## Deployment
Deployment is done using [Pod](https://github.com/yyx990803/pod).

The following instructions add a new git remote named `deploy` and push this subdirectory to the server which runs the deploy script in `.podhook`:
- `git remote add deploy ssh://root@tomato.ga/root/tomato/repos/tomato.git`
- From root directory: `git subtree push --prefix TomatoSearch/website deploy master`
