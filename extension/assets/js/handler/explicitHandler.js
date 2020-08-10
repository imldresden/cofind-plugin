/**
 * This file handles all explicit requests.
 * Typically used by sidebarTiles.js
 * Uses functions of backgroundSocketHandler.js
 */

/**
 * fetch tab and sendNewExplicit
 */
async function handleExplicit() {
    var tab = await getCurrentTab();
    if (tab != undefined) {
        var sessionID = await getPersistantData("sessionID");
        if (sessionID != undefined && sessionID != null && sessionID != "") {
            sendNewExplicit(tab);
        }
    }
}

/**
 * sendNewExplicit to backend via rest
 */
async function sendNewExplicit(tab) {
    var sessionID = await getSessionID();
    var groupID = await getPersistantData("groupID");
    var payload = {
        session: sessionID,
        tabs: [tab]
    }
    if (socket != undefined && socket != null) {
        socket.emit('explicit added', groupID, payload);
    }
}