var Member = require('../static/models/member');
const SessionController = require('./sessionController');

/**
 * returns all members
 * input: -
 * output: array of member objects
 */
module.exports.all = function (callback) {
    Member.find({}, function (err, docs) {
        if (err) console.log('could not get members');
        if (docs) {
            callback(docs, 'members fetched');
        }
    });
};

/**
 * return a member
 * add a member if not exists
 * input: member request-object
 * output: member object
 */
module.exports.getOrAdd = function (member, callback) {
    if (!member.user) callback(null, 'bad request - user not found');
    if (!member.group) callback(null, 'bad request - group not found');
    if (member.user && member.group) {
        Member.findOne({ user: member.user, group: member.group }, function (err, docs) {
            if (err) console.log('could not get or add member');
            if (docs) {
                callback(docs, '');
            } else {
                let newMember = new Member(member);
                newMember.save(function () {
                    callback(newMember, `created member ${newMember._id}`);
                });
            }
        });
    }
};

/**
 * returns a member
 * input: member__id
 * output: member object
 */
module.exports.oneById = function (memberId, callback) {
    if (!memberId) callback(null, 'bad request - memberId not found');
    if (memberId) {
        Member.findOne({ _id: memberId }, '', function (err, docs) {
            if (err) console.log(`could not get member ${memberId}`);
            if (docs) {
                callback(docs, '');
            } else {
                callback(null, 'member not exists');
            }
        });
    }
};

/**
 * returns a member
 * input: group__id, user__id
 * output: member object
 */
module.exports.one = function (groupId, userId, callback) {
    if (!groupId) callback(null, 'bad request - groupId not found');
    if (!userId) callback(null, 'bad request - userId not found');
    if (groupId && userId) {
        Member.findOne({ group: groupId, user: userId }, '', function (err, docs) {
            if (err) callback(null, `could not get member`);
            if (docs) {
                callback(docs, '');
            } else {
                callback(null, 'member not exists');
            }
        });
    }
};

/**
 * create a session and adds it to member.sessions
 * if old session exists where session.device == session-request.device and session.isActive == true
 *      -> set session.isActive == false
 *      -> create and add new session
 * input: session request-object including session.device object
 * output: session object
 */
module.exports.addSession = function (reqSession, callback) {
    if (!reqSession) callback(null, 'bad request - session request not found');
    if (!reqSession.member) callback(null, 'bad request - member not found');
    if (!reqSession.device) callback(null, 'bad request - device not found');
    if (!reqSession.browserId) callback(null, 'bad request - browserId not found');
    if (!reqSession.device.mac) callback(null, 'bad request - device.mac not found');
    if (reqSession && reqSession.member && reqSession.device && reqSession.browserId && reqSession.device.mac) {
        //get member
        Member.findById(reqSession.member, function (err, docs) {
            if (err) callback(null, `could not add member`);
            if (docs) {
                //close existing session with device if exists
                // console.log("MemberController.addSession ...");
                SessionController.closeWithDevice(reqSession.device.mac, function (closedSessions, msg) {
                    //create session
                    SessionController.add(reqSession, function (session, msg) {
                        if (!session) callback(null, msg);
                        //add session to group<f
                        docs.sessions.push(session._id);
                        docs.save(function () {
                            callback(session, '');
                        });
                    });
                })
            } else {
                callback(null, `member ${reqSession.member} does not exist`);
            }
        });
    }
};

/**
 * returns all members of one group
 * input: group__id
 * output: array of members
 */
module.exports.allOfGroup = function (groupId, callback) {
    if (!groupId) callback(null, 'bad request - groupId not found');
    if (groupId) {
        Member.find({ group: groupId })
            .populate('user')
            .populate('group')
            .exec(function (err, docs) {
                if (err) console.log(`could not get member of group ${groupId}`);
                if (docs) {
                    for (member in docs) {
                        SessionController.allOfMember(docs[member]._id, function (sessions, msg) {
                            docs[member] = docs[member].toObject();
                            docs[member].sessions = sessions;
                        });
                    }
                    callback(docs, '');
                } else {
                    callback(null, 'member not exists');
                }
            });
    }
};

/**
 * set member.isLoggedIn = true
 * input: member__id
 * output: member
 */
module.exports.login = function (memberId, callback) {
    if (!memberId) callback(null, 'bad request - memberId not found');
    if (memberId) {
        Member.findByIdAndUpdate(memberId, { isLoggedIn: true }, { new: true }, function (err, docs) {
            if (err) callback(null, `could not find member ${memberId}`);
            if (docs) {
                callback(docs, `logged in member ${memberId}`);
            } else {
                callback(null, `member ${memberId} does not exist`);
            }
        });
    }
};

/**
 * set member.isLoggedIn = false
 * input: member__id
 * output: member
 */
module.exports.logout = function (memberId, callback) {
    if (!memberId) callback(null, 'bad request - memberId not found');
    if (memberId) {
        Member.findByIdAndUpdate(memberId, { isLoggedIn: false }, { new: true }, function (err, docs) {
            if (err) callback(null, `could not find member ${memberId}`);
            if (docs) {
                // console.log(docs);
                for(let session of docs.sessions){
                    // console.log("MemberController.logout: "+session);
                    // console.log(session);
                    session.isActive = false;
                }
                docs.save(function(){
                    // console.log(docs);
                    callback(docs, `logged out member ${memberId}`);
                })
            } else {
                // console.log("no docs");
                callback(null, `member ${memberId} does not exist`);
            }
        });
    }
};