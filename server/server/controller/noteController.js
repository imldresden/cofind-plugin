var Note = require('../static/models/note');
var WebsiteProposal = require('../static/models/websiteProposal.js');
var NotePosition = require('../static/models/notePosition.js');

/**
 * returns all notes
 * input: -
 * output: array of note objects
 */
module.exports.all = function (callback) {
    Note.find({}, function (err, docs) {
        if (err) console.log('could not get notes');
        if (docs) {
            callback(docs, 'notes fetched');
        }
    });
};

/**
 * adds a new note
 * input: note request-object
 * output: note object
 */
module.exports.add = function (note, callback) {
    if (!note.websiteProposal) callback(null, 'bad request - websiteProposal not found');
    if (!note.user) callback(null, 'bad request - user not found');
    if (!note.notePosition) callback(null, 'bad request - notePosition not found');
    if (!note.description) callback(null, 'bad request - description not found');
    if (note.websiteProposal && note.user && note.notePosition && note.description) {
        let newNote = new Note(note);
        newNote.save(function () {
            callback(newNote, `created note ${newNote._id}`);
        });
    }
};

/**
 * returns one note
 * input: note__id
 * output: note object
 */
module.exports.one = function (noteId, callback) {
    if (!noteId) callback(null, 'bad request - noteId not found');
    if (noteId) {
        Note.findOne({ _id: noteId }, '', function (err, docs) {
            if (err) console.log(`could not get note ${noteId}`);
            if (docs) {
                callback(docs, '');
            } else {
                callback(null, 'note not exists');
            }
        });
    }
};

/**
 * deletes a note
 * sets isDeleted = true
 * input: note__id
 * output: note object
 */
module.exports.delete = function (noteId, callback) {
    Note.findByIdAndUpdate(noteId, { isDeleted: true }, { new: true }, function (err, docs) {
        if (err) callback(null, `could not delete note ${noteId}`);
        if (docs) {
            callback(docs, `deleted note ${noteId}`);
        } else {
            callback(null, `note ${noteId} does not exist`);
        }
    });
};
