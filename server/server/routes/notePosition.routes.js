let express = require('express');
let router = express.Router();
const NotePositionController = require('../controller/notePositionController');

router.use(function timeLog(req, res, next) {
    next();
});

/**
 * return all notePositions
 * # only for reports 
 * input: -
 * output: array of notePosition objects
 */
router.get('/', function (req, res) {
    NotePositionController.all(function (positions, msg) {
        if (positions) {
            res.status(200).send(positions);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * add a notePosition
 * # depricated - add note including notePosition instead
 * input: notePosition request-object
 * output: notePosition object
 */
router.post('/', function(req, res){
    NotePositionController.add(req.body, function (newNotePos, msg) {
        if (newNotePos) {
            res.status(200).send(newNotePos);
        } else {
            res.status(404).send(msg);
        };
    });
});

/**
 * return a notePosition
 * # depricated - fetch note including notePosition instead
 * input: notePosition__id
 * output: notePosition object
 */
router.get('/:__id', function (req, res) {
    NotePositionController.one(req.params.__id, function (notePos, msg) {
        if (notePos) {
            res.status(200).send(notePos);
        } else {
            res.status(404).send(msg);
        }
    });
});

module.exports = router;