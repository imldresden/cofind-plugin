/**
 * Author: Lucas Vogel
 *
 * This file runs asynchronously in the background
 * of the browser and is only instanced once.
 * This file sets up the sockes and handles all socket events that are independent from messages.
 */

var socket = null;

function getSocket() {
    return new Promise(async function (resolve, reject) {
        if (socket == null) await setupSockets();
        resolve(socket);
    });
}

/**
 * sets up the Socket connection for the extension.
 */
async function setupSockets() {
    var server = await getServer();
    console.log("SETUPSOCKETS for SERVER: " + server);
    if (server != undefined && server != null && server != "") {
        if (socket == undefined || socket == null) {
            socket = io(server, {transports: ['websocket']});
            socket.on('group modified', function (group) { //is Fired if there is a new version of data available
                // sendNewNotesToWebsite(group);
                var message = {
                    type: "socket group modified",
                    data: {
                        group: group
                    }
                };
                sendMessageToSidebar(message);
            });
        }
    }
}

/**
 * check if there are tabs to publish
 * if yes -> call send new tabs
 * usually removedZabId is given to avoid problems with async call of tabs.onRemoved -> tabs.onActivated
 * @returns {Promise<void>}
 */
async function getAndSendNewTabs(removedTabId = null) {
    // console.log("getAndSendNewTabs...");
    if (socket == null) {
        console.log("socket is null");
        return;
    }
    var tabs = await getAllTabs();
    if (tabs != undefined && tabs.length > 0) {
        // remove tab with removedTabId if exists -> it does of called from handelRemoved
        if (removedTabId != null) {
            for (var tab in tabs) {
                if (tabs[tab].number == removedTabId) {
                    tabs.splice(tab, 1);
                }
            }
        }
        sendNewTabs(tabs);
    }
}

/**
 * Sends the given tabs via socket
 * @param {*} tabs array of tab-objects
 */
async function sendNewTabs(tabs) {
    // console.log("sendNewTabs...");
    var userId = await getPersistantData("userId");
    var sessionId = await getPersistantData("sessionId");
    var groupId = await getPersistantData("groupId");
    // if no user logged in -> do nothing
    if (!userId || userId == "null") return;
    if (sessionId != undefined && sessionId != "null" && sessionId != null && sessionId != "") {
        var payload = {
            session: sessionId,
            tabs: tabs
        }
        if (socket != undefined && socket != null) {
            socket.emit('tabgroup added', groupId, payload);
        }
    }
}
