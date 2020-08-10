const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
    __id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        trim: true
    },
    mac: {
        type: String,
        unique: true,
        required: true,
        trim: true
    }
}, {
        timestamps: true
    });
const Device = mongoose.model('Device', DeviceSchema);
module.exports = Device;