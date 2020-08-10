const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TabSchema = require('./tab').schema;

const SnapshotSchema = new Schema({
    __id: Schema.Types.ObjectId,
    session: {
        type: Schema.Types.ObjectId, ref: 'Session',
        required: true
    },
    tabs: [{
        type: Schema.Types.ObjectId, ref: 'Tab'
    }]
}, {
    timestamps: true
});
const Snapshot = mongoose.model('Snapshot', SnapshotSchema);
module.exports = Snapshot;