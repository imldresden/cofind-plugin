let express = require('express');
let router = express.Router();
const MemberController = require('../controller/memberController');
const GroupController = require('../controller/groupController');

router.use(function timeLog(req, res, next) {
    next();
});

/**
 * return all members
 * # only for reports 
 * input: -
 * output: array of member objects
 */
router.get('/', function (req, res) {
    MemberController.all(function (members, msg) {
        if (members) {
            res.status(200).send(members);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * add a member
 * # depricated - use post('/:group__id/join/users/:user__id', function (req, res) with body = device request-object instead
 * # only for test purposes
 * input: member request-object
 * output: member object
 */
router.post('/', function(req, res){
    GroupController.addMember(req.body, function (newMember, msg) {
        if (newMember) {
            res.status(200).send(newMember);
        } else {
            res.status(404).send(msg);
        };
    });
});

/**
 * return a member
 * input: member__id
 * output: member object
 */
router.get('/:__id', function (req, res) {
    MemberController.oneById(req.params.__id, function (member, msg) {
        if (member) {
            res.status(200).send(member);
        } else {
            res.status(404).send(msg);
        }
    });
});

module.exports = router;