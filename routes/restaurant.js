const fs = require('fs');
const express = require('express');
const router = express.Router();
const fleekStorage = require('@fleekhq/fleek-storage-js');
const { fleekAPIKey, fleekAPISecret } = require('../config/keys');

const Restaurant = require('../models/Restaurant');

// GET /api/restaurant
// find all restaurants
router.get('/', async (req, res) => {
    try{
        const restaurants = await Restaurant.find();

        return res.status(200).json({
            data: restaurants,
            count: restaurants.length
        });
    } catch(err){
        console.error(err);
    }
});

// POST /api/restaurant
// add restaurant deal
router.post('/', async (req, res, next) => {
    try{
        const newRestaurant = {
            name: req.body.name,
            price: req.body.price,
            location: req.body.location,
            description: req.body.description
        };

        fs.readFile(req.file.path, async (error, fileData) => {
            const uploadedFile = await fleekStorage.upload({
                apiKey: fleekAPIKey,
                apiSecret: fleekAPISecret,
                key: req.file.filename,
                data: fileData
            });
            newRestaurant["image"] = uploadedFile.publicUrl;

            const dataRestaurant = await Restaurant.create(newRestaurant);

            return res.status(201).json({ data: dataRestaurant });
        })

    } catch(err){
        console.error(err);
    }
});

module.exports = router;

