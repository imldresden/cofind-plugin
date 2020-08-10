let Logger = require('./logger');
let GroupController = require('../controller/groupController');

const date = require('date-and-time');
const dateFormat = 'YYYY/MM/DD';
const timeFormat = 'HH:mm:ss:SS';
const startupDate = new Date();
const startDate = date.format(startupDate, dateFormat);
const startTime = date.format(startupDate, timeFormat);

let nowDate;
let nowTime;

let groupId = null;

let cTabCreated = 0;
let cTabRemoved = 0;
let cTabMoved = 0;
let cTabActivated = 0;
let cTabUrlUpdated = 0;
let cUserDetailsClick = 0;
let cClickUserButton = 0;
let cScrollVertical = 0;

let cSidebarDetailsClick = 0;
let cSidebarProposalTabActivate = 0;
let cSidebarUserTabActivate = 0;
let cSidebarProposalTabClick = 0;
let cSidebarUserTabClick = 0;

module.exports.setGroupId = (latestGroupId) => {
    groupId = latestGroupId;
    // console.log("consoleLogger: setGroupId -> " + groupId);
}

var stdin = process.openStdin();

stdin.addListener("data", function (d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that
    // with toString() and then trim()
    let input = d.toString().trim();
    // console.log("you entered: [" + input + "]");

    if (input == 'l') {
        console.log("log started...");
        manageConsoleLogs();
        console.log("log finished...");
    }
});

manageConsoleLogs = () => {
    const now = new Date();
    nowDate = date.format(now, dateFormat);
    nowTime = date.format(now, timeFormat);

    if (!groupId) {
        console.log("groupId not set, configController not ready... pls try again.");
    }
    GroupController.getFull(groupId, function (docs, msg) {
        if (docs) {
            // GENERAL
            logTime(now, nowDate, nowTime);
            logSessions(nowDate, nowTime, docs);
            logProposals(nowDate, nowTime, docs);
            logScrollVertical(nowDate, nowTime, docs);
            // TABS
            logTabCreated(nowDate, nowTime, docs);
            logTabRemoved(nowDate, nowTime, docs);
            logTabMoved(nowDate, nowTime, docs);
            logTabActivated(nowDate, nowTime, docs);
            logTabUrlUpdated(nowDate, nowTime, docs);
            // SIDEBAR
            // not used yet... all detailsClicks are sidebarDetailsClicks
            // logUserDetailsClick(nowDate, nowTime, docs);
            logClickUserButton(nowDate, nowTime, docs);
            logSidebarDetailsClick(nowDate, nowTime, docs);
            logSidebarProposalTabActivate(nowDate, nowTime, docs);
            logSidebarUserTabActivate(nowDate, nowTime, docs);
            logSidebarProposalTabClick(nowDate, nowTime, docs);
            logSidebarUserTabClick(nowDate, nowTime, docs);
        } else {
            console.log(msg);
        }
    });

}

logTime = (now, nowDate, nowTime) => {
    // absolute time
    let days = date.subtract(now, startupDate).toDays();
    let hours = date.subtract(now, startupDate).toHours();
    let minutes = date.subtract(now, startupDate).toMinutes();
    let seconds = date.subtract(now, startupDate).toSeconds();
    let milliseconds = date.subtract(now, startupDate).toMilliseconds();

    // relative time
    let modHours = hours;
    if (days > 0) modHours = hours % (days * 24);
    let modMinutes = minutes;
    if (modHours > 0) modMinutes = minutes % (modHours * 60);
    let modSeconds = seconds;
    if (modMinutes > 0) modSeconds = seconds % (modMinutes * 60);
    let modMilliseconds = milliseconds;
    if (modSeconds > 0) modMilliseconds = milliseconds % (modSeconds * 1000);

    let startDate = date.format(startupDate, dateFormat);
    let startTime = date.format(startupDate, timeFormat);
    let endDate = date.format(now, dateFormat);
    let endTime = date.format(now, timeFormat);
    let timeAbsolute = `${days}D-${hours}H-${minutes}m-${seconds}s-${milliseconds}S`;
    let timeRelative = `${days}D-${modHours}H-${modMinutes}m-${modSeconds}s-${modMilliseconds}S`;

    Logger.appendAndWriteToFile(nowDate, nowTime, `${nowDate};${nowTime};startDate;${startDate}`);
    Logger.appendAndWriteToFile(nowDate, nowTime, `${nowDate};${nowTime};startTime;${startTime}`);
    Logger.appendAndWriteToFile(nowDate, nowTime, `${nowDate};${nowTime};timeAbsolute;${timeAbsolute}`);
    Logger.appendAndWriteToFile(nowDate, nowTime, `${nowDate};${nowTime};timeRelative;${timeRelative}`);

}

logSessions = (nowDate, nowTime, group) => {
    let cSessions = 0;
    if (group.members) {
        for (let member of group.members) {
            for (let session of member.sessions) {
                cSessions++;
            }
        }
        let msg = `${nowDate};${nowTime};logSessions;${cSessions}`;
        Logger.appendAndWriteToFile(nowDate, nowTime, msg)
    } else {
        console.log("log error: group.members");
    }
}

logProposals = (nowDate, nowTime, group) => {
    let cProposals = 0;
    if (group.websiteProposals) {
        for (let proposal of group.websiteProposals) {
            cProposals++;
        }
        let msg = `${nowDate};${nowTime};logProposals;${cProposals}`;
        Logger.appendAndWriteToFile(nowDate, nowTime, msg)
    } else {
        console.log("log error: group.websiteProposals");
    }
}

logTabCreated = (nowDate, nowTime, group) => {
    let msg = `${nowDate};${nowTime};logTabCreated;${cTabCreated}`;
    Logger.appendAndWriteToFile(nowDate, nowTime, msg)
}
logTabRemoved = (nowDate, nowTime, group) => {
    let msg = `${nowDate};${nowTime};logTabRemoved;${cTabRemoved}`;
    Logger.appendAndWriteToFile(nowDate, nowTime, msg)
}
logTabMoved = (nowDate, nowTime, group) => {
    let msg = `${nowDate};${nowTime};logTabMoved;${cTabMoved}`;
    Logger.appendAndWriteToFile(nowDate, nowTime, msg)
}
logTabActivated = (nowDate, nowTime, group) => {
    let msg = `${nowDate};${nowTime};logTabActivated;${cTabActivated}`;
    Logger.appendAndWriteToFile(nowDate, nowTime, msg)
}
logTabUrlUpdated = (nowDate, nowTime, group) => {
    let msg = `${nowDate};${nowTime};logTabUrlUpdated;${cTabUrlUpdated}`;
    Logger.appendAndWriteToFile(nowDate, nowTime, msg)
}
logUserDetailsClick = (nowDate, nowTime, group) => {
    let msg = `${nowDate};${nowTime};logUserDetailsClick;${cUserDetailsClick}`;
    Logger.appendAndWriteToFile(nowDate, nowTime, msg)
}
logClickUserButton = (nowDate, nowTime, group) => {
    let msg = `${nowDate};${nowTime};logClickUserButton;${cClickUserButton}`;
    Logger.appendAndWriteToFile(nowDate, nowTime, msg)
}
logScrollVertical = (nowDate, nowTime, group) => {
    let msg = `${nowDate};${nowTime};logScrollVertical;${cScrollVertical}`;
    Logger.appendAndWriteToFile(nowDate, nowTime, msg)
}

logSidebarDetailsClick = (nowDate, nowTime, group) => {
    let msg = `${nowDate};${nowTime};logSidebarDetailsClick;${cSidebarDetailsClick}`;
    Logger.appendAndWriteToFile(nowDate, nowTime, msg)
}
logSidebarProposalTabActivate = (nowDate, nowTime, group) => {
    let msg = `${nowDate};${nowTime};logSidebarProposalTabActivate;${cSidebarProposalTabActivate}`;
    Logger.appendAndWriteToFile(nowDate, nowTime, msg)
}
logSidebarUserTabActivate = (nowDate, nowTime, group) => {
    let msg = `${nowDate};${nowTime};logSidebarUserTabActivate;${cSidebarUserTabActivate}`;
    Logger.appendAndWriteToFile(nowDate, nowTime, msg)
}
logSidebarProposalTabClick = (nowDate, nowTime, group) => {
    let msg = `${nowDate};${nowTime};logSidebarProposalTabClick;${cSidebarProposalTabClick}`;
    Logger.appendAndWriteToFile(nowDate, nowTime, msg)
}
logSidebarUserTabClick = (nowDate, nowTime, group) => {
    let msg = `${nowDate};${nowTime};logSidebarUserTabClick;${cSidebarUserTabClick}`;
    Logger.appendAndWriteToFile(nowDate, nowTime, msg)
}


////////////////////////////////////////////////////////////////////////////////////////////
// GENERAL
////////////////////////////////////////////////////////////////////////////////////////////

module.exports.scrollVertical = (groupId, sessionId, userId, tabId, tabUrl, tabPosition) => {
    cScrollVertical++;
}

////////////////////////////////////////////////////////////////////////////////////////////
// TABS
////////////////////////////////////////////////////////////////////////////////////////////
module.exports.tabCreated = (sessionId, userId, tabNumber) => {
    cTabCreated++;
}
module.exports.tabRemoved = (sessionId, userId, tabNumber, windowId, isWindowClosing) => {
    cTabRemoved++;
}
module.exports.tabMoved = (sessionId, userId, tabNumber, fromIndex, toIndex) => {
    cTabMoved++;
}
module.exports.tabActivated = (sessionId, userId, previousTabNumber, tabNumber, windowId) => {
    cTabActivated++;
}
module.exports.tabUrlUpdated = (sessionId, userId, toTabId, toTabUrl) => {
    cTabUrlUpdated++;
}

////////////////////////////////////////////////////////////////////////////////////////////
// SIDEBAR
////////////////////////////////////////////////////////////////////////////////////////////

module.exports.sidebarDetailsClick = (groupId, sessionId, userId, section, sectionName, url) => {
    cSidebarDetailsClick++;
}
module.exports.sidebarProposalTabActivate = (groupId, sessionId, section, sectionUserName, tabId, userId, url, title) => {
    cSidebarProposalTabActivate++;
}
module.exports.sidebarUserTabActivate = (groupId, sessionId, section, sectionUserName, tabId, userId, url, title) => {
    cSidebarUserTabActivate++;
}
module.exports.sidebarProposalTabClick = (groupId, sessionId, userId, proposalUsers, url, title) => {
    cSidebarProposalTabClick++;
}
module.exports.sidebarUserTabClick = (groupId, sessionId, userId, section, sectionUserName, tabId, url, title) => {
    cSidebarUserTabClick++;
}

module.exports.userDetailsClick = (userId) => {
    cUserDetailsClick++;
}
module.exports.clickUserButton = (groupId, sessionId, userId, selectedUserId) => {
    cClickUserButton++;
}







