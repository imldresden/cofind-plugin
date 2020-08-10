/**
 * localStorage params:
 * -----------------------------
 * uiMode
 * userId
 * groupId
 * sessionId
 * browserId
 * mac
 * -----------------------------
 */

init = async () => {
    // await freeLocalStorage();
}
init();

/**
 * Sets Data to local storage. Wrapper, so that this can be modified later
 * @param {String} key key of the data
 * @param {String} value value of the data
 */
async function setPersistantData(key, value) {
    return new Promise(async function (resolve, reject) {
        localStorage.setItem(key, value);
        resolve(await getPersistantData(key));
    });
}

/**
 * Gets data from local storage. Wrapper, so that it can be modified later
 * @param {String} key Key of the data
 * @returns promise, that resolves to the result
 */
async function getPersistantData(key) {
    return new Promise(function (resolve, reject) {
        var result = localStorage.getItem(key);
        resolve(result);
    });
}

async function freeUserStorage(){
    return new Promise(async function (resolve, reject) {
        localStorage.setItem("userId", null);
        localStorage.setItem("sessionId", null);
        resolve(true);
    });
}

async function freeLocalStorage(){
    return new Promise(async function (resolve, reject) {
        localStorage.setItem("uiMode", null);
        localStorage.setItem("groupId", null);
        localStorage.setItem("userId", null);
        localStorage.setItem("sessionId", null);
        resolve(true);
    });
}