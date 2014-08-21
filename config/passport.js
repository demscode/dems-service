var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    Carer = require('../models/carer'),
    Keys = require('./keys');

module.exports = function(passport) {
    //serialise user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    //deserialise user
    passport.deserializeUser(function(id, done) {
        Carer.all([ {where : { gid : id }} ], function(err, user) {    
            done(err, user[0]);
        });
    });

    passport.use(new GoogleStrategy(Keys.googleKeys, function (accessToken, refreshToken, profile, done) {
        //wait for Google to respond
        process.nextTick(function() {
            //find user based on google id
            Carer.all([ {where : { 'gid' : profile.id }}], function(err, user) {
                if (err) {
                    return done(err);
                }   

                if (user[0]) {
                    //login user if found
                    return done(null, user[0]);
                } else {
                    //create a new user
                    var newCarer = {
                        gid : profile.id,
                        token : accessToken,
                        name : profile.displayName,
                        email : profile.emails[0].value
                    };

                    Carer.create(newCarer, function(err, user) {
                        if (err) {
                            throw err;
                        }
                        return done(null, user);
                    });
                }      
            });
        });
     })
    );
};

