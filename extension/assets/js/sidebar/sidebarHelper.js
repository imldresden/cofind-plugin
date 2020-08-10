function getAllProposalsOfUser(group, userId) {
    var proposals = [];
    if(!group.websiteProposals) return proposals;
    for (var proposal of group.websiteProposals) {
        if (proposal.user._id == userId) {
            proposals.push(proposal);
        }
    }
    return proposals;
}

function getExplicitOfCurrentTab(group, sessionId, currentTab) {
    for (var member of group.members) {
        for (var session of member.sessions) {
            if (session._id == sessionId) {
                //there should be only one explicit passed by groupController.getCurrent
                for (var exp of session.explicits) {
                    for (var tab of exp.tabs) {
                        if (tab.url == currentTab.url) {
                            return exp;
                        }
                    }
                }
            }
        }
    }
    return null;
}


/**
 * Adds a Tab to the favorites, after clicking the fav icon next to a open tab
 * @param {Event} event Onclick event fromm the browser
 */
async function tabFavClickHelper(tabURL, id) {
    //var url = event.target.getAttribute("data-url");
    var url = tabURL;
    if (url == undefined || url == null || url == "") {
        return;
    }
    //var tabID = event.target.getAttribute("data-id");
    var tabID = id;
    if (tabID == undefined || tabID == null || tabID == "") {
        return;
    }
    var titleID = "title-" + tabID;
    var titleElement = document.getElementById(titleID);
    if (titleElement == undefined) {
        return;
    }
    var title = titleElement.innerHTML;
    var groupID = await getPersistantData("groupID");
    var user = await getPersistantData("userID");

    let requestWebsiteProposal = {
        group: groupID,
        user: user,
        link: url,
        title: title
    };
    socketsAddWebsiteProposal(groupID, requestWebsiteProposal);
}

function setUiMode(UI_MODE) {
    switch (UI_MODE) {
        case "explicit":
            return 'explicits';
            break;
        case "snapshot":
            return 'snapshots';
            break;
        default: // for auto mode
            return 'tabGroups';
            break;
    }
    return;
}

/**************************************************************************
 *
 * sidebarRight
 *
 **************************************************************************/

async function updateSiteCommentNumber(visible) {
    var group = await getPersistantData("groupID");
    var url = server + "/groups/" + group + "/current";
    var groupInfos = await get(url);
    if (groupInfos.hasOwnProperty("members")) {
        for (member of groupInfos.members) {
            for (session of member.sessions) {
                if (session.tabGroups.length > 0) {
                    for (tabGroup of session.tabGroups) {
                        if (tabGroup.tabs.length > 0) {
                            for (tab of tabGroup.tabs) {
                                if (tab.url == currentTab.url) {
                                    var element = document.getElementById("coFindSiteCommentBoxNumberComments");
                                    if (element != undefined) {
                                        element.innerHTML = "";
                                    }
                                }
                                else {
                                    var element = document.getElementById("coFindSiteCommentBoxNumberComments");
                                    if (element != undefined) {
                                        element.innerHTML = "";
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (groupInfos.hasOwnProperty("websiteProposals")) {
        for (proposal of groupInfos.websiteProposals) {
            if (proposal.hasOwnProperty("notes")) {
                if (proposal.notes.length > 0 && proposal.link == currentTab.url) {
                    var element = document.getElementById("coFindSiteCommentBoxNumberComments");
                    if (element != undefined) {
                        let i = 0;
                        for (note of proposal.notes) {
                            if (!note.isDeleted) {
                                i++;
                                if (!visible) {
                                    element.innerHTML = "";
                                } else {
                                    element.innerHTML = "<div>" + i + "</div>";
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * Gets called when the user clicks on a tab in the sidebar.
 * Can be used in the future to jumpt to the tab if a site
 * is already open. However, currently this API is not
 * implemented fully and is still experimental.
 * After that, the function checkIfUrlIsAlredyOpen() can
 * be used.
 * @param {Event} event onclick event
 */
async function tabClickHelper(event) {
    if (event.target != undefined && event.target != null) {
        if (event.target.className != undefined && event.target.className != "favContainer" && event.target.className != "favMarkedContainer") {
            var url = event.target.getAttribute("data-url");
            var creating = browser.tabs.create({
                url: url
            });
        }
    }
}

async function tabTouchClickHelper(event) {
    var tabtooltip = "tooltip-" + event.target.getAttribute("id");
    var tooltip = document.getElementById(tabtooltip);

    if (tooltip.getAttribute("data-coFind-state") == "closed") {
        tooltip.setAttribute("data-coFind-state", "open");
        var elems = document.getElementsByClassName('tooltiptext');

        for (var i = 0; i != elems.length; ++i) {
            elems[i].style.visibility = "hidden";
            elems[i].setAttribute("data-coFind-state", "closed");
        }
        tooltip.style.visibility = "visible";
    }
}


/**
 * Adds a Tab to the favorites, after clicking the fav icon next to a open tab
 * @param {Event} event Onclick event fromm the browser
 */
async function addProposalHelper(groupId, userId, sessionId, currentTab) {
    var url = currentTab.url;
    if (url == undefined || url == null || url == "") return;

    var title = currentTab.title;

    let requestWebsiteProposal = {
        group: groupId,
        user: userId,
        link: url,
        title: title
    };
    socketsAddWebsiteProposal(groupId, sessionId, requestWebsiteProposal);
}

/**
 * Removes a Favorite
 * @param {Event} event onclick browser event
 */
async function removeProposalHelper(groupId, sessionId, proposalId) {
    if (groupId == undefined || groupId == null) return;

    if (proposalId != undefined && proposalId != null && proposalId != "") {
        socketsDeleteWebsiteProposal(groupId, sessionId, proposalId);
    }
}


/**
 * Adds a Tab to the favorites, after clicking the fav icon next to a open tab
 * @param {Event} event Onclick event fromm the browser
 */
async function tabFavClickHelper(tabUrl, id) {
    //var url = event.target.getAttribute("data-url");
    var url = tabUrl;
    if (url == undefined || url == null || url == "") {
        return;
    }
    //var tabID = event.target.getAttribute("data-id");
    var tabId = id;
    if (tabId == undefined || tabId == null || tabId == "") {
        return;
    }
    var titleId = "title-" + tabId;
    var titleElement = document.getElementById(titleId);
    if (titleElement == undefined) {
        return;
    }
    var title = titleElement.innerHTML;
    var groupId = await getPersistantData("groupId");
    var user = await getPersistantData("userId");

    let requestWebsiteProposal = {
        group: groupId,
        user: user,
        link: url,
        title: title
    };
    socketsAddWebsiteProposal(groupId, requestWebsiteProposal);
}

/**
 * Removes a Favorite
 * @param {Event} event onclick browser event
 */
async function tabUnFavClickHelper(tabID) {
    var groupID = await getPersistantData("groupID");
    if (groupID == undefined || groupID == null) {
        return;
    }
    //var proposalID = event.target.getAttribute("data-id");
    var proposalID = tabID;
    if (proposalID != undefined && proposalID != null && proposalID != "") {
        socketsDeleteWebsiteProposal(groupID, proposalID);
    }
}
function getColor(user) {
    return new Promise(async function (resolve, reject) {
        var color = "";
        var config = await getConfig();

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
       resolve(color);

    })
}

function correctProposalTooltips(addedProposals){
  var rightSidebar = document.getElementById("rightSidebar").offsetWidth;
    for (var proposal of addedProposals) {
        var tabtooltip = document.getElementById("tooltip-" + proposal._id);
        var element = document.body.clientWidth - rightSidebar;
        if (tabtooltip != null){
          var offsets = tabtooltip.getBoundingClientRect();
          var right = offsets.right;
          if (right > element) {
              var div = right - element;
              tabtooltip.style.right = div / 4 + "px";
          }
        }

    }
}

function correctTooltips(group, section, mode = null){
  var rightSidebar = document.getElementById("rightSidebar").offsetWidth;
        for (var member of group.members) {
          var tabGroup;
            for (var session of member.sessions) {
              if (section == 'private'){
                tabGroup = session['tabGroups'][0];
              }
              else{
                tabGroup = session[mode][0];
              }
              if (tabGroup != undefined){
                if (tabGroup.tabs.length > 0) {
                    for (var tab of tabGroup.tabs) {
                      var tabtooltip = document.getElementById("tooltip-" + tab.number + "-" + tab._id);
                      var element = document.body.clientWidth - rightSidebar;
                      if (tabtooltip != null){
                        var offsets = tabtooltip.getBoundingClientRect();
                        var right = offsets.right;
                        if (right > element) {
                            var div = right - element;
                            tabtooltip.style.right = div / 4 + "px";
                        }
                      }

                    }
                }

              }

            }
        }
}

function openTabUrl (group, tabIds, isTouchDevice){
  for (var tabId of tabIds){
    var thistab = document.getElementById(tabId);
    if (!isTouchDevice) {
        if (thistab != undefined) {
            thistab.addEventListener("click", (event) => {
                tabClickHelper(event);
            });
        }

    }
    else {
        if (thistab != undefined) {
            thistab.addEventListener("dblclick", (event) => {
                tabClickHelper(event);
            });
            thistab.addEventListener("click", (event) => {
                tabTouchClickHelper(event);
            });
        }
    }
  }

}

/**
 * checks if the current device is a touch device
 */
function isThisATouchDevice() {
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    var mq = function (query) {
        return window.matchMedia(query).matches;
    }
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        return true;
    }
    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
}



// used for proposals
function shift(elements) {
    // return new Promise(function(resolve, reject){
    var shiftElements = [];
    for (var element of elements) {
        shiftElements.unshift(element);
    }
    return shiftElements;
    // resolve(shiftElements);
    // });
}

// used for tabs
function unShift(elements) {
    // return new Promise(function(resolve, reject){
    var unshiftElements = [];
    for (var element of elements) {
        unshiftElements.unshift(element);
    }
    return unshiftElements;
    //     resolve(unshiftElements);
    // });
}

function removeDuplicates(group){
  var addedProposals = [];
  var lookupObject  = {};

  for(var i in group.websiteProposals) {
     lookupObject[group.websiteProposals[i]["link"]] = group.websiteProposals[i];
  }

  for(i in lookupObject) {
      addedProposals.push(lookupObject[i]);
  }
  return addedProposals;
}

async function getProposalColor(users, allMembers){

    var colors = ["","","",""]

    for (var i = 0; i < users.length; i++){
      if(users[i] == allMembers[0].username){
          var color = await getColor(users[i]);
          colors.splice(0, 1, color);
      }else if (users[i] == allMembers[1].username) {
          var color = await getColor(users[i]);
          colors.splice(1, 1, color);
      }else if (users[i] == allMembers[2].username) {
          var color = await getColor(users[i]);
          colors.splice(2, 1, color);
      }else if (users[i] == allMembers[3].username) {
          var color = await getColor(users[i]);
          colors.splice(3, 1, color);
      }

    }
    return colors;

}
