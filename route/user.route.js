const express   = require('express')
const router     = express.Router()
const controller =   require('../controllers/user.controller');
// const auth = require('../middleware/auth');

// Retrieve a single item with id
    router.post('/list/dt', controller.doDTablesUsers);
    router.post('/add', controller.createUserLogindID);
    router.post('/updatepassword', controller.updatePasswordUserLogindID);
    router.get('/update-password', controller.doFixUserPassword);
    router.post('/update/:id', controller.updateUserLogindID);
    router.get('/edit/:id', controller.editUserLogindID);
    // router.get('/getInvitationCode/:id', controller.getInvitationCode);
    

module.exports = router