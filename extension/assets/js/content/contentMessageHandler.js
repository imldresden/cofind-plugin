/**
 * Send a message to the backgroundscript
 * @param {*} message
 */
async function sendMessageToBackend(message) {
    return new Promise(async function (resolve, reject) {
        var result = await browser.runtime.sendMessage(
            message
        );
        resolve(result);
    });
}
