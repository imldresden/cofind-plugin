const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WebsiteProposalSchema = new Schema({
    __id: Schema.Types.ObjectId,
    group: {
        type: Schema.Types.ObjectId, ref: 'Group'
    },
    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    notes: [{
        type: Schema.Types.ObjectId, ref: 'Note'
    }]
}, {
    timestamps: true
});
const WebsiteProposal = mongoose.model('WebsiteProposal', WebsiteProposalSchema);
module.exports = WebsiteProposal;