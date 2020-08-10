var Message = require('../static/models/message.js');
var Group = require('../static/models/group.js');

/**
 * adds a new message
 * input: message request-object
 * output: message object
 */
module.exports.add = function (message, callback) {
    if (!message.group) callback(null, 'bad request - group not found');
    if (!message.user) callback(null, 'bad request - user not found');
    if (!message.message) callback(null, 'bad request - message not found');
    if (message.group && message.user && message.message) {
        let newMessage = new Message(message);
        newMessage.save(function () {
            callback(newMessage, `created message ${newMessage._id}`);
        });
    }
};

/**
 * returns all messages
 * input: -
 * output: array of message objects
 */
module.exports.all = function (callback) {
    Message.find({}, function (err, docs) {
        if (err) console.log('could not get messages');
        if (docs) {
            callback(docs, 'messages fetched');
        }
    });
};

/**
 * returns all messages of one group
 * input: group__id
 * output: array of messages
 */
module.exports.getMessages = function (groupId, callback) {
    Message.find({ "group__id": groupId }, function (err, docs) {
        if (err) console.log(`could not get messages for group ${groupId}`);
        if (docs) {
            callback(docs);
        } else {
            callback(null, `group ${groupId} does not exist`);
        }
    });
};