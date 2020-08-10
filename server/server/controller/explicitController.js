var Explicit = require('../static/models/explicit.js');
var Tab = require('../static/models/tab.js');
var Session = require('../static/models/session.js');

/**
 * adds a new explicit
 * if explicit already exists -> add new tab to existing explicit
 * input: explicit request-object
 * output: explicit object
 */
module.exports.add = function (explicit, callback) {
    if (!explicit.session) callback(null, 'bad request - session not found');
    if (!explicit.tabs) callback(null, 'bad request - tab not found');
    if (!explicit.tabs[0].number || !explicit.tabs[0].url || !explicit.tabs[0].title) callback(null, 'bad request - tab not valid');
    if (explicit.session && explicit.tabs) {
        // ckeck if explicit tab already exists
        explicitTabExists(explicit.session, explicit.tabs[0], function (tab, msg) {
            if (tab != null) {
                callback(null, `explicit tab already exists`);
            } else {
                // create and save tab
                let newTab = new Tab(explicit.tabs[0]);
                newTab.save();
                // check if explicit already exists
                Explicit.findOneAndUpdate({session: explicit.session}, {
                    upsert: true,
                    new: true
                }, {sort: {createdAt: -1}}, function (err, exp) {
                    if (err) console.log(`could not get explicit for session ${explicit.session}`);
                    if (exp) {
                        exp.tabs.push(newTab);
                        exp.save(function () {
                            callback(exp, `updated explicit ${exp._id}`);
                        });
                    } else {
                        // create and save explicit
                        let newExplicit = new Explicit({
                            session: explicit.session,
                            tabs: [newTab]
                        });
                        newExplicit.save(function () {
                            callback(newExplicit, `created explicit ${newExplicit._id}`);
                        });
                    }
                });
            }
        });
    }
};


/**
 * set one tab of explicit.tabs to isDeleted = true
 * input: sessionId, url, callback
 * output: true, false
 */
module.exports.deleteExplicitTab = function (sessionId, url, callback) {
    hasSharedTab(sessionId, url, function (sharedTab, msg){
        if(sharedTab){
            Tab.findById(sharedTab._id, function (err, docs) {
                if(docs) {
                    docs.isDeleted = true;
                    docs.save();
                    callback(true);
                } else {
                    callback(false);
                }
            });
        } else {
            callback(false);
        }
    });
}

/**
 * ckeck if is exists an explicit with the given tab for the given session and tab.isDeleted == false
 * matching variables: url, isDeleted
 * input: sessionId, reqTab
 * output: tab-object if tab exists, null otherwise
 */
explicitTabExists = function (sessionId, reqTab, callback) {
    Explicit.findOne({session: sessionId}, function (err, docs) {
        if (err) console.log(`could not find explicit for session ${sessionId}`);
        if (docs) {
            tabsContainUrl(docs.tabs, reqTab.url, function (tab, msg){
                callback(tab, msg);
            });
        } else {
            callback(null, `explicit for session ${sessionId} does not exist`);
        }
    });
}

hasSharedTab = function (sessionId, url, callback) {
    Explicit.findOne({session: sessionId}, function (err, docs) {
        if (err) console.log(`could not find explicit for session ${sessionId}`);
        if (docs) {
            tabsContainUrl(docs.tabs, url, function (tab, msg){
                callback(tab);
            });
        } else {
            callback(null, '');
        }
    });
};
module.exports.hasSharedTab = hasSharedTab;

/**
 * check if an array of tabs contain a tab.url
 * with tab.isDeleted == false
 * input: array of tabId, url
 * output: tab, if contain url, null otherwise
 */
tabsContainUrl = function (tabs, url, callback) {
    Tab.find({
        '_id': { $in: tabs }
    }, function(err, docs){
        if (docs){
            for(var tab in docs){
                if(docs[tab].url.localeCompare(url) == 0 && docs[tab].isDeleted == false){
                    callback (docs[tab], 'tabs does contain url');
                    break;
                } else {
                    if (tab == docs.length - 1) callback(null, 'tabs do not contain url');
                }
            }
        } else {
            console.log(null, `no tabs in ${tabs}`)
        }
    });
}


/**
 * returns all explicit of one session where isDeleted == false
 * input: session__id
 * output: snapshot object
 */
module.exports.activeOneSession = function (sessionId, callback) {
    if (!sessionId) callback(null, 'bad request - session__id not found');
    Explicit.find({session: sessionId, isDeleted: false}, '', function (err, docs) {
        if (err) console.log(`could not get explicit for session ${sessionId}`);
        if (docs) {
            callback(docs);
        } else {
            callback(null, `session ${sessionId} does not exist`);
        }
    });
};
