const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

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

        const salt = await bcrypt.genSalt(10);
        newOwner.password = await bcrypt.hash(req.body.password, salt);

        await newOwner.save();

        const payload = { id: newOwner.id };

        jwt.sign(payload, keys.secretOrKey, { expiresIn: '1 days' },
            (err, token) => {
                if (err) throw err;
                return res.status(201).json({ token: 'Bearer ' + token });
            }
        );

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

        const isMatch = await bcrypt.compare(req.body.password, owner.password);

        if(!isMatch){
            return res.status(400).json({ errors: 'Invalid email or password' });
        }

        const payload = { id: owner.id };

        jwt.sign(payload, keys.secretOrKey, { expiresIn: '1 days' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ token: 'Bearer ' + token });
            }
        );

    } catch(err){
        console.error(err);
    }
});

// GET /api/owner/profile/:ownerId
// get the owner's profile
router.get('/profile/:ownerId', async (req, res) => {
    try{
        const ownerId = req.params.ownerId;
        const owner = await Owner.findById(ownerId).populate("restaurants");

        owner.password = "";

        return res.status(200).json({
            data: owner
        });
    } catch(err){
        console.error(err);
    }
});

module.exports = router;