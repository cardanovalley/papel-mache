const pinataSDK = require('@pinata/sdk');

const apiKey = process.env.API_KEY
const apiSecretKey = process.env.API_SECRET_KEY
const pinata = pinataSDK(apiKey, apiSecretKey);


const fs = require('fs');
const path = require('path');

const imagesFolder = process.env.IMAGES_FOLDER || 'test'
const resultHashes = []
const pinataPromises = []
//joining path of directory
const directoryPath = path.join(__dirname, imagesFolder);

let imagesToUpload = []
let offset = 0
let limit = 1000

const arrayOfPins = []

function uploadImages() {
    const file = imagesToUpload.pop()
    const readableStreamForFile = fs.createReadStream(path.join(directoryPath, file));
    const options = {
        pinataMetadata: {
            name: file,
            keyvalues: {
                fileName: file
            }
        },
        pinataOptions: {
            cidVersion: 0
        }
    };

    const newPromise = pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
        //handle results here
        resultHashes.push(result.IpfsHash)
        if (imagesToUpload.length !== 0) {
            setTimeout(uploadImages, 1000)
        }
    }).catch((err) => {
        //handle error here
        console.log(err);
    });
    pinataPromises.push(newPromise);
}

function checkPinataPromises() {
    Promise.all(pinataPromises).then(() => {
        const pinataPromise = pinata.pinList({
            "status": "pinned",
            "pageLimit": limit,
            "pageOffset": offset,
        })
        pinataPromise.then((hashes) => {
            hashes.rows.forEach((pin) => {
                arrayOfPins.push({
                    "ipfs_hash": pin.ipfs_pin_hash,
                    "image_name": pin.metadata.name
                })
                fs.writeFile('ipfs.csv', pin.ipfs_pin_hash + ',' + pin.metadata.name + '\n',
                    { flag: 'a+' },
                    function (err) {
                        if (err) return console.error(err);
                    });
            })
            if ((offset + limit) < hashes.count) {
                offset = offset + limit
                checkPinataPromises()
            }
        }).catch((err) => {
            //handle error here
            console.error(err);
        });

    }).catch((err) => {
        //handle error here
        console.error(err);
    });
}

function checkImagesHasBeenUploaded() {
    if (imagesToUpload.length == 0) {
        checkPinataPromises()
    } else {
        setTimeout(checkImagesHasBeenUploaded, 1000)
    }
}


// reading files in directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    imagesToUpload = files

    uploadImages();

    checkImagesHasBeenUploaded();

});





