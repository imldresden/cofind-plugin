/**
 * Gets fired if there is a Message for the background script.
 * @param {*} message
 */
async function gotMessage(message) {
    if (message.hasOwnProperty("type")) {
        if (message.type == "setPersistantData") {
            setPersistantData(message.data.key, message.data.value);
            return;
        }
        if (message.type == "socket") {
            handleSocketMessage(message);
            return;
        }
        if (message.type == "socketLog") {
            handleSocketLogMessage(message);
            return;
        }
    }
}

browser.runtime.onMessage.addListener(gotMessage);

/**
 * Send a Message to all tabs
 * except developer tab
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
                    // never send message to dev tabs
                    var ct = await getCurrentTab();
                    if (ct.url && ct.url != undefined && !ct.url.startsWith("moz-extension") && !ct.url.startsWith("about:")) {
                        browser.tabs.sendMessage(tab.id, message);
                    }
                }
            }
        }
    });
}

/**
 *
 * @param {*} message Message to send to the Sidebar, can be anything (String, Object, etc.)
 * @returns Promise, that resolves to the result of the message sent
 */
async function sendMessageToSidebar(message) {
    return new Promise(async function (resolve, reject) {
        var result = await browser.runtime.sendMessage(
            message
        );
        resolve(result);
    });
}

/**
 * If a comment (note) is added to a website,
 * this function helps in preparing and sending
 * the neccessary data from the note to the socket.
 *
 * @param {*} data data of the note
 * @returns promise that resolves to true, if the message was sent successfully.
 */
async function prepareAddNoteAndSend(data) {
    return new Promise(async function (resolve, reject) {
        var userID = await getPersistantData("userID");
        var groupID = await getPersistantData("groupID");
        var sessionID = await getPersistantData("sessionID");
        var note = data.data;
        let requestNote = {
            user: userID,
            notePosition:
                {
                    startElementOffsetOfSameType: note.startElementOffsetOfSameType,
                    startElementType: note.startElementType,
                    startElementInnerOffset: note.startElementInnerOffset,
                    startElementInnerText: note.startElementInnerText,
                    endElementOffsetOfSameType: note.endElementOffsetOfSameType,
                    endElementType: note.endElementType,
                    endElementInnerOffset: note.endElementInnerOffset,
                    endElementInnerText: note.endElementInnerText
                },
            description: data.text
        };
        let requestWebsiteProposalWithNote = {
            group: groupID,
            user: userID,
            title: data.title,
            link: data.url,
            notes: [requestNote]
        };
        if (socket != undefined && socket != null) {
            socket.emit('note added', groupID, sessionID, userID, requestWebsiteProposalWithNote);
            resolve(true);
        } else {
            resolve(false);
        }
    });
}
