let express = require('express');
let router = express.Router();
const GroupController = require('../controller/groupController');

router.use(function timeLog(req, res, next) {
    next();
});

/**
 * add a group
 * input: group request-object
 * output: group object
 */
router.post('/', function (req, res) {
    GroupController.add(req.body, function (newGroup, msg) {
        if (newGroup) {
            res.status(200).send(newGroup);
        } else {
            res.status(404).send(msg);
        }
        ;
    });
});

/**
 * return all groups without subdocuments
 * # only for reports
 * input: -
 * output: array of group objects
 */
router.get('/', function (req, res) {
    GroupController.all(function (groups, msg) {
        if (groups) {
            res.status(200).send(groups);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * deactivate a group
 * input: group__id
 * output: message as string
 */
router.put('/:__id/deactivate', function (req, res) {
    GroupController.deactivate(req.params.__id, function (group, msg) {
        if (group) {
            res.status(200).send(msg);
        } else {
            res.status(404).send(msg);
        }
        ;
    });
});

/**
 * set a group to isDeleted = true
 * input: group__id
 * output: group object
 */
router.put('/:__id/delete', function (req, res) {
    GroupController.delete(req.params.__id, function (group, msg) {
        if (group) {
            res.status(200).send(group);
        } else {
            res.status(404).send(msg);
        }
        ;
    });
});

/**
 * set a group to isDeleted = false
 * input: group__id
 * output: group object
 */
router.put('/:__id/revive', function (req, res) {
    GroupController.revive(req.params.__id, function (group, msg) {
        if (group) {
            res.status(200).send(group);
        } else {
            res.status(404).send(msg);
        }
        ;
    });
});

/**
 * get all messages for a group
 * input: group__id
 * output: array of message objects
 */
router.get('/:__id/messages', function (req, res) {
    MessageController.getMessages(req.params.__id, function (messages, msg) {
        if (messages) {
            res.status(200).send(messages);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * get a group with latest populated subdocuments
 * - used for updating user view
 * input: group__id
 * output: group object
 */
router.get('/:__id/current', function (req, res) {
    GroupController.getCurrent(req.params.__id, function (group, msg) {
        if (group) {
            res.status(200).send(group);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * get a group with all populated subdocuments
 * - used for reports
 * input: group__id
 * output: group object
 */
router.get('/:__id/all', function (req, res) {
    GroupController.getAll(req.params.__id, function (group, msg) {
        if (group) {
            res.status(200).send(group);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * get the least registered group
 * - used for building userButtons in init landing page
 * input:
 * output: group object
 */
router.get('/latest', function (req, res) {
    GroupController.latest(function (latestGroup, msg) {
        if (latestGroup) {
            GroupController.getGroupEmitObject(latestGroup._id, function(currentGroup, msg){
                if (currentGroup){
                    res.status(200).send(currentGroup);
                } else {
                    res.status(404).send(msg);
                }
            })
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * join a user to a group
 * - get or create device
 * - get or create member
 * - set member.isLoggedIn = true
 * - create session
 * - add session to member.sessions
 * - getCurrent session
 * input: group__id, user__id, device request-object
 * output: current group object
 */
router.post('/:group__id/join/users/:user__id/:browser__id', function (req, res) {
    GroupController.join(req.params.group__id, req.params.user__id, req.params.browser__id, req.body, function (session, msg) {
        if (session) {
            res.status(200).send(session);
        } else {
            console.log(msg);
            res.status(404).send(msg);
        }
    });
});


router.put('/:group__id/logout/users/:user__id', function (req, res) {
    GroupController.logout(req.params.group__id, req.params.user__id, function (group, msg) {
        if (group) {
            res.status(200).send(group);
        } else {
            res.status(404).send(msg);
        }
    });
});
module.exports = router;