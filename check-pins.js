const fs = require('fs');
const pinataSDK = require('@pinata/sdk');

const apiKey = process.env.API_KEY
const apiSecretKey = process.env.API_SECRET_KEY
const pinata = pinataSDK(apiKey, apiSecretKey);

let offset = 0
const limit = 1000

const arrayOfPins = []

function checkPinns() {
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
            fs.writeFile('uploaded_ipfs.csv', pin.ipfs_pin_hash + ',' + pin.metadata.name + '\n',
                { flag: 'a+' },
                function (err) {
                    if (err) return console.error(err);
                });
        })
        if ((offset + limit) < hashes.count) {
            offset = offset + limit
            checkPinns()
        }
    }).catch((err) => {
        //handle error here
        console.error(err);
    });

}

checkPinns()
