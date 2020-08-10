var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var GroupSchema = new Schema({
  __id: Schema.Types.ObjectId,
  user: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  uiMode: {
    type: String,
    enum: ['auto', 'explicit', 'snapshot']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  members: [{
    type: Schema.Types.ObjectId, ref: 'Member'
  }],
  websiteVisits: [{
    type: Schema.Types.ObjectId, ref: 'WebsiteVisit'
  }],
  websiteProposals: [{
    type: Schema.Types.ObjectId, ref: 'WebsiteProposal'
  }],
  messages: [{
    type: Schema.Types.ObjectId, ref: 'Message'
  }]
}, {
    timestamps: true
  });
var Group = mongoose.model('Group', GroupSchema);
module.exports = Group;