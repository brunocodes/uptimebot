const router = require('express').Router();
const passport  = require('passport');
require('dotenv').config();
const CLIENT_DASH_PAGE_URL = process.env.CLIENT_DASH_PAGE_URL; 
const CLIENT_HOME_PAGE_URL = process.env.CLIENT_HOME_PAGE_URL;

const authCheck = (req, res, next) => {
  if(!req.user){
      res.redirect('/');
  } else {
      next();
  }
};

// @route   GET auth/discord
// @desc    Passport discord OAth2.0
// @access  Public 
router.get("/discord", passport.authenticate("discord"));

// @route   GET auth/discord/callback
// @desc    Passport discord OAth2.0 callback route
// @access  Private
router.get("/discord/callback", passport.authenticate("discord", { failureRedirect: "/" }), (req, res) => {    
    res.redirect(CLIENT_DASH_PAGE_URL);
});

// @route   GET auth/discord/success
// @desc    User successfully authenticated 
// @access  Private
router.get("/discord/success", authCheck,(req, res) => {  
  res.json({
      user: req.user,
      session: req.session
  });  
});

// @route   GET auth/discord/logout
// @desc    Get All Items
// @access  Private
router.get('/discord/logout', authCheck,(req, res) => {
  req.session.destroy();
  req.logout();  
  res.redirect(CLIENT_HOME_PAGE_URL);
});

module.exports = router;