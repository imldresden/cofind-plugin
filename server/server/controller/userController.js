let User = require('../static/models/user.js');
let Group = require('../static/models/group.js');
let Member = require('../static/models/member.js');
let Session = require('../static/models/session.js');

/**
 * returns all users
 * input: -
 * output: array of user objects
 */
module.exports.all = function (callback) {
    User.find({}, '', function (err, docs) {
        if (err) console.log('could not get users ');
        if (docs) {
            callback(docs, '');
        } else {
            callback(null, 'no users existing');
        }
    });
};

/**
 * returns one user
 * input: user__id
 * output: user object
 */
one = async function (userId, callback) {
    if (!userId) {
        callback(null, 'bad request - userId not found');
        return;
    }
    if (userId) {
        User.findById(userId, '', function (err, docs) {
            if (err) console.log(`could not get user ${userId}`);
            // console.log("user by id");
            if (docs) {
                callback(docs, '');
            } else {
                console.log(`user ${userId} not exists`);
                callback(null, 'user not exists');
            }
        });
    }
};
module.exports.one = one;

/**
 * find a user by sessionId
 * @param sessionId
 * @param callback
 */
module.exports.oneBySession = function(sessionId, callback){
  if (!sessionId){
      callback(null, 'bad request - userId not found');
      return;
  }
  if(sessionId) {
      Session.findById(sessionId, '', function (err, session){
          if (err) console.log(`could not get session ${sessionId}`);
          if (session) {
              Member.findOne({ _id: session.member}, '', function (err, member){
                  if (err) console.log(`could not get member ${session.member}`);
                  if(member)  {
                      one(member.user, function(user, msg){
                         callback(user, msg);
                      });
                  } else {
                      console.log(`member ${session.member} not exists`);
                      callback(null, 'member not exists');
                  }
              });
          } else {
              console.log(`session ${sessionId} not exists`);
              callback(null, 'session not exists');
          }
      });
  }
};

/**
 * return all group__ids of a user
 * helper function
 * input: user__id
 * output: array of group__ids
 */
let fetchActiveMembers = function (userId, callback) {
    Member.find({ user: userId, isActive: true }, 'group', function (err, docs) {
        if (err) console.log(`could not get members for user ${userId}`);
        if (docs) {
            let groupIds = [];
            for (group in docs) {
                groupIds.push(docs[group].group);
            }
            callback(groupIds, '');
        } else {
            callback(null, 'userId not exists');
        }
    });
};

/**
 * returns all active groups of a user where user is owner
 * - group.user = user
 * - group.isActive = true
 * input: user__id
 * output: array of group objects
 */
module.exports.activeGroupsOwner = function (userId, callback) {
    if (!userId) callback(null, 'bad request - userId not found');
    if (userId) {
        Group.find({ user: userId }, function (err, docs) {
            if (err) callback(null, 'could not find group');
            if (docs) {
                callback(docs, '');
            } else {
                callback(null, 'groupId not exists');
            }
        });
    }
};

/**
 * returns all active groups of a user where user is member
 * - member.user = user
 * - group.members contains member
 * - group.isActive = true
 * input: user__id
 * output: array of group objects
 */
module.exports.activeGroupsMember = function (userId, callback) {
    if (!userId) callback(null, 'bad request - userId not found');
    if (userId) {
        fetchActiveMembers(userId, function (members, msg) {
            if (!members) callback(null, msg);
            Group.find({ _id: { $in: members }, isActive: true }, function (err, groups) {
                if (err) console.log(`could not get groups for user ${userId}`);
                if (groups) {
                    callback(groups, '');
                } else {
                    callback(null, 'groupId not exists');
                }
            });
        });
    }
};

/**
 * adds a new user
 * input: user request-object
 * output: user object
 */
module.exports.signupUser = function (user, callback) {
    if (!user.username) callback(null, 'bad request - username not found');
    if (!user.password) callback(null, 'bad request - password not found');
    if (user.username && user.password) {
        User.findOne({ "username": user.username }, '', function (err, docs) {
            if (err) console.log(`could not signup user ${user.username}`);
            if (docs) {
                callback(null, `user ${user.username} already exists`);
            } else {
                let newUser = new User(user);
                newUser.save(function () {
                    callback(newUser, `signed up user ${newUser._id}`);
                });

            }
        });
    }
};

/**
 * deletes a user
 * depricated !!!
 * input: user__id
 * output: user object
 */
module.exports.deleteUser = function (userId, callback) {
    if (!userId) callback(null, `userId not found`);
    User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true }, function (err, docs) {
        if (err) callback(null, `could not delete user ${userId}`);
        if (docs) {
            callback(docs, `deleted user ${userId}`);
        } else {
            callback(null, `user ${userId} does not exist`);
        }
    });
};

/**
 * log a user in
 * sets isLoggedIn = true
 * input: username, password of a user
 * output: user object
 */
module.exports.loginUser = function (username, password, callback) {
    if (!username) callback(null, 'bad request - username not found');
    if (!password) callback(null, 'bad request - password not found');
    if (!(username && password)) return;
    User.findOne({ "username": username }, function (err, docs) {
        if (err) callback(null, `could not login user ${username}`);
        if (docs) {
            if (docs.password === password) {
                callback(docs, `logged in user ${username}`);
            } else {
                callback(null, 'bad username or password');
            }
        } else {
            callback(null, `user ${username} does not exist`);
        }
    });
};
