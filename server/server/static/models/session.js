const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    __id: Schema.Types.ObjectId,
    member: {
        type: Schema.Types.ObjectId, ref: 'Member'
    },
    device: {
        type: Schema.Types.ObjectId, ref: 'Device'
    },
    browserId: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tabGroups: [{
        type: Schema.Types.ObjectId, ref: 'TabGroup'    
    }],
    snapshots: [{
        type: Schema.Types.ObjectId, ref: 'Snapshot'
    }],
    explicits: [{
        type: Schema.Types.ObjectId, ref: 'Explicit'
    }]
}, {
        timestamps: true
    });
const Session = mongoose.model('Session', SessionSchema);
module.exports = Session;