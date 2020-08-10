var Group = require('../static/models/group.js');
var Member = require('../static/models/member.js');
var TabGroup = require('../static/models/tabGroup.js');
var Tab = require('../static/models/tab.js');
const MemberController = require('./memberController');
const MessageController = require('./messageController');
const WebsiteVisitController = require('./websiteVisitController');
const WebsiteProposalController = require('./websiteProposalController');
const UserController = require('./userController');


/**
 * adds a new group
 * input: group request-object
 * output: device object
 */
module.exports.add = function (group, callback) {
    if (!group.name) callback(null, 'bad request - groupname not found');
    if (!group.description) callback(null, 'bad request - description not found');
    if (!group.user) callback(null, 'bad request - user not found');
    if (group.name && group.description && group.user) {
        let newGroup = new Group(group);
        newGroup.save(function () {
            callback(newGroup, `created group ${newGroup._id}`);
        });
    }
};

/**
 * returns all groups
 * input: -
 * output: array of group objects
 */
module.exports.all = function (callback) {
    Group.find({}, function (err, docs) {
        if (err) console.log('could not get groups');
        if (docs) {
            callback(docs, '');
        } else {
            callback(null, 'no groups existing');
        }
    });
};

/**
 * returns the first of all groups
 * input: -
 * output: group objects
 */
module.exports.first = function (callback) {
    Group.find({}, function (err, docs) {
        if (err) console.log('could not get groups');
        if (docs) {
            callback(docs[0], '');
        } else {
            callback(null, 'no groups existing');
        }
    });
};
/**
 * returns the latest of all groups
 * input: -
 * output: group objects
 */
module.exports.latest = function (callback) {
    // if createdAt doesn´t work... try: _id: -1
    Group.findOne().sort({createdAt: -1}).exec(function (err, group) {
        if (err) console.log('could not get group');
        if (group) {
            callback(group, '');
        } else {
            callback(null, 'no groups existing');
        }
    });
};

/**
 * returns the latest of all groupId´s
 * input: -
 * output: group objects
 */
getLatestId = function (callback) {
    // if createdAt doesn´t work... try: _id: -1
    Group.findOne({}, "id").sort({createdAt: -1}).exec(function (err, groupId) {
        if (err) console.log('could not get group');
        if (groupId) {
            callback(groupId, '');
        } else {
            callback(null, 'no groups existing');
        }
    });
};

/**
 * deactivates a group
 * sets isActive = false
 * input: group__id
 * output: group object
 */
module.exports.deactivate = function (groupId, callback) {
    Group.findOne({"_id": groupId}, '', function (err, docs) {
        if (err) console.log(`could not deactivate group ${groupId}`);
        if (docs) {
            docs.isActive = false;
            docs.save(function () {
                callback(docs, `deactivated group ${docs._id}`);
            });
        } else {
            callback(null, `group ${groupId} does not exist`);
        }
    });
};

/**
 * activates a group
 * sets isActive = true
 * input: group__id
 * output: group object
 */
module.exports.activate = function (groupId, callback) {
    Group.findOne({"_id": groupId}, '', function (err, docs) {
        if (err) console.log(`could not deactivate group ${groupId}`);
        if (docs) {
            docs.isActive = true;
            docs.save(function () {
                callback(docs, `activated group ${docs._id}`);
            });
        } else {
            callback(null, `group ${groupId} does not exist`);
        }
    });
};

/**
 * deletes a group
 * sets isDeleted = true
 * input: group__id
 * output: group object
 */
module.exports.delete = function (groupId, callback) {
    Group.findByIdAndUpdate(groupId, {isDeleted: true}, {new: true}, function (err, docs) {
        if (err) callback(null, `could not delete group ${groupId}`);
        if (docs) {
            callback(docs, `deleted group ${groupId}`);
        } else {
            callback(null, `group ${groupId} does not exist`);
        }
    });
};

/**
 * revive a group
 * sets isDeleted = false
 * input: group__id
 * output: group object
 */
module.exports.revive = function (groupId, callback) {
    Group.findByIdAndUpdate(groupId, {isDeleted: false}, {new: true}, function (err, docs) {
        if (err) callback(null, `could not revive group ${groupId}`);
        if (docs) {
            callback(docs, `revived group ${groupId}`);
        } else {
            callback(null, `group ${groupId} does not exist`);
        }
    });
};

/**
 * returns a group
 * input: group__id
 * output: group object
 */
module.exports.one = function (groupId, callback) {
    Group.findOne({_id: groupId}, '', function (err, docs) {
        if (err) console.log(`could not get group ${groupId}`);
        if (docs) {
            callback(docs, ``);
        } else {
            callback(null, `group ${groupId} does not exist`);
        }
    });
};

/**
 * return a group with all populated corresponding data
 * input: group__id
 * output: group object
 */
module.exports.getAll = function (groupId, callback) {
    Group.findById(groupId)
        //populate: add subdocuments to group object, instead of simple id´s
        .populate('user')
        // // .populate('members') user path
        .populate({path: 'members', populate: {path: 'user'}})
        // // .populate('members') tabGroups path
        .populate({
            path: 'members', populate: {path: 'sessions', populate: {path: 'tabGroups', populate: {path: 'tabs'}}}
        })
        // // .populate('members') device path
        .populate({
            path: 'members', populate: {path: 'sessions', populate: {path: 'device'}}
        })
        // // .populate('messages')
        .populate({path: 'messages', populate: {path: 'user'}})
        // .populate('websiteVisits')
        .populate({path: 'websiteVisits', populate: {path: 'user'}})
        // .populate('websiteProposals') notes path
        .populate({path: 'websiteProposals', populate: {path: 'notes', populate: {path: 'user'}}})
        // .populate('websiteProposals') user path
        .populate({path: 'websiteProposals', populate: {path: 'user'}})
        .exec(function (err, docs) {
            if (err) console.log(`could not get group ${groupId}`);
            if (docs) {
                callback(docs, '');
            } else {
                callback(null, 'group does not exist');
            }
        });
};

/**
 * return a groupEmitObject
 * >>> used for communication via websockets - the one and only <<<
 * get current group
 * add detailProposals for detailPage
 * * @param groupId
 * @param callback
 */
module.exports.getGroupEmitObject = (groupId, callback) => {
    getCurrent(groupId, function (currentGroup, msg) {
        if (!currentGroup) {
            callback(null, msg);
        } else {
            WebsiteProposalController.allForDetails(groupId, function (detailProposals, msg) {
                if (!detailProposals) {
                    // console.log(msg);
                    callback(currentGroup, msg);
                } else {
                    currentGroup["detailProposals"] = detailProposals;
                    callback(currentGroup, msg);
                }
            });
        }
    });
}

/**
 * return a group with the latest populated corresponding data
 * - only logged members
 * - only active sessions
 * - only latest tabGroups
 * - only not deleted wesiteProposals
 * input: group__id
 * output: group object
 */
getCurrent = function (groupId, callback) {
    Group.findById(groupId)
        //populate: add subdocuments to group object, instead of simple id´s
        //always hide user password
        .populate('user', '-password')
        // // .populate('members') user path
        .populate({path: 'members', populate: {path: 'user', select: '-password'}})
        // // .populate('members') tabGroups path
        .populate({
            path: 'members',
            populate: {
                path: 'sessions',
                match: {isActive: 'true'},
                populate: {path: 'tabGroups', options: {sort: {createdAt: -1}, limit: 1}, populate: {path: 'tabs'}}
            }
        })

        // // .populate('members') snapshot path
        .populate({
            path: 'members',
            populate: {
                path: 'sessions',
                match: {isActive: 'true'},
                populate: {path: 'snapshots', options: {sort: {createdAt: -1}, limit: 1}, populate: {path: 'tabs'}}
            }
        })
        // // .populate('members') explicit path
        .populate({
            path: 'members',
            populate: {
                path: 'sessions',
                match: {isActive: 'true'},
                populate: {
                    path: 'explicits',
                    options: {sort: {createdAt: -1}, limit: 1},
                    populate: {path: 'tabs', match: {isDeleted: "false"}}
                }
            }
        })

        // // .populate('members') device path
        .populate({
            path: 'members', populate: {path: 'sessions', match: {isActive: 'true'}, populate: {path: 'device'}}
        })
        // // .populate('messages')
        .populate({path: 'messages', populate: {path: 'user', select: '-password'}})
        // .populate('websiteVisits')
        .populate({path: 'websiteVisits', populate: {path: 'user', select: '-password'}})
        // .populate('websiteProposals') notes path - only isDeleted: true
        .populate({
            path: 'websiteProposals',
            match: {isDeleted: 'false'},
            populate: {path: 'notes', populate: {path: 'user', select: '-password'}}
        })
        // .populate('websiteProposals') user path - only isDeleted: true
        .populate({
            path: 'websiteProposals',
            match: {isDeleted: 'false'},
            populate: {path: 'user', select: '-password'}
        })
        .lean()
        .exec(function (err, docs) {
            if (err) console.log(`getCurrent: could not get group ${groupId}`);
            if (docs) {
                callback(docs, '');
            } else {
                callback(null, 'get current: group does not exist');
            }
        });
};
module.exports.getCurrent = getCurrent;


/**
 * return a group with the latest populated corresponding data
 * used for consoleLogger
 * input: group__id
 * output: group object
 */
module.exports.getFull = function (groupId, callback) {
    Group.findById(groupId)
        //populate: add subdocuments to group object, instead of simple id´s
        .populate('user')
        .populate({path: 'members', populate: {path: 'user'}})
        .populate({
            path: 'members',
            populate: {
                path: 'sessions',
                populate: {path: 'tabGroups', options: {sort: {createdAt: -1}}, populate: {path: 'tabs'}}
            }
        })
        .populate({
            path: 'members',
            populate: {
                path: 'sessions',
                populate: {path: 'snapshots', options: {sort: {createdAt: -1}}, populate: {path: 'tabs'}}
            }
        })
        .populate({
            path: 'members',
            populate: {
                path: 'sessions',
                populate: {
                    path: 'explicits',
                    options: {sort: {createdAt: -1}},
                    populate: {path: 'tabs'}
                }
            }
        })

        .populate({
            path: 'members', populate: {path: 'sessions', populate: {path: 'device'}}
        })
        .populate({path: 'messages', populate: {path: 'user'}})
        .populate({path: 'websiteVisits', populate: {path: 'user'}})
        .populate({
            path: 'websiteProposals',
            populate: {path: 'notes', populate: {path: 'user'}}
        })
        .populate({
            path: 'websiteProposals',
            populate: {path: 'user'}
        })
        .lean()
        .exec(function (err, docs) {
            if (err) console.log(`getCurrent: could not get group ${groupId}`);
            if (docs) {
                callback(docs, '');
            } else {
                callback(null, 'getFullGroup: group does not exist');
            }
        });
};

/**
 * create a member if not exissts and adds it to group.members
 * if member exists - return existing member
 * input: member request-object
 * output: member object
 */
getOrAddMember = function (reqMember, callback) {
    if (!reqMember.group) callback(null, 'bad request - group not found');
    if (!reqMember.user) callback(null, 'bad request - user not found');
    if (reqMember.group && reqMember.user) {
        //check if member exists
        Member.findOne({group: reqMember.group, user: reqMember.user}, function (err, docs) {
            //if member exists - return existing member
            if (docs) {
                callback(docs, '');
                //if member not exists - add new member
            } else {
                //get group
                Group.findById(reqMember.group, function (err, docs) {
                    if (err) console.log(`could not add member`);
                    if (docs) {
                        //create member
                        MemberController.getOrAdd(reqMember, function (member, msg) {
                            if (!member) callback(null, msg);
                            //add member to group
                            docs.members.push(member._id);
                            docs.save(function () {
                                callback(member, '');
                            });
                        });
                    } else {
                        callback(null, `group ${reqMember.group} does not exist`);
                    }
                });
            }
        });
    }
};
module.exports.addMember = getOrAddMember;

/**
 * create a message and adds it to group.messages
 * input: message request-object
 * output: message object
 */
module.exports.addMessage = function (reqMessage, callback) {
    if (!reqMessage.group) callback(null, 'bad request - group not found');
    //get group
    Group.findById(reqMessage.group, function (err, docs) {
        if (err) console.log(`could not add message`);
        if (docs) {
            //create message
            MessageController.add(reqMessage, function (message, msg) {
                if (!message) callback(null, msg);
                //add message to group
                docs.messages.push(message._id);
                docs.save(function () {
                    callback(message, '');
                });
            });
        } else {
            callback(null, `group ${reqMessage.group} does not exist`);
        }
    });
};

/**
 * create a websiteVisit and adds it to group.websiteVisits
 * input: websiteVisit request-object
 * output: websiteVisit object
 */
module.exports.addWebsiteVisit = function (reqVisit, callback) {
    if (!reqVisit.group) callback(null, 'bad request - group not found');
    //get group
    Group.findById(reqVisit.group, function (err, docs) {
        if (err) console.log(`could not add website-visit`);
        if (docs) {
            //create websiteVisit
            WebsiteVisitController.add(reqVisit, function (visit, msg) {
                if (!visit) callback(null, msg);
                //add websiteVisit to group
                docs.websiteVisits.push(visit._id);
                docs.save(function () {
                    callback(visit, '');
                });
            });
        } else {
            callback(null, `group ${reqVisit.group} does nots exist`);
        }
    });
};


/**
 * check if group.websitePorposals contains websitePorposal._id
 * if no -> add websitePorposal._id
 * input: group document, websiteProposal._id
 * output: group
 */
addProposalToGroup = function (group, proposalId, callback) {
    if (group.websiteProposals.indexOf(proposalId) < 0) {
        group.websiteProposals.push(proposalId);
    }
    callback(group);
}

/**
 * create a websiteProposal and adds it to group.websiteProposals
 * if proposal contains notes -> add notes to new websiteProposal
 * if proposal already exists -> return existing proposal and msg
 * input: websiteProsposal request-object including note request-objects
 * output: websiteProposal object
 */
module.exports.addWebsiteProposal = function (reqProposal, callback) {
    if (!reqProposal.group) callback(null, 'bad request - group not found');
    if (!reqProposal.link) callback(null, 'bad request - link not found');
    Group.findById(reqProposal.group, function (err, docs) {
        if (err) console.log(`could not add website-proposal`);
        if (docs) {
            //create websiteProposal
            WebsiteProposalController.getOrAdd(reqProposal, function (proposal, note, msg) {
                if (!proposal) callback(null, msg);
                if (proposal) {
                    //add websiteProposal to group
                    addProposalToGroup(docs, proposal._id, function (group) {
                        //return new or modified proposal
                        group.save(function () {
                            callback(proposal, note, '');
                        });
                    });
                }
            });
        } else {
            callback(null, null, `group ${reqProposal.group} does nots exist`);
        }
    });
};

/**
 * join a user to a group
 * - get or create device
 * - get or create member
 * - set member.isLoggedIn = true
 * - create session
 * - add session to member.sessions
 * - getCurrent group
 * input: group__id, user__id, device request-object
 * output: current group object
 */
module.exports.join = function (groupId, userId, browserId, reqDevice, callback) {
    // console.log(groupId);
    // console.log(userId);
    // console.log(browserId);
    // console.log(reqDevice);
    if (!userId) callback(null, 'bad request - user not found');
    if (!groupId) callback(null, 'bad request - group not found');
    if (!browserId) callback(null, 'bad request - browserId not found');
    if (!reqDevice) callback(null, 'bad request - device not found');
    if (userId && groupId && browserId && reqDevice) {
        UserController.one(userId, function (user, msg) {
            if (user) {
                let reqMember =
                    {
                        user: userId,
                        group: groupId
                    };
                getOrAddMember(reqMember, function (member, msg) {
                    if (!member) callback(null, msg);
                    if (member) {
                        MemberController.login(member._id, function (member, msg) {
                            if (member) {
                                let reqSession =
                                    {
                                        member: member._id,
                                        device: reqDevice,
                                        browserId: browserId
                                    };
                                MemberController.addSession(reqSession, function (session, msg) {
                                    if (!session) callback(null, msg);
                                    if (session) {
                                        callback(session, '');
                                    } else {
                                        callback(null, 'could not add session');
                                    }
                                });
                            } else {
                                callback(null, msg);
                            }
                        });
                    }
                });
            } else {
                callback(null, msg);
            }
        });
    }
};

/**
 * logout a user from a group
 * - get member
 * - logout member including set session.isActive = false for all sessions of member
 * input: group__id, user__id
 * output: current group object
 */
module.exports.logout = function (groupId, userId, callback) {
    if (!userId) callback(null, 'bad request - user not found');
    if (!groupId) callback(null, 'bad request - group not found');
    if (userId && groupId) {
        MemberController.one(groupId, userId, function (searchMember, searchMsg) {
            if (searchMember) {
                MemberController.logout(searchMember._id, function (member, msg) {
                    if (member) {
                        callback(member, '');
                    } else {
                        callback(null, msg);
                    }
                });
            } else {
                callback(null, searchMsg);
            }

        });
    }
};
