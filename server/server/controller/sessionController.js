var Session = require('../static/models/session');
var TabGroup = require('../static/models/tabGroup');
var Member = require('../static/models/member.js');
var Session = require('../static/models/session.js');
var Device = require('../static/models/device.js');
const TabGroupController = require('./tabgroupController');
const SnapshotController = require('./snapshotController');
const ExplicitController = require('./explicitController');
const MemberController = require('./memberController');
const ConfigController = require('./configController');

/**
 * returns all sessions
 * input: -
 * output: array of session objects
 */
module.exports.all = function (callback) {
    Session.find({}, function (err, docs) {
        if (err) console.log('could not get sessions');
        if (docs) {
            callback(docs, 'sessions fetched');
        }
    });
};

/**
 * adds a new session
 * - create a device
 * - create a session
 * - add device to session
 * input: session request-object
 * output: session object
 */
module.exports.add = function (session, callback) {
    if (!session.member) callback(null, 'bad request - member not found');
    if (!session.device) callback(null, 'bad request - device not found');
    if (!session.browserId) callback(null, 'bad request - browserId not found');
    if (session.member && session.device && session.browserId) {
        // find member for reference
        Member.findById(session.member, function (err, docs) {
            if (err) callback(null, `could not get member ${session.member}`);
            if (!docs) callback(null, `member ${session.member} not found`);
            // find or create and save device
            Device.findOneAndUpdate({mac: session.device.mac}, session.device, {
                upsert: true,
                new: true
            }, function (err, dev) {
                // save parent doc for reference
                docs.save(function () {
                    // create and save session
                    let newSession = new Session({
                        member: docs._id,
                        device: dev._id,
                        browserId: session.browserId
                    });
                    newSession.save(function () {
                        // return newSession
                        callback(newSession, `created session ${newSession._id}`);
                    });
                });
            });
        });
    }
};

/**
 * close an active session
 * - set session.isActive == false
 * - if session is only session of member - logout member
 * input: session__id
 * output: session object
 */
module.exports.close = function (sessionId, callback) {
    if (!sessionId) callback(null, 'bad request - session__id not found');
    if (sessionId) {
        Session.findOneAndUpdate({_id: sessionId}, {isActive: false}, {upsert: true, new: true}, function (err, docs) {
            if (err) callback(null, `could not get session ${sessionId}`);
            if (docs) {
                console.log("sessionController.close " + docs._id);
                allActiveOfMember(docs.member, function (activeSessions, msg) {
                    if (activeSessions.length < 1) {
                        MemberController.logout(docs.member, function (member, msg) {
                            if (member) {
                                callback(docs, '');
                            } else {
                                callback(null, msg);
                            }
                        });
                    } else {
                        callback(docs, '');
                    }
                });
            } else {
                callback(null, `session ${sessionId} does not exist`);
            }
        });
    }
};

/**
 * close an active session
 * - set session.isActive == false
 * input: mac of a device
 * output: session object
 */
module.exports.closeWithDevice = function (mac, callback) {
    if (!mac) callback(null, 'bad request - mac not found');
    if (mac) {
        // console.log("closeWithMac: "+mac);
        Device.findOne({mac: mac}, function (err, docs) {
            if (err) callback(null, `could not get device ${mac}`);
            if (docs) {
                Session.find({device: docs._id}, function (err, sessions) {
                    if (err) callback(null, `could not get session for device ${docs._id}`);
                    for (session in sessions) {
                        // console.log("SessionController.closeWithDevice: " + sessions[session]._id);
                        sessions[session].isActive = false;
                        sessions[session].save();
                    }
                    callback(sessions, '');
                });
            } else {
                callback(null, `device ${mac} does not exist`);
            }
        });
    }
};

/**
 * create a tabGroup and adds it to session.tabGroups
 * input: tabGroup request-object including tabGroup.tabs object
 * output: tabGroup object
 */
module.exports.addTabGroup = function (reqTabGroup, callback) {
    if (!reqTabGroup.session) callback(null, 'bad request - session not found');
    //get session
    Session.findById(reqTabGroup.session, function (err, docs) {
        if (err) console.log(`could not add tab-group`);
        if (docs) {
            //create message
            TabGroupController.add(reqTabGroup, function (tabGroup, msg) {
                if (!tabGroup) callback(null, msg);
                //add message to group
                docs.tabGroups.push(tabGroup._id);
                docs.save(function () {
                    callback(tabGroup, '');
                });
            });
        } else {
            callback(null, `session ${reqTabGroup.session} does not exist`);
        }
    });
};

/**
 * create a snapshot and adds it to session.snapshots
 * input: snapshot request-object including snapshot.tabs object
 * similar to tabGroup request-object
 * output: tabGroup object
 */
module.exports.addSnapshot = function (reqSnapshot, callback) {
    // console.log("addSnapshot...");
    if (!reqSnapshot.session) callback(null, 'bad request - session not found');
    //get session
    Session.findById(reqSnapshot.session, function (err, docs) {
        if (err) console.log(`could not add snapshot`);
        if (docs) {
            //create message
            SnapshotController.add(reqSnapshot, function (snapshot, msg) {
                if (!snapshot) callback(null, msg);
                //add message to group
                docs.snapshots.push(snapshot._id);
                docs.save(function () {
                    callback(snapshot, '');
                });
            });
        } else {
            callback(null, `session ${reqSnapshot.session} does not exist`);
        }
    });
};

/**
 * create an explicit and adds it to session.explicits
 * input: explicit request-object including explicit.tab object
 * output: explicit object
 */
module.exports.addExplicit = function (reqExplicit, callback) {
    if (!reqExplicit.session) callback(null, 'bad request - session not found');
    //get session
    Session.findById(reqExplicit.session, function (err, docs) {
        if (err) console.log(`could not add snapshot`);
        if (docs) {
            //create message
            ExplicitController.add(reqExplicit, function (explicit, msg) {
                if (explicit == null) {
                    callback(null, msg);
                } else {
                    //add message to group
                    docs.explicits.push(explicit._id);
                    docs.save(function () {
                        callback(explicit, '');
                    });
                }
            });
        } else {
            callback(null, `session ${reqExplicit.session} does not exist`);
        }
    });
};


/**
 * returns one session object
 * input: session__id
 * output: session object
 */
module.exports.one = function (sessionId, callback) {
    if (!sessionId) callback(null, 'bad request - sessionId not found');
    if (sessionId) {
        Session.findOne({_id: sessionId}, '', function (err, docs) {
            if (err) console.log(`could not get session ${sessionId}`);
            if (docs) {
                callback(docs, '');
            } else {
                callback(null, 'session not exists');
            }
        });
    }
};

/**
 * returns all tabGroups of one session
 * input: session__id
 * output: array of tabGroups
 */
module.exports.tabGroups = function (sessionId, callback) {
    if (!sessionId) callback(null, 'bad request - sessionId not found');
    if (sessionId) {
        TabGroup.find({"session__id": sessionId}, '', function (err, docs) {
            if (err) console.log(`could not get tab-groups for session ${sessionId}`);
            if (docs) {
                callback(docs, '');
            } else {
                callback(null, 'sessionId not exists');
            }
        });
    }
};

/**
 * returns all sessions of one member
 * input: member__id
 * output: array of sessions
 */
module.exports.allOfMember = function (memberId, callback) {
    if (!memberId) callback(null, 'bad request - memberId not found');
    if (memberId) {
        Session.find({member: memberId}, '', function (err, docs) {
            if (err) console.log(`could not get members ${memberId}`);
            if (docs) {
                callback(docs, '');
            } else {
                callback(null, 'members not exists');
            }
        });
    }
};

/**
 * returns all active sessions of one member
 * input: member__id
 * output: array of sessions
 */
allActiveOfMember = function (memberId, callback) {
    if (!memberId) callback(null, 'bad request - memberId not found');
    if (memberId) {
        Session.find({member: memberId, isActive: true}, '', function (err, docs) {
            if (err) console.log(`could not get members ${memberId}`);
            if (docs) {
                callback(docs, '');
            } else {
                callback(null, 'members not exists');
            }
        });
    }
};

/**
 * returns true, if a specific tab is shared within a session
 * tab is searched only via url
 * differ between modi:
 * if explicit -> check if the (one and only) explicit.tabs of the session contains tab
 * if snapshot -> check if the latest snapshot of one session contains tab
 * if auto -> always return true, since every opened tab is shared
 * @param sessionId
 * @param url
 * @param callback
 */
module.exports.hasSharedTab = function (sessionId, url, callback) {
    if (!sessionId) callback(null, 'bad request - sessionId not found');
    if (!url) callback(null, 'bad request - url not found');
    if (sessionId && url) {
        ConfigController.getConfig(function (config) {
            switch (config.setup.group.uiMode) {
                case "explicit":
                    ExplicitController.hasSharedTab(sessionId, url, function (tab) {
                        if (tab) {
                            callback(true);
                        } else {
                            callback(false);
                        }
                    });
                    return;
                case "snapshot":
                    SnapshotController.hasSharedTab(sessionId, url, function (tab) {
                        if (tab) {
                            callback(true);
                        } else {
                            callback(false);
                        }
                    });
                    return;
                // auto: always shared
                default:
                    callback(true);
            }
        });
    }
};
