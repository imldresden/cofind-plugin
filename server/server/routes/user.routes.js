let express = require('express');
let router = express.Router();
const UserController = require('../controller/userController');
const Logger = require ('../log/logger');

router.use(function timeLog(req, res, next) {
    next();
});

/**
 * return all users
 * # only for reports 
 * input: -
 * output: array of user objects
 */
router.get('/', function (req, res) {
    UserController.all(function (users, msg) {
        if (users) {
            res.status(200).send(users);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * return a user
 * input: user__id
 * output: user object
 */
router.get('/:__id', function (req, res) {
    UserController.one(req.params.__id, function (user, msg) {
        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * return all groups of a user where user is owner
 * input: user__id
 * output: array of group objects
 */
router.get('/:__id/owner/groups', function (req, res) {
    UserController.activeGroupsOwner(req.params.__id, function (groups, msg) {
        if (groups) {
            res.status(200).send(groups);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * return all groups of a user where user is member
 * input: user__id
 * output: array of group objects
 */
router.get('/:__id/member/groups', function (req, res) {
    UserController.activeGroupsMember(req.params.__id, function (groups, msg) {
        if (groups) {
            res.status(200).send(groups);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * add a user
 * input: user request-object
 * output: user object
 */
router.post('/', function (req, res) {
    UserController.signupUser(req.body, function (newUser, msg) {
        if (newUser) {
            res.status(200).send(newUser);
        } else {
            res.status(404).send(msg);
        };
    });
});

/**
 * mark an user as deleted
 * set user.isDeleted = true
 * input: user__id
 * output: user object
 */
router.delete('/:__id', function (req, res) {
    UserController.deleteUser(req.params.__id, function (deletedUser, msg) {
        if (deletedUser) {
            res.status(200).send(deletedUser);
        } else {
            res.status(404).send(msg);
        };
    });
});

/**
 * get access to an user-account
 * input: username, password
 * output: user object
 */
router.get('/login/:username/:password', function (req, res) {
    // Logger.login(req.params.username);
    UserController.loginUser(req.params.username, req.params.password, function (user, msg) {
        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send(msg);
        }
    });
});

router.get('/:__id/logout', function (req, res) {
    UserController.logoutUser(req.params.__id, function (user, msg) {
        if (user) {
            res.status(200).send(msg);
        } else {
            res.status(404).send(msg);
        }
    });
});

// // liefert {groups: []}
// router.get('/:__id/groups', function (req, res) {
//     UserController.groups(req.params.username, function (groups, msg) {
//         if (groups) {
//             res.status(200).send(groups);
//         } else {
//             res.status(404).send(msg);
//         }
//     });
// });

module.exports = router;