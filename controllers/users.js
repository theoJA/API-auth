const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../configuration')

// Token generator
signToken = user => {
  return JWT.sign({
    iss: 'TheoJA',
    sub: user.id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)
  }, JWT_SECRET);

};

module.exports = {
  signUp: async (req, res, next) => {
    // This function will have access to all the body data by calling req.value.body
    // We have to use req.value.body not req.body cause we're using Joi 
    // If result.error exists this function won't be called at all

    const { email, password } = req.value.body;
    // Check if user with same email exists
    // Enclosing in quotes is a way to let Mongoose look inside nested objects
    const foundUser = await User.findOne({ "local.email": email });
    if (foundUser) { 
      return res.status(403).json({ error: 'Email is already in use' });
    }
    // Create a new user
    const newUser = new User({ 
      method: 'local',
      local: {
        email: email, 
        password: password 
      }     
    });
    await newUser.save();
    // Generate a token for the new user
    const token = signToken(newUser);
    // Respond with token
    res.status(200).json({ token });
  },

  signIn: async (req, res, next) => {
    // Genereate a token
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  googleOauth: async (req, res, next) => {
    // genereate token
    console.log('req.user', req.user);
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  secret: async (req, res, next) => {
    console.log('I managed to get here!');
    res.json({ title: "Something", secret: "Some resource", etc: "Other stuff" });
  }
}

