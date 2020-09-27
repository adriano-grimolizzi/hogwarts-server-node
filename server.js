const express = require('express');
const fs = require("fs");

const app = express();

const RESOURCE_URL = '/wizards';
const JSON_PATH = __dirname + '/wizards.json';
const ENCODING = 'utf8';

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.get(RESOURCE_URL, function (req, res) {
    console.log('Handling GET request...');
    fs.readFile(JSON_PATH, ENCODING, function (err, data) {
        console.log(data);
        res.setHeader("Content-Type", "application/json");
        res.end(data);
    });
});

app.get(RESOURCE_URL + "/:id", function (req, res) {
    console.log('Handling GET BY ID request...');
    const requestedId = parseInt(req.params.id);
    console.log("Requested ID: " + requestedId);

    fs.readFile(JSON_PATH, ENCODING, function (err, data) {

        let requestedWizard = null;
        const wizards = JSON.parse(data);

        for (var i = 0; i < wizards.length; i++) {
            var wizard = wizards[i];
            if (wizard.id === requestedId) {
                requestedWizard = wizard;
            }
        }
        res.setHeader("Content-Type", "application/json");
        if (requestedWizard) {
            console.log("Found Wizard: " + JSON.stringify(requestedWizard));
            res.end(JSON.stringify(requestedWizard));
        } else {
            console.log("Wizard not found");
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Wizard not found" }));
        }
    });
});

app.delete(RESOURCE_URL + "/:id", function (req, res) {
    console.log('Handling DELETE BY ID request...');
    const requestedId = parseInt(req.params.id);
    console.log("Requested ID: " + requestedId);

    fs.readFile(JSON_PATH, ENCODING, function (err, data) {

        const readWizards = JSON.parse(data);
        const toWriteWizards = [];
        let deleted = false;

        for (let i = 0; i < readWizards.length; i++) {
            let wizard = readWizards[i];
            if (wizard.id !== requestedId) {
                toWriteWizards.push(wizard)
            } else {
                deleted = true;
            }
        }

        console.log(JSON.stringify(toWriteWizards));
        // res.setHeader("Content-Type", "application/json");
        if (deleted) {
            console.log("Deleting...");
            fs.writeFile(JSON_PATH, JSON.stringify(toWriteWizards), ENCODING, (err) => {
                if (err) throw error;
                console.log('toWriteWizards has been saved.');
            });
            res.writeHead(200);
            res.end(JSON.stringify(toWriteWizards));            
        } else {
            console.log("not Deleted!");
            res.writeHead(404);
            res.end("not Deleted!");
        }
    });
});

app.post(RESOURCE_URL, function (req, res) {
    console.log('Handling POST request...');

    const wizard = {};
    wizard.id = req.body.data.id;
    wizard.name = req.body.data.name;
    wizard.house = req.body.data.house;

    fs.readFile(JSON_PATH, ENCODING, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        data.push(wizard);

        console.log('Saving new Wizard:');
        console.log(wizard);

        fs.writeFile(JSON_PATH, JSON.stringify(data), ENCODING, (err) => {
            if (err) throw error;
            console.log('Wizard has been saved.');
        });
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
    });
});

const host = 'localhost';
const port = 8080;

const server = app.listen(port, host, function () {
    console.log(`Server listening at http://${host}:${port}.`);
})