const express = require('express');
const router = require('express-promise-router')(); // () at the end means we're invoking the function straight away

const UsersController = require('../controllers/users')

router.route('/signup')
  .post(UsersController.signUp);

router.route('/signin')
  .post(UsersController.signIn);

router.route('/secret')
  .get(UsersController.secret);

module.exports = router;