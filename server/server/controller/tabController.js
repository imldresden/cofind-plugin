var Tab = require('../static/models/tab.js');
var Group = require('../static/models/group.js');

/**
 * adds a new tab
 * depricated !!! - use tabGroups instead
 * input: tab request-object
 * output: tab object
 */
module.exports.add = function (tab, callback) {
    if (!tab.session) callback(null, 'bad request - session not found');
    if (!tab.number) callback(null, 'bad request - number not found');
    if (!tab.url) callback(null, 'bad request - url not found');
    if (!tab.title) callback(null, 'bad request - title not found');
    if (tab.session && tab.number && tab.url && tab.title) {
        let newTab = new Tab(tab);
        newTab.save(function() {
            callback(newTab, `created tab ${newTab._id}`);
        });
    }
};

/**
 * returns all tabs
 * input: -
 * output: array of tabs
 */
module.exports.all = function (callback) {
    Tab.find({}, function (err, docs) {
        if (err) console.log('could not get tabs');
        if (docs) {
            callback(docs, 'tabs fetched');
        }
    });
};

/**
 * returns all tabs of one session
 * depricated !!! - use tabGroups instead
 * input: session__id
 * output: array of tabs
 */
module.exports.getTabs = function(sessionId, callback) {
    if(!sessionId) callback(null, 'bad request - session__id not found');
    Tab.findById(sessionId, function (err, docs) {
        if (err) console.log(`could not get tabs for session ${sessionId}`);
        if (docs) {
            callback(docs);
        } else {
            callback(null, `session ${sessionId} does not exist`);
        }
    });
};

