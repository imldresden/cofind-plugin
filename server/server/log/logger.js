const fs = require('fs');
const util = require('util')
const config = require('../config/config.json');
const studyConfig = config.study;
const setupConfig = config.setup;
let User = require('../static/models/user');
const UserController = require('../controller/userController');
const GroupController = require('../controller/groupController');
const WebsiteProposalController = require('../controller/websiteProposalController');
const NoteController = require('../controller/noteController');
const SessionController = require('../controller/sessionController');

let appRoot = require('app-root-path');
const logPath = "/log/logs";
const studyPath = `/${studyConfig.id}`;
const filePath = `${appRoot}${logPath}${studyPath}`;

const date = require('date-and-time');
const dateFormat = 'YYYY/MM/DD';
const timeFormat = 'HH:mm:ss:SS';

/**
 * map for hiding username in log files
 * @type {Map<any, any>}
 */
let userMap = new Map();
userMap.set(setupConfig.users.user1.username, "user1");
userMap.set(setupConfig.users.user2.username, "user2");
userMap.set(setupConfig.users.user3.username, "user3");
userMap.set(setupConfig.users.user4.username, "user4");

// für matching logs and questionaires
console.log("userMap ready: ");
console.log("user1" + " - " + setupConfig.users.user1.username);
console.log("user2" + " - " + setupConfig.users.user2.username);
console.log("user3" + " - " + setupConfig.users.user3.username);
console.log("user4" + " - " + setupConfig.users.user4.username);

/**
 * create log folder for each study, if not exist
 */
setupLogger = function () {
    if (!fs.existsSync(`${appRoot}${logPath}`)) {
        fs.mkdirSync(`${appRoot}${logPath}`);
    }

    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }
}
setupLogger();

/**
 * append msg to filepath
 * @param path
 * @param msg
 */
writeToFile = function (path, msg) {
    fs.appendFile(path, msg, function (err) {
        if (err) {
            return console.log(err);
        }
        // console.log("The file was saved!");
    });
};

module.exports.appendAndWriteToFile = function (nowDate, nowTime, msg){
    let repDate = nowDate.split('/').join('-');
    let repTime = nowTime.split(':').join('-');
    const path = `${filePath}/${studyConfig.id}_statistics_${repDate}_${repTime}.log`;
    filterLogMsg(msg, function (logMsg) {
        writeToFile(path, logMsg);
    });
}

filterLogMsg = function (msg, callback) {
    callback(msg.replace(/\s/g, '') + '\n');
}
/**
 * EXPORT EVENT FUNCTIONS
 * logs actions of users, not db states(!)
 * called by socket.handler.js
 */

module.exports.test = function (msg) {
    const path = `${filePath}/${studyConfig.id}_test.log`;
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    writeToFile(path, `file system works`);
    console.log(`file system works\n`);
};

module.exports.clickUserButton = function (groupId, sessionId, userId, selectedUserId) {
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    GroupController.one(groupId, function (group, msg) {
        UserController.one(userId, function (user, msg) {
            UserController.one(selectedUserId, function (selectedUser, selectedMsg) {
                let mappedUserOld = null;
                if (user != null) {
                    mappedUserOld = userMap.get(user.username);
                }
                let mappedUserNew = userMap.get(selectedUser.username);
                // console.log("oldUser " + mappedUserOld);
                // if (user != null) console.log("user.username " + user.username);
                // console.log("newUser " + mappedUserNew);
                // console.log("selectedUser.username " + selectedUser.username);
                const path = `${filePath}/${studyConfig.id}_${mappedUserOld}_${sessionId}.log`;
                filterLogMsg(`${nowDate};${nowTime};clickUserButton;${group.name};${mappedUserOld};${sessionId};${mappedUserNew};${selectedUserId}`, function (logMsg) {
                    writeToFile(path, logMsg);
                });
            });
        });
    });
};

module.exports.login = function (username) {
    const path = `${filePath}/${studyConfig.id}_login.log`;
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    filterLogMsg(`${nowDate};${nowTime};${userMap.get(username)}`, function (logMsg) {
        writeToFile(path, logMsg);
    });
};

module.exports.sessionConnect = function (groupId, sessionId, userId) {
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    GroupController.one(groupId, function (group, msg) {
        UserController.one(userId, function (user, msg) {
            let mappedUser = userMap.get(user.username);
            const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
            filterLogMsg(`${nowDate};${nowTime};connect;${group.name};${mappedUser}`, function (logMsg) {
                writeToFile(path, logMsg);
            });
        });
    });
};

module.exports.sessionDisconnect = function (groupId, sessionId, userId) {
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    GroupController.one(groupId, function (group, msg) {
        UserController.one(userId, function (user, msg) {
            let mappedUser = userMap.get(user.username);
            const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
            filterLogMsg(`${nowDate};${nowTime};disconnect;${group.name};${mappedUser}`, function (logMsg) {
                writeToFile(path, logMsg);
            });
        });
    });
};

module.exports.logout = function (username) {
    const path = `${filePath}/${studyConfig.id}_logout.log`;
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    // User.findById(user_id, function(user, msg){
    //     let txt = `${nowDate};${nowTime};${userMap.get(user.username)}\n`;
    //     writeToFile(path, txt.trim());
    //     console.log(txt.trim());
    // });
    filterLogMsg(`${nowDate};${nowTime};${userMap.get(username)}`, function (logMsg) {
        writeToFile(path, logMsg);
    });
};

// TODO: remove due to tabCreated ?
module.exports.tabGroupAdded = function (group, reqTabGroup) {
    const path = `${filePath}/${studyConfig.id}_tab_group_added.log`;
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    UserController.oneBySession(reqTabGroup.session, function (user, msg) {
        let txt = `${nowDate};${nowTime};${userMap.get(user.username)};${reqTabGroup.tabs.length};${util.inspect(reqTabGroup.tabs, false, null, false)}\n`;
        filterLogMsg(txt, function (logMsg) {
        });
    });
};

module.exports.snapshotAdded = function (groupId, sessionId, reqSnapshot) {
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    UserController.oneBySession(reqSnapshot.session, function (user, msg) {
        if (user) {
            let mappedUser = userMap.get(user.username);
            let slimTabs = getSlimTabs(reqSnapshot.tabs);
            const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
            let txt = `${nowDate};${nowTime};snapshotAdded;${mappedUser};${reqSnapshot.tabs.length};${util.inspect(slimTabs, false, null, false)}`;
            filterLogMsg(txt, function (logMsg) {
                writeToFile(path, logMsg);
            });
        }
    });
};

module.exports.explicitAdded = function (groupId, sessionId, reqExplicit) {
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    UserController.oneBySession(reqExplicit.session, function (user, msg) {
        if (user) {
            let mappedUser = userMap.get(user.username);
            const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
            let tab = reqExplicit.tabs[0];
            // let txt = `${nowDate};${nowTime};explicitAdded;${mappedUser};${util.inspect(reqExplicit.tab, false, null, false)}`;
            let txt = `${nowDate};${nowTime};explicitAdded;${mappedUser};${tab.number};${tab.url};${tab.title}`;
            filterLogMsg(txt, function (logMsg) {
                writeToFile(path, logMsg);
            });
        }
    });
};

module.exports.explicitDeleted = function (groupId, sessionId, url, explicitId) {
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    // ExplicitController.one(explicitId, function (explicit, msg) {
    UserController.oneBySession(sessionId, function (user, msg) {
        if (user && user != null) {
            let mappedUser = userMap.get(user.username);
            const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
            let txt = `${nowDate};${nowTime};explicitDeleted;${mappedUser};${url}`;
            filterLogMsg(txt, function (logMsg) {
                console.log("writeToFile...");
                writeToFile(path, logMsg);
            });
        }
    });
    // });
};

// TODO: can be removed due to tebActivated ?
module.exports.websiteVisitAdded = function (group, reqWebsiteVisit) {
    const path = `${filePath}/${studyConfig.id}_website_visit_added.log`;
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    UserController.one(reqWebsiteVisit.user, function (user, msg) {
        let txt = `${nowDate};${nowTime};${userMap.get(user.username)};${reqWebsiteVisit.title};${reqWebsiteVisit.link}`;
        filterLogMsg(txt, function (logMsg) {
            writeToFile(path, logMsg);
        });
    });
};

module.exports.websiteProposalAdded = function (groupId, sessionId, reqWebsiteProposal) {
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    UserController.one(reqWebsiteProposal.user, function (user, msg) {
        if (user && user != null) {
            let mappedUser = userMap.get(user.username);
            const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
            let txt = `${nowDate};${nowTime};websiteProposalAdded;${mappedUser};${reqWebsiteProposal.title};${reqWebsiteProposal.link}`;
            filterLogMsg(txt, function (logMsg) {
                writeToFile(path, logMsg);
            });
        }
    });
};

module.exports.websiteProposalDeleted = function (groupId, sessionId, proposalId) {
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    WebsiteProposalController.one(proposalId, function (websiteProposal, msg) {
        UserController.one(websiteProposal.user, function (user, msg) {
            if (user && user != null) {
                let mappedUser = userMap.get(user.username);
                const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
                let txt = `${nowDate};${nowTime};websiteProposalDeleted;${mappedUser};${proposalId}`;
                filterLogMsg(txt, function (logMsg) {
                    writeToFile(path, logMsg);
                });
            }
        });
    });
};

module.exports.userDetailsClick = function (userId) {
    const path = `${filePath}/${studyConfig.id}_user_details_click.log`;
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    UserController.one(userId, function (user, msg) {
        filterLogMsg(`${nowDate};${nowTime};${userMap.get(user.username)}`, function (logMsg) {
            writeToFile(path, logMsg);
        });
    });
};

// note unused
//
// module.exports.noteAdded = function (groupId, sessionId, userId, websiteProposal, note) {
//     let comment = "";
//     if (note) comment = note.notePosition.startElementInnerText.slice(note.notePosition.startElementInnerOffset, note.notePosition.endElementInnerOffset);
//     const now = new Date();
//     const nowDate = date.format(now, dateFormat);
//     const nowTime = date.format(now, timeFormat);
//     UserController.one(note.user, function (user, msg) {
//         let mappedUser = userMap.get(user.username);
//         const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
//         SessionController.hasSharedTab(sessionId, websiteProposal.link, function (tabShared) {
//             WebsiteProposalController.oneActiveInGroup(groupId, websiteProposal.link, function (proposal, proposalMsg) {
//                 let tabSaved = false;
//                 if (proposal) tabSaved = true;
//                 filterLogMsg(`${nowDate};${nowTime};noteAdded;${mappedUser};${websiteProposal.link};${note.description};${tabShared};${tabSaved};${note._id};${comment};${note.description}`, function (logMsg) {
//                     writeToFile(path, logMsg);
//                 });
//             });
//         });
//     });
// };
//
// module.exports.noteDeleted = function (group, sessionId, noteId) {
//     const now = new Date();
//     const nowDate = date.format(now, dateFormat);
//     const nowTime = date.format(now, timeFormat);
//     NoteController.one(noteId, function (note, msg) {
//         UserController.one(note.user, function (user, msg) {
//             let mappedUser = userMap.get(user.username);
//             const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
//             filterLogMsg(`${nowDate};${nowTime};noteDeleted;${mappedUser};${noteId}`, function (logMsg) {
//                 writeToFile(path, logMsg);
//             });
//         });
//     });
// };
//
// module.exports.siteCommentBoxOpenClose = function (sessionId, userId) {
//     if (!userId) return;
//     const now = new Date();
//     const nowDate = date.format(now, dateFormat);
//     const nowTime = date.format(now, timeFormat);
//     UserController.one(userId, function (user, msg) {
//         let mappedUser = userMap.get(user.username);
//         const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
//         filterLogMsg(`${nowDate};${nowTime};siteCommentBoxOpenClose;${mappedUser}`, function (logMsg) {
//             writeToFile(path, logMsg);
//         });
//     });
// };
// module.exports.siteCommentBoxShowNote = function (sessionId, userId, noteId) {
//     const now = new Date();
//     const nowDate = date.format(now, dateFormat);
//     const nowTime = date.format(now, timeFormat);
//     UserController.one(userId, function (user, msg) {
//         let mappedUser = userMap.get(user.username);
//         const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
//         filterLogMsg(`${nowDate};${nowTime};siteCommentBoxShowNote;${mappedUser};${noteId}`, function (logMsg) {
//             writeToFile(path, logMsg);
//         });
//     });
// };
// module.exports.siteCommentBoxDetailsOpen = function (sessionId, userId, noteId) {
//     const now = new Date();
//     const nowDate = date.format(now, dateFormat);
//     const nowTime = date.format(now, timeFormat);
//     UserController.one(userId, function (user, msg) {
//         let mappedUser = userMap.get(user.username);
//         const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
//         filterLogMsg(`${nowDate};${nowTime};siteCommentBoxDetailsOpen;${mappedUser};${noteId}`, function (logMsg) {
//             writeToFile(path, logMsg);
//         });
//     });
// };
// module.exports.siteCommentBoxDetailsClose = function (sessionId, userId, noteId) {
//     const now = new Date();
//     const nowDate = date.format(now, dateFormat);
//     const nowTime = date.format(now, timeFormat);
//     UserController.one(userId, function (user, msg) {
//         let mappedUser = userMap.get(user.username);
//         const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
//         filterLogMsg(`${nowDate};${nowTime};siteCommentBoxDetailsClose;${mappedUser};${noteId}`, function (logMsg) {
//             writeToFile(path, logMsg);
//         });
//     });
// };
// module.exports.commentBubbleOpen = function (sessionId, userId, noteId) {
//     const now = new Date();
//     const nowDate = date.format(now, dateFormat);
//     const nowTime = date.format(now, timeFormat);
//     UserController.one(userId, function (user, msg) {
//         let mappedUser = userMap.get(user.username);
//         const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
//         filterLogMsg(`${nowDate};${nowTime};commentBubbleOpen;${mappedUser};${noteId}`, function (logMsg) {
//             writeToFile(path, logMsg);
//         });
//     });
// };
//
// module.exports.commentBubbleClose = function (sessionId, userId, noteId) {
//     const now = new Date();
//     const nowDate = date.format(now, dateFormat);
//     const nowTime = date.format(now, timeFormat);
//     UserController.one(userId, function (user, msg) {
//         let mappedUser = userMap.get(user.username);
//         const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
//         filterLogMsg(`${nowDate};${nowTime};commentBubbleClose;${mappedUser};${noteId}`, function (logMsg) {
//             writeToFile(path, logMsg);
//         });
//     });
// };

////////////////////////////////////////////////////////////////////////////////////////////
// TABS
////////////////////////////////////////////////////////////////////////////////////////////

module.exports.tabCreated = function (sessionId, userId, tabNumber) {
    if (!userId) return;
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    UserController.one(userId, function (user, msg) {
        if (user && user != null) {
            let mappedUser = userMap.get(user.username);
            const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
            filterLogMsg(`${nowDate};${nowTime};tabCreated;${mappedUser};${tabNumber}`, function (logMsg) {
                writeToFile(path, logMsg);
            });
        }
    });
};
module.exports.tabRemoved = function (sessionId, userId, tabNumber, windowId, isWindowClosing) {
    if (!userId) return;
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    UserController.one(userId, function (user, msg) {
        if (!user || user == null) {
            console.log("could not find user with id " + userId);
            return;
        }
        let mappedUser = userMap.get(user.username);
        const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
        filterLogMsg(`${nowDate};${nowTime};tabRemoved;${mappedUser};${tabNumber};${windowId};${isWindowClosing}`, function (logMsg) {
            writeToFile(path, logMsg);
        });
    });
};
module.exports.tabMoved = function (sessionId, userId, tabNumber, fromIndex, toIndex) {
    if (!userId) return;
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    UserController.one(userId, function (user, msg) {
        let mappedUser = userMap.get(user.username);
        const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
        filterLogMsg(`${nowDate};${nowTime};tabMoved;${mappedUser};${tabNumber};${fromIndex};${toIndex}`, function (logMsg) {
            writeToFile(path, logMsg);
        });
    });
};
module.exports.tabActivated = function (sessionId, userId, previousTabNumber, tabNumber, windowId) {
    if (!userId || userId == "null") return;
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    UserController.one(userId, function (user, msg) {
        if(!user) return;
        let mappedUser = userMap.get(user.username);
        const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
        filterLogMsg(`${nowDate};${nowTime};tabActivated;${mappedUser};${previousTabNumber};${tabNumber};${windowId}`, function (logMsg) {
            writeToFile(path, logMsg);
        });
    });
};
module.exports.tabUrlUpdated = function (sessionId, userId, toTabId, toTabUrl) {
    if(!sessionId || !userId || !toTabId || !toTabUrl ) return;
    if (!userId || userId == "null") return;
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    UserController.one(userId, function (user, msg) {
        let mappedUser = userMap.get(user.username);
        const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
        filterLogMsg(`${nowDate};${nowTime};tabUrlUpdated;${mappedUser};${toTabId};${toTabUrl}`, function (logMsg) {
            writeToFile(path, logMsg);
        });
    });
};

module.exports.scrollVertical = function (groupId, sessionId, userId, tabId, tabUrl, tabPosition) {
    if (!userId || userId == "null") return;
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    UserController.one(userId, function (user, msg) {
        let mappedUser = userMap.get(user.username);
        const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
        filterLogMsg(`${nowDate};${nowTime};scrollVertical;${mappedUser};${tabId};${tabUrl};${tabPosition}`, function (logMsg) {
            writeToFile(path, logMsg);
        });
    });
};

getSlimTabs = (tabs) => {
    let slimTabs = [];
    for (let tab of tabs) {
        let slimTab = {
            number: tab.number,
            url: tab.url,
            title: tab.title
        };
        slimTabs.push(slimTab);
    }
    return slimTabs;
}

////////////////////////////////////////////////////////////////////////////////////////////
// SIDEBAR
////////////////////////////////////////////////////////////////////////////////////////////

module.exports.sidebarDetailsClick = function (sessionId, userId, section, sectionName, url) {
    if (!userId || userId == "null") return;
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    let mappedSectionName = sectionName;
    if(section == "activity"){
        mappedSectionName = userMap.get(sectionName);
    }
    UserController.one(userId, function (user, msg) {
        let mappedUser = userMap.get(user.username);
        const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
        filterLogMsg(`${nowDate};${nowTime};sidebarDetailsClick;${mappedUser};${section};${mappedSectionName};${url}`, function (logMsg) {
            writeToFile(path, logMsg);
        });
    });
};

module.exports.sidebarProposalTabActivate = function (sessionId, userId, proposalUsers, url, title) {

};
module.exports.sidebarUserTabActivate = function (sessionId, userId, section, sectionUserName, tabId, url, title) {

};

module.exports.sidebarProposalTabClick = function (sessionId, userId, proposalUsers, url, title) {
    if (!userId || userId == "null") return;
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    UserController.one(userId, function (user, msg) {
        let mappedUser = userMap.get(user.username);
        let mappedUsers = [];
        for (let user of proposalUsers) {
            mappedUsers.push(userMap.get(user.username));
        }
        const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
        filterLogMsg(`${nowDate};${nowTime};sidebarProposalTabClick;${mappedUser};${proposalUsers};${url};${title}`, function (logMsg) {
            writeToFile(path, logMsg);
        });
    });
};
module.exports.sidebarUserTabClick = function (sessionId, userId, section, sectionUserName, tabId, url, title) {
    if (!userId || userId == "null") return;
    const now = new Date();
    const nowDate = date.format(now, dateFormat);
    const nowTime = date.format(now, timeFormat);
    UserController.one(userId, function (user, msg) {
        let mappedUser = userMap.get(user.username);
        let mappedSectionUserName = userMap.get(sectionUserName);
        const path = `${filePath}/${studyConfig.id}_${mappedUser}_${sessionId}.log`;
        filterLogMsg(`${nowDate};${nowTime};sidebarUserTabClick;${mappedUser};${section};${mappedSectionUserName};${tabId};${url};${title}`, function (logMsg) {
            writeToFile(path, logMsg);
        });
    });
};
