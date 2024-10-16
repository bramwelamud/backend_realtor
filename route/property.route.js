const express   = require('express')
const router     = express.Router()
const controller =   require('../controllers/user.controller');
const photosController =   require('../helpers/app.uploader');



router.post('/create', controller.createNewPropertyLandlord);
router.get('/list/view', controller.getListViewProperties);
router.post('/view/:idReg', controller.viewPropertyLandlord);
router.post('/update/:idReg', controller.updatePropertyLandlord);
router.post('/delete/:idReg', controller.deletePropertyLandlord);
router.post('/photo-upload/:idReg', photosController.doUploadPhotos);
router.post('/list/dt', controller.doDTProperties);
// router.get('/user-agreement/:id', controller.getLoginLandlord);
// router.post('/create-agreement', controller.registerCompanyLandlord);
// router.post('/view-agreement/:landlordId', companyController.findContractNoCompanyLandlordId);
module.exports = router