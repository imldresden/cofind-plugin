const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    __id: Schema.Types.ObjectId,
    group: {
        type: Schema.Types.ObjectId, ref: 'Group'
    },
    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    // dateTime: {
    //     type: Date,
    //     default: Date.now()
    // },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;