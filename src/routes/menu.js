const express = require('express');
const router = express.Router();

const menuController = require('../controllers/menuController');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');

router.get('/', menuController.ask);

router.get('/user/', userController.menu);
router.get('/user/trips', userController.trips);
router.get('/user/trips/:id', userController.show);
router.get('/user/qr', userController.qr);

router.get('/user/tickets', userController.tickets);
router.get('/user/tickets/:id', userController.ticket);
router.post('/user/tickets/cancel/:id', userController.cancel);
router.post('/user/trips/buy/:id', userController.buy);

router.get('/user/profile', userController.profile);
router.post('/user/edit/:id', userController.editProfile);

router.get('/admin/', adminController.menu);

router.get('/admin/chivas/', adminController.chivas);
router.get('/admin/chivas/create/', adminController.createChiva);
router.post('/admin/chivas/', adminController.saveChiva);
router.get('/admin/chivas/edit/:id', adminController.editChiva);
router.post('/admin/chivas/update/:id', adminController.updateChiva);
router.get('/admin/chivas/delete/:id', adminController.deleteChiva);

router.get('/admin/trips', adminController.trips);
router.post('/admin/trips', adminController.save);
router.get('/admin/trips/create', adminController.create);
router.get('/admin/trips/delete/:id', adminController.delete);
router.get('/admin/trips/edit/:id', adminController.edit);
router.post('/admin/trips/update/:id', adminController.update);

module.exports = router;