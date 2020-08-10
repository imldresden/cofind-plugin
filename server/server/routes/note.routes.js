let express = require('express');
let router = express.Router();
const NoteController = require('../controller/noteController');
const WebsiteProposalController = require('../controller/websiteProposalController');

router.use(function timeLog(req, res, next) {
    next();
});

/**
 * return all note
 * # only for reports
 * input: -
 * output: array of note objects
 */
router.get('/', function (req, res) {
    NoteController.all(function (notes, msg) {
        if (notes) {
            res.status(200).send(notes);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * add a note
 * - create note including notePosition
 * - add note to websiteProposal.notes
 * input: note request-object including notePosition request-object
 * output: note object
 */
router.post('/', function (req, res) {
    // WebsiteProposalController.addNote
    WebsiteProposalController.addNote(req.body, function (note, msg) {
        if (note) {
            res.status(200).send(note);
        } else {
            res.status(404).send(msg);
        };
    });
});

/**
 * return a note including notePosition
 * input: note__id
 * output: note object
 */
router.get('/:__id', function (req, res) {
    NoteController.one(req.params.__id, function (note, msg) {
        if (note) {
            res.status(200).send(note);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * set a note to isDeleted = true
 * input: note__id
 * output: note object
 */
router.put('/:__id/delete', function (req, res) {
    NoteController.delete(req.params.__id, function (note, msg) {
        if (note) {
            res.status(200).send(note);
        } else {
            res.status(404).send(msg);
        };
    });
});

module.exports = router;