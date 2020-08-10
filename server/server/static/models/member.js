const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
    __id: Schema.Types.ObjectId,
    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    group: {
        type: Schema.Types.ObjectId, ref: 'Group'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    sessions: [{
        type: Schema.Types.ObjectId, ref: 'Session'
    }]
}, {
    timestamps: true
});
const Member = mongoose.model('Member', MemberSchema);
module.exports = Member;