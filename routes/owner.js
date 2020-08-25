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

        return res.status(201).json({ data: dataOwner });
    } catch(err){
        console.error(err);
    }
});

// PUT /api/owner/login
// login owner
router.put('/login', async (req, res) => {
    try{
        const owner = await Owner.findOne({ email: req.body.email });

        if(!owner){
            return res.status(400).json({ errors: 'Email not found' });
        }

        if(req.body.password != owner.password){
            return res.status(400).json({ errors: 'Invalid email or password' });
        }

        const loginData = {
            name: owner.name,
            email: owner.email,
        };

        return res.status(200).json({ data: loginData });
    } catch(err){
        console.error(err);
    }
});
module.exports = router;

module.exports = router;