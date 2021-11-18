# Papel Mache

Papel Mache is an app that uploads pictures to IPFS through pinata.cloud, useful for NFTs collections and automatically deploys in IPFS

---
## Requirements

- pinata/sdk: 1.1.14
- node: 14.17.6

### Node
- #### Node installation on Windows

  Go on [official Node.js website](https://nodejs.org/) and download the installer.
  
- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ apt-get install nodejs
      $ apt-get install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).


## Configure app

You will need the following env variables:

- API_KEY: get it from your pinata.cloud user.
- API_SECRET_KEY: get it from your pinata.cloud user.
- IMAGES_FOLDER: this is the name of the folder where the files you want to download are located.
they should be in your project, this is a relative location. If not set, the program will
try to find the images in a folder called `test`

## Running the project

    $ npm install
    $ npm app.js


## Output

It will write a csv file called ipfs.csv with the ipfs id and the image so you can relate
each image with the ipfs link

## Other features

If there are a lot of pictures to upload the pinata cloud server may failed or your connection 
may failed. That's why you have the file `check-pins.js`. With the command:

    $ npm check-pins.js

You can get a report of the pins uploaded in case you want to retry only for those who failed.
