const express = require('express');
const router = express.Router();
const controller = require('../controllers/thirdPartyIntegration');

router.post('/', controller.create);
router.get('/:id', controller.findById);
router.get('/business/:businessId', controller.findByBusiness);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
