const express = require('express');
const services = require('../services/drawServices');

const router = express.Router();

router.get('/new',services.getCurrentDraw);

module.exports = router;