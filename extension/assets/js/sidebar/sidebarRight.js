var UI_MODE_TAB_GROUP;

async function generateSidebarRight(group, userId, sessionId, currentTab, uiModeTabGroup) {
    if (!UI_MODE_TAB_GROUP) UI_MODE_TAB_GROUP = uiModeTabGroup;

    initButtonProposal(group, userId, sessionId, currentTab);

    if (UI_MODE_TAB_GROUP == 'explicits') {
        initButtonExplicit(group, userId, sessionId, currentTab);
    } else if (UI_MODE_TAB_GROUP == 'snapshots') {
        initButtonSnapshot(group, userId, sessionId, currentTab);
    }

}

function setProposalBtnFav() {
    var proposalBtn = document.getElementById("coFindProposalBtn");
    proposalBtn.setAttribute("data-coFind-state", "fav");
    proposalBtn.innerHTML = "★";
    proposalBtn.style.opacity = "0.8";
    proposalBtn.style.background = "rgb(201, 0, 0)";
}

function setProposalBtnNonFav() {
    var proposalBtn = document.getElementById("coFindProposalBtn");
    proposalBtn.setAttribute("data-coFind-state", "nonFav");
    proposalBtn.innerHTML = "☆";
    proposalBtn.style.background = "#888";
    proposalBtn.style.opacity = "0.8";
}

function initButtonProposal(group, userId, sessionId, currentTab) {

    var proposalBox = document.getElementById("coFindProposalBox");
    var proposalBtn = document.getElementById("coFindProposalBtn");

    // remove old proposalBtn before adding new one
    if (proposalBtn != null) {
        proposalBox.removeChild(proposalBtn);
    }

    // hide proposalBtn for developer sites
    if (!currentTab.url.startsWith("http")) return;

    // show proposalBtn for common site
    var newProposalBtn = `<div id="coFindProposalBtn"  data-coFind-state="nonFav" data-url="${currentTab.url}" data-id="${currentTab.number}">☆</div>`;
    proposalBox.insertAdjacentHTML("beforeend", newProposalBtn);
    proposalBtn = document.getElementById("coFindProposalBtn");

    var userProposals = getAllProposalsOfUser(group, userId);

    var currentProposalId = null;
    for (var proposal of userProposals) {
        if (currentTab.url == proposal.link) {
            currentProposalId = proposal._id;
        }
    }

    /**
     * add design of coFindProposalBtn
     * depends on if proposal exists
     */
    if (currentProposalId) {
        setProposalBtnFav();
    } else {
        setProposalBtnNonFav();
    }

    /**
     * add event listeners
     * switch button data-coFind-state
     */
    proposalBtn.addEventListener("click", (event) => {
        if (!currentProposalId) {
            addProposalHelper(group._id, userId, sessionId, currentTab);

        } else {
            removeProposalHelper(group._id, sessionId, currentProposalId);
        }
    });

}

function setExplicitBtnExpl() {
    var explicitBtn = document.getElementById("coFindExplicitBtn");
    explicitBtn.setAttribute("data-coFind-state", "expl");
    explicitBtn.innerHTML = "Expl.";//""+ language.shared;
    explicitBtn.style.opacity = "0.8";
    explicitBtn.style.background = "rgb(201, 0, 0)";
}

function setExplicitBtnNonExpl() {
    var explicitBtn = document.getElementById("coFindExplicitBtn");
    explicitBtn.setAttribute("data-coFind-state", "nonExpl");
    explicitBtn.innerHTML = "Expl.";
    explicitBtn.style.background = "#888";
    explicitBtn.style.opacity = "0.8";
}

function initButtonExplicit(group, userId, sessionId, currentTab) {
        // console.log("initButtonExplicit...");
    var explicitBox = document.getElementById("coFindExplicitBox");
    var explicitBtn = document.getElementById("coFindExplicitBtn");

    // remove old proposalBtn before adding new one
    if (explicitBtn != null) {
        explicitBox.removeChild(explicitBtn);
    }

    // hide proposalBtn for developer sites
    if (!currentTab.url.startsWith("http")) return;

    var explicitHtml = `<div id="coFindExplicitBtn" data-coFind-state="nonExpl" >Expl.</div>`;

    explicitBox.insertAdjacentHTML("beforeend", explicitHtml);
    explicitBtn = document.getElementById("coFindExplicitBtn");



    var viewport = `<meta name="viewport" content="width=device-width, initial-scale=1.0">`;
    //Setup a viewport for mobile websites to show correct scale on touch-devices
    document.head.insertAdjacentHTML("beforeend", viewport);

    var html = `<div id="confirmText" style="display:none">${language.done}</div>`;
    var rightSidebar = document.getElementById("rightSidebar");
    rightSidebar.insertAdjacentHTML("beforeend", html);

    /**
     * add event listeners
     */
    var exp = getExplicitOfCurrentTab(group, sessionId, currentTab);



    if (exp == null) {
        setExplicitBtnNonExpl();
    } else {
        setExplicitBtnExpl();
    }


    explicitBtn.addEventListener("click", (event) => {

        if (exp == null) {
            socketsAddExplicit(group._id, sessionId, currentTab);
        } else {
            socketsDeleteExplicit(group._id, sessionId, currentTab, exp._id);
        }
        var confirmText = document.getElementById("confirmText");
        confirmText.style.display = "block";
    });

    var confirmText = document.getElementById("confirmText");
    if(confirmText != undefined){
        window.setTimeout("confirmText.style.display='none'",1500);
    }
}

function initButtonSnapshot(group, userId, sessionId, currentTab) {
    // console.log("initButtonSnapshot...");
    var snapshotBox = document.getElementById("coFindSnapshotBox");
    var snapshotBtn = document.getElementById("coFindSnapshotBtn");

    // remove old proposalBtn before adding new one
    if (snapshotBtn != null) {
        snapshotBox.removeChild(snapshotBtn);
    }

    // hide proposalBtn for developer sites
    if (!currentTab.url.startsWith("http")) return;

    var snapshotHtml = `<div id="coFindSnapshotBtn">Snap</div>`;

    snapshotBox.insertAdjacentHTML("beforeend", snapshotHtml);
    snapshotBtn = document.getElementById("coFindSnapshotBtn");


    var viewport = `<meta name="viewport" content="width=device-width, initial-scale=1.0">`;
    //Setup a viewport for mobile websites to show correct scale on touch-devices
    document.head.insertAdjacentHTML("beforeend", viewport);

    var html = `<div id="confirmText" style="display:none">Done</div>`;
    var rightSidebar = document.getElementById("rightSidebar");
    rightSidebar.insertAdjacentHTML("beforeend", html);

    /**
     * add event listeners
     */
    snapshotBtn.addEventListener("click", (event) => {
        socketsAddSnapshot(group._id, sessionId);
        var confirmText = document.getElementById("confirmText");
        confirmText.style.display = "block";
    });

    var confirmText = document.getElementById("confirmText");
    if(confirmText != undefined){
        window.setTimeout("confirmText.style.display='none'",1500);
    }
}

/**
 * Generate the favorites box
 * @param {Object} groupInfos optional. Object with all the group infos in it.
 * Otherwise it gets the group infos via REST-API.
 */
function generateFavoritesBoxes(group, currentTab) {
    return new Promise(async function (resolve, reject) {
        var tabIds = [];

        var html = "";
        if (group.hasOwnProperty("websiteProposals")) {
            var deletedProposals = [];
            await setPersistantData("proposals", group.websiteProposals);
            // var shiftProposals;
            var shiftProposals = await shift(group.websiteProposals);
            for (var proposal of shiftProposals) {
                var userId = proposal.user._id;
                var color = getColor(proposal.user.username);
                var tabId = proposal._id;
                html += `<div class="tabbox"><div class="tab" id="${tabId}" title="${proposal.title}" data-user-id="${proposal.user._id}" data-url="${proposal.link}" style="border-color:rgb(${color})">
                         <img data-url="${proposal.link}" id="img-${tabId}" src="https://s2.googleusercontent.com/s2/favicons?domain=${proposal.link}">
                         <b data-url="${proposal.link}" id="title-${tabId}"></b></div>
                         `;
                if (proposal.hasOwnProperty("notes")) {
                    if (proposal.notes.length > 0) {
                        updateSiteCommentNumber(true);
                        var element = document.getElementById("coFindSiteCommentBox");
                        if (element && element.hasAttribute("data-coFind-state")) {
                            if (element.getAttribute("data-coFind-state") == "open") {
                                addCommentsToSiteCommentBox();
                            }
                        }
                        var numberComments = 0;
                        for (note of proposal.notes) {
                            if (note.isDeleted == false) {
                                numberComments += 1;
                            }
                        }
                        if (numberComments > 0) {
                            html += `<div class="commentNumberContainerFavTabs" id="comment-${tabId}"> ${numberComments}</div>`;
                        }
                    }
                }

                if (currentTab && currentTab.url == proposal.link) {
                    html += `<div class="currentTab" id="current-${tabIdD}"></div>`;
                }
                html += `<div class="tooltiptext" id="tooltip-${tabId}" data-coFind-state="closed" data-id="${tabId}"><b data-url="${proposal.link}" id="f${tabId}">${proposal.title}</b><br>
                  <p class="url" data-url="${proposal.link}" id="url-${tabId}">${proposal.link}</p></div></div>`

                tabIds.push(tabId);
            }

            var container = document.getElementById("favorites");
            container.innerHTML = html;
            var viewport = `<meta name="viewport" content="width=device-width, initial-scale=1.0">`;
            //Setup a viewport for mobile websites to show correct scale on touch-devices
            document.head.insertAdjacentHTML("beforeend", viewport);

            for (tabId of tabIds) {
                var tabtooltip = document.getElementById("tooltip-" + tabId);
                var element = document.body.clientWidth;
                var offsets = tabtooltip.getBoundingClientRect();
                var right = offsets.right;
                if (right > element) {
                    var div = right - element;
                    tabtooltip.style.right = div / 4 + "px";
                }
                var thistab = document.getElementById(tabId);
                var tabfav = document.getElementById("fav-" + tabId);

                if (!isTouchDevice) {
                    if (thistab != undefined) {
                        thistab.addEventListener("click", (event) => {
                            tabClickHelper(event);
                        });
                    }
                    if (tabfav != undefined) {
                        tabfav.addEventListener("click", (event) => {
                            tabUnFavClickHelper(event);
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

    });
}
