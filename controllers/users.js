const User = require('../models/user')

module.exports = {
  signUp: async (req, res, next) => {
    // This function will have access to all the body data by calling req.value.body
    // We have to use req.value.body not req.body cause we're using Joi 
    // If result.error exists this function won't be called at all

    const { email, password } = req.value.body;
    // Check if user with same email exists
    const foundUser = await User.findOne({ email });
    if (foundUser) { 
      return res.status(403).json({ error: 'Email is already in use' });
    }
    // Create a new user
    const newUser = new User({ email, password });
    await newUser.save();
    // Respond with token
    res.json({ user: 'created' });
  },

  signIn: async (req, res, next) => {
    // Genereate a token
    
  },

  secret: async (req, res, next) => {
    
  }
}

