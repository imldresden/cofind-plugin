var UI_MODE;
var UI_MODE_TAB_GROUP;
var CONFIG;
var GROUP_ID;
var LANGUAGE;
var IS_TOUCH_DEVICE;
var tabIds;
var userIds = [];

init = async () => {
    UI_MODE = await getUiMode();
    UI_MODE_TAB_GROUP = setUiMode(UI_MODE);
    CONFIG = await getConfig();
    LANGUAGE = CONFIG.language.english;

    IS_TOUCH_DEVICE = isThisATouchDevice();

    var group = await getLatestGroup();
    GROUP_ID = group._id;
    await setPersistantData("userId", null); // also set in background to avoid logging initial closing tabs
    await setPersistantData("groupId", GROUP_ID);
    generateSidebar();

}
init();


async function generateSidebar(group = null) {
    // console.log("generateSidebar...");
    if (group == null) group = await getLatestGroup();

    var userId = await getPersistantData("userId");
    var sessionId = await getPersistantData("sessionId");
    var currentTab = await getCurrentTab();

    var container = document.getElementById("loginBox");
    container.innerHTML = ""+ language.login;

    generateUserButtons(group, userId, sessionId);

    if (userId && userId != "null") {
        generateSidebarRight(group, userId, sessionId, currentTab, UI_MODE_TAB_GROUP);
        // synchronize to allow adding eventListeners after adding content
        await generateProposalSection(group, userId, currentTab);
        await generateActivitySection(group, userId, currentTab);
        await generatePrivateSection(group, userId, currentTab);
        generateSidebarLeftEventListeners();
    }
}


async function generateUserButtons(currentGroup, currentUserId, sessionId) {
    return new Promise(async function (resolve, reject) {
        var dropdownHtml = `<div class="dropdown">
                               <button class="dropbtn" id="dropdownBtn">${language.select}

                               </button>
                               <p class="arrow" id="arrow">⯆</p>
                               <div class="dropdown-content" id="dropdown-content">
                               </div>
                               </div>`
        var container = document.getElementById("coFindUserButtons");
        container.innerHTML = dropdownHtml;

        var dropdownButton = document.getElementById("dropdownBtn");
        dropdownButton.addEventListener("click", async (event) => {
            document.getElementById("dropdown-content").classList.toggle("show");
        });
        var arrow = document.getElementById("arrow");
        arrow.addEventListener("click", async (event) => {
            document.getElementById("dropdown-content").classList.toggle("show");
        });

        // fetch users from group
        var users = [];
        if (currentGroup.hasOwnProperty("members")) {
            for (var member of currentGroup.members) {
                // // hide user for selection uf username == null
                if(member.user.username == "null") continue;
                users.push(member.user);
            }
        }

        if (currentUserId != "null") {
            var i = 0;
            for (user of users) {
                if (user._id == currentUserId) {
                    var dropdownBtn = document.getElementById("dropdownBtn");
                    dropdownBtn.innerHTML = user.username;
                    var color = await getColor(user.username);

                    if (user._id == currentUserId) {
                        dropdownBtn.style.background = "rgba(" + color + ",0.7)";
                        dropdownBtn.style.borderColor = "rgb(" + color + ")";
                    }
                    users.splice(i, 1);
                }
                i++;
            }
        }

        /**
         * set userButtons
         * @type {string}
         */
        var html = "";
        var password = "pw";
        for (var user of users) {
            if (user.isDeleted != undefined && !user.isDeleted) {
                var userButtonId = "coFind-user-" + user._id;
                var buttonId = "coFind-button-" + user._id;
                html += `<div class="coFindUserButton" id="${buttonId}" >
                <div class="coFindUserButtonBox" id="${userButtonId}" data-username="${user.username}" data-password="${password}" data-id="${user._id}" >
                ${user.username}</div></div>`;
                var container = document.getElementById("dropdown-content");
                container.innerHTML = html;
            }
        }
        var viewport = `<meta name="viewport" content="width=device-width, initial-scale=1.0">`;
        //Setup a viewport for mobile websites to show correct scale on touch-devices
        document.head.insertAdjacentHTML("beforeend", viewport);

        /**
         * set eventListeners for userButtons
         */
        for (user of users) {
            var color = await getColor(user.username);
            var userButtonId = "coFind-user-" + user._id;
            var buttonId = "coFind-button-" + user._id;
            var button = document.getElementById(userButtonId);

            button.addEventListener("click", async (event) => {
                var btnId = event.target.getAttribute("data-id");
                let msg = {
                    type: "socketLog",
                    data: {
                        socketType: 'clickUserButton',
                        groupId: currentGroup._id,
                        sessionId: sessionId,
                        userId: currentUserId,
                        selectedUserId: btnId
                    }
                };
                sendMessageToBackend(msg);
                fastLogin(event);


            });
        }
    });
}

async function generateProposalSection(group, userId, currentTab) {
    // if(group.websiteProposals) console.log(group.websiteProposals.length);
    if (!group.websiteProposals) return;
    var proposalContainer = document.getElementById("proposals");
    tabIds = [];
    allMembers = [];

    var proposalUserNumber = {};
    var proposalUsers = {};

    if (group.hasOwnProperty("members")) {
        for (var member of group.members) {
            allMembers.push(member.user);
        }
    }
    var proposalsHtml = `<div class='sectionProposals'>${language.favorites}`;
    proposalsHtml += `<a id="detail-5" class="sidebar-details-button" href="./detailpage.html#favoriteTitle" target="_blank" data-section="proposal" data-section-name="Favorites">${language.details}</a></div>`;

    proposalsHtml += `<div class="proposalSection">`;

    /*no dublicate tabs for favs*/
    var addedProposals = removeDuplicates(group);


    for (addedProposal of addedProposals) {
        var count = 0;
        var users = [];
        for (var i = 0; i < group.websiteProposals.length; i++) {
            if (addedProposal.link == group.websiteProposals[i].link) {
                users.push(group.websiteProposals[i].user.username);
                count++;

            }
            proposalUsers = {addedProposal, users};
            proposalUserNumber = {addedProposal, count};
        }
        proposalsHtml += await addProposalHtml(addedProposal, proposalUsers, allMembers, proposalUserNumber, currentTab);
    }

    proposalsHtml += `</div>`;
    proposalContainer.innerHTML = proposalsHtml;

    correctProposalTooltips(addedProposals);
    openTabUrl(group, tabIds, IS_TOUCH_DEVICE);
}

async function addProposalHtml(proposal, proposalUsers, allMembers, proposalUserNumber, currentTab) {

    var users = proposalUsers.users
    /* different border colors for users*/
    var colors = await getProposalColor(users, allMembers);

    var topBorder = colors[0];
    var rightBorder = colors[1];
    var bottomBorder = colors[2];
    var leftBorder = colors[3];

    var userId = proposal.user._id;
    if (proposalUserNumber.count == 1) {
        var color = await getColor(proposal.user.username);
    } else {
        var color = "187,187,187"
    }
    var tabId = proposal._id;
    tabIds.push(tabId);

    var proposalHtml = "";

    proposalHtml += `<div class="tabBox">`;


    if (proposal.link == currentTab.url) {
        proposalHtml += `<div class="currentTab" style="border-bottom: 3px solid red">`;
    } else {
        proposalHtml += `<div class="currentTab" style="border-bottom: 3px solid rgba(193,193,193,0)">`;
    }


    /*different border colors for users*/
    proposalHtml += `<div class="tab proposalTab" id="${tabId}" title="${proposal.title}" data-user-id="${userId}" data-users="${users}" data-url="${proposal.link}" style="border-top-color:rgb(${topBorder}); border-right-color:rgb(${rightBorder});border-bottom-color:rgb(${bottomBorder});border-left-color:rgb(${leftBorder})">
                      <img data-url="${proposal.link}" id="img-${tabId}" src="https://s2.googleusercontent.com/s2/favicons?domain=${proposal.link}">
                      <b data-url="${proposal.link}" id="title-${tabId}"></b>
                      </div> `;

    proposalHtml += `<div class="tooltipText" id="tooltip-${tabId}" data-coFind-state="closed" data-id="${tabId}">
                      <b data-url="${proposal.link}" id="f${tabId}">${proposal.title}</b><br>
                      <a class="url" href="${proposal.link}" data-url="${proposal.link}" id="url-${tabId}">${proposal.link}</a>
                      </div>
                      </div>
                      </div>`;

    return proposalHtml;
}


/**
 * manage functions to generate user activity section
 * only show activities of other users
 * @param group
 * @param currentUserId
 * @param currentTab
 */
async function generateActivitySection(group, currentUserId, currentTab) {
    var userSections = "";
    tabIds = [];
    userIds = [];
    if (group.hasOwnProperty("members")) {
        for (var member of group.members) {
            // // hide user for selection uf username == null
            if(member.user.username == "null") continue;
            // don´t add current user here
            if (currentUserId != member.user._id) {
                userSections += "<div class='userPanel'>";
                userSections += await addActivitySection(group, member) + "\n";
                userSections += "</div>";
                userIds.push(member.user._id);
            }
        }
        var activityContainer = document.getElementById("activity");
        activityContainer.innerHTML = userSections;

        correctTooltips(group, 'activity', UI_MODE_TAB_GROUP);
        openTabUrl(group, tabIds, IS_TOUCH_DEVICE);
    }
}

/**
 * manage functions to generate user activity section
 * only show activities of current user
 * TODO: only show sessions from different devices of the current user
 * TODO: which tabs to show in snapshot or explicit mode? (also just auto every tab?)
 * @param group
 * @param currentUserId
 * @param currentTab
 */
async function generatePrivateSection(group, currentUserId, currentTab) {
    var userSection = "";
    tabIds = [];
    if (group.hasOwnProperty("members")) {
        for (var member of group.members) {
            // only add current user here
            if (currentUserId == member.user._id) {
                userSection += "<div class='privatePanel'>";
                userSection += await addPrivateSection(group, member, currentTab);
                userSection += "</div>";
            }
        }
        var activityContainer = document.getElementById("private");
        activityContainer.innerHTML = userSection;

        correctSidebarView();
        correctTooltips(group, 'private');
        openTabUrl(group, tabIds, IS_TOUCH_DEVICE);
    }
}

/**
 * add a single user activity section
 * used by generateActivitySection
 * used by generatePrivateSections
 *         ... in the same fashion
 * @param group
 * @param member
 * @param currentTab
 */
async function addActivitySection(group, member) {
    var color = await getColor(member.user.username);
    var userHTML = `<div class='sectionUsername' style="background-color:rgb(${color})">${member.user.username}`;
    userHTML += `<a id="detail-5" class="sidebar-details-button" href="./detailpage.html#${member.user.username}" target="_blank" data-section="activity" data-section-name="${member.user.username}">${language.details}</a></div>`;
    userHTML += `<div class="sectionActivity">`;
    for (var session of member.sessions) {
        userHTML += await addActivitySession(group, session, member, UI_MODE_TAB_GROUP);
    }
    userHTML += "</div>";

    return userHTML;
}

async function addPrivateSection(group, member, currentTab) {
    var color = await getColor(member.user.username);
    var userHTML = `<div class='sectionUsername' style="background-color:rgb(${color})">${language.private}`;
    userHTML += `<a id="detail-5" class="sidebar-details-button" href="./detailpage.html#privateTitle" target="_blank" data-section="private" data-section-name="Private">${language.details}</a></div>`;
    userHTML += `<div class="privateSection">`;
    var number = 1;
    for (var session of member.sessions) {
        userHTML += await addPrivateSession(group, session, member, 'tabGroups', currentTab, number);
        number++;
    }
    userHTML += "</div>";
    return userHTML;
}

/**
 * return html of one session for sidebar
 * @param session
 * @param uiModeTabGroup - is set automatically by activitySection or manually by privateSection
 * @returns {string}
 */
async function addActivitySession(group, session, member, uiModeTabGroup) {
    console.log("addSession " + uiModeTabGroup);
    var sessionHTML = ``;
    if (session[uiModeTabGroup].length > 0) {
        var tabGroup = session[uiModeTabGroup][0];
        if (tabGroup.tabs.length > 0) {
            var tabsHTML = "";
            for (var tab of tabGroup.tabs) {
                var tabId = tab.number + "-" + tab._id;
                tabIds.push(tabId)
                tabsHTML += `<div class="tabBox">`;
                tabsHTML += `<div class="tab activityTab" id="${tabId}" title="${tab.title}" data-user-id="${tab._id}" data-username="${member.user.username}" data-url="${tab.url}">
                              <img data-url="${tab.url}" id="img-${tabId}" src="https://s2.googleusercontent.com/s2/favicons?domain=${tab.url}">
                              <b data-url="${tab.url}" id="title-${tabId}" style="visibility:hidden"></b>
                              <span data-url="${tab.url}" id="url-${tabId}"></span>
                              </div>`;
                tabsHTML += `<span class="tooltipText" id="tooltip-${tabId}"><b data-url="${tab.url}" id="title-${tabId}">${tab.title}</b><br>
                              <a class="url" href="${tab.url}" data-url="${tab.url}" id="url-${tabId}">${tab.url}</a>
                              </span></div>`;
            }
            sessionHTML += tabsHTML;
        }
    }
    return sessionHTML;
}

/**
 * return html of one session for sidebar
 * @param session
 * @param uiModeTabGroup - is set automatically by activitySection or manually by privateSection
 * @returns {string}
 */
async function addPrivateSession(group, session, member, uiModeTabGroup, currentTab, number) {
    console.log("addSessionPRIVATE " + uiModeTabGroup);
    var sessionHTML = `<p class='sectionSession'>${language.device} ${number}</p></br>`;
    if (session[uiModeTabGroup].length > 0) {
        var tabGroup = session[uiModeTabGroup][0];
        if (tabGroup.tabs.length > 0) {
            var tabsHTML = "";
            for (var tab of tabGroup.tabs) {
                var tabId = tab.number + "-" + tab._id;
                tabIds.push(tabId)
                tabsHTML += `<div class="tabBox">`;


                if (tab.url == currentTab.url) {
                    tabsHTML += `<div class="currentTab" style="border-bottom: 3px solid red">`;
                } else {
                    tabsHTML += `<div class="currentTab" style="border-bottom: 3px solid rgba(193,193,193,0)">`;
                }

                tabsHTML += `<div class="tab privateTab" id="${tabId}" title="${tab.title}" data-user-id="${tab._id}" data-username="${member.user.username}" data-url="${tab.url}">
                              <img data-url="${tab.url}" id="img-${tabId}" src="https://s2.googleusercontent.com/s2/favicons?domain=${tab.url}">
                              <b data-url="${tab.url}" id="title-${tabId}" style="visibility:hidden"></b>
                              <span data-url="${tab.url}" id="url-${tabId}"></span>
                              </div>`;
                tabsHTML += `<span class="tooltipText" id="tooltip-${tabId}"><b data-url="${tab.url}" id="title-${tabId}">${tab.title}</b><br>
                              <a class="url" href="${tab.url}" data-url="${tab.url}" id="url-${tabId}">${tab.url}</a>
                              </span></div> </div>`;

            }
            sessionHTML += tabsHTML;
        }
    }
    return sessionHTML;
}

function correctSidebarView(){
  if(userIds.length == 2){
      var userPanels = document.getElementsByClassName("userPanel");
      for (userPanel of userPanels){
        userPanel.style.height = "24vh";
      }
     var sectionsActivity = document.getElementsByClassName("sectionActivity");
     for(sectionActivity of sectionsActivity){
       sectionActivity.style.height = "20vh";
     }

     document.getElementById("private").style.height = "20vh";
     var privateSections = document.getElementsByClassName("privateSection");
     for(privateSection of privateSections){
       privateSection.style.height = "16vh";
     }

  }
}
