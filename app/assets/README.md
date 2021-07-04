In Redmine, most javascripts, stylesheets, and images(hereafter called "assets") are under the control of webpack

webpack register assets in 'public/pack/manifest.json'. Redmine determines the actual URL based on the registered contents in manifest.json.

In the development environment, webpack-dev-server delivers assets, and the HMR feature automatically re-fetches the updated assets.

In the production environment, Redmine uses pre-compiled assets.

Each asset can be fine-grained to control how it is cached in the browser by file name, query strings, etc., thus reducing traffic and ensuring accurate content updates.

## Requirements

The following tools are necessary to the development and testing environment.

Node.js 14+
Yarn 1.x

## Preparation

In the development and test environments, start webpack-dev-server after installing the dependent npm packages.

````
# Install dependent packages
$ yarn

# Run this before starting Redmine.
# assets will be stored in memory and will not be output as a file.
$ yarn server &
$ rails server -b 0.0.0.0
````

In production, pre-compile your assets.

```
# Install the dependency packages.
$ yarn

# Compile assets (assets will be output to 'public/').
$ yarn release

# Start Redmine
$ rails server
````

## Notes

It will take some time to generate manifest.json after starting webpack-dev-server.
