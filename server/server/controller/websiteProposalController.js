const WebsiteProposal = require('../static/models/websiteProposal');
const NoteController = require('./noteController');
const WebsiteProposalController = require('./websiteProposalController');

/**
 * adds a websiteProposal
 * if proposal for
 * input: websiteProposal request-object
 * output: websiteProposal object
 */
add = function (proposal, callback) {
    if (!proposal.group) callback(null, 'bad request - group not found');
    if (!proposal.user) callback(null, 'bad request - user not found');
    if (!proposal.link) callback(null, 'bad request - proposal-link not found');
    if (!proposal.title) callback(null, 'bad request - proposal-title not found');
    if (proposal.group && proposal.user && proposal.link && proposal.title) {
        let reqProposal = {
            group: proposal.group,
            user: proposal.user,
            link: proposal.link,
            title: proposal.title
        };
        let newProposal = new WebsiteProposal(reqProposal);
        newProposal.save(function () {
            callback(newProposal, `created website-proposal ${newProposal._id}`);
        });
    }
};
module.exports.add = add;

/**
 * return a websiteProposal
 * add a websiteProposal if not already exists for same user
 * input: websiteProposal request-object
 * output: websiteProposal object
 */
module.exports.getOrAdd = function (reqProposal, callback) {
    if (!reqProposal.group) callback(null, 'bad request - group not found');
    if (!reqProposal.user) callback(null, 'bad request - user not found');
    if (!reqProposal.link) callback(null, 'bad request - proposal-link not found');
    if (!reqProposal.title) callback(null, 'bad request - proposal-title not found');
    if (reqProposal.group && reqProposal.user && reqProposal.link && reqProposal.title) {
        WebsiteProposal.findOne({ link: reqProposal.link, group: reqProposal.group, user: reqProposal.user, isDeleted: false }, function (err, docs) {
            if (err) console.log('could not get or add website-proposal');
            //if websiteProposal exists
            if (docs) {
                prepareAndAddNote(reqProposal, docs, function (note, msg) {
                    if (!note) callback(docs, note, msg);
                    if (note) {
                        callback(docs, note, '');
                    }
                });
            } else {
                //if websiteProposal not exists
                add(reqProposal, function (proposal, msg) {
                    if (!proposal) callback(null, 'could not create website-proposal');
                    if (proposal) {
                        prepareAndAddNote(reqProposal, proposal, function (note, msg) {
                            if (!note) callback(proposal, note, msg);
                            if (note) {
                                callback(proposal, note, '');
                            }
                        });
                    }
                });
            }
        });
    }
};

/**
 * check if websiteProposal request-object contains note request-object
 * if yes -> create new note object
 * add new note object to websiteProposal object
 * input: websiteProposal request-object
 * output: websiteProposal object
 */
prepareAndAddNote = function (reqProposal, websiteProposal, callback) {
    if (reqProposal.notes && reqProposal.notes.length > 0) {
        //add websiteProposalID to note
        reqProposal.notes[0].websiteProposal = websiteProposal._id;
        //add note to websiteProposals
        NoteController.add(reqProposal.notes[0], function (note, msg) {
            if (!note) callback(null, msg);
            if (note) {
                //add message to group
                websiteProposal.notes.push(note._id);
                websiteProposal.save(function () {
                    callback(note, '');
                });
            }
        });
    } else {
        //if not note should be added return existing websiteProposal
        callback(null, 'website-proposal request-object does not contain note-request-object');
    }
}

/**
 * returns a website-proposal
 * check by group_id, link and isDeleted: false
 * input: group__id, url
 * output: website-proposal object
 */
module.exports.oneActiveInGroup = function (groupId, url, callback) {
    WebsiteProposal.findOne({ group: groupId, link: url, isDeleted: false }, '', function (err, docs) {
        if (err) console.log(`could not get website-proposal`);
        if (docs) {
            callback(docs, ``);
        } else {
            callback(null, `website-proposal does not exist`);
        }
    });
};

/**
 * create a note and adds it to websitePorposal.notes
 * input: note request-object including note.notePosition object
 * output: note object
 */
module.exports.addNote = function (reqNote, callback) {
    if (!reqNote.websiteProposal) callback(null, 'bad request - website-proposal not found');
    //get session
    WebsiteProposal.findById(reqNote.websiteProposal, function (err, docs) {
        if (err) console.log(`could not add note`);
        if (docs) {
            //create message
            NoteController.add(reqNote, function (note, msg) {
                if (!note) callback(null, msg);
                //add message to group
                docs.notes.push(note._id);
                docs.save(function () {
                    callback(note, '');
                });
            });
        } else {
            callback(null, `website-proposal ${reqNote.websiteProposal} does not exist`);
        }
    });
};

/**
 * returns all websitePorposals
 * input: -
 * output: array of websitePorposals
 */
module.exports.all = function (callback) {
    WebsiteProposal.find({}, function (err, docs) {
        if (err) console.log('could not get website proposals');
        if (docs) {
            callback(docs, 'website proposals fetched');
        }
    });
};

/**
 * returns all websitePorposals for a detail page
 * - only one group
 * input: -
 * output: array of websitePorposals
 */
module.exports.allForDetails = function (currentGroupId, callback) {
    WebsiteProposal.find({group: currentGroupId})
        .sort("createdAt")
        .exec(function (err, docs) {
        if (err) console.log('could not get website proposals for details');
        if (docs) {
            callback(docs, 'website proposals fetched');
        } else {
            callback(null, 'could not fetch website proposals');
        }
    });
};

/**
 * deletes a websiteProposal
 * sets isDeleted = true
 * input: websiteProposal__id
 * output: websiteProposal object
 */
module.exports.delete = function (websiteProposalId, callback) {
    WebsiteProposal.findByIdAndUpdate(websiteProposalId, { isDeleted: true }, { new: true }, function (err, docs) {
        if (err) callback(null, `could not delete website-proposal ${websiteProposalId}`);
        if (docs) {
            callback(docs, `deleted website-proposal ${websiteProposalId}`);
        } else {
            callback(null, `website-proposal ${websiteProposalId} does not exist`);
        }
    });
};

/**
 * returns one website-proposal
 * input: website-proposal__id
 * output: website-proposal object
 */
module.exports.one = function (proposalId, callback) {
    if (!proposalId) callback(null, 'bad request - proposalId not found');
    if (proposalId) {
        WebsiteProposal.findById(proposalId, '', function (err, docs) {
            if (err) console.log(`could not get user ${proposalId}`);
            if (docs) {
                callback(docs, '');
            } else {
                console.log(`website-proposal ${proposalId} not exists`);
                callback(null, 'website-proposal not exists');
            }
        });
    }
};
