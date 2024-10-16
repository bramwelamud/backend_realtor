const express   = require('express');
const router     = express.Router();
const controller =   require('../controllers/user.controller');
const auth = require('../middleware/auth');

// Retrieve a single item with id
    router.post('/login',controller.doLoginToken);
    router.get('/me',auth.ensureAuthenticated, controller.getUserLoginMe);
    router.post('/signin',controller.doSignInUserLogin);
    router.post('/logout',controller.doLoginLogout);
    router.post('/reset-password',controller.doResetPasswordUserLogin);
    // router.post('/rental-application',controller.doSendApplication)
    router.post
    
module.exports = router