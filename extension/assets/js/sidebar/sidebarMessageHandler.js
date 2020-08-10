/**
 * Author: Lucas Vogel
 *
 * This file is the helper file for the sidebar,
 * it handles message sending and recieving
 */

/**
 * gets Called when a message was sent
 * get message from globalHelper.sendMessageToSidebar
 * @param {*} message message that was recieved
 */
async function gotMessage(message) {
    if (message.hasOwnProperty("type")) {
        // console.log("...has type..."+message.type);
        var type = message.type;
        var data = message.data;

        if (type == "socket group modified") {
            generateSidebar(data.group);         

        }
    }
}
browser.runtime.onMessage.addListener(gotMessage);

/**
 * Send a Message to the current Tab
 * @param {*} message message to send
 */
async function sendMessageToTabs(message, url = null) {
    return new Promise(async function (resolve, reject) {
        var tabs = await browser.tabs.query({});
        for (tab of tabs) {
            if (tab.url.startsWith("http")) {
                if (url != null && url != tab.url) {
                    continue;
                } else {
                    var result = browser.tabs.sendMessage(
                        tab.id,
                        message
                    )
                }
            }
        }
    });
}

/**
 * Send a message to the backgroundscript
 * @param {*} message
 * @returns promise that resoves to the result of the message sent
 */
async function sendMessageToBackend(message) {
    return new Promise(async function (resolve, reject) {
        var result = await browser.runtime.sendMessage(
            message
        );
        resolve(result);
    });
}
