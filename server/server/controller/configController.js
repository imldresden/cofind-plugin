const UserController = require('./userController');
const GroupController = require('./groupController');
const ConsoleLogger = require('../log/consoleLogger');
let User = require('../static/models/user.js');
const defaultConfig = require('../config/config.json');
const setup = defaultConfig.setup;
let config = defaultConfig;

/**
 * setup users for group (get or add principle)
 * setup group with users (if 4 users collected)
 * @param setup
 * @param callback
 */
module.exports.runSetup = function (callback) {
    console.log("working with config: " + setup.config_id);
    setupUsers(setup.users, function (users, msg) {
        if (users) {
            setupGroup(setup.group, users, function (group, msg) {
                if (group) {
                    callback(1, "...setup done");
                    // set groupId for consoleLogger
                    ConsoleLogger.setGroupId(group._id);
                } else {
                    callback(0, msg);
                }
            });
        } else {
            callback(0, "...could not finish user + group setup")
        }
    });
}

/**
 * setup users
 * if existing: get user
 * else: add user
 * @param reqUsers
 * @param callback
 */
setupUsers = function (reqUsers, callback) {
    let users = [];
    let count = 0;
    for (let user in reqUsers) {
        // skip user with username == null
        // if(reqUsers[user].username == "null") continue;
        UserController.signupUser(reqUsers[user], function (newUser, msg) {
            if (newUser != null) {
                users.push(newUser);
                console.log("new user: " + newUser.username);
                count++;
                if (count == 4) finishSetupUsers(users, callback);
            } else {
                User.findOne({"username": reqUsers[user].username}, '', function (err, docs) {
                    if (err) console.log(`could not get user ${reqUsers[user].username}`);
                    if (docs) {
                        users.push(docs);
                        console.log("old user: " + docs.username);
                    } else {
                        console.log("could not get user " + reqUsers[user].username);
                    }
                    count++;
                    if (count == 4) finishSetupUsers(users, callback);
                });
            }
        });
    }
}

finishSetupUsers = function (users, callback) {
    if (users.length == 4) {
        callback(users, "setup users complete");
    } else {
        callback(null, "setup users failed, cancel setup config");
    }
}

setupGroup = function (reqGroup, users, callback) {
    //finish group to reqGroup
    reqGroup.user = users[0]._id;
    delete reqGroup._user_comment;

    GroupController.add(reqGroup, function (group, msg) {
        if (group) {
            console.log("new group: " + group.name + " ("+group._id+")");
            // add group.id to config for extension
            setup.group.group_id = group._id;
            addUsersToGroup(group, users, function (members, msg) {
                if (members) {
                    callback(group, msg);
                } else {
                    callback(null, msg);
                }
            })
        } else {
            callback(null, msg);
        }
    });
}

addUsersToGroup = function (group, users, callback) {
    let tmpReqMember = {};
    let members = [];
    let count = 0;
    tmpReqMember.group = group._id;
    for (let user in users) {
        // deep copy reqMember to avoid schizophrenia
        let reqMember = JSON.parse(JSON.stringify(tmpReqMember));
        reqMember.user = users[user]._id;
        GroupController.addMember(reqMember, function (member, msg) {
            if (member) {
                members.push(member);
                console.log("add " + users[user].username + " to group: " + group.name);
                // callback(group, msg)
            } else {
                console.log("could not add " + ": " + users[user].username + "to group " + group.name);
            }
            count++;
            if (count == 4) finishAddUsersToGroup(members, callback);
        });
    }

}

finishAddUsersToGroup = function (members, callback) {
    console.log("finish add users to group...");
    if (members.length == 4) {
        callback(members, "setup group complete");
    } else {
        callback(null, "setup group failed, cancel setup config");
    }
}

/**
 * return config if available
 */
module.exports.getConfig = function (callback) {
    if(config){
        callback(config);
    } else {
        callback("no config found");
    }

}