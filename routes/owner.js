const express = require('express');
const router = express.Router();

const Owner = require('../models/Owner');

// POST /api/owner/register
// create a new owner
router.post('/register', async (req, res) => {
    try{
        const owner = await Owner.findOne({ email: req.body.email });

        if(owner){
            return res.status(400).json({ errors: 'Email Already Exists' });
        }

        const newOwner = new Owner({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        const dataOwner = await Owner.create(newOwner);

        return res.status(200).json({ data: dataOwner });
    } catch(err){
        console.error(err);
    }
});

module.exports = router;