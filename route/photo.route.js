const express   = require('express')
const router     = express.Router()
// const controller =   require('../controller/properties.controller');
const photosController =   require('../helpers/app.uploader');



// router.post('/create', controller.createNewPropertyLandlord);
router.post('/photo-upload/:propertyId/:categoryId', photosController.doUploadPhotos);
router.get('/photo-remove/:id', photosController.removeFiles);
// router.post('/docs-upload/:propertyId', photosController.doUploadPhotos);
// router.post('/list/dt', controller.doDTablesUsers);
// router.get('/user-agreement/:id', controller.getLoginLandlord);
// router.post('/create-agreement', controller.registerCompanyLandlord);
// router.post('/view-agreement/:landlordId', companyController.findContractNoCompanyLandlordId);
module.exports = router