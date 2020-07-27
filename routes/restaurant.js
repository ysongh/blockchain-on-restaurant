const fs = require('fs');
const express = require('express');
const router = express.Router();
const fleekStorage = require('@fleekhq/fleek-storage-js');
const { fleekAPIKey, fleekAPISecret } = require('../config/keys');

const Restaurant = require('../models/Restaurant');

// POST /api/restaurant
// add restaurant deal
router.post('/', async (req, res, next) => {
    console.log(req.file);
    try{
        fs.readFile(req.file.path, async (error, fileData) => {
            const uploadedFile = await fleekStorage.upload({
                apiKey: fleekAPIKey,
                apiSecret: fleekAPISecret,
                key: req.file.filename,
                data: fileData
            });
            console.log(uploadedFile);

            return res.status(200);
        })
    } catch(err){
        console.error(err);
    }
});

module.exports = router;

