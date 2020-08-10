var config;
var language;
var UI_MODE;
var UI_MODE_TABGROUP;
var tabIds;

var server;
var yOffset;

async function initDetailpageArchiv(groupInfos = null) {

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
    if (buttonCategory != null) {
        buttonCategory.href = "./detailpageCategory.html#" + id;
        buttonCategory.innerHTML = ""+language.category;
    }

    var buttonDetails = document.getElementById('btnDetails');
    if (buttonDetails != null) {
        buttonDetails.href = "./detailpage.html#" + id;
    }

    if (groupInfos == null){
        // console.log("groupInfos == null [detailpageArchiv:34]");
        groupInfos = await getLatestGroup();
    }
    console.log(groupInfos);

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
    generateDetailArchivProposals(groupInfos);
}

window.onfocus = function () {

    initDetailpageArchiv();
}


function emptyDetailpage() {
    var favorites = document.getElementById("favorite");

    if (favorites != null || favorites != undefined) {
        favorites.innerHTML = "";
    }

}


async function generateDetailArchivProposals(groupInfos = null) {

    if (groupInfos == null) groupInfos = await getLatestGroup();

    var title = document.getElementById("favoriteTitle");
    if (title != null) {
        title.innerHTML = "" + language.favorites;
    }


    tabIds = [];
    var html = ``;

    if (groupInfos.hasOwnProperty("detailProposals")) {
        setPersistantData("proposals", groupInfos.detailProposals);

        var addedProposals = removeDuplicates(groupInfos);

        var proposalHtml = '<div class="tabFavBox">';
        let proposalUsers;
        for (let proposal of addedProposals) {
            var users = [];
            for (var i = 0; i < groupInfos.websiteProposals.length; i++) {
                if (proposal.link == groupInfos.websiteProposals[i].link) {
                    users.push(groupInfos.websiteProposals[i].user);

                }

                proposalUsers = {proposal, users};
                console.log("proposalUsers");
                console.log(proposalUsers);
            }

            if(proposalUsers) proposalHtml += addProposalHtml(proposal, proposalUsers);
        }

        proposalHtml += `</div>`;

        favorites = document.getElementById("favorite")
        if (favorites != null) {
            favorites.insertAdjacentHTML("beforeend", proposalHtml);
        }
        openTabDetailUrl(tabIds);
        jump();
    }
}


function addProposalHtml(proposal, proposalUsers) {
    var users = proposalUsers.users
    var userId = proposal.user._id;
    var tabId = proposal._id;

    tabIds.push(tabId);

    if (users.length == 0 && proposal.isDeleted == true) {

        proposalHtml = `<div class="deletedTab"><div class="tab" id="${tabId}" title="${proposal.title}" data-user-id="${proposal.user._id}" data-url="${proposal.link}" >
                          <div class="usernames">
                          `
      for (user of users) {
        var color = getColor(user.username);
          proposalHtml += `<div class="username" style="background-color:rgb(${color})"> ${user.username}</div>`
      }

        proposalHtml += `</div>
                            <div class="icon"> <img data-url="${proposal.link}" id="img-${tabId}" src="https://s2.googleusercontent.com/s2/favicons?domain=${proposal.link}"></div>
                          <b class="urltitle">${proposal.title}</b></br>
                           <p class="urlFavs" data-url="${proposal.link}"> ${proposal.link}</p>
                           </div></div>`;

    }
    else {
        proposalHtml = `<div class="tab" id="${tabId}" title="${proposal.title}" data-user-id="${proposal.user._id}" data-url="${proposal.link}" >
                    <div class="usernames">
                    `

        for (user of users) {
          var color = getColor(user.username);
            proposalHtml += `<div class="username" style="background-color:rgb(${color})"> ${user.username}</div>`
        }

        proposalHtml += `</div><div class="icon"> <img data-url="${proposal.link}" id="img-${tabId}" src="https://s2.googleusercontent.com/s2/favicons?domain=${proposal.link}"></div>
                          <b class="urltitle">${proposal.title}</b></br>
                         <p class="urlFavs" data-url="${proposal.link}"> ${proposal.link}</p>
                         </div>`;
    }

    return proposalHtml;
}

function removeDuplicates(group) {
    var addedProposals = [];
    var lookupObject = {};

    if (group.hasOwnProperty("detailProposals")) {
        for (var i in group.detailProposals) {
            lookupObject[group.detailProposals[i]["link"]] = group.detailProposals[i];
        }
    }
    else {
        for (var i in group.websiteProposals) {
            lookupObject[group.websiteProposals[i]["link"]] = group.websiteProposals[i];
        }
    }

    for (i in lookupObject) {
        addedProposals.push(lookupObject[i]);
    }
    return addedProposals;
}


function openTabDetailUrl(tabIds) {
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
    //console.log(message.data);
    if (message.hasOwnProperty("type")) {
        // console.log("...has type..."+message.type);
        var type = message.type;
        var data = message.data;

        if (type == "socket group modified") {
            initDetailpageArchiv(data.group);
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
