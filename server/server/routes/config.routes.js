let express = require('express');
let router = express.Router();
const ConfigController = require('../controller/configController');

router.use(function timeLog(req, res, next) {
    next();
});

/**
 * return config object with setup infos (users, group...)
 * input: -
 * output: config objects
 */
router.get('/', function (req, res) {
    ConfigController.getConfig(function (config, msg) {
        if (config) {
            res.status(200).send(config);
        } else {
            res.status(404).send(msg);
        }
    });
});

module.exports = router;