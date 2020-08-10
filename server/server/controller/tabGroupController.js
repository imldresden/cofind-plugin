var TabGroup = require('../static/models/tabGroup.js');
var Tab = require('../static/models/tab.js');
var Session = require('../static/models/session.js');

/**
 * adds a new tabGroup
 * input: tabGroup request-object
 * output: tabGroup object
 */
module.exports.add = function (tabGroup, callback) {
    if (!tabGroup.session) callback(null, 'bad request - session not found');
    if (!tabGroup.tabs) callback(null, 'bad request - tabs not found');
    if (tabGroup.session && tabGroup.tabs) {
        // create and save tabs
        for (tab in tabGroup.tabs) {
            tabGroup.tabs[tab] = new Tab(tabGroup.tabs[tab]);
            tabGroup.tabs[tab].save();
        }
        // create and save tabGroup
        let newTabGroup = new TabGroup({
            session: tabGroup.session,
            tabs: tabGroup.tabs
        });
        newTabGroup.save(function () {
            callback(newTabGroup, `created tab-group ${newTabGroup._id}`);
        });
    }
};

/**
 * returns all tabGroups
 * input: -
 * output: array of tabGroups
 */
module.exports.all = function (callback) {
    TabGroup.find({}, function (err, docs) {
        if (err) console.log('could not get tab-groups');
        if (docs) {
            callback(docs, 'tab-groups fetched');
        }
    });
};
/**
 * returns all tabGroups of one session
 * input: session__id
 * output: array of tabGroups
 */
module.exports.allOneSession = function (sessionId, callback) {
    if (!sessionId) callback(null, 'bad request - session not found');
    TabGroup.find({ session__id: sessionId }, function (err, docs) {
        if (err) console.log(`could not get tab-groups for session ${sessionId}`);
        if (docs) {
            callback(docs);
        } else {
            callback(null, `session ${sessionId} does not exist`);
        }
    });
};

/**
 * returns the latest tabGroup of one session
 * input: session__id
 * output: tabGroup object
 */
module.exports.latestOneSession = function (sessionId, callback) {
    if (!sessionId) callback(null, 'bad request - session__id not found');
    TabGroup.findOne({ session: sessionId })
        .sort('-createdAt')
        .exec(function (err, docs) {
            if (err) console.log(`could not get tab-group for session ${sessionId}`);
            if (docs) {
                callback(docs);
            } else {
                callback(null, `session ${sessionId} does not exist`);
            }
        });
};

