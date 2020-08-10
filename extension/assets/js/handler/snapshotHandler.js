/**
 * This file handles all snapshot requests.
 * Typically used by sidebarTiles.js
 * Uses functions of backgroundSocketHandler.js
 */

/**
 * fetch tabs and sendNewSnapshot
 */
async function handleSnapshot() {
    var tabs = await getAllTabs();
    if (tabs != undefined && tabs.length > 0) {
        var sessionID = await getPersistantData("sessionID");
        if (sessionID != undefined && sessionID != null && sessionID != "") {
            sendNewSnapshot(tabs);
        }
    }
}

/**
 * sendNewSnapshot to backend via rest
 */
async function sendNewSnapshot(tabs) {
    var sessionID = await getSessionID();
    var groupID = await getPersistantData("groupID");
    var payload = {
        session: sessionID,
        tabs: tabs
    }
    if (socket != undefined && socket != null) {
        socket.emit('snapshot added', groupID, payload);
    }
}