const router = require('express').Router();

router.use('/auth', require('../modules/auth/auth.routes.js'));
router.use('/vendors', require('../modules/vendor/vendor.routes'));
router.use('/products', require('../modules/product/product.routes.js'));
router.use('/orders', require('../modules/order/order.routes'));
router.use('/analytics', require('../modules/analytics/analytics.routes'));

router.get('/', (req, res) => res.json({ ok: true, version: '1.0' }));

module.exports = router;
