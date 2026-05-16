const router = require('express').Router();
const ctrl = require('./vendor.controller');
const { authenticate } = require('../../common/middlewares/auth.middleware');
const { permit } = require('../../common/middlewares/roles.middleware');
const { assertVendorAccess } = require('../../common/middlewares/vendorScope.middleware');
const { validationMiddleware } = require('../../common/middlewares/validation.middleware');
const { createVendor, updateVendor } = require('./vendor.validator');

router.get('/', authenticate, permit('admin'), ctrl.list);
router.post('/', authenticate, permit('admin'), validationMiddleware(createVendor), ctrl.create);
router.get('/:id', authenticate, permit('admin', 'vendor'), assertVendorAccess, ctrl.get);
router.patch('/:id', authenticate, permit('admin'), validationMiddleware(updateVendor), ctrl.update);
router.delete('/:id', authenticate, permit('admin'), ctrl.remove);

module.exports = router;
