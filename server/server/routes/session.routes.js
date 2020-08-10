let express = require('express');
let router = express.Router();
const SessionController = require('../controller/sessionController');
const TabGroupController = require('../controller/tabGroupController');
const MemberController = require('../controller/memberController');

router.use(function timeLog(req, res, next) {
    next();
});

/**
 * return all sessions
 * # only for reports 
 * input: -
 * output: array of session objects
 */
router.get('/', function (req, res) {
    SessionController.all(function (devices, msg) {
        if (devices) {
            res.status(200).send(devices);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * add a session
 * input: session request-object including device request-object
 * output: session object
 */
router.post('/', function (req, res) {
    MemberController.addSession(req.body, function (newSession, msg) {
        if (newSession) {
            res.status(200).send(newSession);
        } else {
            res.status(404).send(msg);
        };
    });
});

/**
 * return a session
 * input: session__id
 * output: session object
 */
router.get('/:__id', function (req, res) {
    SessionController.one(req.params.__id, function (device, msg) {
        if (device) {
            res.status(200).send(device);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * return all tabGroups of one session
 * # only for reports 
 * input: session__id
 * output: array of tabGroup objects
 */
router.get('/:__id/tab-groups', function (req, res) {
    TabGroupController.allOneSession(req.params.__id, function (tabGroups, msg) {
        if (tabGroups) {
            res.status(200).send(tabGroups);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * return the latest tabGroup of one session
 * input: session__id
 * output: tabGroup object
 */
router.get('/:__id/tab-groups/latest', function (req, res) {
    TabGroupController.latestOneSession(req.params.__id, function (tabGroup, msg) {
        if (tabGroup) {
            res.status(200).send(tabGroup);
        } else {
            res.status(404).send(msg);
        }
    });
});

router.put('/:__id/close', function (req, res) {
    SessionController.close(req.params.__id, function (session, msg) {
        if (session) {
            res.status(200).send(session);
        } else {
            res.status(404).send(msg);
        }
    });
});

module.exports = router;