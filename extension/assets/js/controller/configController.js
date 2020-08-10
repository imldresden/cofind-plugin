/**
 * reading config info
 * requires:
 * localStorageHandler
 */

var CONFIG;
var language;
var UI_MODE; // [auto, snapshot, explicit]


/**
 * fetch config from server via rest
 * initialize runtime variables
 */
loadConfig = async () => {
    var server = await getServer();
    var url = server + "/config";
    var defaultConfig = await get(url);
    if (defaultConfig !== undefined && defaultConfig !== null && defaultConfig !== false) {
        CONFIG = defaultConfig;
        // console.log(CONFIG);
        language = CONFIG.language.english;
        UI_MODE = CONFIG.setup.group.uiMode;
        await setPersistantData("uiMode", UI_MODE);
    }
}

getUiMode = async () => {
    if (!UI_MODE) {
        await loadConfig();
    }
    return new Promise(resolve => {
        resolve(UI_MODE);
    });
}

getConfig = async () => {
    if (!CONFIG || CONFIG == undefined) {
        await loadConfig();
    }
    return new Promise(resolve => {
        resolve(CONFIG);
    });
}

getColor = async (username) => {
    if (!CONFIG) {
        await  loadConfig();
    }
    return new Promise(resolve => {
        if(!CONFIG) return null;
        switch (username) {
            case CONFIG.setup.users.user1.username:
                resolve(CONFIG.setup.users.user1.color);
                break;
            case CONFIG.setup.users.user2.username:
                resolve(CONFIG.setup.users.user2.color);
                break;
            case CONFIG.setup.users.user3.username:
                resolve(CONFIG.setup.users.user3.color);
                break;
            default:
                resolve(CONFIG.setup.users.user4.color);
                break;
        }
    });
}

init = async () => {
    await loadConfig();
}
init();