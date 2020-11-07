const fs = require('fs');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const fleekStorage = require('@fleekhq/fleek-storage-js');
const { fleekAPIKey, fleekAPISecret } = require('../config/keys');

const Owner = require('../models/Owner');
const Restaurant = require('../models/Restaurant');

// GET /api/restaurant
// find all restaurants
router.get('/', async (req, res) => {
    try{
        const restaurants = await Restaurant.find().sort('-date');

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
router.post('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try{
        const owner = await Owner.findById(req.user.id);

        const newRestaurant = {
            name: req.body.name,
            location: req.body.location,
            description: req.body.description,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            ownerId: req.user.id
        };

        if(req.file){
            fs.readFile(req.file.path, async (error, fileData) => {
                const uploadedFile = await fleekStorage.upload({
                    apiKey: fleekAPIKey,
                    apiSecret: fleekAPISecret,
                    key: req.file.filename,
                    data: fileData
                });
                newRestaurant["image"] = uploadedFile.publicUrl;
    
                const dataRestaurant = await Restaurant.create(newRestaurant);

                owner.restaurants.unshift(dataRestaurant._id);
                await owner.save();
    
                return res.status(201).json({ data: dataRestaurant });
            });
        }
        else{
            const dataRestaurant = await Restaurant.create(newRestaurant);
            
            owner.restaurants.unshift(dataRestaurant._id);
            await owner.save();

            return res.status(201).json({ data: dataRestaurant });
        }

    } catch(err){
        console.error(err);
    }
});

// GET /api/restaurant/:restaurantId
// find more detail about a restaurant
router.get('/:restaurantId', async (req, res) => {
    try{
        const restaurantId = req.params.restaurantId;
        const restaurant = await Restaurant.findById(restaurantId).populate("deals");

        return res.status(200).json({
            data: restaurant
        });
    } catch(err){
        console.error(err);
    }
});

// PUT /api/restaurant/:restaurantId
// edit a restaurant
router.put('/:restaurantId', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
        const restaurantId = req.params.restaurantId;
        const restaurant = await Restaurant.findById(restaurantId);

        if(!restaurant){
            res.status(404).json({ error: "This restaurant cannot be found"});
        }

        restaurant.name = req.body.name;
        restaurant.location = req.body.location;
        restaurant.description = req.body.description;
        restaurant.phoneNumber = req.body.phoneNumber;
        restaurant.email = req.body.email

        await restaurant.save();

        return res.status(200).json({
            data: restaurant
        });
    } catch(err){
        console.error(err);
    }
});

// DELETE /api/restaurant/:restaurantId
// delete a restaurant
router.delete('/:restaurantId', async (req, res) => {
    try{
        const restaurantId = req.params.restaurantId;

        const restaurant = await Restaurant.findById(restaurantId);
        const owner = await Owner.findById(restaurant.ownerId);
        

        if(!restaurant){
            res.status(404).json({ error: "This restaurant cannot be found"});
        }

        await Restaurant.findByIdAndRemove(restaurantId);
        
        owner.restaurants = owner.restaurants.filter(restaurant => restaurant._id !== restaurantId);
        await owner.save();

        return res.status(200).json({
            data: restaurant
        })
    }catch(err){
        console.error(err);
    }
});


module.exports = router;

