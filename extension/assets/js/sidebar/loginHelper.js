function leaveGroup() {
    return new Promise(async function (resolve, reject) {
        hideGroupSections();
        let msg = {
            type: "socket",
            data: {
                socketType: 'leaveGroup',
                groupId: await getPersistantData("groupId"),
                sessionId: await getPersistantData("sessionId"),
                userId: await getPersistantData("userId")
            }
        };
        // setPersistantDate od userId and sessionId to null
        await freeUserStorage();
        resolve(sendMessageToBackend(msg));
    });
}

function logout(groupId, sessionId, userId) {
    return new Promise(async function (resolve, reject) {
        var url = server + `/users/logout/${userId}`;
        // console.log("logged out " + userId);
        var user = await get(url);
        await setPersistantData("userId", null);
        // message for log and emitCurrentGroup after session is inactive
        let msg = {
            type: "socket",
            data: {
                socketType: 'sessionDisconnect',
                groupId: groupId,
                sessionId: sessionId,
                userId: userId
            }
        };
        sendMessageToBackend(msg);
        resolve(user);
    });
}

function login(username, password) {
    console.log("login..." + username + password);
    return new Promise(async function (resolve, reject) {
        // close all opened tabs
        await closeOpenTabs();
        var url = server + `/users/login/${username}/${password}`;
        var user = await get(url);
        if (user.hasOwnProperty("_id")) {
            var userId = await setPersistantData("userId", user._id);
            // console.log("logged in " + userId);
        } else {
            console.log("login failed: " + user);
        }
        resolve(user);
    });
}

async function joinGroup(groupId, userId, browserId) {
    console.log("join..." + groupId + userId + browserId);
    return new Promise(async function (resolve, reject) {
        // join group in db
        await join(groupId, userId, browserId);
        showGroupSections();
        // join socket
        let msg = {
            type: "socket",
            data: {
                socketType: 'joinGroup',
                groupId: groupId
            }
        };
        resolve(sendMessageToBackend(msg));
    });
}

/**
 * manage logout-login chain between two users
 * no authentication required
 */
async function fastLogin(event) {

    var btnUsername = event.target.getAttribute("data-username");
    var btnPassword = event.target.getAttribute("data-password");
    var btnUserId = event.target.getAttribute("data-id");
    var groupId = await getPersistantData("groupId");
    var sessionId = await getPersistantData("sessionId");
    var userId = await getPersistantData("userId");
    var browserId = await getPersistantData("browserId");

    // break if user already logged in
    if (btnUserId == await getPersistantData("userId")) {
        console.log(`user ${btnUserId} already logged in`);
        return;
    }

    console.log("fastlogin... " + btnUsername + " " + btnPassword);
    // if user loggedIn
    if (userId && userId != "null") {
        await leaveGroup().then(() => logout(groupId, sessionId, userId).then(() => login(btnUsername, btnPassword).then(user => joinGroup(groupId, user._id, browserId))));
    } else {
        //if no user is loggedIn => first login since loading extension
        await login(btnUsername, btnPassword).then((user) => joinGroup(groupId, user._id, browserId));
    }
}

/**
 * allow manual group selection
 * not used in current version
 */
function showGroupSections() {
    var loginSection = document.getElementById("loginSection");
    if (loginSection) loginSection.classList.add("hidden");

    var favoriteSection = document.getElementById("proposalSection");
    if (favoriteSection) favoriteSection.classList.remove("hidden");

    var activitySection = document.getElementById("activitySection");
    activitySection.classList.remove("hidden");

    var privateSection = document.getElementById("privateSection");
    privateSection.classList.remove("hidden");
}

/**
 * hide manual group selection
 * not used in current version
 */
function hideGroupSections() {
    var favoriteSection = document.getElementById("proposalSection");
    if (favoriteSection) favoriteSection.classList.add("hidden");

    var activitySection = document.getElementById("activitySection");
    activitySection.classList.add("hidden");

    var privateSection = document.getElementById("privateSection");
    privateSection.classList.add("hidden");

    var loginSection = document.getElementById("loginSection");
    if (loginSection) loginSection.classList.remove("hidden");
}

/**
 * Joining a group.
 * @param {*} id optional. ID of the Group to join, otherwise it takes the ID from the input field.
 * @returns promise that resolves true if the join was successfull, otherwise false.
 */
async function join(groupId, userId, browserId) {
    return new Promise(async function (resolve, reject) {
        if (!groupId || !userId) resolve(false);

        var deviceName = getOs();
        var mac = guid();
        await setPersistantData("mac", mac);
        console.log("mac: " + await getPersistantData("mac"));

        var server = await getServer();
        var url = server + `/groups/${groupId}/join/users/${userId}/${browserId}`;
        console.log(url);
        var payload = {
            name: deviceName,
            mac: mac
        };

        var joinResult = await post(url, payload);
        console.log(joinResult);
        if (joinResult != undefined && joinResult != false) {
            await setPersistantData("sessionId", joinResult._id);
            await setPersistantData("groupId", groupId);
            var groupURL = server + "/groups/" + groupId + "/current";

            // var groupInfo = await get(groupURL);
            // var groupName = groupInfo.name;
            // if (groupName != undefined && groupName != null && groupName != "") {
            //     setGroupNameHtml(groupName);
            // }
            var message = {
                type: "socket",
                data: {
                    socketType: "sessionConnect",
                    groupID: groupId,
                    userID: userId,
                    sessionID: joinResult._id
                }
            };
            sendMessageToBackend(message);
            // showPanel("inGroup");
            resolve(true);
        } else {
            reject();
        }
    });
}