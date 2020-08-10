const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TabSchema = require('./tab').schema;

const ExplicitSchema = new Schema({
    __id: Schema.Types.ObjectId,
    session: {
        type: Schema.Types.ObjectId, ref: 'Session',
        required: true
    },
    tabs: [{
        type: Schema.Types.ObjectId, ref: 'Tab'
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const Explicit = mongoose.model('Explicit', ExplicitSchema);
module.exports = Explicit;