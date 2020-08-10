let express = require('express');
let router = express.Router();
const TabGroupController = require('../controller/tabGroupController');
const SessionController = require('../controller/sessionController');

router.use(function timeLog(req, res, next) {
    next();
});

/**
 * return all tabGroups
 * # only for reports 
 * input: -
 * output: array of tabGroup objects
 */
router.get('/', function (req, res) {
    TabGroupController.all(function (tabGroups, msg) {
        if (tabGroups) {
            res.status(200).send(tabGroups);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * add a tabGroup
 * input: tabGroup request-object including an array of tab request-objects
 * output: tabGroup object
 */
router.post('/', function(req, res){
    SessionController.addTabGroup(req.body, function (newTabGroup, msg) {
        if (newTabGroup) {
            res.status(200).send(newTabGroup);
        } else {
            res.status(404).send(msg);
        };
    });
});

module.exports = router;