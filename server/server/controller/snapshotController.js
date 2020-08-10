var Snapshot = require('../static/models/snapshot.js');
var Tab = require('../static/models/tab.js');
var Session = require('../static/models/session.js');

/**
 * adds a new snapshot
 * input: snapshot request-object
 * output: snapshot object
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
        let newSnapshot = new Snapshot({
            session: tabGroup.session,
            tabs: tabGroup.tabs
        });
        newSnapshot.save(function () {
            callback(newSnapshot, `created snapshot ${newSnapshot._id}`);
        });
    }
};

/**
 * returns the latest snapshot of one session
 * old snapshots are overwritten by the latest one
 * input: session__id
 * output: snapshot object
 */
latestOneSession = function (sessionId, callback) {
    if (!sessionId) callback(null, 'bad request - session__id not found');
    Snapshot.findOne({session: sessionId})
        .sort('-createdAt')
        .populate('tabs')
        .exec(function (err, docs) {
            if (err) console.log(`could not get snapshot for session ${sessionId}`);
            if (docs) {
                callback(docs);
            } else {
                callback(null, `session ${sessionId} does not exist`);
            }
        });
};
module.exports.latestOneSession = latestOneSession;

/**
 * check if current tab is already shared in latest snapshot
 * @param sessionId
 * @param url
 * @param callback
 */
module.exports.hasSharedTab = function (sessionId, url, callback) {
    latestOneSession(sessionId, function (snapshot, msg) {
        if (snapshot) {
            for (var tab in snapshot.tabs) {
                if (snapshot.tabs[tab].url.localeCompare(url) == 0) {
                    callback(snapshot.tabs[tab]);
                    break;
                } else {
                    if (tab == snapshot.tabs.length - 1) {
                        callback(null);
                        break;
                    }
                }
            }
        } else {
            callback(null);
        }
    })
}
