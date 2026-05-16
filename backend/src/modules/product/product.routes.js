const router = require('express').Router();
const ctrl = require('./product.controller');
const { authenticate } = require('../../common/middlewares/auth.middleware');
const { permit } = require('../../common/middlewares/roles.middleware');
const { ApiError } = require('../../common/middlewares/error.middleware');
const upload = require('./upload.middleware');
const { createProduct, updateProduct } = require('./product.validator');

const validateProduct = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
    context: { role: req.user?.role }
  });
  if (error) return next(new ApiError(400, 'Validation failed', error.details));
  if (value.categories && typeof value.categories === 'string') {
    try {
      value.categories = JSON.parse(value.categories);
    } catch {
      value.categories = value.categories.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  req.body = value;
  next();
};

router.get('/', authenticate, permit('admin', 'vendor'), ctrl.list);
router.post('/', authenticate, permit('admin', 'vendor'), upload.single('image'), validateProduct(createProduct), ctrl.create);
router.get('/:id', authenticate, permit('admin', 'vendor'), ctrl.get);
router.patch('/:id', authenticate, permit('admin', 'vendor'), upload.single('image'), validateProduct(updateProduct), ctrl.update);
router.delete('/:id', authenticate, permit('admin', 'vendor'), ctrl.remove);

module.exports = router;
