const express = require('express');  //FRAMEWORK
const fs = require('fs');   //NODE MODULE TO INTERACT WITH/ accessFILE SYSTEM 
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); // YOU MAY GET COR ERROR IN NETWORK WITHOUT CROSS ORIGIN RESOURCE SHARING
app.use(express.json()); //middleware to parse json bodies 

// Endpoint to save data POST
app.post('/save', (req, res) => {
    const newData = req.body;  //TO GET DATA FROM REQUEST BODY

    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err && err.code === 'ENOENT') {   // If file does not exist(ENOENT), create it with the new data
            fs.writeFile('data.json', JSON.stringify(newData, null, 2), (err) => {
                if (err) {
                    res.status(500).send('Error saving data');
                } else {
                    res.send('Data saved successfully');
                }
            });
        } else if (err) {
            res.status(500).send('Error reading data file');
        } else {
            // If file exists, append the new data
            let existingData;
            try {
                existingData = JSON.parse(data);
                if (!Array.isArray(existingData)) {
                    existingData = [existingData];
                }
            } catch (parseError) {
                res.status(500).send('Error parsing data file');
                return;
            }
            const updatedData = existingData.concat(newData);
            fs.writeFile('data.json', JSON.stringify(updatedData, null, 2), (err) => {
                if (err) {
                    res.status(500).send('Error saving data');
                } else {
                    res.send('Data saved successfully');
                }
            });
        }
    });
});

// Endpoint to fetch data
app.get('/fetch', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) {
            res.status(500).send('Error fetching data');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
