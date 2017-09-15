const express = require('express');
const router = require('express-promise-router')(); // () at the end means we're invoking the function straight away
const passport = require('passport');
const passportConf = require('../passport')

const { validateBody, schemas } = require('../helpers/routeHelpers')
const UsersController = require('../controllers/users')

const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/signup')
  .post(validateBody(schemas.authSchema), 
        UsersController.signUp);

router.route('/signin')
  .post(validateBody(schemas.authSchema), 
        passportSignIn, 
        UsersController.signIn);

router.route('/secret')
  .get(passportJWT, 
       UsersController.secret);

module.exports = router;