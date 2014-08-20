var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    Carer = require('../models/carer');
    

var googleKeys = 
    {
        'clientID'    : '155424153501-c8cops3ulln3irkq6lb77k2gcvgvuhlr.apps.googleusercontent.com',
        'clientSecret': 've_ALQ4Ex5wGiXHYwxSkpAh8',
        'callbackURL' : 'http://localhost:3000/auth/google/callback'
    };

module.exports = function(passport) {
    //serialise user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    //deserialise user
    passport.deserializeUser(function(id, done) {
        Carer.findById(id, function(err, user) {    
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy(googleKeys), function (accessToken, refreshToken, profile, done) {
        //wait for Google to respond
        process.nextTick(function() {
            //find user based on google id
            Carer.findOne({ 'id' : profile.id }, function(err, user) {
                if (err) {
                    return done(err);
                }   

                if (user) {
                    //login user if found
                    return done(null, user);
                } else {
                    //create a new user
                    var newCarer = new Carer();
                    newCarer.id = profile.id;
                    newCarer.token = accessToken;
                    newCarer.name = profile.displayName;
                    newCarer.email = profile.emails[0].value;

                    newCarer.save(function(err) {
                        if (err) {
                            throw err;
                        }
                        return done(null, newCarer);
                    });
                }      
            });
        });
    });
};

