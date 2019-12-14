require('dotenv').config();

//

const express = require('express');
const app = express();
const request = require('request');

const port = process.env.PORT || 3000;
const key = process.env.KEY || "";

const { Client } = require('tplink-smarthome-api');

/*
192.168.86.41 - Plug - HS105(US)
192.168.86.26 - My Smart Bulb - LB130(US)
192.168.86.40 - Right Desk - LB120(US)
192.168.86.39 - Left Desk - LB120(US)
*/

const devices = new Map();

const client = new Client();

client.getDevice({ host: '192.168.86.26' }).then((device) => {
    devices.set('192.168.86.26', device);
});
client.getDevice({ host: '192.168.86.39' }).then((device) => {
    devices.set('192.168.86.39', device);
});
client.getDevice({ host: '192.168.86.40' }).then((device) => {
    devices.set('192.168.86.40', device);
});

app.get('/', function (req, res) {
    res.send('Haunt');
});

app.get('/power/:state/', function (req, res) {

    let state = {
        transition_period: 0,
        on_off: (req.params.state === "on")
    }

    devices.forEach((device, ip) => {
        device.lighting.setLightState(state);
    });

    //

    res.send('Power state updated.');
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

    res.send('Scene state updated.');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

