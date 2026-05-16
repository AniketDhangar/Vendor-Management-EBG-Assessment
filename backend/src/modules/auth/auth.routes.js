const express = require('express');
const controller = require('./auth.controller');
const { validationMiddleware } = require('../../common/middlewares/validation.middleware');
const { authenticate } = require('../../common/middlewares/auth.middleware');
const { register, login, refresh, logout } = require('./auth.validator');

const router = express.Router();

router.post('/register', validationMiddleware(register), controller.register);
router.post('/login', validationMiddleware(login), controller.login);
router.post('/refresh', validationMiddleware(refresh), controller.refresh);
router.post('/logout', authenticate, validationMiddleware(logout), controller.logout);
router.get('/me', authenticate, controller.me);

module.exports = router;
