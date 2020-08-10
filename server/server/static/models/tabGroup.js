const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TabSchema = require('./tab').schema;

const TabGroupSchema = new Schema({
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
const TabGroup = mongoose.model('TabGroup', TabGroupSchema);
module.exports = TabGroup;