var config;
var language;
var UI_MODE;
var UI_MODE_TABGROUP;
var tabIds;
var server;
var yOffset;
/**
 * HTTP GET method
 * @param {String} url url of the request
 * @returns promise that resolves to the result of the request, otherwise false.
 */
async function initDetailpage() {
    yOffset = window.pageYOffset;

    server = await getServer();

    var url = server + "/config";
    var defaultConfig = await get(url);
    if (defaultConfig !== undefined && defaultConfig !== null && defaultConfig !== false) {
        config = defaultConfig;
        language = config.language.english;
        UI_MODE = config.setup.group.uiMode;
    }

    var url = window.location.href;
    var splittedUrl = url.split("#")
    var id = "" + splittedUrl[1];
    var buttonCategory = document.getElementById('btnCategory');
    buttonCategory.href = "./detailpageCategory.html#" + id;
    buttonCategory.innerHTML = ""+language.category;
    var buttonArchiv = document.getElementById('btnArchiv');
    buttonArchiv.href = "./detailpageArchiv.html#" + id;

    switch (UI_MODE) {
        case "explicit":
            UI_MODE_TABGROUP = 'explicits';
            break;
        case "snapshot":
            UI_MODE_TABGROUP = 'snapshots';
            break;
        default: // for auto mode
            UI_MODE_TABGROUP = 'tabGroups';
            break;
    }


    generateDetailProposals();

}

initDetailpage();

function emptyDetailpage() {
    var favoritesHtml = document.getElementById("favorite");
    if (favoritesHtml != null || favoritesHtml != undefined) {
        favoritesHtml.innerHTML = "";
    }

    var activitiesHtml = document.getElementById("activityPage");
    if (activitiesHtml != null || activitiesHtml != undefined) {
        activitiesHtml.innerHTML = "";
    }

    var privateHtml = document.getElementById("private");
    if (privateHtml != null || privateHtml != undefined) {
        privateHtml.innerHTML = "";
    }
}


async function generateDetailProposals(groupInfos = null) {
    emptyDetailpage();

    if (groupInfos == null) groupInfos = await getLatestGroup();

    var title = document.getElementById("favoriteTitle");
    title.innerHTML = "" + language.favorites;

    tabIds = [];
    var html = ``;

    if (groupInfos.hasOwnProperty("websiteProposals")) {
        setPersistantData("proposals", groupInfos.websiteProposals);

        var addedProposals = removeDuplicates(groupInfos);

        var proposalHtml = '<div class="tabFavBox">';

        for (proposal of addedProposals) {
            var users = [];

            for (var i = 0; i < groupInfos.websiteProposals.length; i++) {
                if (proposal.link == groupInfos.websiteProposals[i].link) {
                    users.push(groupInfos.websiteProposals[i].user.username);
                }
                proposalUsers = {proposal, users};
            }
            proposalHtml += addProposalHtml(proposal, proposalUsers);
        }
        proposalHtml += `</div>`;
        document.getElementById("favorite").innerHTML = proposalHtml;
        openTabUrl(tabIds);
    }
    generateActivity(groupInfos);
    generatePrivate(groupInfos);
}

function addProposalHtml(proposal, proposalUsers) {
    var users = proposalUsers.users;
    var userId = proposal.user._id;
    var tabId = proposal._id;
    tabIds.push(tabId);
    proposalHtml = `<div class="tab" id="${tabId}" title="${proposal.title}" data-user-id="${proposal.user._id}" data-url="${proposal.link}" >
                  <div class="usernames">`


    for (user of users) {
      var color = getColor(user);
        proposalHtml += `<div class="username" style="background-color:rgb(${color})"> ${user}</div>`
    }

    proposalHtml += `</div>
                        <div class="icon"> <img data-url="${proposal.link}" id="img-${tabId}" src="https://s2.googleusercontent.com/s2/favicons?domain=${proposal.link}"></div>
                      <b class="urltitle">${proposal.title}</b></br>
                       <a class="urlFavs" data-url="${proposal.link}"> ${proposal.link}</a>
                       </div>`;

    return proposalHtml;
}

async function generateActivity(groupInfos) {
    var title = document.getElementById("activityTitle");
    title.innerHTML = "" + language.activity;

    var tabIds = [];
    var html = ``;

    var currentUserId = await getPersistantData("userId");

    if (groupInfos.hasOwnProperty("members")) {
        for (member of groupInfos.members) {
          if (member.user.username != "null"){
            var userId = member.user._id;

            if (userId != currentUserId) {
                html += `<section class="users">`;
                html += await addActivitySection(member, currentUserId);
                html += "</section>"
            }
          }
        }

    }

    var container = document.getElementById("activityPage");
    container.innerHTML = html;
    jump();
    openTabUrl(tabIds);
}

async function addActivitySection(member, currentUserId) {
    var html = `<p class="activityUser" id="${member.user.username}">${member.user.username}</p>`;
    for (session of member.sessions) {
        if (session[UI_MODE_TABGROUP].length > 0) {
            html += await addSession(session, UI_MODE_TABGROUP);
        }
    }
    return html;
}

async function generatePrivate(groupInfos = null) {
    var title = document.getElementById("privateTitle");
    title.innerHTML = "" + language.private;

    tabIds = [];
    var html = ``;
    var currentUserId = await getPersistantData("userId");

    if (groupInfos.hasOwnProperty("members")) {
        for (member of groupInfos.members) {
            var userId = member.user._id;
            if (userId == currentUserId) {
                html += await addPrivateSection(member, currentUserId);
            }
        }
    }

    if (html != "undefined") {
        var container = document.getElementById("private");
        container.innerHTML = html;
    }

    jump();
    openTabUrl(tabIds);
}

async function addPrivateSection(member, currentUserId) {
    var userId = member.user._id;
    var number = 1;
    var html = "";

    for (session of member.sessions) {

        if (session['tabGroups'].length > 0) {
            html += `<section class="users" data-user-id="${userId}">`;
            html += `<p class="sectionDescription">${language.device} ${number}</p><br><br>`;
            html += `<div class="tabBox">`;
            html += await addSession(session, 'tabGroups');
            html += "</div></section>";
        }
        number++;
    }
    return html;
}

async function addSession(session, uiModeTabGroup) {
    if (session[uiModeTabGroup].length > 0) {

        var html = "";
        for (tabGroup of session[uiModeTabGroup]) {
            for (tab of tabGroup.tabs) {

                var tabId = tab.number + "-" + tab._id;
                html += `<div class="tab" id="${tabId}" title="${tab.title}" data-user-id="${tab._id}" data-url="${tab.url}">
                          <div class="icon">
                          <img data-url="${tab.url}" id="img-${tabId}" src="https://s2.googleusercontent.com/s2/favicons?domain=${tab.url}"></div>

                          <b class="urltitleActiv" data-url="${tab.url}" id="title-${tabId}">${tab.title}</b><br>
                          <a class="urlFavs" data-url="${tab.url}" id="url-${tabId}">${tab.url}</a></div>
                          `;

                tabIds.push(tabId);
            }

        }

        return html;
    }
}

function removeDuplicates(group) {
    var addedProposals = [];
    var lookupObject = {};

    for (var i in group.websiteProposals) {
        lookupObject[group.websiteProposals[i]["link"]] = group.websiteProposals[i];
    }

    for (i in lookupObject) {
        addedProposals.push(lookupObject[i]);
    }
    return addedProposals;
}

function openTabUrl(tabIds) {
    for (tabId of tabIds) {
        var thistab = document.getElementById(tabId);
        if (thistab != undefined) {
            thistab.addEventListener("click", (event) => {
                tabClickHelper(event);
            });
        }
    }
}

function tabClickHelper(event) {
    if (event.target != undefined && event.target != null) {
        if (event.target.className != undefined && event.target.className != "favContainer" && event.target.className != "favMarkedContainer") {
            var url = event.target.getAttribute("data-url");
            var creating = browser.tabs.create({
                url: url
            });
        }
    }
}

function jump() {
    var url = window.location.href;
    var splittedUrl = url.split("#")
    var id = "" + splittedUrl[1];
    var element = document.getElementById(id);
    if (element != null) {
        element.scrollIntoView(true);
    }

    window.scrollTo({ top: yOffset, left: 0, behavior: "auto" });
}

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
            initDetailpage();
        }
    }
}

browser.runtime.onMessage.addListener(gotMessage);

function getColor(user) {

        var color = "";

        if (config.setup.users.user1.username == user) {
            color = config.setup.users.user1.color;
        }
        if (config.setup.users.user2.username == user) {
            color = config.setup.users.user2.color;
        }
        if (config.setup.users.user3.username == user) {
            color = config.setup.users.user3.color;
        }
        if (config.setup.users.user4.username == user) {
            color = config.setup.users.user4.color;
        }
       return color;
}
