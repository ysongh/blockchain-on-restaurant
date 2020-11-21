const fs = require('fs');
const express = require('express');
const router = express.Router();
const passport = require('passport');
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

// GET /api/deal/:restaurantId
// find all deals by restaurantId
router.get('/:restaurantId', async (req, res) => {
    try{
        const restaurantId = req.params.restaurantId;

        const deals = await Deal.find({ 'restaurant': restaurantId });

        return res.status(200).json({
            data: deals
        });
    } catch(err){
        console.error(err);
    }
});


// POST /api/deal/:restaurantId
// add a deal
router.post('/:restaurantId', passport.authenticate('jwt', {session: false}), async (req, res) => {
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

        if(req.file){
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
            });
        }
        else{
            const dataDeal = await Deal.create(newDeal);
            restaurant.deals.unshift(dataDeal._id);

            await restaurant.save();

            return res.status(201).json({
                data: dataDeal,
                restaurant: restaurant
            });
        }
        
    } catch(err){
        console.error(err);
    }
});

// GET /api/deal/:restaurantId/:dealId
// find deal by id
router.get('/:restaurantId/:dealId', async (req, res) => {
    try{
        const dealId = req.params.dealId;

        const deal = await Deal.findById(dealId);

        if(!deal){
            res.status(404).json({ error: "This deal cannot be found"});
        }

        return res.status(200).json({
            data: deal
        });
    } catch(err){
        console.error(err);
    }
});

// PUT /api/deal/:restaurantId/:dealId
// edit a deal
router.put('/:restaurantId/:dealId', passport.authenticate('jwt', {session: false}), async (req, res) => {
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
        deal.name = req.body.name,
        deal.price = req.body.price,
        deal.description = req.body.description

        await deal.save();

        return res.status(200).json({
            data: deal
        });
    } catch(err){
        console.error(err);
    }
});

// DELETE /api/deal/:restaurantId/:dealId
// delete a deal
router.delete('/:restaurantId/:dealId', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
        const dealId = req.params.dealId;
        const restaurantId = req.params.restaurantId;

        const deal = await Deal.findById(dealId);
        const restaurant = await Restaurant.findById(restaurantId).populate("deals");

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
            data: restaurant
        })
    }catch(err){
        console.error(err);
    }
});

module.exports = router;