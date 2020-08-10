const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NotePositionSchema = require('./notePosition').schema;

const NoteSchema = new Schema({
    __id: Schema.Types.ObjectId,
    websiteProposal: {
        type: Schema.Types.ObjectId, ref: 'WebsiteProposal'
    },
    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    notePosition: NotePositionSchema,
    description: {
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
const Note = mongoose.model('Note', NoteSchema);
module.exports = Note;