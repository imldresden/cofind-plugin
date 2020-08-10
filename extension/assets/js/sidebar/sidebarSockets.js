/**
 * Author: Lucas Vogel
 *
 * This file is the helper file for the sidebar socket handler
 */

/**
 * Send leave message to backend
 */
async function socketsLeave() {
    var groupID = await getPersistantData("groupID");
    var sessionID = await getPersistantData("sessionID");
    var userID = await getPersistantData("userID");
    // get a extensive group object
    if (groupID != undefined && groupID != null && groupID != "") {
        var message = {
            type: "socket",
            data: {
                socketType: "disconnect",
                groupID: groupID,
                sessionID: sessionID,
                userID: userID
            }
        }
        console.log("socketsLeave");
        sendMessageToBackend(message);
    }
}

/**
 * Get the current session ID
 * @returns promise that resolves to the session ID or false
 */
async function getSessionID() {
    return new Promise(async function (resolve, reject) {
        var id = getPersistantData("sessionID");
        if (id != undefined && id != null && id != "" && id != "null" && id != false) {
            resolve(id);
        } else {
            resolve(false);
        }
    });
}

/**
 * Adding a favorite (proposal)
 * @param {String} groupID ID of the group
 * @param {Object} requestWebsiteProposal The proposal that should be added
 */
async function socketsAddWebsiteProposal(groupId, sessionId, requestWebsiteProposal) {
    var message = {
        type: "socket",
        data: {
            socketType: 'websiteproposal added',
            groupId: groupId,
            sessionId: sessionId,
            requestWebsiteProposal: requestWebsiteProposal
        }
    }
    sendMessageToBackend(message);
}

/**
 * Removes a favorite (proposal)
 * @param {String} groupID ID of the group
 * @param {String} proposalID ID of the proposal
 */
async function socketsDeleteWebsiteProposal(groupId, sessionId, proposalId) {
    var message = {
        type: "socket",
        data: {
            socketType: 'websiteproposal deleted',
            groupId: groupId,
            sessionId: sessionId,
            proposalId: proposalId
        }
    }
    sendMessageToBackend(message);
}

async function socketsAddExplicit(groupId, sessionId, currentTab) {
    var reqExplicit = {
        session: sessionId,
        tabs: [currentTab]
    }
    var msg = {
        type: "socket",
        data: {
            socketType: 'explicit added',
            groupId: groupId,
            sessionId: sessionId,
            reqExplicit: reqExplicit
        }
    };
    sendMessageToBackend(msg);
}

async function socketsDeleteExplicit(groupId, sessionId, currentTab, explicitId) {
    var msg = {
        type: "socket",
        data: {
            socketType: 'explicit deleted',
            groupId: groupId,
            sessionId: sessionId,
            url: currentTab.url,
            explicitId: explicitId
        }
    };
    sendMessageToBackend(msg);
}

async function socketsAddSnapshot(groupId, sessionId) {
    var tabs = await getAllTabs();
    // reqSnapshot is similar to reqTabGroups but send to different socket-msg
    var reqSnapshot = {
        session: sessionId,
        tabs: tabs
    }
    var msg = {
        type: "socket",
        data: {
            socketType: 'snapshot added',
            groupId: groupId,
            sessionId: sessionId,
            reqSnapshot: reqSnapshot
        }
    };
    sendMessageToBackend(msg);
}
