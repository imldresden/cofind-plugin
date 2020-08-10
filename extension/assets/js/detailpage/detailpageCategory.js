var config;
var language;
var UI_MODE;
var UI_MODE_TABGROUP;
var tabIds;

var server;
var yOffset;

async function init() {
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
    var buttonDetails = document.getElementById('btnDetails');
    buttonDetails.href = "./detailpage.html#" + id;
    var buttonArchiv = document.getElementById('btnArchiv');
    buttonArchiv.href = "./detailpageArchiv.html#" + id;

    var group = await getPersistantData("groupId");
    var url = server + "/groups/" + group + "/current";
    var groupInfos = await get(url);


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

    emptyDetailpage();
    generateDetailProposals(groupInfos);
}

init();

function emptyDetailpage() {
    var favorites = document.getElementById("favorite");

    if (favorites != null || favorites != undefined) {
        favorites.innerHTML = "";
    }

    var activities = document.getElementById("activityPage");
    if (activities != null || activities != undefined) {
        activities.innerHTML = "";
    }

    var private = document.getElementById("private");
    if (private != null || private != undefined) {
        private.innerHTML = "";
    }

}


async function generateDetailProposals(groupInfos = null) {

    var title = document.getElementById("favoriteTitle");
    title.innerHTML = "" + language.favorites;

    tabIds = [];
    var html = ``;

    if (groupInfos.hasOwnProperty("websiteProposals")) {
        setPersistantData("proposals", groupInfos.websiteProposals);

        var addedProposals = removeDuplicates(groupInfos);
        var addedLinkProposals = removeCategoryDuplicates(addedProposals);

        var proposalHtml = `<div class="tabFavBox">`;
        for (proposal of addedLinkProposals) {
            var count = 0;
            for (addedProposal of addedProposals) {

                if (addedProposal.link.includes(proposal)) {
                    count++;
                }
            }


            if (count > 1) {
                proposalHtml += `<div class="category">`;
                proposalHtml += `<div class="domainCategory"><div class="icon"> <img src="https://s2.googleusercontent.com/s2/favicons?domain=${proposal}"></div>
                              <b class="urltitle"> ${proposal}</b></br>
                              <div class="tabCount">Favorites:  ${count}</div></div> `
                proposalHtml += `<div class="tabs">`;
            }

            for (addedProposal of addedProposals) {

                var users = [];
                for (var i = 0; i < groupInfos.websiteProposals.length; i++) {
                    if (addedProposal.link == groupInfos.websiteProposals[i].link) {
                        users.push(groupInfos.websiteProposals[i].user.username);

                    }

                    proposalUsers = {proposal, users};
                }

                if (addedProposal.link.includes(proposal)) {
                    proposalHtml += addProposalHtml(addedProposal, proposalUsers, count, proposal);
                }

            }
            if (count > 1) {
                proposalHtml += `</div>`;
                proposalHtml += `</div>`;
            }

        }
        document.getElementById("favorite").insertAdjacentHTML("beforeend", proposalHtml);

        openTabUrl(tabIds);
    }
    generateActivity(groupInfos);
}


function addProposalHtml(proposal, proposalUsers, count, domain) {
    var users = proposalUsers.users;
    var userId = proposal.user._id;
    var tabId = proposal._id;
    var tabClass = "tab";
    tabIds.push(tabId);


    if (count <= 1) {
        tabClass = "tab-single";
        proposalHtml = `<div class="${tabClass}" id="${tabId}" title="${proposal.title}" data-user-id="${proposal.user._id}" data-url="${proposal.link}" >
                          <div class="usernames">`
        for (user of users) {
            var color = getColor(user);
            proposalHtml += `<div class="username" style="background-color:rgb(${color})"> ${user}</div>`
        }
        proposalHtml += `</div>
                          <div class="icon"> <img data-url="${proposal.link}" id="img-${tabId}" src="https://s2.googleusercontent.com/s2/favicons?domain=${proposal.link}"></div>
                          <b class="urltitle" data-url="${proposal.link}"> ${domain}: ${proposal.title}</b></br>
                          <div class="previewFrame" data-url="${proposal.link}"><iframe id="preview" src="${proposal.link}" scrolling="no"></iframe></div>
                          </div>`;
        //  <p class="urlFavs" data-url="${proposal.link}"> ${proposal.link}</p>
        //  <div class="previewFrame" data-url="${proposal.link}"><iframe id="preview" src="${proposal.link}" scrolling="no"></iframe></div>
    }
    else {
        proposalHtml = `<div class="${tabClass}" id="${tabId}" title="${proposal.title}" data-user-id="${proposal.user._id}" data-url="${proposal.link}" >
                        <div class="usernames">
                           `
        for (user of users) {
            var color = getColor(user);
            proposalHtml += `<div class="username" style="background-color:rgb(${color})"> ${user}</div>`
        }
        proposalHtml += `</div><b class="urltitle" data-url="${proposal.link}"> ${proposal.title}</b></br>
                          <div class="previewFrame" data-url="${proposal.link}"><iframe id="preview" src="${proposal.link}" scrolling="no"></iframe></div>
                          </div>`;
    }

    return proposalHtml;
}

async function generateActivity(groupInfos) {
    var title = document.getElementById("activityTitle");
    title.innerHTML = "" + language.activity;

    var tabIds = [];
    var html = ``;
    var activityTabs = [];

    var currentUserId = await getPersistantData("userId");

    if (groupInfos.hasOwnProperty("members")) {
        for (member of groupInfos.members) {
            for (session of member.sessions) {
                for (tabGroup of session['tabGroups']) {
                    for (tab of tabGroup.tabs) {
                        tab.member = member;
                        activityTabs.push(tab)
                    }
                }
            }
        }

    }

    var categoryTabs = removeCategoryDuplicates(activityTabs);

    for (tab of categoryTabs) {
        var count = 0;
        for (addedTab of activityTabs) {

            if (addedTab.url.includes(tab)) {
                count++;
            }
        }

        if (count > 1) {
            html += `<div class="category">`;
            html += `<div class="domainCategory"><div class="icon"> <img src="https://s2.googleusercontent.com/s2/favicons?domain=${tab}"></div>
                            <b class="urltitle"> ${tab}</b></br>
                            <div class="tabCount">Tabs:  ${count}</div></div> `
            html += `<div class="tabs">`;
        }

        for (activityTab of activityTabs) {

            if (activityTab.url.includes(tab)) {
                var tabId = activityTab._id;
                if (count <= 1) {
                    tabClass = "tab-single";
                    var color = getColor(activityTab.member.user.username);
                    html += `<div class="${tabClass}" id="${tabId}" title="${activityTab.title}"  data-url="${activityTab.url}" >
                                 <div class="usernames"><div class="username" style="background-color:rgb(${color})"> ${activityTab.member.user.username}</div></div>`
                    html += `<div class="icon"> <img data-url="${activityTab.url}" id="img-${tabId}" src="https://s2.googleusercontent.com/s2/favicons?domain=${activityTab.url}"></div>
                                 <b class="urltitle" data-url="${activityTab.url}"> ${tab}: ${activityTab.title}</b></br>
                                 <div class="previewFrame" data-url="${activityTab.url}"><iframe id="preview" src="${activityTab.url}" scrolling="no"></iframe></div>
                                 </div>`;
                    // <p class="urlFavs" data-url="${activityTab.url}"> ${activityTab.url}</p>
                    // <div class="previewFrame" data-url="${activityTab.url}"><iframe id="preview" src="${activityTab.url}" scrolling="no"></iframe></div>
                }
                else {
                    var color = getColor(activityTab.member.user.username);
                    html += `<div class="tab" id="${activityTab._id}" title="${activityTab.title}" data-user-id="${activityTab._id}" data-url="${activityTab.url}">
                        <div class="usernames"><div class="username" style="background-color:rgb(${color})"> ${activityTab.member.user.username}</div></div>
                        <b class="urltitle" data-url="${activityTab.url}"> ${activityTab.title}</b></br>
                        <div class="previewFrame" data-url="${activityTab.url}"><iframe id="preview" src="${activityTab.url}" scrolling="no"></iframe></div></div>
                        `;
                }

                tabIds.push(tabId);
            }
        }
        if (count > 1) {
            html += `</div>`;
            html += `</div>`;
        }

    }
    var container = document.getElementById("activityPage");
    container.insertAdjacentHTML("beforeend", html);

    jump();
    openTabUrl(tabIds);
}

async function addActivitySection(member, currentUserId) {
    var html = "";
    for (session of member.sessions) {
        if (session[UI_MODE_TABGROUP].length > 0) {
            html += await addSession(session, UI_MODE_TABGROUP);
        }
        if (session['tabGroups'].length > 0) {
            html += await addSession(session, 'tabGroups');
        }
    }

    return html;
}

async function addSession(session, uiModeTabGroup) {
    if (session[uiModeTabGroup].length > 0) {

        var html = "";
        for (tabGroup of session[uiModeTabGroup]) {
            for (tab of tabGroup.tabs) {

                html += `<div>${tab.createdAt}</div>`
                var tabId = tab.number + "-" + tab._id;
                html += `<div class="tab" id="${tabId}" title="${tab.title}" data-user-id="${tab._id}" data-url="${tab.url}">
                        <div class="icon">
                        <img data-url="${tab.url}" id="img-${tabId}" src="https://s2.googleusercontent.com/s2/favicons?domain=${tab.url}"></div>

                        </div>
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

function removeCategoryDuplicates(addedTabs) {
    var addedCategoryTabs = [];

    for (tab of addedTabs) {

        if (tab.hasOwnProperty("link")) {
            var domain = urlDomain(tab.link);
        }
        else {
            var domain = urlDomain(tab.url);
        }

        addedCategoryTabs.push(domain);
    }

    var addedLinkTabs = [];
    var lookupObject = {};

    for (var i in addedCategoryTabs) {
        lookupObject[addedCategoryTabs[i]["name"]] = addedCategoryTabs[i]["name"];
        lookupObject[addedCategoryTabs[i]["name"]] = addedCategoryTabs[i]["domain"];
    }

    for (i in lookupObject) {
        addedLinkTabs.push(lookupObject[i]);
    }

    return addedLinkTabs.sort();

}

function urlDomain(data) {
    var url = data;
    var urlParts = url.replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/);

    var domainParts = urlParts[0].split(".");

    var domain = domainParts[domainParts.length - 2] + "." + domainParts[domainParts.length - 1];

    var savedDomain = domain;
    var splittedDomain = domain.split(".");
    domain = splittedDomain;

    if (domain.length > 1) {
        var newDomain = "";
        for (i = 0; i < domain.length; i++) {
            newDomain += "." + domain[i];
        }
        var domainObject = {
            domain: savedDomain,
            name: newDomain
        }
    }
    else {

        var domainObject = {
            domain: savedDomain,
            name: domain
        }
    }
    return domainObject;
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
    if (id != "favoriteTitle") {
        id = "activityTitle"
    }
    var element = document.getElementById(id);
    if (element != null) {
        element.scrollIntoView(true);
    }

    window.scrollTo({top: yOffset, left: 0, behavior: "auto"});
}

/**
 * gets Called when a message was sent
 * get message from globalHelper.sendMessageToSidebar
 * @param {*} message message that was recieved
 */
async function gotMessage(message) {
    //console.log(message.data);
    if (message.hasOwnProperty("type")) {
        // console.log("...has type..."+message.type);
        var type = message.type;
        var data = message.data;

        if (type == "socket group modified") {
            init(data.group);
        }
    } else {
        // checkStorageChange();
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
