const router = require('express').Router();
const ctrl = require('./analytics.controller');
const { authenticate } = require('../../common/middlewares/auth.middleware');
const { permit } = require('../../common/middlewares/roles.middleware');

router.get('/totals', authenticate, permit('admin'), ctrl.totals);
router.get('/monthly', authenticate, permit('admin'), ctrl.monthly);

module.exports = router;
