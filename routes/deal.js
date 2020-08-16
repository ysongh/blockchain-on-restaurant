const fs = require('fs');
const express = require('express');
const router = express.Router();
const fleekStorage = require('@fleekhq/fleek-storage-js');
const { fleekAPIKey, fleekAPISecret } = require('../config/keys');

const Deal = require('../models/Deal');
const Restaurant = require('../models/Restaurant');

// GET /api/deal
// find all deals
router.get('/', async (req, res) => {
    try{
        const deals = await Deal.find();

        return res.status(200).json({
            data: deals,
            count: deals.length
        });
    } catch(err){
        console.error(err);
    }
});


// POST /api/deal/:restaurantId
// add a deal
router.post('/:restaurantId', async (req, res) => {
    try{
        const restaurantId = req.params.restaurantId;
        const restaurant = await Restaurant.findById(restaurantId);

        if(!restaurant){
            return res.status(404).json({error: 'Restaurant not found'});
        }

        const newDeal = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            restaurant: restaurantId
        };

        fs.readFile(req.file.path, async (error, fileData) => {
            const uploadedFile = await fleekStorage.upload({
                apiKey: fleekAPIKey,
                apiSecret: fleekAPISecret,
                key: req.file.filename,
                data: fileData
            });
            newDeal["image"] = uploadedFile.publicUrl;

            const dataDeal = await Deal.create(newDeal);
            restaurant.deals.unshift(dataDeal._id);

            await restaurant.save();

            return res.status(201).json({
                data: dataDeal,
                restaurant: restaurant
            });
        })

    } catch(err){
        console.error(err);
    }
});

// DELETE /api/deal/:restaurantId/:dealId
// delete a deal
router.delete('/:restaurantId/:dealId', async (req, res) => {
    try{
        const dealId = req.params.dealId;
        const restaurantId = req.params.restaurantId;

        const deal = await Deal.findById(dealId);
        const restaurant = await Restaurant.findById(restaurantId);

        if(!deal){
            res.status(404).json({ error: "This deal cannot be found"});
        }

        if(!restaurant){
            res.status(404).json({ error: "This restaurant cannot be found"});
        }

        restaurant.deals = restaurant.deals.filter(id => id != dealId);

        await Deal.findByIdAndRemove(dealId);
        await restaurant.save();

        return res.status(200).json({
            data: deal
        })
    }catch(err){
        console.error(err);
    }
});


module.exports = router;

