const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WebsiteVisitSchema = new mongoose.Schema({
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
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
});
const WebsiteVisit = mongoose.model('WebsiteVisit', WebsiteVisitSchema);
module.exports = WebsiteVisit;