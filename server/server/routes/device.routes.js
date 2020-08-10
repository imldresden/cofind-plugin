let express = require('express');
let router = express.Router();
const DeviceController = require('../controller/deviceController');

router.use(function timeLog(req, res, next) {
    next();
});

/**
 * return all devices
 * # only for reports 
 * input: -
 * output: array of device objects
 */
router.get('/', function (req, res) {
    DeviceController.all(function (devices, msg) {
        if (devices) {
            res.status(200).send(devices);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * add a device
 * # depricated - add session including device instead
 * input: device request-object
 * output: device object
 */
router.post('/', function(req, res){
    DeviceController.getOrAdd(req.body, function (newDevice, msg) {
        if (newDevice) {
            res.status(200).send(newDevice);
        } else {
            res.status(404).send(msg);
        };
    });
});

/**
 * return a device
 * # depricated - fetch session including device instead
 * input: device__id
 * output: device object
 */
router.get('/:__id', function (req, res) {
    DeviceController.one(req.params.__id, function (device, msg) {
        if (device) {
            res.status(200).send(device);
        } else {
            res.status(404).send(msg);
        }
    });
});

module.exports = router;