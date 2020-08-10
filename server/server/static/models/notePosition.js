const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotePositionSchema = new Schema({
    __id: Schema.Types.ObjectId,
    startElementOffsetOfSameType: {
        type: Number,
        required: true
    },
    startElementType: {
        type: String,
        required: true
    },
    startElementInnerOffset: {
        type: Number,
        required: true
    },
    startElementInnerText: {
        type: String,
        required: true
    },
    endElementOffsetOfSameType: {
        type: Number,
        required: true
    },
    endElementType: {
        type: String,
        required: true
    },
    endElementInnerOffset: {
        type: Number,
        required: true
    },
    endElementInnerText: {
        type: String,
        required: true
    },
}, {
        timestamps: true
    });
const NotePosition = mongoose.model('NotePosition', NotePositionSchema);
module.exports = NotePosition;