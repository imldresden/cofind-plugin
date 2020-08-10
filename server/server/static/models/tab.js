const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TabSchema = new Schema({
    __id: Schema.Types.ObjectId,
    number: {
        type: Number,
        required: true
    },
    moz_number: {
        type: Number
    },
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const Tab = mongoose.model('Tab', TabSchema);
module.exports = Tab;