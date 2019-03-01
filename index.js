require('dotenv').config();

//

const express = require('express');
const app = express();
const request = require('request');

const port = process.env.PORT || 3000;
const key = process.env.KEY || "";

const TPLSmartDevice = require('tplink-lightbulb');

/*
192.168.86.41 - Plug - HS105(US)
192.168.86.26 - My Smart Bulb - LB130(US)
192.168.86.40 - Right Desk - LB120(US)
192.168.86.39 - Left Desk - LB120(US)
*/

const devices = new Map([
    //    ['192.168.86.41', {}],
    [new TPLSmartDevice('192.168.86.26'), {}],
    [new TPLSmartDevice('192.168.86.40'), {}],
    [new TPLSmartDevice('192.168.86.39'), {}]
]);

app.get('/', function (req, res) {


    res.send('HomeBoi');
});

app.get('/power/:state/', function (req, res) {

    let state = (req.params.state === "on");

    devices.forEach((value, key) => {

        key.power(state, 0)
            .then(status => {
                console.log(status)
            })
            .catch(err => console.error(err))

    });

    //

    res.send('hello world');
})

app.get('/scene/:scene/', function (req, res) {

    let event = "set_" + req.params.scene;
    const url = `https://maker.ifttt.com/trigger/${event}/with/key/${key}`;

    //

    request(url, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        console.log(body.url);
        console.log(body.explanation);
    });

    //

    res.send('hello world');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

