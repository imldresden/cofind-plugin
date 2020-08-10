/**
 * Queries the current active tab and returns it as object.
 * @returns promise that will resolve to a tab-object
 */
async function getCurrentTab() {
    return new Promise(async function (resolve, reject) {
        // get current tab from browser
        // browser.tabs.getCurrent() is not working in backgroundScript
        //, windowId: browser.windows.WINDOW_ID_CURRENT
        browser.tabs.query({active: true})
            .then(tabs => browser.tabs.get(tabs[0].id))
            .then(tab => {
                // console.log("get tab " + JSON.stringify(tab));
                var tabObject = {
                    number: tab.id,
                    url: tab.url,
                    title: tab.title
                }
                resolve(tabObject);
            });
    });
}

/**
 * Queries all tabs and returns them in a "array of objects"-Format.
 * It also ignores all internal tabs, like "about:" or "file:"
 * @returns promise that will resolve to an array of tab-objects
 */
async function getAllTabs() {
    var TabObjectsArray = [];
    return new Promise(async function (resolve, reject) {
        var tabs = await browser.tabs.query({});
        for (tab of tabs) {
            if (!tab.url.startsWith("about:") && !tab.url.startsWith("moz-") && !tab.url.startsWith("file:///")) {
                var tabObject = {
                    number: tab.id,
                    url: tab.url,
                    title: tab.title
                }
                TabObjectsArray.push(tabObject);
            }
        }
        resolve(TabObjectsArray);
    });
}

/**
 * close tabs starting with...
 * moz-
 *
 * coming soon: remove all http tabs...
 * @returns {Promise<any>}
 */
function closeLandingpage() {
    var tabIds = [];
    return new Promise(async function (resolve, reject) {
        var tabs = await browser.tabs.query({});
        for (var tab of tabs) {
            if (tab.url.startsWith("moz-")) {
                tabIds.push(tab.id);
            }
        }
        var removing = browser.tabs.remove(tabIds);
        resolve(removing);
    });
}

/**
 * close tabs starting with...
 * moz-
 *
 * coming soon: remove all http tabs...
 * @returns {Promise<any>}
 */
function closeOpenTabs() {
    var tabIds = [];
    return new Promise(async function (resolve, reject) {
        var tabs = await browser.tabs.query({});
        let splitter;
        for (var tab of tabs) {
            console.log(tab.url);
            splitter = tab.url.split("/");
            if (tab.url.startsWith("http")) {
                tabIds.push(tab.id);
            } else if (tab.url.startsWith("about:newtab")){
                tabIds.push(tab.id);
            } else if (splitter[0] == "moz-extension:" && splitter[3] == "assets" && splitter[4] == "html" && splitter[5] != "landingpage.html") {
                tabIds.push(tab.id);
            }
        }
        var removing = browser.tabs.remove(tabIds);
        resolve(removing);
    });
}