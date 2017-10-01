const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const { JWT_SECRET } = require('./configuration')
const User = require('./models/user')

// JWT STRATEGY
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: JWT_SECRET
}, async (payload, done) => {
  try {
    // Find the user specified in token
    const user = await User.findById(payload.sub);
    // If user doesn't exist, handle it
    if (!user) {
      return done(null, false);
    }
    // Otherwise return the user
    done(null, user);
    
  } catch(error) {
    done(error, false);
  }
}));

// GOOGLE OAUTH STRATEGY
passport.use('googleToken', new GooglePlusTokenStrategy({
  clientID: '634344244963-ljul6t02crrajg1eolmll2235k3kmtq1.apps.googleusercontent.com',
  clientSecret: 'OcSjitrUIcjZc2wbTZ4X09AP'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // console.log('accessToken', accessToken)
    // console.log('refreshToken', refreshToken)
    // console.log('profile', profile)
  
    // Check whether this current user exists in our DB
    const existingUser = await User.findOne({ "google.id": profile.id });
    if (existingUser) {
      console.log('User already exists in our DB');
      return done(null, existingUser);
    }

    // escape \ very useful for using ' inside a string!
    console.log('User doesn\'t exist, we\'re creating a new one');
  
    // If new account
    const newUser = new User({
      method: 'google',
      google: {
        id: profile.id,
        email: profile.emails[0].value
      }
    });
    await newUser.save();
    done(null, newUser);

  } catch(error) {
    done(error, false, error.message);
  }
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    // Find the user given the email
    const user = await User.findOne({ "local.email": email });
    // If not, handle it
    if (!user) {
      return done(null, false);
    }
    // Check if the password is correct
    const isMatch = await user.isValidPassword(password);
    // If not, handle it
    if (!isMatch) {
      return done(null, false);
    }
    // Otherwise, return the user
    done(null, user);

  } catch(error) {
    done(error, false);
  }
}));