var NotePosition = require('../static/models/notePosition');

/**
 * returns all notePositions
 * input: -
 * output: array of notePosition objects
 */
module.exports.all = function (callback) {
    NotePosition.find({}, function (err, docs) {
        if (err) console.log('could not get note-position');
        if (docs) {
            callback(docs, 'note-position fetched');
        }
    });
};

/**
 * adds a new notePosition
 * input: notePosition request-object
 * output: notePosition object
 */
module.exports.add = function (notePos, callback) {
    if (!notePos.startElementOffsetOfSameType ||
        !notePos.startElementType ||
        !notePos.startElementInnerOffset ||
        !notePos.startElementInnerText ||
        !notePos.endElementOffsetOfSameType ||
        !notePos.endElementType ||
        !notePos.endElementInnerOffset ||
        !notePos.endElementInnerText
    ) {
        callback(null, 'bad request - note-position not valid');
    } else {
        let newNotePos = new NotePosition(notePos);
        newNotePos.save(function () {
            callback(newNotePos, `created device ${newNotePos._id}`);
        });
    }
};

/**
 * returns one notePosition
 * input: notePosition__id
 * output: notePosition object
 */
module.exports.one = function (notePosId, callback) {
    if (!notePosId) callback(null, 'bad request - notePosId not found');
    if (notePosId) {
        NotePosition.findOne({ _id: notePosId }, '', function (err, docs) {
            if (err) console.log(`could not get note-position ${notePosId}`);
            if (docs) {
                callback(docs, '');
            } else {
                callback(null, 'note-position not exists');
            }
        });
    }
};
