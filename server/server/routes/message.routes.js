let express = require('express');
let router = express.Router();
const MessageController = require('../controller/messageController');
const GroupController = require('../controller/groupController');


router.use(function timeLog(req, res, next) {
    next();
});

/**
 * return all messages
 * # only for reports
 * input: -
 * output: array of message objects
 */
router.get('/', function (req, res) {
    MessageController.all(function (message, msg) {
        if (message) {
            res.status(200).send(message);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * add a message
 * - create message
 * - add message to group.messages
 * input: message request-object
 * output: message object
 */
router.post('/', function(req, res){
    GroupController.addMessage(req.body, function (newMessage, msg){
        if (newMessage) {
            res.status(200).send(newMessage);
        } else {
            res.status(404).send(msg);
        };
    });
});

module.exports = router;