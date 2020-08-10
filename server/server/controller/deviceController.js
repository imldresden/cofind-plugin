var Device = require('../static/models/device');

/**
 * returns for all devices
 * input: -
 * output: array of device objects
 */
module.exports.all = function (callback) {
    Device.find({}, function (err, docs) {
        if (err) console.log('could not get devices');
        if (docs) {
            callback(docs, 'devices fetched');
        }
    });
};

/**
 * return a device
 * add a device if not existing
 * input: device request-object
 * output: device object
 */
module.exports.getOrAdd = function (device, callback) {
    if (!device.name) callback(null, 'bad request - device-name not found');
    if (!device.mac) callback(null, 'bad request - mac not found');
    if (device.name && device.mac ) {
        Device.findOne({mac: device.mac}, function(err, docs){
            if (err) callback(null, 'could not get or create device');
            if(docs){
                callback(docs, '');
            } else {
                let newDevice = new Device(device);
                newDevice.save(function(){
                    callback(newDevice, `created device ${newDevice.__id}`);
                });
            }
        });
    }
};

/**
 * returns one device
 * input: device__id
 * output: device object
 */
module.exports.one = function (deviceId, callback) {
    if (!deviceId) callback(null, 'bad request - deviceId not found');
    if (deviceId) {
        Device.findOne({ _id: deviceId }, '', function (err, docs) {
            if (err) console.log(`could not get device ${deviceId}`);
            if (docs) {
                callback(docs, '');
            } else {
                callback(null, 'device not exists');
            }
        });
    }
};
