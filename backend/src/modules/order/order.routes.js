const router = require('express').Router();
const ctrl = require('./order.controller');
const { authenticate } = require('../../common/middlewares/auth.middleware');
const { permit } = require('../../common/middlewares/roles.middleware');
const { ApiError } = require('../../common/middlewares/error.middleware');
const { createOrder, updateOrderStatus } = require('./order.validator');

const validateOrder = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
    context: { role: req.user?.role }
  });
  if (error) return next(new ApiError(400, 'Validation failed', error.details));
  req.body = value;
  next();
};

router.get('/', authenticate, permit('admin', 'vendor'), ctrl.list);
router.post('/', authenticate, permit('admin', 'vendor'), validateOrder(createOrder), ctrl.create);
router.get('/:id', authenticate, permit('admin', 'vendor'), ctrl.get);
router.patch('/:id/status', authenticate, permit('admin', 'vendor'), validateOrder(updateOrderStatus), ctrl.updateStatus);
router.delete('/:id', authenticate, permit('admin'), ctrl.remove);

module.exports = router;
