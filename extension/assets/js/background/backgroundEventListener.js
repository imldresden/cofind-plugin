/**
 * send events to backend
 * using socket
 * used for logging
 */

var SOCKET;

// used to pass tabId from tabs.onRemoved -> tabs.onActivated (async call) to avoid rewriting removed tab
var lastRemovedTabId = null;
var updatingTabsSet = new Set();

init = async () => {
    SOCKET = await getSocket();
}
init();

async function handleCreated(tab) {
    let sessionId = await getPersistantData("sessionId");
    let userId = await getPersistantData("userId");
    SOCKET.emit('tabCreated', sessionId, userId, tab.id);
}

async function handleUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status == "loading") {
        // ignore event if no url in changeInfo
        if (changeInfo.url && changeInfo.url != null) {
            if (!updatingTabsSet.has(tabId)) {
                let sessionId = await getPersistantData("sessionId");
                let userId = await getPersistantData("userId");
                SOCKET.emit('tabUrlUpdated', sessionId, userId, tabId, changeInfo.url);
            }
            updatingTabsSet.add(tabId);
        }
    }
    if (changeInfo.status == "complete") {
        // unmark tab as updating anyway (removing non existing is not a prob)
        updatingTabsSet.delete(tabId);
        // for business processes
        getAndSendNewTabs();
    }
}

async function handleRemoved(tabId, removeInfo) {
    lastRemovedTabId = tabId;
    let groupId = await getPersistantData("groupId");
    let sessionId = await getPersistantData("sessionId");
    let userId = await getPersistantData("userId");
    if (removeInfo.isWindowClosing) {
        //sessionDisconnect
        setPersistantData("userId", null);
        socket.emit('sessionDisconnect', groupId, sessionId, userId);
    } else {
        getAndSendNewTabs(tabId);
    }
    SOCKET.emit('tabRemoved', sessionId, userId, tabId, removeInfo.windowId, removeInfo.isWindowClosing);
}

async function handleMoved(tabId, moveInfo) {
    let sessionId = await getPersistantData("sessionId");
    let userId = await getPersistantData("userId");
    SOCKET.emit('tabMoved', sessionId, userId, tabId, moveInfo.fromIndex, moveInfo.toIndex);
}

async function handleActivated(activeInfo) {
    let sessionId = await getPersistantData("sessionId");
    let userId = await getPersistantData("userId");
    if (userId == "null") return;
    SOCKET.emit('tabActivated', sessionId, userId, activeInfo.previousTabId, activeInfo.tabId, activeInfo.windowId);
    getAndSendNewTabs(lastRemovedTabId);
}

const pattern1 = "*://*/*"; // Match all HTTP, HTTPS and WebSocket URLs.
const filterOnUpdated = {
    urls: [pattern1],
    properties: ["status"]
};

/**
 * listening on tab events
 */
browser.tabs.onCreated.addListener(handleCreated);
browser.tabs.onRemoved.addListener(handleRemoved);
browser.tabs.onMoved.addListener(handleMoved);
browser.tabs.onActivated.addListener(handleActivated);
/**
 * ignore changes in admin tabs
 * using pattern filter
 */
browser.tabs.onUpdated.addListener(handleUpdated, filterOnUpdated);