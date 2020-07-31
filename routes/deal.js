const express = require('express');
const router = express.Router();

const Deal = require('../models/Deal');
const Restaurant = require('../models/Restaurant');

// POST /api/restaurant/:restaurantId
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

        const dataDeal = await Deal.create(newDeal);

        restaurant.deals.push(dataDeal._id);
        await restaurant.save();

        return res.status(201).json({
            data: dataDeal,
            restaurant: restaurant
        });
        
    } catch(err){
        console.error(err);
    }
});

module.exports = router;

