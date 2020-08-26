const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const Owner = require('../models/Owner');
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        Owner.findById(jwt_payload.id)
            .then(owner => {
                if(owner){
                    return done(null, owner);
                }
                return done(null, false);
            })
            .catch(err => console.log(err));
    }));
};